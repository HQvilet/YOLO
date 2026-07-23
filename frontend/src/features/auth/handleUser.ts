import { useQuery } from "@tanstack/react-query"
import api from "../../lib/api.config"
import type { UserInterface } from "../../typedef/user.type"

export const useQueryAuthUser = () => useQuery({
  queryKey: ["authUser"],
  queryFn: (): Promise<UserInterface> => 
    api.get("/api/auth/me")
      .then(res => {
        if(!res.data)
          throw new Error(res.data.error, res.data.message)
        return res.data.data
      }).catch(err => {
        console.log(err)
      }),
    staleTime: 60*1000
})

export const useQueryUser = (userID: string) => useQuery({
  queryKey: ["user", userID],
  queryFn: async (): Promise<UserInterface> =>
    api.get(`/api/user/profile/${userID}`)
      .then(res => res.data.data)
})

export const useQueryAllUsers = () => useQuery({
  queryKey: ["users"],
  queryFn: (): Promise<UserInterface[]> => 
    api.get(`/api/user`)
      .then(res => res.data.data)
})