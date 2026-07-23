import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useQueryAuthUser } from '../features/auth/handleUser'

import ChatBox from '../components/chat/ChatBox'
import NavChatAvatar from '../components/chat/NavChatAvatar'
import { useChatListStore } from '../features/chat/chatFriendStore'

interface ChatPreview{
  user: string,
  isOpen: boolean,
}


const ChatPage = () => {

  const authUser = useQueryAuthUser()
  const chatList = useChatListStore(state => state.chatList)
    
  return (
    <>
      <div className='flex flex-row-reverse gap-3 mr-2 fixed bottom-0 right-0 z-10'>
          <div className='flex flex-col-reverse gap-2 pb-3'>
            <div className='size-10 '>

            </div>
            {
                chatList.map(chat => 
                  (!chat.isOpen && <NavChatAvatar key={chat.conversationID ?? chat.userID} userID={chat.userID} conversationID={chat.conversationID || ""}/>))
              }
          </div>
          <div className='flex flex-row gap-10'>
              {
                chatList.map(chat => 
                  (chat.isOpen && <ChatBox key={chat.conversationID ?? chat.userID} userID={chat.userID} conversationID={chat.conversationID || ""}/>))
              }
          </div>
      </div> 
    </>
  )
}

export default ChatPage