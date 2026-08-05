import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useQueryAuthUser } from '../auth/hooks/useAuthUser'

import ChatBox from './components/ChatBox'
import NavChatAvatar from './components/NavChatAvatar'
import { useChatListStore } from './store/chatStore'
import Modal from '../../layout/Modal'
import VideoCallScreen from './components/VideoCallScreen'
import { type Conversation } from '../../shared/types/conversation.types'

interface ChatPreview{
  user: string,
  isOpen: boolean,
}


const ChatPage = () => {

  const authUser = useQueryAuthUser()
  const chatList = useChatListStore(state => state.chatList)

  const [callRoom, setCallRoom] = useState<Conversation | null>(null);
    
  return (
    <>
      <div className='flex flex-row-reverse gap-3 mr-2 fixed bottom-0 right-0 z-10'>
          <div className='flex flex-col-reverse gap-2 pb-3'>
            <div className='size-10 '>

            </div>
              {chatList.map(chat => 
                  (!chat.isOpen && <NavChatAvatar key={chat.conversationID ?? chat.userID} userID={chat.userID} conversationID={chat.conversationID || ""}/>))}
          </div>
          <div className='flex flex-row gap-10'>
              {
                chatList.map(chat => 
                  (chat.isOpen && 
                    <ChatBox 
                      key={chat.conversationID ?? chat.userID} 
                      userID={chat.userID} 
                      conversationID={chat.conversationID || ""} 
                      onOpenVideoCallRoom={setCallRoom}/>))
              }
          </div>
      </div>
      {callRoom && <Modal open={true}>
        <VideoCallScreen roomId={callRoom._id} conversation={callRoom} isMicrophoneOn={true} isCameraOn={true} onClose={() => {setCallRoom(null)}} />
      </Modal>}
    </>
  )
}

export default ChatPage