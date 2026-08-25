
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
    reactCount: number
    commentCount: number
    isAuthUserReacted: string | null
}

export type PostWithReactions = PostInterface & {
    reactions: {
        ownerID: string
        type: string
        owner: UserInterface
    }[]
}

export type PostWithComments = PostInterface & {
    comments: {
        _id: string
        ownerID: string
        postID: string
        content: string
        referenceCommentID?: string
        createdAt: Date
        owner: UserInterface
    }[]
}

export type Comment = {
    _id: string
    owner: UserInterface,
    content: string
    postID: string
    referenceCommentID?: string
    createdAt: Date
}

export type Reaction = {
    owner: UserInterface,
    type: string
    createdAt: Date
}