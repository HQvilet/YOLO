import React, { useState } from 'react'
import { useQueryAuthUser } from '../../auth/hooks/useAuthUser';
import AvatarImage from '../../../assets/AvatarImage';
import CreatePostModal from './CreatePostModal';

const CreatePostHomePage = () => {
    const [open, setOpen] = useState<boolean>(false);
    const {data: authUser} = useQueryAuthUser()
    return (
    <div className='bg-zinc-800 rounded-lg'>
        <div className='flex gap-4 p-3 items-center'>
            <AvatarImage 
                src={authUser?.profileImg}
                className='size-10 rounded-full flex-shrink-0'/>
            <button 
                className='bg-zinc-700 flex-grow rounded-full text-left p-2 hover:bg-zinc-600 overflow-hidden whitespace-nowrap'
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(true)
                }}>
                Hallo, what y'all doing?
            </button>
            <div className='flex'>
                {/* <button className='rounded-xl size-10 text-white hover:bg-zinc-700'>
                    X
                </button>
                <button className='rounded-xl size-10 text-white hover:bg-zinc-700'>
                    X
                </button>
                <button className='rounded-xl size-10 text-white hover:bg-zinc-700'>
                    X
                </button> */}
            </div>
        </div>
        <CreatePostModal open={open} onClose={() => setOpen(false)}/>
    </div>
  )
}

export default CreatePostHomePage