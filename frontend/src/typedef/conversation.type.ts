import type { UserInterface } from "./user.type"

export interface Conversation{
    _id: string,
    group?: {
        name: string,
        createdBy: string,
    }
    conversationID?: string,
    participants: {
        userID: UserInterface,
        joinedAt: Date,
        nickName?: string
    }[],
    
}