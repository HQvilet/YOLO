import type { Server } from "http";
import type { DefaultEventsMap } from "socket.io";
import onlineUsers from "../memory/onlineUserSocket.ts";

export const updateConversation = (conversation: any, message: any) => {
    conversation.set({
        lastMessageAt: message.createdAt,
        lastMessage: message._id,
    })

    conversation.participants.forEach((p: any) => {
        const memberID = p.userID._id.toString();
        const isSender = memberID === message.senderID.toString();
        const prevCount = conversation.unreadCounts.get(memberID) || 0;
        conversation.unreadCounts.set(memberID, isSender ? 0 : prevCount + 1);
    });
}
