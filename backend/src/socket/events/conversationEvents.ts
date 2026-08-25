import onlineUsers from "../../memory/onlineUserSocket.ts";
import { io } from "../socket.ts";

export function emitNewConversationEvent(conversation: any){
    io.to(conversation.id).emit("conversation-new-group", {
        conversation
    })
}

export function emitNewUsersInvitedEvent(conversation: any, participants: any[]){
    io.to(conversation.id).emit("conversation-new-participant", {
        conversation,
        participants,
    })
}

export function emitUserLeftEvent(conversation: any, participant: any){
    io.to(conversation.id).emit("conversation-participant-left", {
        conversation,
        participant,
    })
}