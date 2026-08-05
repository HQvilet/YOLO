import { create } from "zustand";
import type { UserInterface } from "../../../shared/types/user.types";
import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "../../../shared/types/conversation.types";
import api from "../../../lib/api.config";
import type { Message } from "../../../shared/types/message.types";

interface MessageStore{
    messages: {
        convo?: string,
        messages?: Message[]
    }
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: {}
}))