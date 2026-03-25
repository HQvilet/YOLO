import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../services/api.config"
import type { RequestInterface } from "../typedef/request.type"


export const useSendFriendRequest = () => useMutation({
    mutationFn: (userID: string) => 
        api.post(`/api/friend/request/${userID}`)
            .then(res => res.data.data)
})

export const useQueryAllRequests = () => useQuery({
    queryKey: ["requests"],
    queryFn: (): Promise<RequestInterface[]> =>
        api.get(`/api/friend/request`)
            .then(res => res.data.data)
})