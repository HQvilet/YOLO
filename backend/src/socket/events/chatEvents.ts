import Message from "../../model/message.model.ts";
import { io } from "../socket.ts";

export function emitNewMessageEvent(message: any, conversation: any){
    io.to(conversation._id.toString()).emit("new-message", {
        message,
        conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
        },
        unreadCounts: conversation.unreadCounts,
    })
}

export function emitReadConversationEvent(conversation: any){
    
}