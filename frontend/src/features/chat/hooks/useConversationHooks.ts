import { useQuery, useMutation, type UseMutationOptions } from "@tanstack/react-query"
import api from "../../../lib/api.config"
import queryClient from "../../../lib/queryClient"
import type { Conversation } from "../../../shared/types/conversation.types"
import type { Message } from "../../../shared/types/message.types"

export const useCreateConversation = (options?: UseMutationOptions<Conversation, unknown, { userIDs: string[] }>) => useMutation({
    mutationFn: ({userIDs} : {userIDs: string[]}) => 
        api.post("/conversation", { userIDs })
            .then(res => {
                console.log("create conversation", res.data.data)
                return res.data.data
            }),
    ...options
})

export const useQueryConversation = ({conversationID, participantID} : {conversationID?: string, participantID?: string}) => useQuery({
    queryKey: ["conversation", conversationID ?? participantID],
    queryFn: (): Promise<Conversation> => {
        if(!conversationID && !participantID){
            throw new Error("Conversation ID or Participant ID is required.")
        }

        return api.get(`/conversation/${conversationID}`)
            .then(res => res.data.data)  
    }
})

export const useInviteFriends = (options?: UseMutationOptions<Conversation, unknown, any>) => useMutation({
    mutationFn: ({ conversationID, users }: { conversationID: string, users: string[] }): Promise<Conversation> => {
        return api.post(`/conversation/${conversationID}/invite`, {
            toInviteIDs: users
        })
    }
})

export const useQueryAllConversation = () => useQuery({
    queryKey: ["conversations"],
    queryFn: (): Promise<Conversation[]> =>
        api.get("/conversation")
            .then(res => {
            return res.data.data
        }),
    staleTime: Infinity
  })

