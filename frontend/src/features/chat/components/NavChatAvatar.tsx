import React from 'react'
import type { UserInterface } from "../../../shared/types/user.types"
import { useChatListStore } from '../store/chatStore'
import type { Conversation } from '../../../shared/types/conversation.types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryConversation } from '../hooks/useConversationHooks'
import AvatarImage from '../../../assets/AvatarImage'
import { useQueryAuthUser } from '../../auth/hooks/useAuthUser'

const NavChatAvatar = ({userID, conversationID}: {userID?: string, conversationID: string}) => {
  const queryClient = useQueryClient()
  
  const setChatState = useChatListStore(state => state.setChatState)

  const { data: authUser } = useQueryAuthUser();

  const {
    data: conversation,
    isError
  } = useQueryConversation({
    conversationID,
    // recipientID: userID,
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