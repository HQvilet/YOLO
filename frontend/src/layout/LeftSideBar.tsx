import React, { type ReactNode } from 'react'
import SideBarButton from '../components/SideBarButton'

const LeftSideBar = () => {
  return (
    <div className='flex flex-col gap-1 h-[calc(100vh-10vh)] pt-2 px-2'>
        <SideBarButton>
          asd
        </SideBarButton>
        <SideBarButton>
          asd
        </SideBarButton>
        <SideBarButton>
          asd
        </SideBarButton>
        <SideBarButton>
          asd
        </SideBarButton>
    </div>
  )
}

export default LeftSideBar