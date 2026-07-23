import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query"
import api from "../lib/api.config"
import axios from "axios"

export const asyncReadFileData = (file: File) => 
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ fileName: file.name, content: reader.result });
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

export const useUploadImage = (
    options?: UseMutationOptions<any, Error, any>
) => useMutation({
    mutationFn: (imgRawData: string[]) =>
      api.get("/api/cloudinary/sign-delivery")
        .then(res => {
            console.log("Get signed url.")
            const signatureResult = res.data

            if(!signatureResult){
                throw new Error("Fail to sign secret url.")
            }
            
            return Promise.all(imgRawData.map(img => {
                const data = new FormData();
                
                data.append("file", img)
                data.append("api_key", signatureResult.apiKey)
                data.append("timestamp", `${signatureResult.timestamp}`)
                data.append("signature", signatureResult.signature)

                return axios.post(`https://api.cloudinary.com/v1_1/${signatureResult.cloudName}/image/upload`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }))
            
        }),
    ...options
})