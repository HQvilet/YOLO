import React from 'react'
import { Link } from 'react-router-dom'

const Post = () => {
  return (
    <div className='flex flex-col bg-zinc-800 rounded-2xl gap-1'>
        {/* post owner info */}
        <div className='flex gap-3 align-middle p-2'>
            <Link to={"/"} className='self-center'>
                <img 
                    src="a" 
                    alt="" 
                    className="rounded-full size-10"/>
            </Link>
            <div className='flex flex-col flex-grow self-center'>
                <div>
                    <Link to={"/"}>Name</Link>
                </div>
                <div>
                    <Link to={"/"} className='text-sm'>20/12/2025</Link>
                </div>
            </div>
            <div className='flex gap-2 mr-2 self-center'>
                <button className='size-10 bg-zinc-500 rounded-lg'>
                    X
                </button>
                <button className='size-10 bg-zinc-500 rounded-lg'>
                    X
                </button>
            </div>
        </div>
        {/* post content */}
        <div className='flex flex-col'>
            <p className='p-2 text-sm'>
                Lorem ipsum dolor sit amet asidicon sectetur adipisicing elit. Dicta minima assumenda eveniet molestiae incidunt praesentium sit, optio nemo voluptatem sapiente corporis et explicabo, quo quisquam rem amet beatae nihil tempora!
            </p>
            <div className='flex'>
                <img 
                    src="data:image/jpeg;base64,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" 
                    alt="" 
                    className='object-cover w-full'/>
            </div>
        </div>
        {/* post utilities */}
        <div className='flex flex-col gap-1'>
            <div className='flex justify-between mx-1'>
                <a href="" className=''>
                    <span>👍🩷</span>
                    <span>15k</span>
                </a>
                <div className='flex gap-2'>
                    <a href="" className=''>Comment</a>
                    <a href="" className=''>Share</a>
                </div>
                
            </div>
            <div className='flex gap-2'>
                <button className='flex-1 p-2 rounded-sm rounded-bl-2xl hover:bg-zinc-700'>
                    Like
                </button>
                <button className='flex-1 p-2 rounded-sm  hover:bg-zinc-700'>
                    Comment
                </button>
                <button className='flex-1 p-2 rounded-sm rounded-br-2xl hover:bg-zinc-700'>
                    Share
                </button>
            </div>
        </div>
    </div>
  )
}

export default Post