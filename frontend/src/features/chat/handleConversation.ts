import { useQuery, useMutation } from "@tanstack/react-query"
import api from "../../lib/api.config"
import queryClient from "../../lib/queryClient"
import type { Conversation } from "../../typedef/conversation.type"
import type { Message } from "../../typedef/message.type"

export const useCreateConversation = () => useMutation({
    mutationFn: () => 
        api.post("/conversation/create")
            .then(res => {})
})

export const useQueryConversation = ({conversationID, recipientID} : {conversationID?: string, recipientID?: string}) => useQuery({
    queryKey: ["conversation", conversationID],
    queryFn: (): Promise<Conversation> => 
        api.get("/api/conversation/get",{
            params: {
                participantID: recipientID,
                conversationID,
            }
        }).then(res => res.data.data),
    staleTime: 1000*60
})



export const useQueryAllConversation = () => useQuery({
    queryKey: ["conversations"],
    queryFn: (): Promise<Conversation[]> =>
        api.get("/api/conversation")
            .then(res => {
            return res.data.data
        }),
    staleTime: Infinity
  })

export const updateConversation = (conversationID: string, message: Message) => {
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

export const addConversation = (conversationID: string) => {
    queryClient.setQueryData(["conversations"], (oldData: any[]) => ([
        ...oldData,
        conversationID
    ]))
}