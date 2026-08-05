import React from 'react'
import LeftSideBar from '../layout/LeftSideBar'
import HomePageFeed from '../features/feed/components/HomePageFeed'
import RightSideBar from '../layout/RightSideBar'

const HomePage = () => {
  return (
    <>
      <div className='flex flex-row gap-10 relative top-[10vh]'>
        <div className='basis-1/4 bg-transparent relative top-0 min-h-[100vh] h-auto overflow-y-auto overflow-x-clip'>
          <LeftSideBar/>
        </div>
        <div className='basis-1/2 bg-transparent border-violet-400 border-x-2 relative'>
          <HomePageFeed/>
        </div>
        <div className='basis-1/4 bg-transparent'>
          <RightSideBar/>
        </div>
      </div>
    </>
  )
}

export default HomePage