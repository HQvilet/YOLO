import { create } from "zustand";
import type { UserInterface } from "../../typedef/user.type";

type ChatPreview = {
    conversationID?: string,
    user: UserInterface,
    isOpen: boolean
}

type ChatStore = {
    chatList: ChatPreview[]
    addToChatList: (user: UserInterface, conversationID?: string) => void
    setChatState: (userID: UserInterface, value: boolean) => void
}

export const useChatList = create<ChatStore>((set) => ({
    chatList: [],
    addToChatList: (user: UserInterface, conversationID?: string) => set((state) => {
        if(state.chatList.find(chat => chat.conversationID === conversationID || chat.user === user)){
            return ({
                chatList: state.chatList.map(chat => ({
                    conversationID: chat.conversationID,
                    user: chat.user,
                    isOpen: chat.user === user ? true : chat.isOpen}))
            })
        }
        return ({
            chatList: [...state.chatList, ({
                user,
                conversationID,
                isOpen: true
            })]
        })
    }),
    setChatState: (userID: UserInterface, value: boolean) => set(state => ({
        chatList: state.chatList.map(chat => ({
            conversationID: chat.conversationID,
            user: chat.user,
            isOpen: chat.user === userID ? value : chat.isOpen
      }))
    })),
}))
