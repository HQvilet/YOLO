import type { Request, Response } from "express"
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import Conversation from "../model/conversation.model.ts";
import { Types } from "mongoose"
import UserProfile from "../model/user.profile.model.ts";
import Message from "../model/message.model.ts";
import { io } from "../socket/socket.ts";
import { addUsersToConversation } from "../socket/socketHelper.ts";
import { emitNewConversationEvent } from "../socket/events/conversationEvents.ts";

export const getAllConversations = async (req: Request, res: Response) => {
    try{
        const userID = req.user._id

        const conversations = await Conversation.find({
            "participants.userID": userID
        })
        .populate({
            path: "participants.userID",
        })
        .populate("lastMessage")
        .sort({
            lastMessageAt: -1,
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

export const getConversationById = async (req: Request, res: Response) => {
    try{
        const { conversationID } = req.params
        const userID = req.user._id

        let conversation;
        if(conversationID){
            conversation = await Conversation.findOne({
                _id: conversationID,
                "participants.userID": {$in: userID}
            }).populate({
                path: "participants.userID",
            })
            .populate("lastMessage")
            
        } else {
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

export const getConversationByParticipantID = async (req: Request, res: Response) => {
    try{
        const { participantID } = req.params
        const userID = req.user._id

        let conversation;
        if(participantID){
            conversation = await Conversation.findOne({
                "participants.userID": {
                    $all: [userID, participantID]
                },
                type: "direct",
            }).populate({
                path: "participants.userID",
            })
        } else{
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
        const { userIDs } = req.body
        const userID = req.user._id

        userIDs.push(userID.toString())

        const conversation = await Conversation.create({
            participants: userIDs.map((id: string) => ({
                userID: new Types.ObjectId(id),
                joinedAt: new Date(),
                invitedBy: userID
            })),
            type: "group",
            group: {
                name: "New Group",
                createBy: userID,
            }
        })

        await conversation.populate({
            path: "participants.userID",
        })

        addUsersToConversation(io, conversation.participants.map(p => p.userID?.toString()!), conversation.id)
        emitNewConversationEvent(conversation)

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

export const inviteUsersToConversation = async (req: Request, res: Response) => {
    try{
        const { conversationID } = req.params
        const { toInviteIDs } = req.body
        const userID = req.user._id

        const conversation = await Conversation.findOne({
            _id: conversationID,
            "participants.userID": userID,
            "type": "group",
        })

        if(!conversation){
            return res.status(404).json(serverResponseMessage({
                success: false,
                message: "No Resource Found",
            }))
        }

        if(conversation.participants.some((participant) => toInviteIDs.includes(participant.userID?.toString()))){
            return res.status(400).json(serverResponseMessage({
                success: false,
                message: "Some users are already in the conversation.",
            }))
        }

        const newParticipants = toInviteIDs.map((id: string) => ({
            userID: new Types.ObjectId(id),
            joinedAt: new Date(),
            invitedBy: userID
        }))

        conversation.participants.push(...newParticipants)
        
        await conversation.save()

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Invited users to conversation",
            data: conversation
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const leaveConversation = async (req: Request, res: Response) => {
    try{
        const { conversationID } = req.params
        const userID = req.user._id

        const conversation = await Conversation.findOneAndUpdate({
            _id: conversationID,
            "participants.userID": userID,
        }, {
            $set: {
                "participants.status": "left",
            }
        })

        if(!conversation){
            return res.status(404).json(serverResponseMessage({
                success: false,
                message: "No Resource Found",
            }))
        }

        await conversation.save()

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
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