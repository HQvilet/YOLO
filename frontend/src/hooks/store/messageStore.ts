import { create } from "zustand";
import type { UserInterface } from "../../typedef/user.type";
import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "../../typedef/conversation.type";
import api from "../../services/api.config";
import type { Message } from "../../typedef/message.type";

interface MessageStore{
    messages: {
        convo?: string,
        messages?: Message[]
    }
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: {}
}))