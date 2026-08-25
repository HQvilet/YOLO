
import type { Message } from './message.types'
import type { UserInterface } from './user.types'

export interface Conversation {
    _id: string
    group?: {
        name?: string
        avatar?: string
        createdBy: string
    }
    conversationID?: string
    participants: {
        userID: UserInterface
        joinedAt: Date
        nickName?: string
        status: "joined" | "left"
        invitedBy: string
    }[]
    lastMessageAt: Date
    lastMessage: Message
    type: 'direct' | 'group'
    unreadCounts?: Map<string, number>
}
