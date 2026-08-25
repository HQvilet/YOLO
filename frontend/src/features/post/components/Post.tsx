import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { PostInterface } from '../../../shared/types/post.types'
import AvatarImage from '../../../assets/AvatarImage'
import queryClient from '../../../lib/queryClient'
import { useLikePost, useUnlikePost } from '../hooks/usePostHooks'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { FaCommentAlt, FaShareAlt } from 'react-icons/fa'
import { IoMdShare } from 'react-icons/io'
import Modal from '../../../layout/Modal'
import PostDetail from '../pages/PostDetail'

const Post = ({post} : {post: PostInterface}) => {

    const navigate = useNavigate()

    const [isReacted, setIsReacted] = useState(post.isAuthUserReacted)
    const [reactCount, setReactCount] = useState<number>(post.reactCount)

    const [openPostDetail, setOpenPostDetail] = useState(false)

    const {
        mutate: likePost,
    } = useLikePost({
        onSuccess: (data) => {}
    })

    const {
        mutate: unlikePost,
    } = useUnlikePost({
        onSuccess: (data) => {}
    })

    const handleLikeOrUnlikePost = () => {
        if(!isReacted || isReacted === null){
            likePost(post._id)
            setReactCount(prev => prev + 1)
            setIsReacted("like")
        } else {
            unlikePost(post._id)
            setReactCount(prev => prev - 1)
            setIsReacted(null)
        }
    }

    const navigateToPostDetail = () => {
        queryClient.setQueryData(["post", post._id], () =>  post)
        navigate(`/post/${post._id}`)

    }

  return (
    <div className='flex flex-col bg-zinc-800 rounded-2xl gap-0 text-white'>
        {/* post owner info */}
        <div className='flex gap-3 align-middle p-2 pb-0 mb-1'>
            <Link to={`/profile/${post.creator._id}`} className='self-center'>
                <AvatarImage 
                    src={post.creator.profileImg}
                    className='size-10 rounded-full'/>
            </Link>
            <div className='flex flex-col flex-grow self-center'>
                <div>
                    <Link to={`/profile/${post.creator._id}`} className='font-semibold hover:underline line-clamp-1'>{post.creator.username}</Link>
                </div>
                <div className=''>
                    <Link to={"/"} className='text-xs text-zinc-500 hover:underline font-semibold line-clamp-1'>{post.createdAt.toUTCString()}</Link>
                </div>
            </div>
            <div className='flex gap-2 mr-2 self-center'>
                {/* <button className='size-10 bg-zinc-500 rounded-lg'>
                    X
                </button>
                <button className='size-10 bg-zinc-500 rounded-lg'>
                    X
                </button> */}
            </div>
        </div>
        {/* post content */}
        <div className='flex flex-col'>
            <p className='px-2 pb-2 text-sm'>
                {post.content.text}
            </p>
            <div className='flex hover:cursor-pointer'
                onClick={() => {
                    navigateToPostDetail()
                }}
            >
                <img 
                    src={post.content.img}
                    alt="" 
                    className='object-cover w-full'/>
            </div>
        </div>
        {/* post utilities */}
        <div className='flex flex-col gap-0'>
            <div className='flex justify-between'>
                
            </div>
            <div className='flex gap-0'>
                <button className={'flex justify-center items-center gap-2 flex-1 p-2 rounded-sm rounded-bl-2xl hover:bg-zinc-700' + (isReacted !== null ? ' bg-zinc-700 text-blue-500' : '')}
                    onClick={(e) => {
                        handleLikeOrUnlikePost()
                    }}
                >
                    {!isReacted ? <AiOutlineLike className='size-6'/> : <AiFillLike className='size-6'/>}
                    <span className=''>{reactCount}</span>
                </button>
                <button className='flex justify-center items-center gap-2 flex-1 p-2 rounded-sm  hover:bg-zinc-700'
                    onClick={() => {
                        navigateToPostDetail()
                    }}
                >
                    <FaCommentAlt className='size-5'/>
                    <span className=''>{post.commentCount}</span>
                </button>
                <button className='flex justify-center items-center gap-2 flex-1 p-2 rounded-sm rounded-br-2xl hover:bg-zinc-700'>
                    <IoMdShare className='size-6'/>
                    <span className=''>{"Share"}</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Post