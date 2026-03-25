import type { Server } from "http";
import type { DefaultEventsMap } from "socket.io";
import onlineUsers from "../memory/onlineUserSocket.ts";

export const updateConversation = (conversation: any, message: any) => {
    conversation.set({
        lastMessageAt: message.createdAt,
        lastMessage: message._id,
    })

    conversation.participants.forEach((p: any) => {
        const memberID = p.userID.toString();
        const isSender = memberID === message.senderID.toString();
        const prevCount = conversation.unreadCounts.get(memberID) || 0;
        conversation.unreadCounts.set(memberID, isSender ? 0 : prevCount + 1);
    });
    
}

export const emitNewMessage = (io: any, conversation: any, message: any) => {
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

export const addUserToConversation = (io: any, userID: string, conversationID: string) => {
    const s = io.sockets.sockets.get(onlineUsers.get(userID))
    s?.join(conversationID)

}