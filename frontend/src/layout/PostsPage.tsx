import React, { useState } from 'react'
import Post from '../components/post/Post'
import Modal from '../components/modal/Modal'
import CreatePost from '../components/post/CreatePostModal'
import CreatePostModal from '../components/post/CreatePostModal'
import { useQuery } from '@tanstack/react-query'
import { useQueryAuthUser } from '../features/auth/handleUser'
import AvatarImage from '../assets/AvatarImage'
import { useGetPosts } from '../features/post/handlePost'
const CreatePostHeader = () => {
    const [open, setOpen] = useState<boolean>(false);
    const {data: authUser} = useQueryAuthUser()
    return (
    <div className='bg-zinc-800 rounded-lg'>
        <div className='flex gap-4 p-3 items-center'>
            <AvatarImage 
                src={authUser?.profileImg}
                className='size-10 rounded-full'/>
            <button 
                className='bg-zinc-700 flex-grow rounded-full text-left p-2 hover:bg-zinc-600 overflow-hidden whitespace-nowrap'
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(true)
                }}>
                Hallo, what yall doing?
            </button>
            <div className='flex'>
                <button className='rounded-xl size-10 text-white hover:bg-zinc-700'>
                    X
                </button>
                <button className='rounded-xl size-10 text-white hover:bg-zinc-700'>
                    X
                </button>
                <button className='rounded-xl size-10 text-white hover:bg-zinc-700'>
                    X
                </button>
            </div>
        </div>
        <CreatePostModal open={open} onClose={() => setOpen(false)}/>
    </div>
  )
}

const PostsPage = () => {

    const {
        data: posts
    } = useGetPosts()
  return (
    <div className='flex justify-center'>
        <div className='flex flex-col mt-4 w-[80%] gap-5 justify-center'>
            <CreatePostHeader/>
            <div className='flex flex-col gap-4'>
                {posts?.map(post => (<Post key={post._id} post={post}/>))}
                {/* <Post/>
                <Post/>
                <Post/> */}
            </div>
        </div>        
    </div>

  )
}

export default PostsPage