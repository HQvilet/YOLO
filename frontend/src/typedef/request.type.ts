
export interface RequestInterface{
    _id: string,
    sender: any,
    recipient: string,
    acceptedAt: Date,
    createdAt: Date,
    status: "accepted" | "pending"
}