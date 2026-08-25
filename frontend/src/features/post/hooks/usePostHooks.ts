import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import api from "../../../lib/api.config";
import type { Comment, PostContent, PostInterface, Reaction } from "../../../shared/types/post.types";

export const useQueryPosts = () => useQuery({
    queryKey: ["posts"],
    queryFn: (): Promise<PostInterface[]> => 
        api.get("/post/")
            .then(res => res.data.data),
    staleTime: 10000
})

export const useQueryUserPosts = (userID: string) => useQuery({
    queryKey: ["posts", userID],
    queryFn: (): Promise<PostInterface[]> => 
        api.get(`/post/${userID}/user`)
            .then(res => res.data.data)
})

export const useQueryPostByID = (postID: string) => useQuery({
    queryKey: ["post", postID],
    queryFn: (): Promise<PostInterface> => 
        api.get(`/post/${postID}`)
            .then(res => res.data.data),
    
})

export const useUploadPost = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (data: PostContent) => 
        api.post("/post/", data),
    ...options
})

export const useQueryAllReacts = (
    postID: string,

) => useQuery({
    queryKey: ["post-like"],
    queryFn: (): Promise<Reaction[]> => 
        api.get(`/post/${postID}/like`,  {
            params: {
                limit: 20,
                offset: 0
            }
        })
            .then(res => res.data.data)
})

export const useQueryAllComments = (
    postID: string,
) => useQuery({
    queryKey: ["post-comment", postID],
    queryFn: (): Promise<Comment[]> =>
        api.get(`/post/${postID}/comment`,  {
            params: {
                limit: 20,
                offset: 0
            }
        })
            .then(res => res.data.data)
})

export const useLikePost = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (postID: string): Promise<PostInterface> => 
        api.post(`/post/${postID}/like`, {
            type: "like"
        })
            .then(res => res.data.data),
    ...options
})

export const useUnlikePost = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (postID: string): Promise<PostInterface> => 
        api.post(`/post/${postID}/unlike`)
            .then(res => res.data.data),
    ...options
})

export const useCommentPost = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (data: {postID: string, comment: string}): Promise<PostInterface> => 
        api.post(`/post/${data.postID}/comment`, {
            content: data.comment,
            referenceCommentID: null
        })
            .then(res => res.data.data),
    ...options
})
