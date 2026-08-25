import { useQuery } from "@tanstack/react-query"
import api from "../../../lib/api.config"
import type { UserProfileWithDetail } from "../../../shared/types/user.types"


export const useQuerySearchUsers = (searchQuery: string) => useQuery({
    queryKey: ['search', searchQuery],
    queryFn: (): Promise<UserProfileWithDetail[]> => 
        api.get(`/user/search`,{
            params: {
                q: searchQuery,
                limit: 10,
                offset: 0
            }
        }).then(res => res.data.data),
})