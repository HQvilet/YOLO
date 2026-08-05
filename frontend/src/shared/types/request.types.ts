
import type { UserInterface } from './user.types'

export interface RequestInterface {
    _id: string
    sender: UserInterface
    recipient: string
    acceptedAt: Date
    createdAt: Date
    requestStatus: any
}
