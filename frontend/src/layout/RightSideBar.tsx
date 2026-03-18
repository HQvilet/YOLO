import React from 'react'
import SideBarButton from '../components/SideBarButton'

const RightSideBar = () => {
  return (
    <div className='flex flex-col gap-4 mt-3 text-white'>
        <div className='flex flex-col'>
            <div>
                Sponsor by
            </div>
        </div>
        <div className='flex flex-col border-t-2 border-zinc-500'>
            <div className='flex justify-between p-2 pl-0'>
                <div className='self-center'>
                    Contacts
                </div>
                <div className='flex gap-2'>
                    <button className='rounded-full size-10 hover:bg-zinc-700'>
                        X
                    </button>
                    <button className='rounded-full size-10 hover:bg-zinc-700'>
                        X
                    </button>
                </div>
            </div>
            <div className='flex flex-col mr-1'>
                <SideBarButton>
                    LOL
                </SideBarButton>
                <SideBarButton>
                    LOL
                </SideBarButton>
                <SideBarButton>
                    LOL
                </SideBarButton>
            </div>
        </div>
    </div>
  )
}

export default RightSideBar