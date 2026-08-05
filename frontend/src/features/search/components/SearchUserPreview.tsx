import React from 'react'
import { Link } from 'react-router-dom'
import type { UserInterface, UserWithStatus } from '../../../shared/types/user.types'

import { useQueryAuthUser } from '../../auth/hooks/useAuthUser'
import { useSendFriendRequest } from '../../friends/hooks/useRequestHooks'

const SearchUserPreview = ({user} : {user: UserWithStatus}) => {
    
    const {
        mutate: sendRequest
    } = useSendFriendRequest({
        onSuccess: () => {
            
        }
    });

    const {data: authUser} = useQueryAuthUser()

    let userStatus : "none" | "waitResponse" | "respond" | "friend" = "none"
    if(!user.requestStatus){
        userStatus = "none"
    }else if(user.requestStatus.status === "accepted"){
        userStatus = "friend"
    }else if(user.requestStatus.sender === authUser?._id){
        userStatus = "waitResponse"
    }else {
        userStatus = "respond"
    }

    return (
    <div className='flex gap-2 border-b-[0.1rem] border-zinc-700 '>
        <Link to={`/profile/${user._id}`}>
            <div className='size-14 rounded-full overflow-hidden'>
                <img 
                    src={user.profileImg || ""}
                    alt=""
                    className=''/>
            </div>
        </Link>
        <div className='flex-1 flex flex-col'>
            <span>
                <Link to={`/profile/${user._id}`} className='font-semibold hover:underline inline-block'>
                    {user.username}
                </Link>
            </span>
            <span className='text-gray-400 text-sm max-w-[95%]'>
                {/* Short description */}
                {userStatus}
            </span>
            <div className='p-1 pl-4'>
                8 Mutual Friends
            </div>
        </div>
        <div className='flex gap-2 self-center'>
            {userStatus === "none" && <button className='px-2 py-1 bg-violet-500/50 rounded-lg text-violet-300 hover:bg-violet-600'
                onClick={() => {
                    sendRequest(user._id)
                }}
            >
                Add Friend
            </button>}
            {(userStatus == "friend" || userStatus === "waitResponse") && <button className='px-2 py-1 bg-violet-500/50 rounded-lg text-violet-300 hover:bg-violet-600'
                onClick={() => {
                    sendRequest(user._id)
                }}
            >
                Message
            </button>}
            {userStatus === "respond" && 
            <>
                <button className='px-2 py-1 bg-violet-500/50 rounded-lg text-violet-300 hover:bg-violet-600'
                    onClick={() => {
                        sendRequest(user._id)
                    }}
                >
                    Accept
                </button>
                <button className='px-2 py-1 bg-red-500/50 rounded-lg text-red-300 hover:bg-red-500/70'
                    onClick={() => {
                        sendRequest(user._id)
                    }}
                >
                    Decline
                </button>
            </>}
        </div>
    </div>
  )
}

export default SearchUserPreview