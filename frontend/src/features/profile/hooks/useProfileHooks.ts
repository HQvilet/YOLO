import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import api from "../../../lib/api.config";
import type { UserInterface, UserProfileWithDetail, UserWithStatus } from "../../../shared/types/user.types";
import type { PostInterface } from "../../../shared/types/post.types";


export const useQueryProfile = (userID: string) => useQuery({
    queryKey: ["profile", userID],
    queryFn: (): Promise<UserProfileWithDetail> => 
        api.get(`/user/profile/${userID}`)
            .then(res => {
                const data = res.data.data;
                return data
            }),
})

export const useQueryProfilePosts = (userID: string) => useQuery({
    queryKey: ["posts", userID],
    queryFn: (): Promise<PostInterface[]> =>
        api.get(`/post/user/${userID}`)
            .then(res => {
                const data = res.data.data;
                return data
            }),
})

export const useQueryFriends = (userID: string) => useQuery({
    queryKey: ["friends", userID],
    queryFn: (): Promise<UserProfileWithDetail[]> => 
        api.get(`/friend/${userID}/all`)
    .then(res => {
        return res.data.data;
    }),
})

export const useUpdateProfile = (
    options?: UseMutationOptions<unknown, unknown, { profileImg: string; coverImg: string }>
) => useMutation<unknown, unknown, { profileImg: string; coverImg: string }>({
    mutationFn: ({ profileImg, coverImg }: { profileImg: string; coverImg: string }): Promise<unknown> => 
        api.put("/user/update", {
            profileImg,
            coverImg
        }),
    ...options
})