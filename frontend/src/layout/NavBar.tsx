import React, { useState, type ReactNode } from 'react'
import { Route, Link } from 'react-router-dom'
import Logo from '../assets/Logo'
import AvatarImage from '../assets/AvatarImage'
import { useQueryAllUsers, useQueryAuthUser } from '../hooks/handleUser'

import { HiDotsHorizontal } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineMessage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { MdHistory } from "react-icons/md";


import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQueryAllFriends, useQueryAllRecommendedUser, useQueryAllRequests } from '../hooks/handleFriend'
import FriendRequest from '../components/navbar/FriendRequest'
import RecommendFriend from '../components/navbar/RecommendFriend'

import { type UserInterface } from '../typedef/user.type'
import api from '../services/api.config'
import FriendMessage from '../components/navbar/FriendMessage'
import Conversation from '../components/navbar/Conversation'

const NavBarNavigation = ({to, children}: {to: string, children: ReactNode}) => {
  return(
    <div className='flex flex-1 justify-center items-center align-middle hover:text-violet-400 hover:bg-zinc-700 h-full self-center'>
      {children}
    </div>
  )
}

const NavBar = () => {
  const queryClient = useQueryClient()

  const [isOpenDropDown, openDropDown] = useState<boolean>(false)
  const [feedType, setFeedType] = useState<"recommend" | "request" | "friend" | "conversation">('recommend')

  const {
    data: authUser,
    isLoading
  } = useQueryAuthUser();

  const {mutate: logOut} = useMutation({
    mutationFn: () => api.post("/api/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })

  const { data: recommends } = useQueryAllRecommendedUser(authUser._id)
  const { data: requests } = useQueryAllRequests(authUser._id)
  const { data: friends } = useQueryAllFriends(authUser._id)

  return (
    <nav className='flex justify-stretch gap-5 border-b-4 border-violet-500 bg-zinc-800 w-[100vw] fixed top-0 right-0 z-10'>
        <div className='flex basis-1/3 items-center'>
          <Link to={'/home'} className='flex ml-3'>
            <Logo />
          </Link>
          <div className='w-56 h-1/2 self-center bg-zinc-600 rounded-full border-2 border-zinc-500'>
            
          </div>
        </div>
        <div className='flex gap-2 basis-1/2'>
          <NavBarNavigation to={"/home"}>
            X
          </NavBarNavigation>
          <NavBarNavigation to={"/home"}>
            Y
          </NavBarNavigation>
          <NavBarNavigation to={"/home"}>
            Z
          </NavBarNavigation>
          <NavBarNavigation to={"/home"}>
            V
          </NavBarNavigation>
        </div>
        <div className='relative flex justify-end items-center basis-1/3 gap-4 mr-2'>
          <div className='size-11'>
            <button className='size-full bg-zinc-700 rounded-full overflow-hidden border-2 border-violet-500 hover:bg-zinc-500'
              onClick={e => openDropDown(prev => !prev)} 
            >
              <HiDotsHorizontal className='text-4xl mx-auto text-violet-400'/>
            </button>
            
          </div>
          <div className='size-11 bg-white rounded-full overflow-hidden' >
            <Link to={`/profile/${authUser._id}`}>
              <AvatarImage src={authUser.profileImg}/>
            </Link>
          </div>
          <div className='size-11'>
            <button className='size-full bg-zinc-700 rounded-full overflow-hidden border-2 border-red-500 hover:bg-zinc-500'
              onClick={() => logOut()}
            >
              <FiLogOut className='text-2xl mx-auto text-red-500'/>
            </button>
          </div>

          {isOpenDropDown && <div className='absolute top-[calc(100%+0.2rem)] right-0'>
              <div className='flex flex-col bg-zinc-700 text-white rounded-lg gap-2'>
                <div className='flex justify-between items-center gap-4 p-2 border-b-[1px] border-gray-50 m-2'>
                  <h1 className='font-bold text-2xl'>
                    Friend Requests
                  </h1>
                  <div className='flex gap-1'>
                    <div className={`rounded-full size-10 text-4xl hover:bg-white/20 ${feedType === "recommend" ? "text-violet-400": ""}`}>
                      <button className='size-full'
                        onClick={e => {setFeedType("recommend")}}
                      >
                        <RxAvatar className='mx-auto my-auto'/>
                      </button>
                    </div>
                    <div className={`rounded-full size-10 text-3xl hover:bg-white/20 ${feedType === "friend" ? "text-violet-400": ""}`}>
                      <button className='size-full'
                        onClick={e => {setFeedType("friend")}}
                      >
                        <FaUserFriends className='mx-auto my-auto'/>
                      </button>
                    </div>
                    <div className={`rounded-full size-10 text-3xl hover:bg-white/20 ${feedType === "request" ? "text-violet-400": ""}`}>
                      <button className='size-full'
                        onClick={e => {setFeedType("request")}}
                      >
                        <MdOutlineMessage className='mx-auto my-auto'/>
                      </button>
                    </div>
                    <div className={`rounded-full size-10 text-3xl hover:bg-white/20 ${feedType === "conversation" ? "text-violet-400": ""}`}>
                      <button className='size-full'
                        onClick={e => {setFeedType("conversation")}}
                      >
                        <MdHistory className='mx-auto my-auto'/>
                      </button>
                    </div>
                    {/* <div className='rounded-full bg-white size-10'></div>
                    <div className='rounded-full bg-white size-10'></div> */}
                  </div>
                </div>
                {feedType === 'request' && <div className='flex flex-col gap-3 w-[2rem] rounded-xl h-[60vh] overflow-auto m-2 mr-1'>
                  {requests?.map(req => 
                    <FriendRequest key={req._id} request={req} />
                  )}
                </div>}
                {feedType === 'friend' && <div className='flex flex-col gap-3 w-[24rem] rounded-xl h-[60vh] overflow-auto m-2 mr-1'>
                  {friends?.map(friend => {
                    return <FriendMessage key={friend._id} user={friend.friendDetail}/>
                  })}
                </div>}
                {feedType === 'recommend' && <div className='flex flex-col gap-3 w-[24rem] rounded-xl h-[60vh] overflow-auto m-2 mr-1'>
                  {recommends?.map(recommend => {
                    return <RecommendFriend key={recommend._id} user={recommend}/>
                  })}
                </div>}
                {feedType === 'conversation' && <div className='flex flex-col gap-3 w-[24rem] rounded-xl h-[60vh] overflow-auto m-2 mr-1'>
                  {recommends?.map(recommend => {
                    return <Conversation key={recommend._id} user={recommend} conversationID=''/>
                  })}
                </div>}
              </div>
          </div>}
        </div>
        
    </nav>
  )
}

export default NavBar