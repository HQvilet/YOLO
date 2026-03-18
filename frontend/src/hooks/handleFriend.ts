import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../services/api.config";
import type { UserInterface } from "../typedef/user.type";
import type { RequestInterface } from "../typedef/request.type";

export const useSendFriendRequest = () => useMutation({
    mutationFn: (userID: string) => 
        api.post(`/api/user/friend/request/${userID}`)
            .then(res => res.data.data)
})

export const useAcceptFriendRequest = () => useMutation({
    mutationFn: (requestID: string) => 
        api.post(`/api/user/friend/${requestID}/accept`)
            // .then(res => res.data.data)
})

export const useQueryAllFriends = (userID: string) => useQuery({
    queryKey: ["friends", userID],
    queryFn: (): Promise<any[]> => 
        api.get(`/api/user/friend/${userID}/all`)
            .then(res => res.data.data)
})

export const useQueryAllRecommendedUser = (userID: string) => useQuery({
    queryKey: ["friend-recommend", userID],
    queryFn: (): Promise<UserInterface[]> => 
        api.get(`/api/user/friend/recommend`)
            .then(res => res.data.data),
})

export const useQueryAllRequests = (userID: string) => useQuery({
    queryKey: ["friend-requests"],
    queryFn: (): Promise<RequestInterface[]> =>
        api.get(`/api/user/friend/request`)
            .then(res => res.data.data)
})