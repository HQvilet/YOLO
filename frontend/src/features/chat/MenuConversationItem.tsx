import React from 'react'
import { useChatListStore } from './store/chatStore'
import type { UserInterface } from '../../shared/types/user.types'
import type { Conversation } from '../../shared/types/conversation.types'
import { useQueryAuthUser } from '../auth/hooks/useAuthUser'

import { HiDotsHorizontal } from "react-icons/hi";
import AvatarImage from '../../assets/AvatarImage'
const MenuConversationItem = ({conversation}: {conversation: Conversation}) => {

  const isSeen: boolean = false;
  const isOnline: boolean = true;

  const addConversation = useChatListStore(state => state.addChatByConversation)

  const {data: authUser} = useQueryAuthUser()
  const p_user: UserInterface | undefined = conversation.participants.find(p => p.userID._id !== authUser?._id)?.userID
  const lastMessageSender = conversation.lastMessage ? conversation.participants.find(p => p.userID._id === conversation.lastMessage.senderID)?.userID : undefined
  return (
    <div 
      className='flex w-full justify-between p-2 bg-zinc-800 rounded-xl hover:bg-white/10 pr-2 cursor-pointer'
      onClick={() => {
        addConversation(conversation._id)
      }}
      >
      <div className='relative flex gap-2 items-center w-full overflow-hidden'>
        <div className='relative size-fit flex-none '>
          <AvatarImage
            src={p_user?.profileImg}
            className='rounded-full size-14 bg-white'/>
          {isOnline && <div className='absolute size-3 bg-green-500 rounded-full bottom-0 right-0 border-2 border-zinc-800'></div>}
        </div>
        <div className='flex-1 text-left min-w-0'>
          <div className='flex flex-col overflow-hidden'>
            <span className='text-lg font-semibold'>{`${conversation.group?.name ?? p_user?.username ?? "UserName"}`}</span>
            <div className='overflow-hidden'>
              { conversation.lastMessage && (
                <span className={'text-sm text-gray-500 w-[85%] truncate block ' + (isSeen && "text-white")}>
                  {`${lastMessageSender?._id === authUser?._id ? "You" : lastMessageSender?.username}: ${conversation.lastMessage.content.text}`}
                </span>
              )}
            </div>
          </div>
        </div>
        <button className='absolute my-auto right-4 size-8 p-2 rounded-full hover:bg-violet-500/20 z-10'
          onClick={e => {
            e.stopPropagation();
          }}>
          <HiDotsHorizontal className='m-auto'/>
        </button>
      </div>
    </div>
  )
}

export default MenuConversationItem