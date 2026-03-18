import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import { Types } from "mongoose"
import Conversation from "../model/conversation.model.ts";
import Message from "../model/message.model.ts";

export const sendMessage = async (req: Request, res: Response) => {
    try{
        const { recipientID, conversationID, content } = req.body;
        const senderID = req.user._id.toString()

        if(!content){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Missing content.",
            }))
        }
        
        let conversation;
        
        if(conversationID)
            conversation = await Conversation.findOne({
                _id: conversationID,
                "participants.userID": {$all: [senderID, recipientID]},
                type: "direct"
            })
        else
            conversation = await Conversation.findOne({
                "participants.userID": {$all: [senderID, recipientID]},
                type: "direct"
            })
        
        if(!conversation){
            conversation = await Conversation.create({
                participants: [
                    { userID: senderID },
                    { userID: recipientID }
                ],
                type: "direct"
            })
        }

        const message = await Message.create({
            senderID,
            conversationID: conversation._id,
            content,
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent message.",
            data: message
        }))

    }catch(error: any){
        console.log(error.message)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllMessageFromConversation = async (req: Request, res: Response) => {
    try{
        const conversationID = req.params.conversationID as string;
        const senderID = req.user._id

        const messages = await Message.find({
            conversationID,
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent message.",
            // data: message
        }))

    }catch(error: any){
        console.log(error.message)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}