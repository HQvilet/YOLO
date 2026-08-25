import React from 'react'
import { Link } from 'react-router-dom'
import api from '../../../lib/api.config'
import { useMutation } from '@tanstack/react-query'
import type { RequestInterface } from '../../../shared/types/request.types'

import { useAcceptFriendRequest, useDeclineFriendRequest } from '../hooks/useRequestHooks'
import AvatarImage from '../../../assets/AvatarImage'

const SentRequestCard = ({request}: {request: RequestInterface}) => {

  const {
    mutate: accept
  } = useAcceptFriendRequest()

  const {
    mutate: decline
  } = useDeclineFriendRequest()

  if(!request.recipient) {
    return null;
  }

  return (
    <div className='flex flex-col bg-zinc-800 rounded-lg border-[1px] border-zinc-700 overflow-hidden h-full'>
      <div className='flex-none'>
        <Link to={`/profile/${request.recipient._id}`}>
          <AvatarImage src={request.recipient.profileImg} className='size-36 md:size-48' />
        </Link>
      </div>
      <div className='flex-1 flex flex-col gap-2 p-3 justify-between'>
        <div className='flex flex-col text-nowrap'>
        <Link to={`/profile/${request.recipient._id}`} className='font-semibold hover:underline decoration-1 inline-block'>
          <span>{request.recipient.username}</span>
        </Link>
        <span className='text-gray-400 text-sm max-w-[95%] line-clamp-1'>Sent at {request.createdAt.toLocaleDateString()}</span>
        </div>
        <div className='flex flex-col self-center gap-1 w-full'>
        </div>
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
  )
}

export default SentRequestCard