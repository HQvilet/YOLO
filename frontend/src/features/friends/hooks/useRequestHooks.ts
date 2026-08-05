import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import api from "../../../lib/api.config"
import type { RequestInterface } from "../../../shared/types/request.types"


export const useSendFriendRequest = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (userID: string) => 
        api.post(`/api/friend/request/${userID}`)
            .then(res => res.data.data),
    ...options
})

export const useAcceptFriendRequest = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (requestID: string) => 
        api.put(`/api/friend/request/${requestID}/accept`)
            .then(res => res.data.data),
    ...options
})

export const useDeclineFriendRequest = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (requestID: string) => 
        api.put(`/api/friend/request/${requestID}/decline`)
            .then(res => res.data.data),
    ...options
})

export const useQueryAllRequests = (
    options?: UseQueryOptions<any, Error, any>
) => useQuery({
    queryKey: ["requests"],
    queryFn: (): Promise<RequestInterface[]> =>
        api.get(`/api/friend/request`)
            .then(res => res.data.data),
    ...options
})
