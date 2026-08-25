import { create } from "zustand";
import type { UserInterface } from "../../../shared/types/user.types";
import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "../../../shared/types/conversation.types";
import api from "../../../lib/api.config";

type ChatPreview = {
    conversationID?: string,
    userID?: string,
    isOpen: boolean
}

type ChatStore = {
    chatList: ChatPreview[]
    addChatByUser: (userID: string) => void
    addChatByConversation: (conversationID: string) => void

    setChatState: (userID?: string, conversationID?: string, value?: boolean) => void

    updateConversationID: (userID: string, conversationID: string) => void
}

export const useChatListStore = create<ChatStore>((set, get) => ({
    chatList: [],
    addChatByUser: async (userID: string) => {
        await api.get("/conversation/" + userID + "/user")
            .then(res => {
                if(res.data.data){
                    get().addChatByConversation(res.data.data._id)
                }
            })
            .catch((error) => {
                set(state => {
                    if(state.chatList.find(chat => chat.userID === userID)){
                        get().setChatState(userID, undefined, true)
                        return ({...state.chatList})
                    }
                    return ({
                        chatList: [...state.chatList,{
                            userID,
                            isOpen: true,
                        }]
                    })
                })
            })
    },
    addChatByConversation: (conversationID: string) => set(state => {
        if(state.chatList.find(chat => chat.conversationID === conversationID)){
            get().setChatState(undefined, conversationID, true)
            return ({...state.chatList})
        }
        return ({
            chatList: [...state.chatList, ({
                conversationID: conversationID,
                isOpen: true
            })]
        })
    }),
    setChatState: (userID?: string, conversationID?: string, value: boolean = false) => {
        if(conversationID){
            set(state => ({
                chatList: state.chatList.map(chat => ({
                    conversationID: chat.conversationID,
                    userID: chat.userID,
                    isOpen: chat.conversationID === conversationID ? value : chat.isOpen
                }))
            }))
        }
        else if(userID){
            set(state => ({
                chatList: state.chatList.map(chat => ({
                    conversationID: chat.conversationID,
                    userID: chat.userID,
                    isOpen: chat.userID === userID ? value : chat.isOpen
                }))
            }))
        }
    },
    updateConversationID: (userID: string, conversationID: string) => set(state => ({
        chatList: state.chatList.map(chat => ({
            conversationID: chat.userID === userID ? conversationID : chat.conversationID,
            userID: chat.userID,
            isOpen: chat.isOpen
        }))
    }))
}))
