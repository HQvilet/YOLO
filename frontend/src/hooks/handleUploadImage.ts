import { useQuery } from "@tanstack/react-query"
import api from "../services/api.config"

export const useQuerySignedURL = () => useQuery({
    queryKey: ["signedURL"],
    queryFn: async () => 
      api.get("/api/cloudinary/sign-delivery")
        .then(res => res.data)

  })
