import { useQuery, useMutation } from "@tanstack/react-query"
import api from "../services/api.config"

export const useCreateConversation = () => useMutation({
    mutationFn: () => 
        api.post("/conversation/create")
            .then(res => {})
})

export const useQueryConversation = ({conversationID, recipientID} : {conversationID?: string, recipientID?: string}) => useQuery({
    queryKey: ["conversation", conversationID ?? recipientID],
    queryFn: () => 
        api.get("")
            .then(res => res.data.data)
})

export const useQueryAllConversation = () => useQuery({
    queryKey: ["conversation"],
    queryFn: () => 
        api.get("")
            .then(res => res.data.data)
})
