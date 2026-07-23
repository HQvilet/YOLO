import React, { useState } from 'react'
import { useQueryAuthUser } from '../../features/auth/handleUser';

import { HiDotsHorizontal } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineMessage } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { LuExpand } from "react-icons/lu";
import { LuNotebookPen } from "react-icons/lu";

import MenuConversationItem from './MenuConversationItem'
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api.config';
import type { Conversation } from '../../typedef/conversation.type';
import { useQueryAllConversation } from '../../features/chat/handleConversation';

const NavChatFlyOutMenu = () => {
  const [feedType, setFeedType] = useState<"all" | "unseen" | "conversation">('conversation')

  const {
      data: authUser,
      isLoading
  } = useQueryAuthUser();

  const {
    data: conversations
  } = useQueryAllConversation()
  
  return (
    <div className='absolute top-[calc(100%+0.2rem)] right-0'>
      <div className='flex flex-col bg-zinc-800 text-white rounded-lg gap-1'>
        <header className='flex justify-between items-center gap-4 p-2 mx-4'>
          <h1 className='font-bold text-3xl'>
            Chat
          </h1>
          <div className='flex'>
            <div className={`flex gap-1 text-2xl }`}>
              <button className='size-full hover:bg-white/20 p-1 rounded-full'
                onClick={e => {setFeedType("conversation")}}
              >
                <HiDotsHorizontal className='mx-auto my-auto'/>
              </button>
              <button className='size-full hover:bg-white/20 p-1 rounded-full'
                onClick={e => {setFeedType("conversation")}}
              >
                <LuExpand className='mx-auto my-auto'/>
              </button>
              <button className='size-full hover:bg-white/20 p-1 rounded-full'
                onClick={e => {setFeedType("conversation")}}
              >
                <LuNotebookPen className='mx-auto my-auto'/>
              </button>
            </div>
          </div>
        </header>
        <div className='flex flex-col px-4 gap-2'>
          <div className='input_box pl-3 p-2 bg-zinc-700 rounded-full text-zinc-200'>
            <IoSearch />
            <form action=""
              className='input_box'>
              <input
                type="text"
                placeholder="Search here"
                className='bg-transparent' />
            </form>
          </div>
          <div className='flex gap-2'>
            <button className='p-2 px-3 hover:bg-white/20 rounded-full focus:bg-violet-500/20 focus:text-violet-500'>
              All
            </button>
            <button className='p-2 px-3 hover:bg-white/20 rounded-full focus:bg-violet-500/20 focus:text-violet-500'>
              Unseen
            </button>
            <button className='p-2 px-3 hover:bg-white/20 rounded-full focus:bg-violet-500/20 focus:text-violet-500'>
              Groups
            </button>
          </div>
        </div>
        {feedType === 'conversation' && 
        <div className='flex flex-col gap-3 w-[22rem] rounded-xl h-[60vh] overflow-auto mx-4'>
          {conversations?.map(conversation => {
            return <MenuConversationItem key={conversation._id} conversation={conversation}/>
          })}
        </div>}
      </div>
    </div>
  )
}

export default NavChatFlyOutMenu