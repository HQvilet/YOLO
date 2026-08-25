import React, { useRef, useState } from 'react'
import { data, Link, useParams } from 'react-router-dom'
import api from '../../../lib/api.config'
import axios from 'axios'

import AvatarImage from '../../../assets/AvatarImage'
import defaultCoverImg from '../../../assets/default_cover_img.png'
// import defaultProfileImg from '../../assets/default_avatar.png'
import Modal from '../../../layout/Modal'

import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCamera } from 'react-icons/fa'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IoClose } from "react-icons/io5";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoMdPersonAdd } from "react-icons/io";


import Post from '../../post/components/Post'
import type { UserImageData } from '../../../shared/types/user.types'
import { useQueryAuthUser } from '../../auth/hooks/useAuthUser'
import { useChatListStore } from '../../chat/store/chatStore'
import { useUploadImage } from '../../../shared/hooks/handleUploadImage'
import { useAcceptFriendRequest, useAcceptRequestFromUser, useDeclineFriendRequest, useDeclinetRequestFromUser, useSendFriendRequest } from '../../friends/hooks/useRequestHooks'
import EditProfilePanel from './EditProfilePanel'
import { useQueryProfile } from '../hooks/useProfileHooks'
import ProfilePostsFeed from '../components/ProfilePostsFeed'
import FriendsFeed from '../components/FriendsFeed'
import ProfileInformation from '../components/ProfileInformation'

const TABS = [
    {
        key: "all",
        label: "All"
    },{
        key: "friend",
        label: "Friends"
    },{
        key: "info",
        label: "Introduce"
    }
] as const

const ProfilePage = () => {
    const { userID: userProfileID } = useParams()
    const queryClient = useQueryClient()

    const { data: authUser } = useQueryAuthUser()

    const isAuthUser = userProfileID === authUser?._id;

    const [isOpenUploadModal, setOpenUploadModal] = useState<boolean>(false)
    const [feedType, setFeedType] = useState<"all" | "friend" | "info">("all")

    const addUserToChat = useChatListStore(state => state.addChatByUser)

    const updateRequestStatus = (newStatus: "none" | "pending" | "accepted" | "declined" | "waitResponse") => {
        queryClient.setQueryData(['profile', userProfileID], (oldData: any) => {
            if(!oldData) return oldData
            return {
                ...oldData,
                requestStatus: newStatus
            }
        })
    }

    const {
        data: profileData,
        isLoading,
        isSuccess: loadProfileSuccess
    } = useQueryProfile(userProfileID!)

    const {
        mutate: sendRequest
    } = useSendFriendRequest({
        onSuccess: () => {
            updateRequestStatus("waitResponse")
        }
    })

    const {
        mutate: acceptRequest
    } = useAcceptRequestFromUser({
        onSuccess: () => {
            updateRequestStatus("accepted")
        }
    })

    const {
        mutate: declineRequest
    } = useDeclinetRequestFromUser({
        onSuccess: () => {
            updateRequestStatus("declined")
        }
    })

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <div className='w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin'></div>
                    <span className='text-white'>Loading profile...</span>
                </div>
            </div>)}

    return (
    <div className='flex flex-col relative top-[10vh] gap-5 text-white'>
        {/* Profile Header */}
        <header className='flex items-center flex-col bg-zinc-800 gap-4'>
            {/* Cover Image */}
            <div className='w-full relative'>
                <div className=''>
                    <img src={profileData?.coverImg || defaultCoverImg} 
                        alt="" 
                        className='rounded-md mx-auto object-contain w-[80vw] h-96'/>
                </div>
                <div className='absolute top-0 w-full h-full bg-black/20 bg-gradient-to-b from-white/95 to-zinc-900/0'>
                </div>
                {isAuthUser && <button 
                    className='flex justify-center items-center gap-2 absolute bottom-2 right-4 bg-white p-2 rounded-lg text-black'
                    onClick={e => {
                        setOpenUploadModal(true)
                    }}
                >
                    <FaCamera />
                    <span>Edit cover image</span>
                </button>}
            </div>
            <div className=''>
                <div className='flex gap-5 border-b-[1px] border-b-gray-400 p-1 pb-2'>
                    <div className='relative'>
                        <AvatarImage 
                            src={profileData?.profileImg}
                            className='size-36 bg-black rounded-full'/>
                        {isAuthUser && <button 
                            className='absolute bottom-2 right-2 bg-zinc-700 rounded-full p-2 text-lg'
                            onClick={e => {
                                setOpenUploadModal(true)
                            }}
                        >
                            <FaCamera />
                        </button>}
                    </div>
                    <div className='flex flex-col justify-center'>
                        <div className='flex gap-10 justify-between w-[48rem]'>
                            <div>
                                <span className='text-3xl font-bold'>{`${profileData?.fullname} (${profileData?.username})`}</span>
                            </div>
                            {!isAuthUser &&
                            <div className='flex gap-3'>
                                {profileData?.requestStatus === "pending" && <>
                                    <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'
                                        onClick={() => {
                                            acceptRequest(profileData._id)
                                        }}
                                    >
                                        <IoMdPersonAdd className='text-2xl'/> 
                                        <span>Accept</span>
                                    </button>
                                    <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'
                                        onClick={() => {
                                            declineRequest(profileData._id)
                                        }}
                                    >
                                        <IoMdPersonAdd className='text-2xl'/> 
                                        <span>Decline</span>
                                    </button>
                                </>}
                                {profileData?.requestStatus === "none" && <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'
                                    onClick={() => {
                                        sendRequest(profileData._id)
                                    }}
                                >
                                    <IoMdPersonAdd className='text-2xl'/> 
                                    <span>Add Friend</span>
                                </button>}
                                {profileData?.requestStatus === "accepted" && <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'
                                    onClick={() => {
                                        
                                    }}
                                >
                                    <IoMdPersonAdd className='text-2xl'/> 
                                    <span>Friend</span>
                                </button>}
                                {profileData?.requestStatus === "waitResponse" && <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'
                                    onClick={() => {
                                        
                                    }}
                                >
                                    <IoMdPersonAdd className='text-2xl'/> 
                                    <span>Wait For Response</span>
                                </button>}


                                <button 
                                    className='flex gap-2 items-end rounded-md p-2 bg-violet-800 '
                                    onClick={() => {
                                        addUserToChat(userProfileID!)
                                    }}>
                                    <LuMessageCircleMore className='text-2xl'/> 
                                    <span>Message</span>
                                </button>
                                <button className='rounded-md p-2 bg-zinc-600'>
                                    <RiArrowDropDownLine className='text-2xl m-auto'/>
                                </button>
                            </div>}
                            {isAuthUser && 
                            <div className='flex gap-3'>
                                <button 
                                    className='flex gap-2 items-end rounded-md p-2 bg-violet-800 '
                                    onClick={() => {
                                        setOpenUploadModal(true)
                                    }}>
                                    <LuMessageCircleMore className='text-2xl'/> 
                                    <span>Edit Profile</span>
                                </button>
                                <button className='rounded-md p-2 bg-zinc-600'>
                                    <RiArrowDropDownLine className='text-2xl m-auto'/>
                                </button>
                            </div>}
                            {

                            }
                        </div>
                        <Link to="">Link</Link>
                    </div>
                </div>
                {/* Utils */}
                <div className='flex gap-1 my-2 text-gray-400'>
                        {TABS.map(tab => <>
                        <button className={'p-2 ' + (feedType === tab.key ? "rounded-sm border-b-2 border-violet-500 text-violet-500" : "rounded-lg hover:bg-white/20")}
                            onClick={() => {setFeedType(tab.key)}}>{tab.label}</button>
                    </>)}
                </div>
            </div>
        </header>
        {/* Profile body */}
            <div className='flex gap-5 justify-center'>
                {feedType === "all" && <ProfilePostsFeed profileData={profileData!} onNavigateToFriends={() => setFeedType("friend")} />}
                {feedType === "friend" && <FriendsFeed profileData={profileData!} />}
                {feedType === "info" && 
                    <ProfileInformation   
                        data={{
                        fullname: "Jane Doe",
                        username: "janedoe",
                        email: "jane@example.com",
                        phoneNumber: "+1 555 0100",
                        bio: "Product designer based in Huế.",
                        birthday: "1998-04-21",
                        address: "123 Main St, Huế, Vietnam",
                    }}
            isAuthUser={true}
            onSave={(updated) => console.log(updated)}/>}

        </div>

        {/* Upload image modal */}
        {isAuthUser && isOpenUploadModal &&
            <Modal open={isOpenUploadModal}> 
                <EditProfilePanel profileData={profileData!} onClose={() => setOpenUploadModal(false)} />
            </Modal>
        }
        
    </div>
  )
}

export default ProfilePage