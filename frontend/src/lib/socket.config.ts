import { io, Socket } from "socket.io-client"


const baseURL = import.meta.env.VITE_SOCKET_URL

export const clientSocket: Socket = io(baseURL, {
    transports: ["websocket"],
    withCredentials: true,
})