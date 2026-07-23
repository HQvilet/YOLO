import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/api.config";
import type { UserInterface, UserWithStatus } from "../../typedef/user.type";
import type { RequestInterface } from "../../typedef/request.type";


export const useQueryAllFriends = (userID: string) => useQuery({
    queryKey: ["friends", userID],
    queryFn: (): Promise<any[]> => 
        api.get(`/api/friend/${userID}/all`)
            .then(res => res.data.data)
})

export const useQueryAllRecommendedUser = () => useQuery({
    queryKey: ["friend-recommend"],
    queryFn: (): Promise<UserWithStatus[]> => 
        api.get(`/api/friend/recommend`)
            .then(res => res.data.data),
})

