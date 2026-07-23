import React from 'react'
import type { UserInterface } from '../../typedef/user.type'
import { useChatListStore } from '../../features/chat/chatFriendStore'
import type { Conversation } from '../../typedef/conversation.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryConversation } from '../../features/chat/handleConversation'
import AvatarImage from '../../assets/AvatarImage'
import { useQueryAuthUser } from '../../features/auth/handleUser'

const NavChatAvatar = ({userID, conversationID}: {userID?: string, conversationID: string}) => {
  const queryClient = useQueryClient()
  
  const setChatState = useChatListStore(state => state.setChatState)

  const { data: authUser } = useQueryAuthUser();

  const {
    data: conversation,
    isError
  } = useQueryConversation({
    conversationID,
    recipientID: userID,
  })
  

  const useGroupDisplayInfo: any = conversation && conversation.group
  let otherUser: UserInterface | undefined ;

  if(!useGroupDisplayInfo){
    if(conversationID)
      otherUser = conversation?.participants.find((p: any) => p.userID._id !== authUser?._id)?.userID
    else
      otherUser = queryClient.getQueryData(["userProfile", userID])
  }

  return (
    <button
      onClick={() => setChatState(userID, conversationID, true)}
      className=''
    >
      <AvatarImage 
        src={otherUser?.profileImg}
        className='size-12 rounded-full' />
    </button>
  )
}

export default NavChatAvatar