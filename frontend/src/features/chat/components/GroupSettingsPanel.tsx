import React, { useRef, useState, useMemo } from "react";
import {
  Pencil,
  UserPlus,
  Users,
  UploadCloud,
  Check,
  MessageSquare,
  MoreVertical,
  X,
  Search,
  ImageOff,
} from "lucide-react";
import type { Conversation } from "../../../shared/types/conversation.types";
import AvatarImage from "../../../assets/AvatarImage";
import { useQueryAllRecommendedUser } from "../../friends/hooks/useFriendHooks";
import { useInviteFriends } from "../hooks/useConversationHooks";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type TabKey = "edit" | "invite" | "members";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "edit", label: "Edit", icon: Pencil },
  { key: "invite", label: "Invite", icon: UserPlus },
  { key: "members", label: "Members", icon: Users },
];

function RoundIconButton({
  children,
  label,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  variant?: "default" | "danger";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-150
        ${
          variant === "danger"
            ? "border-white/5 bg-[#15121e] text-rose-300/80 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300"
            : "border-white/5 bg-[#15121e] text-violet-200/70 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-200"
        }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

export default function GroupSettingsPanel( { conversation, onClose }: { conversation: Conversation; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>("edit");

  // ---- Edit tab state ----
  const [groupName, setGroupName] = useState(conversation.group?.name || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: inviteFriends
  } = useInviteFriends({
    onSuccess:(data) => {
      onClose()
    }
  })

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // ---- Invite tab state ----
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const {
    data: toInviteUsers
  } = useQueryAllRecommendedUser()

  // const filteredCandidates = useMemo(
  //   () =>
  //     INVITE_CANDIDATES.filter((p) =>
  //       (p.name + p.handle).toLowerCase().includes(query.toLowerCase())
  //     ),
  //   [query]
  // );

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleInviteFriends = () => {
    inviteFriends({
      conversationID: conversation._id,
      users: Array.from(selected)
    })
  }

  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  return (
    <div className="flex min-h-screen w-full mt-[10vh] justify-center p-6 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }}}
      >
      <div className="relative w-full max-w-md">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />

        <div className="relative w-full overflow-hidden rounded-2xl border border-violet-900/20 bg-[#0c0a12] shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">Group Setting</h1>
              <p className="mt-0.5 text-sm text-violet-200/40">
                Manage your group's name, invites and members
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              className="rounded-full p-1.5 text-violet-200/40 transition-colors hover:bg-white/5 hover:text-violet-200"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tab nav */}
          <div className="relative mx-6 mt-5 grid grid-cols-3 rounded-xl bg-[#131019] p-1">
            <div
              className="absolute inset-y-1 w-[calc(33.333%-2.67px)] rounded-lg bg-gradient-to-b from-violet-500 to-violet-600 shadow-[0_0_16px_rgba(139,92,246,0.45)] transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative z-10 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-white" : "text-violet-200/50 hover:text-violet-200/80"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {activeTab === "edit" && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="group-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-violet-200/40">
                    Group name
                  </label>
                  <input
                    id="group-name"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter a group name"
                    className="w-full rounded-lg border border-white/5 bg-[#15121e] px-3 py-2.5 text-sm text-white placeholder-violet-200/30 outline-none transition-colors focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-violet-200/40">
                    Group image
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors duration-150 ${
                      isDragOver
                        ? "border-violet-400 bg-violet-500/10"
                        : "border-violet-200/15 bg-[#0f0c15] hover:border-violet-300/30 hover:bg-[#131019]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Selected group"
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-violet-400/40"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                    )}
                    <p className="text-sm text-violet-100/80">
                      {imagePreview ? "Looks good — click to replace" : "Drag & drop an image, or click to browse"}
                    </p>
                    <p className="text-xs text-violet-200/30">PNG or JPG, up to 5MB</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-gradient-to-b from-violet-500 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-opacity hover:opacity-90"
                >
                  Save changes
                </button>
              </div>
            )}

            {activeTab === "invite" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-200/30" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people to invite"
                    className="w-full rounded-lg border border-white/5 bg-[#15121e] py-2.5 pl-9 pr-3 text-sm text-white placeholder-violet-200/30 outline-none transition-colors focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
                  {toInviteUsers?.map((person) => {
                    const isChecked = selected.has(person._id);
                    return (
                      <li key={person._id}>
                        <button
                          type="button"
                          onClick={() => toggleSelected(person._id)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.03]"
                        >
                          <AvatarImage src={person.profileImg} className="size-8 rounded-full" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">{person.username}</p>
                            <p className="truncate text-xs text-violet-200/40">{person.fullname}</p>
                          </div>
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-150 ${
                              isChecked
                                ? "border-violet-400 bg-violet-500"
                                : "border-violet-200/20 bg-transparent"
                            }`}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {toInviteUsers?.length === 0 && (
                    <li className="flex flex-col items-center gap-2 py-8 text-center text-violet-200/30">
                      <ImageOff className="h-5 w-5" />
                      <span className="text-sm">No one matches "{query}"</span>
                    </li>
                  )}
                </ul>

                <button
                  type="button"
                  disabled={selected.size === 0}
                  className="w-full rounded-lg bg-gradient-to-b from-violet-500 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={handleInviteFriends}
                >
                  {selected.size === 0 ? "Select people to invite" : `Invite ${selected.size} ${selected.size === 1 ? "person" : "people"}`}
                </button>
              </div>
            )}

            {activeTab === "members" && (
              <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
                {conversation?.participants.map((person) => (
                  <li
                    key={person.userID._id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]"
                  >
                    <AvatarImage src={person.userID.profileImg} className="size-8 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{person.userID.username}</p>
                      <p className="truncate text-xs text-violet-200/40">{person.userID.fullname}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <RoundIconButton label={`Message ${person.userID.username}`}>
                        <MessageSquare className="h-4 w-4" />
                      </RoundIconButton>
                      <RoundIconButton label={`More options for ${person.userID.username}`}>
                        <MoreVertical className="h-4 w-4" />
                      </RoundIconButton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}