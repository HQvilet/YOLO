
import type { UserInterface } from './user.types'

export interface RequestInterface {
    _id: string
    sender?: UserInterface
    recipient?: UserInterface
    acceptedAt: Date
    createdAt: Date
    requestStatus: any
}
