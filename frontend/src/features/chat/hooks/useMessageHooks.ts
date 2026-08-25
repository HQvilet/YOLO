import { QueryClient, useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import api from "../../../lib/api.config";
import type { Message, MessageContent } from "../../../shared/types/message.types";
import queryClient from "../../../lib/queryClient";

export const useSendDirectMessage = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (message: any) =>
      api.post("/message/direct", message),
    ...options
})

export const useSendGroupMessage = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (message: any) =>
      api.post("/message/group", message),
    ...options
})

export const sendMessageToConversation = (conversationID: string, message: MessageContent) => {
    api.post(`/message/${conversationID}`, message)
        .then(res => {
            const data = res.data.data
            queryClient.setQueryData(['message', conversationID], (oldData: any[] | undefined) => ([
                data,
                ...(oldData ?? []),
            ]))
        })
        .catch(err => {
            console.error("Error sending message:", err);
        });
}

export const sendMessageToDirect = (recipientID: string, message: MessageContent) => {
    api.post(`/message/direct`, { ...message, recipientID })
        .then(res => {
            const data = res.data.data
            queryClient.setQueryData(['message', 'direct'], (oldData: any[] | undefined) => ([
                data,
                ...(oldData ?? []),
            ]))
        })
        .catch(err => {
            console.error("Error sending direct message:", err);
        });
}

export const useQueryAllMessage = (conversationID?: string) => useQuery({
    queryKey: ["message", conversationID],
    queryFn: (): Promise<Message[]> => {
        if(!conversationID)
            throw new Error("Conversation ID is required.")

        return api.get(`/message/${conversationID}`)
            .then(res => res.data.data)
    },
    staleTime: Infinity
})

export const addMessageToConversation = (conversationID: string, message: Message) => {
    queryClient.setQueryData(['message', conversationID], (oldData: any[] | undefined) => ([
        message,
        ...(oldData ?? []),
    ]))
}