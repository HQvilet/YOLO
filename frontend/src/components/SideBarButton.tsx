import React, { type ReactNode } from 'react'

const SideBarButton = ({children} : {children: ReactNode}) => {
  return (
    <button className='flex text-white gap-3 p-2 hover:bg-zinc-700 rounded-md'>
      <div className=' pl-2 icon'>
        🗣️
      </div>
      <div className='text-white'>
        {children}
      </div>    
    </button>
  )
}
export default SideBarButton