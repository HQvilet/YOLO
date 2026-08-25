import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import api from "../../../lib/api.config"
import type { RequestInterface } from "../../../shared/types/request.types"


export const useSendFriendRequest = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (userID: string) => 
        api.post(`/friend/request/${userID}`)
            .then(res => res.data.data),
    ...options
})

export const useAcceptFriendRequest = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (requestID: string) => 
        api.put(`/friend/request/${requestID}/accept`)
            .then(res => res.data.data),
    ...options
})

export const useAcceptRequestFromUser = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (userID: string) => 
        api.put(`/friend/request/user/${userID}/accept`)
            .then(res => res.data.data),
    ...options
})

export const useDeclinetRequestFromUser = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (userID: string) => 
        api.put(`/friend/request/user/${userID}/decline`)
            .then(res => res.data.data),
    ...options
})

export const useDeclineFriendRequest = (
    options?: UseMutationOptions<any, Error, string>
) => useMutation({
    mutationFn: (requestID: string) => 
        api.put(`/friend/request/${requestID}/decline`)
            .then(res => res.data.data),
    ...options
})

export const useQueryAllRequests = (
    options?: UseQueryOptions<any, Error, any>
) => useQuery({
    queryKey: ["requests"],
    queryFn: (): Promise<RequestInterface[]> =>
        api.get(`/friend/request`)
            .then(res => res.data.data),
    ...options
})

export const useQueryAllSentRequests = (
    options?: UseQueryOptions<any, Error, any>
) => useQuery({
    queryKey: ["sent-requests"],
    queryFn: (): Promise<RequestInterface[]> =>
        api.get(`/friend/sent-request`)
            .then(res => res.data.data),
    ...options
})
