import React from 'react'

import { IoMdSettings } from "react-icons/io";

import FriendRequestCard from '../components/FriendRequestCard';
import { useQueryAllRequests, useQueryAllSentRequests } from '../hooks/useRequestHooks';
import SentRequestCard from '../components/SentRequestCard';


const FriendRequestPage = () => {
  const {
    data: requests
  } = useQueryAllRequests();

  const {
    data: sentRequests
  } = useQueryAllSentRequests();

  
  return (
    <div className='flex flex-row gap-2 relative top-[10vh] text-white'>
      <div className='basis-96 stickey min-h-[100vh] h-auto overflow-y-auto overflow-x-clip hidden lg:block'>
          <div className='size-full bg-zinc-800 border-r-2 border-zinc-600'>

          </div>
      </div>
      <div className='flex-1 flex-col p-5'>
        <div className='flex flex-col gap-5'>
          <header className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>Friend Requests</h1>
          </header>
          {/*Frienrequest cards Container */}
          <div className='grid grid-cols-5 gap-5'>
            {requests?.map((request: any) => (<FriendRequestCard request={request}/>))}
          </div>
          <div>
            
          </div>
        </div>
        <div className='flex flex-col gap-5'>
          <header className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>Sent Requests</h1>
          </header>
          {/*Frienrequest cards Container */}
          <div className='flex flex-row gap-5 flex-wrap'>
            {sentRequests?.map((request: any) => (<SentRequestCard request={request}/>))}
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendRequestPage