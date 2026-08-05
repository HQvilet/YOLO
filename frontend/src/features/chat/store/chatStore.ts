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
    addUserToChatList: (userID: string) => void
    addConversationToChatList: (conversationID: string) => void

    setChatState: (userID?: string, conversationID?: string, value?: boolean) => void

    updateConversationID: (userID: string, conversationID: string) => void
}

export const useChatListStore = create<ChatStore>((set, get) => ({
    chatList: [],
    addUserToChatList: async (userID: string) => {
        const res = await api.get("/api/conversation/get",{
            params: {
                participantID: userID
            }
        }).then(res => {
            get().addConversationToChatList(res.data.data._id)
        }).catch(() => {
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
    addConversationToChatList: (conversationID: string) => set(state => {
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
