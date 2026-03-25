import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import { Types } from "mongoose"
import Conversation from "../model/conversation.model.ts";
import Message from "../model/message.model.ts";
import { create } from "node:domain";
import { addUserToConversation, emitNewMessage, updateConversation } from "../library/messageHelper.ts";
import { io } from "../socket/socket.ts";

export const sendMessage = async (req: Request, res: Response) => {
    try{
        const { recipientID, conversationID, content } = req.body;
        const senderID = req.user._id.toString()
        
        if(!content || (!content.text && !content.imgURL)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Missing content.",
            }))
        }

        let conversation;
        
        if(conversationID)
            conversation = await Conversation.findOne({
                _id: conversationID,
                "participants.userID": {$all: [senderID]},
                type: "direct"
            })
        else{
            conversation = await Conversation.findOne({
                "participants.userID": {$all: [senderID, recipientID]},
                type: "direct"
            })
        }
        
        if(!conversation){
            conversation = await Conversation.create({
                participants: [
                    { userID: senderID },
                    { userID: recipientID }
                ],
                type: "direct"
            })
            
            // add 2 socket to conversation room
        }
        
        const message = await Message.create({
            senderID,
            conversationID: conversation._id,
            content,
        })

        updateConversation(conversation, message);

        await conversation.save()

        // io emit message
        emitNewMessage(io, conversation, message)

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent message.",
            data: message
        }))

    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const sendDirectMessage = async (req: Request, res: Response) => {
    try{
        const { recipientID, conversationID, content } = req.body;
        const senderID = req.user._id.toString()
        
        if(!content || (!content.text && !content.imgURL)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Missing content.",
            }))
        }

        let conversation;
        
        if(conversationID)
            conversation = await Conversation.findOne({
                _id: conversationID,
                "participants.userID": {$all: [senderID]},
                type: "direct"
            })
        else{
            conversation = await Conversation.findOne({
                "participants.userID": {$all: [senderID, recipientID]},
                type: "direct"
            })
        }
        
        if(!conversation){
            conversation = await Conversation.create({
                participants: [
                    { userID: senderID },
                    { userID: recipientID }
                ],
                type: "direct"
            })
            // add 2 socket to conversation room
            addUserToConversation(io, senderID, conversation._id.toString())
            addUserToConversation(io, recipientID, conversation._id.toString())
        }
        
        const message = await Message.create({
            senderID,
            conversationID: conversation._id,
            content,
        })

        updateConversation(conversation, message);

        await conversation.save()

        // io emit message
        emitNewMessage(io, conversation, message)

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent message.",
            data: message
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const sendGroupMessage = async (req: Request, res: Response) => {
    try{
        const { conversationID, content } = req.body;
        const senderID = req.user._id.toString()
        
        if(!content || (!content.text && !content.imgURL)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Missing content.",
            }))
        }

        if(!conversationID){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Bad Request.",
            })) 
        }

        // let conversation;
        
        const conversation = await Conversation.findOne({
            _id: conversationID,
            "participants.userID": senderID,
            type: "group"
        })
        
        if(!conversation){
            return res.status(404).json(serverResponseMessage({
                success: false,
                error: "Conversation not found.",
            })) 
        }
        
        const message = await Message.create({
            senderID,
            conversationID: conversation._id,
            content,
        })

        updateConversation(conversation, message);

        await conversation.save()

        // io emit message
        emitNewMessage(io, conversation, message)

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent message.",
            data: message
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllMessageFromConversation = async (req: Request, res: Response) => {
    try{
        const conversationID = req.params.conversationID as string;
        const senderID = req.user._id

        if(!conversationID){
            return res.status(400).json(serverResponseMessage({
                success: false,
                message: "Bad request."
            }))
        }

        const messages = await Message.find({
            conversationID,
        }).sort({
            createdAt: -1
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent message.",
            data: messages
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const deleteAllMessages = async (req: Request, res: Response) => {
    await Message.deleteMany({})
    return res.send("Delete all messages.")
}