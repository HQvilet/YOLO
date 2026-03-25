import React from 'react'

import { IoMdSettings } from "react-icons/io";

import FriendRequestCard from '../components/FriendRequestCard';

import { useQueryAllRequests } from '../hooks/handleFriendRequest';

const FriendRequestPage = () => {
  const {
    data: requests
  } = useQueryAllRequests();
  console.log(requests)
  
  return (
    <div className='flex flex-row gap-2 relative top-[10vh] text-white'>
      <div className='basis-96 stickey min-h-[100vh] h-auto overflow-y-auto overflow-x-clip hidden lg:block'>
          <div className='size-full bg-zinc-800 border-r-2 border-zinc-600'>

          </div>
      </div>
      <div className='flex-1 p-5'>
        <div className='flex flex-col gap-5'>
          <header className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>Friend Requests</h1>
            <button className='rounded-full hover:bg-white/20 p-1'>
              <IoMdSettings className='text-3xl'/>
            </button>
          </header>
          {/*Frienrequest cards Container */}
          <div className='grid grid-cols-5 gap-5'>
            {requests?.map(request => (<FriendRequestCard request={request}/>))}
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendRequestPage