import React from 'react'
import { Link } from 'react-router-dom'
import type { PostInterface } from '../../../shared/types/post.types'
import AvatarImage from '../../../assets/AvatarImage'

const Post = ({post} : {post: PostInterface}) => {
  return (
    <div className='flex flex-col bg-zinc-800 rounded-2xl gap-1 text-white'>
        {/* post owner info */}
        <div className='flex gap-3 align-middle p-2'>
            <Link to={`/profile/${post.creator._id}`} className='self-center'>
                <AvatarImage 
                    src={post.creator.profileImg}
                    className='size-8 rounded-full'/>
            </Link>
            <div className='flex flex-col flex-grow self-center'>
                <div>
                    <Link to={`/profile/${post.creator._id}`} className='font-semibold hover:underline'>{post.creator.username}</Link>
                </div>
                <div>
                    <Link to={"/"} className='text-sm text-zinc-500 hover:underline font-semibold'>{post.createdAt.toUTCString()}</Link>
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
                {post.content.text}
            </p>
            <div className='flex'>
                <img 
                    src={post.content.img}
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
                    <span>Comment</span>
                    <span>Share</span>
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