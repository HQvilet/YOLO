import type { Request, Response } from "express"
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import Conversation from "../model/conversation.model.ts";

export const getAllConversations = async (req: Request, res: Response) => {
    try{
        const userID = req.user._id

        const conversations = await Conversation.find({
            "participants.userID": userID
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: conversations
        }))

    }catch(error: any){
        console.log(error.message)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getOrCreateConversation = async (req: Request, res: Response) => {
    try{
        const { participantID, conversationID } = req.body
        const userID = req.user._id

        let conversation;

        if(conversationID){
            conversation = await Conversation.find({
                _id: conversationID,
                "participants.userID": {$in: userID}
            })
        }
        else{
            conversation = await Conversation.findOne({
                "participants.userID": {
                    $all: [userID, participantID]
                },
                type: "direct",
            })
        }

        conversation = await Conversation.create({
            participants: [
                {userID: userID}, 
                {userID: participantID}
            ],
            type: "direct",
        })


        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Created conversation",
            data: conversation
        }))

    }catch(error: any){
        console.log(error.message)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const createConversation = async (req: Request, res: Response) => {
    try{
        const { participantID,  } = req.body
        const userID = req.user._id

        const conversation = await Conversation.find({
            "participants.userID": participantID
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Created conversation",
            data: conversation
        }))

    }catch(error: any){
        console.log(error.message)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}
