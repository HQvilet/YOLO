import {
  MapPin,
  Home,
  Cake,
  GraduationCap,
  ChevronRight,
  UserCircle2,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { useQueryFriends } from "../hooks/useProfileHooks";
import type { UserWithStatus } from "../../../shared/types/user.types";
 
interface AllFriendsListItem {
  name: string;
  subtitle: string; // e.g. "13 bạn chung" or a location/status line
  imageUrl: string;
}
 
 
const friendTabs = [
  "Tất cả bạn bè",
  "Đã thêm gần đây",
] as const;

const FriendsFeed = ({ profileData }: { profileData: UserWithStatus }) => {
  const [activeTab, setActiveTab] = useState<(typeof friendTabs)[number]>("Tất cả bạn bè");
  const [query, setQuery] = useState("");
  
  const {
    data: friends,
  } = useQueryFriends(profileData._id)

  // const filtered = friends.filter((f) =>
  //   f.name.toLowerCase().includes(query.trim().toLowerCase())
  // );
  if(!friends || friends.length <= 0) {
    return (
      <div className='flex flex-col gap-5 w-[32rem] h-[16rem] items-center justify-center'>
        <p className='text-[#b0b3b8] text-xl'>Chưa có bạn bè nào</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#18191a] text-[#e4e6eb]">
      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Header */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Bạn bè</h1>
 
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[#3a3b3c] px-3 py-2">
              <Search size={16} className="text-[#b0b3b8]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-32 bg-transparent text-[14px] text-[#e4e6eb] placeholder-[#b0b3b8] outline-none"
              />
            </div>
 
            <button className="whitespace-nowrap text-[15px] font-semibold text-[#2e89ff] hover:underline">
              Lời mời kết bạn
            </button>
            <button className="whitespace-nowrap text-[15px] font-semibold text-[#2e89ff] hover:underline">
              Tìm bạn bè
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3a3b3c] text-[#e4e6eb] hover:bg-[#4e4f50]">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
 
        {/* Tabs */}
        <div className="mb-4 flex gap-6 border-b border-[#3a3b3c]">
          {friendTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-[15px] font-semibold transition-colors ${
                activeTab === tab
                  ? "text-[#2e89ff]"
                  : "text-[#b0b3b8] hover:text-[#e4e6eb]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-[#2e89ff]" />
              )}
            </button>
          ))}
        </div>
 
        {/* Friends list */}
        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {friends.map((friend, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-[#3a3b3c] py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#3a3b3c]">
                  {friend.profileImg ? (
                    <img
                      src={friend.profileImg}
                      alt={friend.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserCircle2 size={36} className="text-[#8a8d91]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-semibold leading-snug">{friend.username}</p>
                  {friend.fullname && (
                    <p className="text-[13px] text-[#b0b3b8]">{friend.fullname}</p>
                  )}
                </div>
              </div>
 
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3a3b3c] text-[#e4e6eb] hover:bg-[#4e4f50]">
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default FriendsFeed