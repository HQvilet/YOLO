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
import { useQuery } from '@tanstack/react-query'
import { IoClose } from "react-icons/io5";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoMdPersonAdd } from "react-icons/io";


import Post from '../../post/components/Post'
import type { UserImageData } from '../../../shared/types/user.types'
import { useQueryAuthUser } from '../../auth/hooks/useAuthUser'
import { useChatListStore } from '../../chat/store/chatStore'
import { useUploadImage } from '../../../shared/hooks/handleUploadImage'
import { useSendFriendRequest } from '../../friends/hooks/useRequestHooks'


const ProfilePage = () => {
    const { userID: userProfileID } = useParams()

    const { data: authUser } = useQueryAuthUser()

    const isAuthUser = userProfileID === authUser?._id; 
    const isFriend = false;
    
    const [isOpenUploadModal, openUploadModal] = useState<boolean>(false)
    const [currentImgUploadType, setCurrentUploadImg] = useState<"profileImg" | "coverImg" | undefined>()

    const previewImgRef = useRef<HTMLInputElement>(null)
    const [modalPreview, setModalPreview] = useState<string | ArrayBuffer | null>()

    const [formData, setFormData] = useState<UserImageData>({
        coverImg: undefined,
        profileImg: undefined,
    })

    const addUserToChat = useChatListStore(state => state.addUserToChatList)

    const {
        data: profileData,
        isLoading,
    } = useQuery({
        queryKey: ["userProfile", userProfileID],
        queryFn: () => 
            api.get(`/api/user/profile/${userProfileID}`)
                .then(res => {
                    const data = res.data.data;
                    setFormData({
                        profileImg: data.profileImg,
                        coverImg: data.coverImg,
                    })
                    return data
                }),
    })

    const {
        mutate: sendRequest
    } = useSendFriendRequest()

    const {
        mutate: uploadImage
    } = useUploadImage({
        onSuccess: (res => {
            console.log(res.data)
            console.log("Uploaded image to cloudinary.")
            const uploadResult = res.data

            if(!uploadResult.secure_url){
                throw new Error("Failed to upload.")
            }

            setFormData(prev => ({...prev, [currentImgUploadType ?? "profileImg"]: uploadResult.secure_url}))
            
            return api.put("/api/user/update", {
                [currentImgUploadType ?? "profileImg"]: uploadResult.secure_url
            })
        })
    })

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const reader = new FileReader()
        
        if (file) reader.readAsDataURL(file)
        reader.onload = function(){
            setModalPreview(reader.result)
        }
    }

    //upload image to cloudinary using signed url 
    const handleUploadImage = (modalPreview: string) => {
        if(!currentImgUploadType || !modalPreview)
            return;
        
        uploadImage([modalPreview])
        // api.get("/api/cloudinary/sign-delivery")
        //     .then(res => {
        //         console.log("Get signed url.")
        //         const signatureResult = res.data

        //         if(!signatureResult){
        //             throw new Error("Fail to sign secret url.")
        //         }

        //         const data = new FormData();
                
        //         data.append("file", modalPreview)
        //         data.append("api_key", signatureResult.apiKey)
        //         data.append("timestamp", `${signatureResult.timestamp}`)
        //         data.append("signature", signatureResult.signature)

        //         return axios.post(`https://api.cloudinary.com/v1_1/${signatureResult.cloudName}/image/upload`, data, {
        //             headers: {
        //                 'Content-Type': 'multipart/form-data'
        //             }
        //         })
        //     })
        //     .then(res => {
        //         console.log("Uploaded image to cloudinary.")
        //         const uploadResult = res.data

        //         if(!uploadResult.secure_url){
        //             throw new Error("Failed to upload.")
        //         }

        //         setFormData(prev => ({...prev, [currentImgUploadType]: uploadResult.secure_url}))
                
        //         return api.put("/api/user/update", {
        //             [currentImgUploadType]: uploadResult.secure_url
        //         })
        //     })
        //     .then(res => {
        //         console.log("Updated database.", res.data)
        //     })
        //     .catch(err => 
        //         console.log(err)
        //     )
    }
    

    return (
    <div className='flex flex-col relative top-[10vh] gap-5 text-white'>
        {/* Profile Header */}
        <header className='flex items-center flex-col bg-zinc-800 gap-4'>
            {/* Cover Image */}
            <div className='w-full relative'>
                <div className=''>
                    <img src={formData.coverImg || defaultCoverImg} 
                        alt="" 
                        className='rounded-md mx-auto object-contain w-[80vw] h-96'/>
                </div>
                <div className='absolute top-0 w-full h-full bg-black/20 bg-gradient-to-b from-white/95 to-zinc-900/0'>
                </div>
                {isAuthUser && <button 
                    className='flex justify-center items-center gap-2 absolute bottom-2 right-4 bg-white p-2 rounded-lg text-black'
                    onClick={e => {
                        setCurrentUploadImg("coverImg")
                        openUploadModal(true)
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
                            src={formData.profileImg}
                            className='size-36 bg-black rounded-full'/>
                        {isAuthUser && <button 
                            className='absolute bottom-2 right-2 bg-zinc-700 rounded-full p-2 text-lg'
                            onClick={e => {
                                setCurrentUploadImg("profileImg")
                                openUploadModal(true)
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
                            {!isAuthUser ?
                            <div className='flex gap-3'>
                                <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'
                                    onClick={() => {
                                        sendRequest(userProfileID || "")
                                    }}
                                >
                                    <IoMdPersonAdd className='text-2xl'/> 
                                    <span>Add Friend</span>
                                </button>
                                <button 
                                    className='flex gap-2 items-end rounded-md p-2 bg-violet-800 '
                                    onClick={() => {
                                        addUserToChat(userProfileID || "")
                                    }}>
                                    <LuMessageCircleMore className='text-2xl'/> 
                                    <span>Message</span>
                                </button>
                                <button className='rounded-md p-2 bg-zinc-600'>
                                    <RiArrowDropDownLine className='text-2xl m-auto'/>
                                </button>
                            </div>
                            :
                            <div className='flex gap-3'>
                                <button className='flex gap-2 items-end rounded-md p-2 bg-zinc-600'>
                                    <IoMdPersonAdd className='text-2xl'/> 
                                    <span>Add Story</span>
                                </button>
                                <button 
                                    className='flex gap-2 items-end rounded-md p-2 bg-violet-800 '
                                    onClick={() => {
                                        addUserToChat(userProfileID || "")
                                    }}>
                                    <LuMessageCircleMore className='text-2xl'/> 
                                    <span>Edit Profile</span>
                                </button>
                                <button className='rounded-md p-2 bg-zinc-600'>
                                    <RiArrowDropDownLine className='text-2xl m-auto'/>
                                </button>
                            </div>}
                        </div>
                        <Link to="">Link</Link>
                    </div>
                </div>
                {/* Utils */}
                <div className='flex gap-1 my-2 text-gray-400'>
                    <button className='p-2 rounded-lg hover:bg-white/20 '>All</button>
                    <button className='p-2 hover:bg-white/20 rounded-lg'>Introduce</button>
                    <button className='p-2 rounded-sm border-b-2 border-violet-500 text-violet-500'>Friends</button>
                </div>
            </div>
        </header>
        {/* Profile body */}
        <div className='flex gap-5 justify-center'>
            {/* Profile left sidebar */}
            <div className='flex flex-col gap-5 w-[24rem]'>
                <div className='w-full h-96 bg-zinc-800 rounded-lg'>

                </div>
                <div className='w-full h-36 bg-zinc-800 rounded-lg'>
                    
                </div>
                <div className='w-full h-36 bg-zinc-800 rounded-lg'>
                    
                </div>
            </div>
            {/* Profile Posts */}
            <div className='flex flex-col gap-5 w-[32rem]'>
                {/* <Post/>
                <Post/>
                <Post/> */}
            </div>
        </div>

        {/* Upload image modal */}
        {isAuthUser && <Modal open={isOpenUploadModal}>
            <div className='mx-auto my-36 w-[30rem]'>
                <div className='relative bg-zinc-700 rounded-xl w-full h-full'>
                    <button 
                        className='absolute top-0 right-0 hover:scale-[1.3]'
                        onClick={e => openUploadModal(false)}>
                        <IoClose className='text-3xl text-white'/>
                    </button>
                    <div className='flex flex-col items-center gap-2 text-white p-2'>
                        <div className='border-b-[1px] border-gray-500 w-[80%]'>
                            <h1 className='text-center p-2 text-2xl font-bold'> Choose your image </h1>
                        </div>
                        <div className='flex flex-col w-4/5 gap-2 items-center'>
                            <div>
                                <img 
                                    src= {modalPreview as string}
                                    alt="" 
                                    className=''/>
                            </div>
                            <div className='flex justify-end w-full gap-2 pr-4'>
                                <button 
                                    className='bg-zinc-500 p-2 rounded-lg'
                                    onClick={e => {
                                        previewImgRef.current?.click()
                                    }}
                                >
                                    + Upload file
                                    <input
                                        type="file"
                                        accept='image/png, image/jpeg'
                                        hidden
                                        ref={previewImgRef} 
                                        name="profileImage"
                                        onChange={handleImgChange} />
                                </button>
                                <button 
                                    className='bg-violet-500 p-2 rounded-lg '
                                    onClick={() => {handleUploadImage(modalPreview as string)}}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </Modal>}
    </div>
  )
}

export default ProfilePage