import React, { useState } from 'react'
import Post from '../../post/components/Post'
import CreatePostHomePage from '../../post/components/CreatePostHomePage'
import { useGetPosts } from '../../post/hooks/usePostHooks'

const HomePageFeed = () => {
    const {
        data: posts
    } = useGetPosts()
  return (
    <div className='flex justify-center'>
        <div className='flex flex-col mt-4 w-[80%] gap-5 justify-center'>
            <CreatePostHomePage/>
            <div className='flex flex-col gap-4'>
                {posts?.map(post => (<Post key={post._id} post={post}/>))}
            </div>
        </div>        
    </div>
  )
}

export default HomePageFeed