import { io, Socket } from "socket.io-client"
import { SOCKET_SERVER_URL } from "./server.config"


const baseURL = SOCKET_SERVER_URL

export const clientSocket: Socket = io(baseURL, {
    transports: ["websocket"],
    withCredentials: true,
})