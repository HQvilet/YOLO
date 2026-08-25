import React, { type ReactNode } from 'react'

const LeftSideBar = () => {
  console.log("Left side bar")
  return (
    <div className='flex flex-col gap-1 h-[calc(100vh-10vh)] pt-2 px-2'>
        <button className='flex text-white gap-3 p-2 hover:bg-zinc-700 rounded-md'>
          <div className=' pl-2 icon'>
            🗣️
          </div>
          <div className='text-white'>
            asd
          </div>
        </button>
        <button className='flex text-white gap-3 p-2 hover:bg-zinc-700 rounded-md'>
          <div className=' pl-2 icon'>
            🗣️
          </div>
          <div className='text-white'>
            asd
          </div>
        </button>
        <button className='flex text-white gap-3 p-2 hover:bg-zinc-700 rounded-md'>
          <div className=' pl-2 icon'>
            🗣️
          </div>
          <div className='text-white'>
            asd
          </div>
        </button>
    </div>
  )
}

export default LeftSideBar