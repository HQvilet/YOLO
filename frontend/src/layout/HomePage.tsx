import React from 'react'
import LeftSideBar from '../layout/LeftSideBar'
import HomePageFeed from '../features/feed/components/HomePageFeed'
import RightSideBar from '../layout/RightSideBar'

const HomePage = () => {
  

  return (
    <>
      <div className='flex justify-between gap-10 relative top-[10vh]'>
        <div className='basis-1/5 bg-transparent relative top-0 min-h-[100vh] h-auto overflow-y-auto overflow-x-clip'>
          {/* <LeftSideBar/> */}
        </div>
        {/* <HomePageFeed/> */}
        <div className=' basis-4/5 max-w-3xl self-center bg-transparent border-violet-400 relative'>
          <HomePageFeed/>
        </div>
        <div className='basis-1/5 bg-transparent'>
          <RightSideBar/>
        </div>
      </div>
    </>
  )
}

export default HomePage