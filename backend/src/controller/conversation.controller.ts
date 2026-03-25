import type { Request, Response } from "express"
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import Conversation from "../model/conversation.model.ts";
import { Types } from "mongoose"
import UserProfile from "../model/user.profile.model.ts";
import Message from "../model/message.model.ts";

export const getAllConversations = async (req: Request, res: Response) => {
    try{
        const userID = req.user._id

        const conversations = await Conversation.find({
            "participants.userID": userID
        })
        .populate({
            path: "participants.userID",
        })
        
        return res.status(200).json(serverResponseMessage({
            success: true,
            data: conversations
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getConversation = async (req: Request, res: Response) => {
    try{
        const { participantID, conversationID } = req.query
        const userID = req.user._id

        let conversation;

        if(participantID && conversationID){
            conversation = await Conversation.findOne({
                _id: conversationID,
                "participants.userID": {
                    $all: [userID, participantID]
                },
                type: "direct"
            }).populate({
                path: "participants.userID",
            })
        }
        else if(conversationID){
            conversation = await Conversation.findOne({
                _id: conversationID,
                "participants.userID": {$in: userID}
            }).populate({
                path: "participants.userID",
            })
        }
        else if(participantID){
            conversation = await Conversation.findOne({
                "participants.userID": {
                    $all: [userID, participantID]
                },
                type: "direct",
            }).populate({
                path: "participants.userID",
            })
        }
        else{
            return res.status(400).json(serverResponseMessage({
                success: false,
                message: "Bad request.",
            }))
        }
        
        if(!conversation){
            return res.status(404).json(serverResponseMessage({
                success: false,
                message: "No Resource Found",
            }))
        }
        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Created conversation",
            data: conversation
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const createConversation = async (req: Request, res: Response) => {
    try{
        const { participantID,  } = req.body
        const userID = req.user._id

        const conversation = await Conversation.find({
            "participants.userID": participantID,
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Created conversation",
            data: conversation
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const markAsSeen = async (req: Request, res: Response) => {
  try {
    const { conversationID } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationID)
                                        .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation không tồn tại" });
    }
    const lastMessage: any = conversation.lastMessage;
    if (!lastMessage) {
      return res.status(200).json({ message: "Không có tin nhắn để mark as seen" });
    }

    if (lastMessage.senderID.toString() === userId) {
      return res.status(200).json({ message: "Sender không cần mark as seen" });
    }

    conversation.unreadCounts.set(userId, 0);

    await conversation.save()

    // io.to(conversationId).emit("read-message", {
    //   conversation: updated,
    //   lastMessage: {
    //     _id: updated?.lastMessage._id,
    //     content: updated?.lastMessage.content,
    //     createdAt: updated?.lastMessage.createdAt,
    //     sender: {
    //       _id: updated?.lastMessage.senderId,
    //     },
    //   },
    // });

    return res.status(200).json({
      message: "Marked as seen",
      data: conversation
    });

  } catch (error) {
    console.error("Lỗi khi mark as seen", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
}

export const getUserConversationsForSocket = async (userID: string) => {
    try{
        const conversations = await Conversation.find({
            "participants.userID" : userID,
        }, {
            _id: 1
        })

        return conversations
    }catch(error: any){
        console.log(error.stack);
    }
}

export const deleteAllConversation = async (req: Request, res: Response) => {
    await Promise.all([ 
        Message.deleteMany({ }),
        Conversation.deleteMany({ })
    ])
    
    return res.send("Deleted all conversations.")
}