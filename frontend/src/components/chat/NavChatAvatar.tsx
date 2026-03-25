import React from 'react'
import type { UserInterface } from '../../typedef/user.type'
import { useChatListStore } from '../../hooks/store/chatFriendStore'
import type { Conversation } from '../../typedef/conversation.type'
import { useQuery } from '@tanstack/react-query'

const NavChatAvatar = ({userID, conversationID}: {userID?: string, conversationID: string}) => {
  const setChatState = useChatListStore(state => state.setChatState)
  const {
    data: conversationData,
    isError
  } = useQuery({
    queryKey: ["conversation", conversationID],
  })

  return (
    <div className='size-12 rounded-full border-2 border-white'>
        <button
            onClick={() => setChatState(userID, conversationID, true)}
            className='size-full'>
          <img
            alt=""
            className=''/>
        </button>
    </div>
  )
}

export default NavChatAvatar