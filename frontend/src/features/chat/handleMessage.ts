import { QueryClient, useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import api from "../../lib/api.config";
import type { Message } from "../../typedef/message.type";
import queryClient from "../../lib/queryClient";

export const useSendDirectMessage = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (message: any) =>
      api.post("/api/message/direct", message),
    ...options
})

export const useSendGroupMessage = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (message: any) =>
      api.post("/api/message/group", message),
    ...options
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