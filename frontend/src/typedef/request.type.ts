import type { UserInterface } from "./user.type";

export interface RequestInterface{
    _id: string,
    sender: UserInterface,
    recipient: string,
    acceptedAt: Date,
    createdAt: Date,
    requestStatus: any
}