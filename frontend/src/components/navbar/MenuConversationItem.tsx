import React from 'react'
import { useChatListStore } from '../../hooks/store/chatFriendStore'
import type { UserInterface } from '../../typedef/user.type'
import type { Conversation } from '../../typedef/conversation.type'
import { useQueryAuthUser } from '../../hooks/handleUser'

import { HiDotsHorizontal } from "react-icons/hi";

const MenuConversationItem = ({conversation}: {conversation: Conversation}) => {

  const addConversation = useChatListStore(state => state.addConversationToChatList)

  const {data: authUser} = useQueryAuthUser()
  const p_user: UserInterface = conversation.participants.find(p => p.userID._id !== authUser._id).userID
  
  return (
    <div 
      className='flex w-full justify-between p-2 bg-zinc-800 rounded-xl hover:bg-white/10'
      onClick={() => {
        addConversation(conversation._id)
      }}
      >
      <div className='relative flex-1 flex gap-2 items-center'>
        <div className='rounded-full size-14 bg-white overflow-hidden flex-none'>
          <img 
            src={conversation?.group ?? p_user.profileImg}
            alt="" />
        </div>
        <div className='flex-1 flex flex-col text-left'>
          <span className='text-lg font-semibold'>{`${conversation.group ?? p_user?.username ?? "UserName"}`}</span>
          <span className='text-sm text-gray-500'>Last Message</span>
        </div>
        <button className='absolute my-auto right-4 size-8 p-2 rounded-full hover:bg-violet-500/20'>
          <HiDotsHorizontal className='m-auto'/>
        </button>
      </div>
    </div>
  )
}

export default MenuConversationItem