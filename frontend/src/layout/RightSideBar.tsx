import React from 'react'
import { useQueryAllFriends } from '../features/friends/hooks/useFriendHooks'
import { useQueryAuthUser } from '../features/auth/hooks/useAuthUser'
import type { UserInterface } from '../shared/types/user.types'
import AvatarImage from '../assets/AvatarImage'

const SideBarFriendItem = ({user}: {user: UserInterface}) => {

    return (<div>
        <div className='flex gap-2 p-2 hover:bg-zinc-700 rounded-lg'>
            <AvatarImage src={user.profileImg} className='size-10 rounded-full'/>
            <div className='flex flex-col'>
                <span className='font-semibold'>{user.username}</span>
                <span className='text-gray-400 text-sm'>Online</span>
            </div>
        </div>
    </div>)
}

const RightSideBar = () => {

    const {data: authUser} = useQueryAuthUser()

    const {
        data: friends
    } = useQueryAllFriends(authUser?._id ?? "")

    
  return (
    <div className='flex flex-col gap-4 mt-3 text-white'>
        <div className='flex flex-col'>
            <div className='flex justify-between p-2 pl-0'>
                <div className='self-center'>
                    Contacts
                </div>
                <div className='flex gap-2'>
                    <button className='rounded-full size-10 hover:bg-zinc-700'>
                        X
                    </button>
                    <button className='rounded-full size-10 hover:bg-zinc-700'>
                        X
                    </button>
                </div>
            </div>
            <div className='flex flex-col mr-1 gap-1'>
                {friends?.map((friend) => <>
                    <SideBarFriendItem key={friend._id} user={friend}/>
                </>)}
            </div>
        </div>
    </div>
  )
}

export default RightSideBar