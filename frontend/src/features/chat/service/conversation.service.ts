import type { Socket } from "socket.io-client";
import type { Conversation } from "../../../shared/types/conversation.types";
import queryClient from "../../../lib/queryClient";
import type { UserInterface } from "../../../shared/types/user.types";
import type { Message } from "../../../shared/types/message.types";

export const manageConversationSocket = (socket: Socket) => {
    socket.on("conversation-new-group", ({conversation}: {conversation: Conversation}) => {
        console.log("Receive new conversation", conversation)
        updateConversation(conversation)
    })

    socket.on("conversation-new-participant", ({conversation, participants}: {conversation: Conversation, participants: UserInterface[]}) => {
        
    })
}

export const updateConversation = (conversation: Conversation) => {
    queryClient.setQueryData(["conversations"], (oldData: Conversation[] | null | undefined) => ([
        conversation,
        ...oldData?.filter(convo => convo._id !== conversation._id) ?? []
    ]))
}

export const addUserToConversation = (conversation: string, participants: UserInterface[]) => {
    queryClient.setQueryData(["conversations"], (oldData: Conversation[]) => ([
        ...oldData.map(conversation => {
            // if(conversation._id === conversationID){
            //     conversation.participants.push(pa)
            // }
        })
    ]))
}


export const updateConversationWithMessage = (conversationID: string, message: Message) => {
    queryClient.setQueryData(["conversations"], (oldData: any[]) => ([
        ...oldData.filter(convo => convo._id === conversationID)
                    .map(convo => ({
                        ...convo,
                        lastMessage: message,
                        lastMessageAt: message.createdAt,
                    })),
        ...oldData.filter(convo => convo._id !== conversationID)
    ]))
}