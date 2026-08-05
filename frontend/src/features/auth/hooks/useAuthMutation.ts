import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "../../../lib/api.config"
import type { UserLogIn, UserSignUp } from "../../../shared/types/user.types"


export const useAuthLogin = ({onSuccess}: {onSuccess?: any}) => useMutation({
    mutationFn: async (authData: UserLogIn) => {
        await api.post("/api/auth/login",
            authData,
        ).then(res => {
            return res.data.data
        }).catch(err => {
            console.log(err.message)
        })
    },
    onSuccess,
})

export const useAuthSignUp = ({onSuccess}: {onSuccess?: any}) => useMutation({
    mutationFn: async (authData: UserSignUp) => {
        await api.post("/api/auth/signup",
            authData,
        ).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },
    onSuccess,
})

export const useAuthLogOut = ({onSuccess}: {onSuccess?: any}) => useMutation({
    mutationFn: () => 
        api.post("/api/auth/logout"),
    onSuccess,
})