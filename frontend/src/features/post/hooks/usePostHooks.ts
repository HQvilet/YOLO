import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import api from "../../../lib/api.config";
import type { PostContent, PostInterface } from "../../../shared/types/post.types";

export const useGetPosts = (
    
) => useQuery({
    queryKey: ["post"],
    queryFn: (): Promise<PostInterface[]> => 
        api.get("/api/post/")
            .then(res => res.data.data)
})

export const useUploadPost = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (data: PostContent) => 
        api.post("/api/post/", data),
    ...options
})