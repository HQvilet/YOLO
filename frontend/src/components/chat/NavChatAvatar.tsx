import React from 'react'
import type { UserInterface } from '../../typedef/user.type'
import { useChatList } from '../../hooks/store/chatFriendStore'

const NavChatAvatar = ({user}: {user: UserInterface}) => {
  const setChatState = useChatList(state => state.setChatState)

  return (
    <div className='size-12 rounded-full border-2 border-white'>
        <button
            onClick={e => setChatState(user, true)}
            className='size-full'>
          <img 
            src={user.profileImg}
            alt=""
            className=''/>
        </button>
    </div>
  )
}

export default NavChatAvatar