import React, { type ReactNode } from 'react'
import { Route, Link } from 'react-router-dom'
import Logo from '../../assets/Logo'
import AvatarImage from '../../assets/AvatarImage'
import { useQueryAllUsers, useQueryAuthUser } from '../../hooks/handleUser'

import { HiDotsHorizontal } from "react-icons/hi";
import { useMutation } from '@tanstack/react-query'
import { useAcceptFriendRequest, useQueryAllFriends } from '../../hooks/handleFriend'
import type { UserInterface } from '../../typedef/user.type'
import type { RequestInterface } from '../../typedef/request.type'
import api from '../../services/api.config'


const FriendRequest = ({request}: {request: RequestInterface}) => {

  const {mutate: accept} = useMutation({
    mutationFn: (requestID: string) => 
        api.put(`/api/user/friend/request/${requestID}/accept`),
    onSuccess: (data) => {
      console.log("Accepted: ",data.data)
      
    }
})
  const handleAcceptRequest = () => {
    accept(request._id)
  }

  const handleDeclineRequest = () => {

  }

  return(
    <div className='flex justify-between p-2 bg-zinc-800 rounded-xl'>
      <div className='flex gap-2 items-center'>
        <div className='rounded-full size-10 bg-white overflow-hidden flex-none'>
          <img 
            src={request.sender.profileImg}
            alt="" />
        </div>
        <span className='text-sm font-bold max-w-24'>{`${request.sender.username}`}</span>
      </div>
      <div className='flex items-center gap-3 mr-2'>
        <button className='bg-violet-400 rounded-lg p-2'
          onClick={handleAcceptRequest}      
        >
          Accept
        </button>
        <button className='bg-zinc-600 rounded-lg p-2'
          onClick={handleDeclineRequest}
        >
          Decline
        </button>
      </div>
    </div>
  )
}

export default FriendRequest