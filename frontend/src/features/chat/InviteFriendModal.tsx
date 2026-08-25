import React, { useMemo, useState } from "react";
import { Search, Check, Send, Users } from "lucide-react";
import { useQueryAllFriends, useQueryAllRecommendedUser } from "../friends/hooks/useFriendHooks";
import AvatarImage from "../../assets/AvatarImage";
import { useQueryAuthUser } from "../auth/hooks/useAuthUser";
import { useCreateConversation } from "./hooks/useConversationHooks";

const InviteFriendModal = ({onClose}: {onClose: () => void}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const {data: authUser} = useQueryAuthUser()
  const {
    data: friends,
  } = useQueryAllRecommendedUser()

  const {
    mutate: createConversation
  } = useCreateConversation({
    onSuccess: (conversation) => {
      onClose()
    }
  })
 
  if(!friends){
    return <></>
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const createNewGroup = () => {
    createConversation({userIDs: Array.from(selected)})
  }
 
  const count = selected.size;
 
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm rounded-[20px] border border-violet-400/20 bg-gradient-to-b from-[#17131f] to-[#120f19] shadow-[0_20px_60px_-20px_rgba(88,28,135,0.55)] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-[22px] pb-[18px] border-b border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-violet-800 shadow-[0_6px_16px_-4px_rgba(139,92,246,0.6)]">
              <Users size={18} className="text-violet-50" strokeWidth={2.25} />
            </div>
            <div>
              <h2 className="m-0 text-[17px] font-semibold tracking-tight text-violet-50">
                Invite friends
              </h2>
              <p className="m-0 mt-0.5 text-[12.5px] text-violet-300/50">
                Bring people into this space
              </p>
            </div>
          </div>
 
          {/* Search */}
          <div className="relative mt-4">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-300/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or handle"
              className="w-full rounded-[10px] border border-violet-400/15 bg-[#1c1726] py-2.5 pl-9 pr-3 text-[13.5px] text-violet-50 outline-none placeholder:text-violet-300/30 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 transition-colors"
            />
          </div>
        </div>
 
        {/* Friend list */}
        <div className="max-h-[340px] overflow-y-auto p-2.5 space-y-0.5">
          {friends.length === 0 && (
            <div className="py-7 px-3 text-center text-sm text-violet-300/40">
              No one matches &ldquo;{query}&rdquo;
            </div>
          )}
 
          {friends.map((friend) => {
            const isChecked = selected.has(friend._id);
            return (
              <label
                key={friend._id}
                htmlFor={`friend-${friend._id}`}
                className={`flex items-center gap-3 rounded-xl p-2.5 cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-violet-500/10"
                    : "bg-transparent hover:bg-white/[0.03]"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <AvatarImage src={friend.profileImg} className="size-10 rounded-full"/>
                  {friend && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#17131f] bg-emerald-400" />
                  )}
                </div>
 
                {/* Name / handle */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium text-violet-50">
                    {friend.fullname}
                  </div>
                  <div className="text-xs text-violet-300/40">
                    {`@${friend.username}`}
                  </div>
                </div>
 
                {/* Checkbox */}
                <input
                  id={`friend-${friend._id}`}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(friend._id)}
                  className="hidden"
                />
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-all ${
                    isChecked
                      ? "border border-transparent bg-gradient-to-br from-violet-500 to-violet-800"
                      : "border-[1.5px] border-violet-400/30"
                  }`}
                >
                  {isChecked && <Check size={13} className="text-white" strokeWidth={3} />}
                </div>
              </label>
            );
          })}
        </div>
 
        {/* Footer */}
        <div className="border-t border-violet-400/10 px-5 pt-4 pb-5">
          <button
            disabled={count === 0}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform active:scale-[0.98] ${
              count === 0
                ? "cursor-not-allowed bg-white/5 text-violet-300/40"
                : "cursor-pointer bg-gradient-to-br from-violet-500 to-violet-800 text-white shadow-[0_10px_24px_-8px_rgba(139,92,246,0.65)]"
            }`}
            onClick={() => {
              createNewGroup()
            }}
          >
            <Send size={15} />
            {count === 0
              ? "Select friends to invite"
              : `Invite ${count} friend${count > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteFriendModal