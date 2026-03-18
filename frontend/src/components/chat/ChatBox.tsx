import React, { type ReactNode } from 'react'

import { IoClose, IoCall } from "react-icons/io5";
import { FaVideo, FaMinus, FaPlusCircle } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { HiGif } from "react-icons/hi2";
import { RiEmojiStickerFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
import type { UserInterface } from '../../typedef/user.type';
import { useChatList } from '../../hooks/store/chatFriendStore';


type Message = 
{
  user: string,
  content: string,
  isNewUserBlock?: boolean,
  isNewTimeStampBlock?: boolean,
}

export const MessageBox = () => {
  return (
    <div>

    </div>
  )
}


const ChatBox = ({user}: {user: UserInterface}) => {

  const setChatState = useChatList(state => state.setChatState)

  const me = "Viet";
  let messages: Message[] = [
    {user:"Viet", content:"Hello"},
    {user:"Teo", content:"couple monddddddddddddddddddddddddddddk"},
    {user:"Viet", content:"Myas asdih asi dasidh Ngu"},
    {user:"Nhan", content:"askdasdasdas da sd as da sd  adasda asd nasd???"},
    {user:"Khang", content:"lol aram"},
    {user:"Khang", content:"lol aram"},
    {user:"Khang", content:"lol aram"},
    {user:"Viet", content:"Hello"},
  ]

  messages = messages.map((msg, i, arr) => {
    
    if(i === 0){
      msg.isNewUserBlock = true;
      return msg;
    }

    if(msg.user !== arr[i-1].user){
      msg.isNewUserBlock = true;
      return msg;
    }

    return msg;
  })

  console.log(messages)

  const handleSendMessage = () => {

  }

  return (
    <div className='flex flex-col w-[21rem] h-[28rem] bg-zinc-800 text-white rounded-t-xl'>
        {/* chat box header */}
        <div className='flex justify-between bg-violet-500 rounded-t-xl'>
          <div className='flex p-1 gap-2 items-center'>
            <div className='size-8 rounded-full'>
              <img 
                src={user.coverImg}
                alt=""
                className='self-center object-cover'/>
            </div>
            <span >{user.username}</span>
          </div>
          <div className='flex p-2 text-xl'>
            <button className='size-8 rounded-full hover:bg-white/20'
              
            >
              <IoCall className='mx-auto'/>
            </button>
            <button className='size-8 rounded-full hover:bg-white/20'
              
            >
              <FaVideo className='mx-auto'/>
            </button>
            <button className='size-8 rounded-full hover:bg-white/20'
              
            >
              <FaMinus className='mx-auto'/>
            </button>
            <button className='size-8 rounded-full hover:bg-white/20'
              onClick={() => setChatState(user, false)}
            >
              <IoClose className='mx-auto text-3xl'/>
            </button>
          </div>
        </div>
        {/* chat box content */}
        <div className='overflow-y-hidden flex-1'>
          <div className='flex flex-col-reverse justify-start w-full h-full overflow-x-auto p-1 gap-[2px]'>
            {messages.map((message, i, arr) => {
              const isMe = message.user === me;
              const prevMsg = arr[i+1];
              const isInFirstBlock = false;
              const isInLastBlock = false;

              const boxRounded = "rounded-xl"
              
              return(
              <>
                
                <div className={`flex text-sm ${message.isNewUserBlock || message.isNewTimeStampBlock ? "pb-2" : ""}`}>
                  {!isMe ?
                    (<div className='flex gap-1 items-end w-full'>
                      <div className='flex size-8'>
                        {message.isNewUserBlock && <img 
                          src="a"
                          alt="" 
                          className='rounded-full size-full'/>}
                      </div>
                      <div className='bg-violet-300 rounded-xl p-2 max-w-[70%] overflow-clip'>
                        <span >
                          {message.content}
                        </span>
                      </div>
                    </div>)
                    :
                    (<div className='flex w-full justify-end'>
                      <div className='flex'>
                        <div className='basis-12'></div>
                        <span className='bg-zinc-500 rounded-xl p-2'>{message.content}</span>
                      </div>
                    </div>)
                  }
                  </div>
                  {prevMsg?.isNewUserBlock &&
                  (<div className='w-full h-12 flex-none flex'>
                    <span className='mx-auto my-auto'>12h:30</span>
                  </div>)
                }
              </>
            )})}
          </div>
        </div>
        {/* chat type writter */}
        <div className='flex p-1 py-2'>
          <div className='flex items-center gap-2'>
              <div className='flex flex-initial items-center'>
                <button className='size-8 hover:bg-white/20 rounded-full'>
                  <FaPlusCircle className='mx-auto text-lg'/>
                </button>
                <button className='size-8 hover:bg-white/20 rounded-full'>
                  <FaPlusCircle className='mx-auto text-lg'/>
                </button>
                <button className='size-8 hover:bg-white/20 rounded-full'>
                  <FaPlusCircle className='mx-auto text-lg'/>
                </button>
                <button className='size-8 hover:bg-white/20 rounded-full'>
                  <FaPlusCircle className='mx-auto text-lg'/>
                </button>
              </div>
              <div className='flex-grow'>
                <input 
                  type="text"
                  placeholder='DM Here'
                  name="textContent"
                  className='bg-zinc-700 rounded-full w-full p-1 pl-2' />
              </div>
              <div className='flex-none'>
                <button className='size-8 p-1 hover:bg-white/20 rounded-full'>
                  <FaPen className='mx-auto'/>
                </button>
              </div>
          </div>
        </div>
    </div>
  )
}

export default ChatBox