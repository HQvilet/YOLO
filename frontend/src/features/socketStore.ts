import {create} from "zustand"
import { io, type Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query";
import { data } from "react-router-dom";
import { updateConversation } from "./chat/handleConversation";
import { addMessageToConversation } from "./chat/handleMessage";

const baseURL = import.meta.env.VITE_SOCKET_URL

interface SocketStore {
    socket: Socket | null | undefined,
    connectSocket: () => void,
    disConnectSocket: () => void,
    joinedConversation: (conversationID: string) => void,
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connectSocket: () => {

        const existingSocket = get().socket;
        if(existingSocket)
            return;

        const socket: Socket = io(baseURL, {
            transports: ["websocket"],
            withCredentials: true,
        })
        socket.on('connect_error', function(err){
            console.log('Connection Failed', err);
        });
        set({ socket })
        socket.on("connect", () => {
            console.log("Socket connected to server.")
        })

        socket.on("online-users", (data) => {
            
        })

        socket.on("read-message", (data) => {
            
        })

        socket.on("new-message", ({message, conversation, unreadCounts}) => {
            console.log(message)
            addMessageToConversation(conversation._id.toString(), message)
            updateConversation(conversation._id, message)
        })
    },
    disConnectSocket: () => {
        const currentSocket = get().socket;
        if(currentSocket){
            currentSocket.disconnect();
            set({ socket: null });
        }
    },
    joinedConversation: (conversationID: string) => {
        // get().socket?.emit("join-conversation", {conversationID})
    }
}))