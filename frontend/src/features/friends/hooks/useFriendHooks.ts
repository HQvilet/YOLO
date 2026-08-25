import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../lib/api.config";
import type { UserInterface, UserWithStatus } from "../../../shared/types/user.types"
import type { RequestInterface } from "../../../shared/types/request.types"


export const useQueryAllFriends = (userID: string) => useQuery({
    queryKey: ["friends", userID],
    queryFn: (): Promise<UserInterface[]> => 
        api.get(`/friend/${userID}/all`)
            .then(res => res.data.data)
})

export const useQueryAllRecommendedUser = () => useQuery({
    queryKey: ["friend-recommend"],
    queryFn: (): Promise<UserWithStatus[]> => 
        api.get(`/friend/recommend`)
            .then(res => res.data.data),
})

