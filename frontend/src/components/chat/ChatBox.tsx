import React, { useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'

import { IoClose, IoCall } from "react-icons/io5";
import { FaVideo, FaMinus, FaPlusCircle } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { HiGif } from "react-icons/hi2";
import { RiEmojiStickerFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
import type { UserInterface } from '../../typedef/user.type';
import { useChatListStore } from '../../hooks/store/chatFriendStore';
import { useQueryAllMessage, useSendMessage } from '../../hooks/handleMessage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api.config';
import { useShallow } from 'zustand/shallow';
import { useQueryAuthUser } from '../../hooks/handleUser';
import { getTimeDifference } from '../../utils/time.utils';
import type { Message, MessageContent } from '../../typedef/message.type';
import defaultAvatar from "../../assets/default_avatar.png"
import { useSocketStore } from '../../hooks/store/socketStore';

export const MessageBox = () => {
  return (
    <>
      
    </>
  )
}

// group message or direct message
// conversation is created whenever user send direct message
// 
const ChatBox = ({userID, conversationID}: {userID?: string, conversationID: string}) => {
  const queryClient = useQueryClient()

  const {setChatState, updateConversationID} = useChatListStore()
  const { joinedConversation } = useSocketStore()

  const [messageContent, setMessageContent] = useState<MessageContent>({
    text: "",
  })

  const { data: authUser } = useQueryAuthUser();

  const {
    data: conversation,
    isError
  } = useQuery({
    queryKey: ["conversation", conversationID],
    queryFn: () => 
      api.get("/api/conversation/get",{
        params: {
          participantID: userID,
          conversationID,
        }
      })
      .then(res => {
        const data = res.data.data;
        if(!conversationID && userID){
          updateConversationID(userID, data._id)
        }
        return data
      }),
    staleTime: 1000*60
  })

  const useGroupDisplayInfo: boolean = conversation && conversation.group
  let otherUser: UserInterface | undefined ;

  
  if(!useGroupDisplayInfo){
    if(conversationID)
      otherUser = conversation?.participants.find((p: any) => p.userID._id !== authUser._id).userID
    else
      otherUser = queryClient.getQueryData(["userProfile", userID])
  }

  const {
    data: messages
  } = useQueryAllMessage(conversationID)

  const {
    mutate: sendMessage,
  } = useMutation({
    mutationFn: (message: any) =>
      api.post("/api/message/direct", {
        recipientID: userID,
        conversationID,
        content: message
      }),
    onSuccess: (res) => {
      const data = res.data.data
      if(!conversationID && userID){
        joinedConversation(data.conversationID)
        updateConversationID(userID, data.conversationID)
      }
    }
  })

  const n_messages = messages?.map<Message>((msg, i, arr) => {
    msg.createdAt = new Date(msg.createdAt);
    msg.isNewTimeStampBlock = false;
    msg.isNewUserBlock = false;
    if(i === 0){
      msg.isNewUserBlock = true
      return msg;
    }
    if(msg.senderID !== arr[i-1].senderID){
      msg.isNewUserBlock = true;
    }
    const {minutes} = getTimeDifference(msg.createdAt, arr[i-1].createdAt)
    if(minutes > 5){
      msg.isNewTimeStampBlock = true;
    }
    return msg;
  })


  const handleSendMessage = () => {
    console.log({
        recipientID: userID,
        conversationID,
        content: messageContent
      })
    sendMessage(messageContent)
    setMessageContent({
      text: ""
    })
  }

  return (
    <div className='flex flex-col w-[21rem] h-[28rem] bg-zinc-800 text-white rounded-t-xl border-2 border-b-0 border-zinc-500'>
        {/* chat box header */}
        <header className='flex justify-between bg-violet-500 rounded-t-xl'>
          <div className='flex p-1 gap-2 items-center'>
            <div className='size-8 rounded-full overflow-hidden'>
              <img 
                src={otherUser?.profileImg || defaultAvatar}
                alt=""
                className='self-center object-cover'/>
            </div>
            <span >{useGroupDisplayInfo ? conversation.group.name : otherUser?.username}</span>
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
              onClick={() => setChatState(userID, conversationID, false)}
            >
              <IoClose className='mx-auto text-3xl'/>
            </button>
          </div>
        </header>
        {/* chat box content */}
        <div className='overflow-y-hidden flex-1'>
          <div className='flex flex-col-reverse justify-start w-full h-full overflow-x-auto p-1 gap-[0.2rem]'>
            {!isError && n_messages?.map((message, i, arr) => {
              const isMe = message.senderID === authUser._id;
              const prevMsg = arr[i+1];
              const isInFirstBlock = message.isNewUserBlock || message.isNewTimeStampBlock;
              const isInLastBlock = prevMsg?.isNewUserBlock || prevMsg?.isNewTimeStampBlock;
              
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
                      <div className={`bg-violet-300 rounded-sm rounded-r-xl p-2 max-w-[70%] overflow-clip ${!isInFirstBlock || "rounded-bl-xl"} ${!isInLastBlock || "rounded-tl-xl"}`}>
                        <span>
                          {message.content?.text}
                        </span>
                      </div>
                    </div>)
                    :
                    (<div className='flex w-full justify-end'>
                      <div className={`bg-zinc-500 rounded-sm rounded-l-xl p-2 max-w-[70%] overflow-clip ${!isInFirstBlock || "rounded-br-xl"} ${!isInLastBlock || "rounded-tr-xl"}`}>
                        <span>{message.content?.text}</span>
                      </div>
                    </div>)
                  }
                  </div>
                  {prevMsg?.isNewTimeStampBlock &&
                    (<div className='w-full h-12 flex-none flex'>
                      <span className='mx-auto my-auto text-gray-400'>{message.createdAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</span>
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
                <form action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage()
                  }}>
                  <input 
                    type="text"
                    placeholder='DM Here'
                    name="textContent"
                    className='bg-zinc-700 rounded-full w-full p-1 pl-2'
                    value={messageContent.text}
                    onChange={(e) => {
                      setMessageContent(prev => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }} />
                </form>
              </div>
              <div className='flex-none'>
                <button 
                  className='size-8 p-1 hover:bg-white/20 rounded-full'
                  onClick={() => {handleSendMessage()}}  
                >
                  <FaPen className='mx-auto'/>
                </button>
              </div>
          </div>
        </div>
    </div>
  )
}

export default ChatBox