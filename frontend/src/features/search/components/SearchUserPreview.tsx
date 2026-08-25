import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserInterface, UserProfileWithDetail, UserWithStatus } from '../../../shared/types/user.types'

import { useQueryAuthUser } from '../../auth/hooks/useAuthUser'
import { useAcceptRequestFromUser, useDeclinetRequestFromUser, useSendFriendRequest } from '../../friends/hooks/useRequestHooks'
import AvatarImage from '../../../assets/AvatarImage'
import { IoMdPersonAdd } from 'react-icons/io'
import { AiFillMessage } from 'react-icons/ai'
import { FaDotCircle, FaUserCheck, FaUserTimes } from 'react-icons/fa'

const SearchUserPreview = ({user} : {user: UserProfileWithDetail}) => {
    
    const [requestStatus, setRequestStatus] = useState<"none"|"waiting"|"pending"|"accepted">(user.requestStatus)

    const {
        mutate: sendRequest
    } = useSendFriendRequest({
        onSuccess: () => {
            setRequestStatus("waiting")
        }
    });

    const {
        mutate: declineRequest
    } = useDeclinetRequestFromUser({
        onSuccess: () => {
            setRequestStatus("none")
        }
    })

    const {
        mutate: acceptRequest
    } = useAcceptRequestFromUser({
        onSuccess: () => {
            setRequestStatus("accepted")
        }
    })

    const {data: authUser} = useQueryAuthUser()

    return (
    <div className='flex gap-2 border-zinc-700 bg-zinc-800 p-3 rounded-xl w-full max-w-lg'>
        <Link to={`/profile/${user._id}`}>
            <AvatarImage src={user.profileImg} className='size-14 rounded-full'/>
        </Link>
        <div className='flex-1 flex flex-col'>
            <div>
                
            </div>
            <span>
                <Link to={`/profile/${user._id}`} className='font-semibold hover:underline decoration-1 inline-block'>
                    {user.fullname}
                </Link>
            </span>
            <span className='flex text-gray-400 text-sm max-w-[95%] pb-1 items-center pl-1'>
                <FaDotCircle size={5}/> 
                <span className='line-clamp-1 pl-1'>
                    {requestStatus === "accepted" ? "Friend" : `@${user.username}`} 
                </span>
            </span>
            <div className='flex gap-2 p-1 pl-2'>
                <div className='flex'>
                    {user.mutualFriends.slice(0, 3).map((user, index) => <>
                        <AvatarImage src={user.profileImg} className={`size-6 rounded-full -translate-x-${index}`}/>
                    </>)}
                </div>
                {user.mutualFriends.length > 0 && <span className='text-gray-400 text-sm'>
                    {user.mutualFriends.length} mutual friends
                </span>}
            </div>
        </div>
        <div className='flex gap-2 self-center'>
            {requestStatus === "none" && 
                <button className='flex items-center gap-2 justif px-2 py-1 bg-violet-500/50 rounded-lg text-violet-300 hover:bg-violet-600'
                    onClick={() => {
                        sendRequest(user._id)
                    }}
                >
                    <IoMdPersonAdd />Add Friend
                </button>}
            {(requestStatus === "accepted" || requestStatus === "waiting") && <button className='flex items-center gap-2 px-2 py-1  border-violet-500 border-2 rounded-lg text-violet-300 hover:bg-violet-600'
                onClick={() => {
                    
                }}
            >
                <AiFillMessage />Message
            </button>}
            {requestStatus === "pending" && 
            <>
                <button className='flex items-center gap-2 px-2 py-1 bg-violet-500/50 rounded-lg text-violet-300 hover:bg-violet-600'
                    onClick={() => {
                        acceptRequest(user._id)
                    }}
                >
                    <FaUserCheck /> Accept
                </button>
                <button className='flex items-center gap-2 px-2 py-1 bg-red-500/50 rounded-lg text-red-300 hover:bg-red-500/70'
                    onClick={() => {
                        declineRequest(user._id)
                    }}
                >
                    <FaUserTimes /> Decline
                </button>
            </>}
        </div>
    </div>
  )
}

export default SearchUserPreview