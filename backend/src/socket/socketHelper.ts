import onlineUsers from "../memory/onlineUserSocket.ts"

export const addUserToConversation = (io: any, userID: string, conversationID: string) => {
    const s = io.sockets.sockets.get(onlineUsers.get(userID))
    s?.join(conversationID)
}

export const addUsersToConversation = (io: any, userIDs: string[], conversationID: string) => {
    userIDs.forEach(userID => {
        const s = io.sockets.sockets.get(onlineUsers.get(userID))
        s?.join(conversationID)
    })
}

export const removeUsersFromConversation = (io: any, userIDs: string[], conversationID: string) => {
    userIDs.forEach(userID => {
        const s = io.sockets.sockets.get(onlineUsers.get(userID))
        s?.leave(conversationID)
    })
}