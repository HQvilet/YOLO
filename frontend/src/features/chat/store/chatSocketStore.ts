import {create} from "zustand"
import { connect, io, type Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query";
import { data } from "react-router-dom";
import { addMessageToConversation } from "../hooks/useMessageHooks";
import api from "../../../lib/api.config";
import type { Conversation } from "../../../shared/types/conversation.types";
import queryClient from "../../../lib/queryClient";
import { manageConversationSocket, updateConversationWithMessage } from "../service/conversation.service";
import { clientSocket } from "../../../lib/socket.config";

const baseURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"


interface SocketStore {
    socket: Socket | null | undefined,
    connectSocket: () => void,
    disconnectSocket: () => void,
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
        });

        console.log("Connecting to socket server at", socket.id)
        
        socket.on('connect_error', function(err){
            console.log('Connection Failed', err);
            get().disconnectSocket();
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
            console.log(message, conversation);
            addMessageToConversation(conversation._id.toString(), message)
            
            const conversations = queryClient.getQueryData(["conversations"]) as Conversation[] | null
            
            if(conversations?.find(c => c._id === conversation._id) ?? false){
                updateConversationWithMessage(conversation._id, message)
            } 
            // else {
            //     api.get(`/api/conversation/${conversation._id}`)
            //         .then(res => { 
            //             updateConversation(res.data.data as Conversation) 
            //         })
            // }
        })

        manageConversationSocket(socket)


    },
    disconnectSocket: () => {
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