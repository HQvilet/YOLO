import React from 'react'
import { Link } from 'react-router-dom'
import api from '../../../lib/api.config'
import { useMutation } from '@tanstack/react-query'
import type { RequestInterface } from '../../../shared/types/request.types'

import { useAcceptFriendRequest, useDeclineFriendRequest } from '../hooks/useRequestHooks'
import AvatarImage from '../../../assets/AvatarImage'

const FriendRequestCard = ({request}: {request: RequestInterface}) => {

  const {
    mutate: accept
  } = useAcceptFriendRequest()

  const {
    mutate: decline
  } = useDeclineFriendRequest()

  return (
    <div className='flex flex-col bg-zinc-800 rounded-lg border-[1px] border-zinc-700 overflow-hidden h-full'>
      <div className='flex-none h-40'>
        <Link to={`/profile/${request.sender._id}`}>
          <AvatarImage/>
        </Link>
      </div>
      <div className='flex-1 flex flex-col gap-2 p-3 justify-between'>
        <div className='flex flex-col text-nowrap'>
        <Link to={`/profile/${request.sender._id}`}>
          <span>{request.sender.username}</span>
        </Link>
        <Link to={"/"}>
          <span>8 Ban Chung</span>
        </Link>
        </div>
        <div className='flex flex-col self-center gap-1 w-full'>
        <button className='bg-violet-400 p-2 rounded-lg overflow-hidden'
          onClick={() => {
            accept(request._id)
          }}
        >
          Accept
        </button>
        <button className='bg-zinc-700 p-2 rounded-lg'
          onClick={() => {
            decline(request._id)
          }}
        >
          Decline
        </button>
        </div>
      </div>
    </div>
  )
}

export default FriendRequestCard