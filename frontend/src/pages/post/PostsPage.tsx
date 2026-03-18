import React from 'react'
import Post from '../../components/post/Post'
import Modal from '../../components/modal/Modal'
import CreatePost from '../../components/post/CreatePost'

const CreatePostHeader = () => {
  return (
    <div className='bg-zinc-800 rounded-lg'>
        <div className='flex gap-4 p-3'>
            <img 
                src="a" 
                alt=""
                className='rounded-full size-10'/>
            <button 
                className='bg-zinc-700 flex-grow rounded-full text-left p-2 hover:bg-zinc-600 overflow-hidden whitespace-nowrap'
                onClick={(e) => {
                    e.preventDefault();

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
        <Modal open={false} >
            <CreatePost/>
        </Modal>
    </div>
  )
}

const PostsPage = () => {
  return (
    <div className='flex justify-center'>
        <div className='flex flex-col mt-4 w-[80%] gap-5 justify-center'>
            <CreatePostHeader/>
            <div className='flex flex-col gap-4'>
                <Post/>
                <Post/>
                <Post/>
            </div>
        </div>        
    </div>

  )
}

export default PostsPage