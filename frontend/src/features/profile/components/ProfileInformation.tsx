import React, { useState } from "react";
import { Pencil, Check, X, Lock, Mail, Phone, Cake, MapPinHouse, BookOpen } from "lucide-react";

export interface ProfileData {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  bio: string;
  birthday: string; // e.g. "1998-04-21"
  address: string;
}

interface ProfilePanelProps {
  data: ProfileData;
  /** true when the panel is being viewed by the account owner (enables editing) */
  isAuthUser: boolean;
  /** called with the updated data when the user saves changes */
  onSave?: (data: ProfileData) => void;
}

// fields that can never be edited, regardless of isAuthUser
const LOCKED_FIELDS: (keyof ProfileData)[] = ["email", "phoneNumber"];

const FIELD_LABELS: Record<keyof ProfileData, string> = {
  fullname: "Full name",
  username: "Username",
  email: "Email",
  phoneNumber: "Phone number",
  bio: "Bio",
  birthday: "Birthday",
  address: "Address",
};

export default function ProfileInformation({ data, isAuthUser, onSave }: ProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(data);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setDraft(data);
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave?.(draft);
    setIsEditing(false);
  };

  const initials = data.fullname
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const renderField = (
    field: keyof ProfileData,
    options?: { multiline?: boolean; type?: string; icon?: React.ReactNode }
  ) => {
    const locked = LOCKED_FIELDS.includes(field);
    const editable = isAuthUser && !locked;
    const value = isEditing ? draft[field] : data[field];

    return (
      <div className="flex flex-col gap-1 py-3 border-b border-neutral-800 last:border-b-0">
        <div className="flex items-center gap-1.5 text-sm uppercase tracking-wide text-white font-medium">
          {options?.icon}
          <span>{FIELD_LABELS[field]}</span>
          {locked && <Lock size={14} className="text-gray-400" />}
        </div>

        {isEditing && editable ? (
          options?.multiline ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md bg-neutral-800/70 border border-neutral-700 px-2.5 py-1.5 text-sm text-gray-500 placeholder-neutral-500 outline-none focus:border-neutral-500 transition-colors"
            />
          ) : (
            <input
              type={options?.type ?? "text"}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full rounded-md bg-neutral-800/70 border border-neutral-700 px-2.5 py-1.5 text-sm text-gray-500 placeholder-neutral-500 outline-none focus:border-neutral-500 transition-colors"
            />
          )
        ) : (
          <p className="text-sm text-gray-500 whitespace-pre-wrap break-words">
            {value || <span className="text-neutral-600">Not set</span>}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-zinc-800 text-gray-300 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-sm font-medium text-gray-300">
            {initials || "?"}
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-200">{data.fullname}</h2>
            <p className="text-xs text-neutral-500">@{data.username}</p>
          </div>
        </div>

        {isAuthUser && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-emerald-400 hover:bg-neutral-700 transition-colors"
                  aria-label="Save changes"
                >
                  <Check size={15} />
                </button>
                <button
                  onClick={handleCancel}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 transition-colors"
                  aria-label="Cancel editing"
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 transition-colors"
                aria-label="Edit profile"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="mt-4 px-5 pb-5">
        {renderField("email", { icon: <Mail size={15} /> })}
        {renderField("phoneNumber", { type: "tel", icon: <Phone size={15} /> })}
        {renderField("bio", { multiline: true, icon: <BookOpen size={15}/> })}
        {renderField("birthday", { type: "date", icon: <Cake size={15}/> })}
        {renderField("address", { multiline: true, icon: <MapPinHouse size={15}/> })}
      </div>
    </div>
  );
}