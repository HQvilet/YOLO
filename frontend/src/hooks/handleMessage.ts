import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "../services/api.config";
import type { UserInterface } from "../typedef/user.type";
import type { Message } from "../typedef/message.type";
import queryClient from "../services/queryClient";

export const useSendMessage = () => useMutation({
    mutationFn: (postData: any) => 
        api.post("/api/message/send", postData)
            .then(res => res.data.data)
})

export const useQueryAllMessage = (conversationID: string) => useQuery({
    queryKey: ["message", conversationID],
    queryFn: (): Promise<Message[]> => 
        api.get(`/api/message/${conversationID}`)
            .then(res => res.data.data),
    staleTime: Infinity
})

export const addMessageToConversation = (conversationID: string, message: Message) => {
    queryClient.setQueryData(['message', conversationID], (oldData: any[] | undefined) => ([
        message,
        ...(oldData ?? []),
    ]))
}