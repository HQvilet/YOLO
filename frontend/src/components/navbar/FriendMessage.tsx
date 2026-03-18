import React from 'react'
import type { UserInterface } from '../../typedef/user.type'
import { useChatList } from '../../hooks/store/chatFriendStore'

const FriendMessage = ({user}: {user: UserInterface}) => {

  const addToChatList = useChatList(state => state.addToChatList)
    
  return (
    <div className='flex justify-between p-2 bg-zinc-800 rounded-xl'>
      <div className='flex gap-2 items-center'>
        <div className='rounded-full size-10 bg-white overflow-hidden flex-none'>
          <img 
            src={user.profileImg}
            alt="" />
        </div>
        <span className='text-lg font-bold max-w-24'>{`${user.username}`}</span>
      </div>
      <div className='flex items-center gap-3 mr-2'>
        <button className='bg-violet-400 rounded-lg p-2'
          onClick={() => {
            addToChatList(user)
          }}
        >
          Text
        </button>
      </div>
    </div>
  )
}

export default FriendMessage