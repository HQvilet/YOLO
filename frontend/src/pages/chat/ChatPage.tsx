import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useQueryAuthUser } from '../../hooks/handleUser'

import ChatBox from '../../components/chat/ChatBox'
import NavChatAvatar from '../../components/chat/NavChatAvatar'
import { useChatList } from '../../hooks/store/chatFriendStore'

interface ChatPreview{
  user: string,
  isOpen: boolean,
}


const ChatPage = () => {

    const chatList = useChatList(state => state.chatList)

    const authUser = useQueryAuthUser()
    
    return (
    <>
        <div className='flex flex-row-reverse gap-3 mr-2 fixed bottom-0 right-0 z-10'>
            <div className='flex flex-col-reverse gap-2 pb-3'>
              {
                  chatList.map(m => 
                    (!m.isOpen && <NavChatAvatar key={m.conversationID || m.user._id} user={m.user}/>))
                }
            </div>
            <div className='flex flex-row gap-10'>
                {
                  chatList.map(m => 
                    (m.isOpen && <ChatBox key={m.conversationID || m.user._id} user={m.user}/>))
                }
            </div>
        </div> 
    </>
  )
}

export default ChatPage