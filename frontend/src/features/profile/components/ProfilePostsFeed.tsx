import { Cake, Home, MapPin, UserCircle2 } from 'lucide-react';
import React from 'react'
import { useQueryPosts, useQueryUserPosts } from '../../post/hooks/usePostHooks';
import Post from '../../post/components/Post';
import type { UserProfileWithDetail, UserWithStatus } from '../../../shared/types/user.types';
import { useQueryFriends } from '../hooks/useProfileHooks';
import AvatarImage from '../../../assets/AvatarImage';
import { useNavigate } from 'react-router-dom';

interface InfoItem {
  icon: React.ReactNode;
  label: string;
}

/* --------------------------- Default content --------------------------- */
 
const items: InfoItem[] = [
  { icon: <MapPin size={20} />, label: "Sống ở Quy Nhơn" },
  { icon: <Home size={20} />, label: "Từ Quy Nhơn" },
  { icon: <Cake size={20} />, label: "12 tháng 8, 2006" },
];
 
const ProfilePostsFeed = ({profileData, onNavigateToFriends}: {profileData: UserProfileWithDetail, onNavigateToFriends?: () => void}) => {
  const navigate = useNavigate()
  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQueryUserPosts(profileData._id)

  const {
    data: friends,
    isLoading: isFriendsLoading,
  } = useQueryFriends(profileData._id)

  return (
    <>
      {/* Profile left sidebar */}
      <div className='flex flex-col gap-5 w-[24rem]'>
          {/* Personal Information */}
            
        <div className="w-full max-w-sm rounded-xl bg-zinc-800 p-4 text-[#e4e6eb] shadow-sm">
          {/* Personal info */}
          <h2 className="mb-3 text-xl font-bold">Thông tin cá nhân</h2>
    
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#b0b3b8]">
                  {item.icon}
                </span>
                <span className="text-[15px] leading-snug">{item.label}</span>
              </li>
            ))}
          </ul>
    
          <button className="mt-3 text-[15px] font-semibold text-[#b0b3b8] hover:underline">
            Xem thêm thông tin cá nhân
          </button>
        </div>

        {/* Friends List */}
        <div className='w-full bg-zinc-800 rounded-lg'>
          <div className="w-full max-w-sm rounded-xl bg-[#242526] p-4 text-[#e4e6eb] shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-xl font-bold">Bạn bè ({profileData.friendCount})</h2>
              <button className="flex items-center text-[15px] text-[#2e89ff] hover:underline"
                onClick={() => {
                  onNavigateToFriends?.()
                }}
              >
                Xem tất cả bạn bè
              </button>
            </div>
      
            <p className="mb-3 text-[15px] text-[#b0b3b8]">
              {profileData.mutualFriends.length > 0 ? `(${profileData.mutualFriends.length} bạn chung)` : ''}
            </p>
            {!friends || friends.length === 0 ? 
              
                <p className="text-[15px] text-[#b0b3b8]">
                  Chưa có bạn bè nào
                </p>
              : 
                <div className="grid grid-cols-3 gap-2">
                  {friends.map((friend, idx) => (
                    <button
                      key={friend._id}
                      className="group flex flex-col overflow-hidden rounded-md text-left"
                      onClick={() => {
                        navigate(`/profile/${friend._id}`)
                      }}
                    >
                      {/* <div className="aspect-square w-full overflow-hidden rounded-md bg-[#3a3b3c]"> */}
                        <AvatarImage src={friend.profileImg} className='aspect-square w-full overflow-hidden rounded-md bg-[#3a3b3c]'/>
                      <p className="mt-1 truncate text-[13px] font-semibold leading-tight">
                        {friend.username}
                      </p>
                      <p className="truncate text-[12px] text-[#b0b3b8]">
                        {friend.mutualFriends.length > 0 ? `(${friend.mutualFriends.length} bạn chung)` : ''}
                      </p>
                    </button>
                  ))}
                </div>}
          </div>
        </div>

      </div>
      {/* Profile Posts */}
      <div className='flex flex-col gap-5 w-[32rem]'>
          {!posts || posts.length <= 0 ?
            <div className='flex flex-col gap-5 w-[32rem] h-[16rem] items-center justify-center'>
              <p className='text-[#b0b3b8] text-xl'>Chưa có bài viết nào</p>
            </div>
          :
            posts?.map((post) => <Post post={post}/>)}
      </div>
    </>
  )
}

export default ProfilePostsFeed
