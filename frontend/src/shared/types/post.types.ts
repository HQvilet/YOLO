
import type { UserInterface } from './user.types'

export interface PostContent {
    textContent: string
    imgContent: string
}

export interface PostInterface {
    _id: string
    creator: UserInterface
    content: {
        text: string
        img?: string
    }
    createdAt: Date
    likeCount: number
    commentCount: number
}
