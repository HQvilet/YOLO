import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../services/api.config"
import axios from "axios"

export const useUploadImage = ({onSuccess}: {onSuccess?: any}) => useMutation({
    mutationFn: (imgData: string) => 
      api.get("/api/cloudinary/sign-delivery")
        .then(res => {
            console.log("Get signed url.")
            const signatureResult = res.data

            if(!signatureResult){
                throw new Error("Fail to sign secret url.")
            }

            const data = new FormData();
            
            data.append("file", imgData)
            data.append("api_key", signatureResult.apiKey)
            data.append("timestamp", `${signatureResult.timestamp}`)
            data.append("signature", signatureResult.signature)

            return axios.post(`https://api.cloudinary.com/v1_1/${signatureResult.cloudName}/image/upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }),
    onSuccess,
})