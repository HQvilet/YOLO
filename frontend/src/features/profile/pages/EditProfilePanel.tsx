import React, { useCallback, useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Trash2, Check } from "lucide-react";
import type { UserInterface } from "../../../shared/types/user.types";
import { useUploadImage } from "../../../shared/hooks/handleUploadImage";
import { useUpdateProfile } from "../hooks/useProfileHooks";
import queryClient from "../../../lib/queryClient";

/**
 * ProfileImagePanel
 * Dark violet themed panel for uploading a cover image and an avatar.
 * Supports click-to-browse and drag-and-drop for both images.
 *
 * Usage:
 *   <ProfileImagePanel onSave={(files) => api.save(files)} />
 */

type ImageValue = {
  file: File | null;
  previewUrl: string | null;
};

const EMPTY_IMAGE: ImageValue = { file: null, previewUrl: null };

interface ProfileImagePanelProps {
  profileData: UserInterface,
  onClose?: () => void,
  onSave?: (data: { avatar: File | null; cover: File | null }) => Promise<void> | void;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

/** Shared drag state + handlers for a drop zone */
function useDropZone(onFile: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && isImageFile(file)) onFile(file);
    },
    [onFile]
  );

  return { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop };
}

export default function EditProfilePanel({
  profileData,
  onClose,
  onSave,
}: ProfileImagePanelProps) {
  const [avatar, setAvatar] = useState<ImageValue>({
    file: null,
    previewUrl: profileData.profileImg ?? null,
  });
  const [cover, setCover] = useState<ImageValue>({
    file: null,
    previewUrl: profileData.coverImg ?? null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = Boolean(avatar.file || cover.file);

  const {
    mutate: updateProfile
  } = useUpdateProfile({
    onSuccess: (data) => {
      console.log("Profile updated successfully.", data);
      // queryClient.invalidateQueries(["profile", profileData._id]);
    }
  });

  const {
      mutate: uploadImage
  } = useUploadImage({
      onSuccess: (data: any[]) => {
          console.log("Uploaded image to cloudinary.")

          console.log("Upload result:", data)

          const profileImgResult = data[0].status === "fulfilled" ? data[0].value.data : null;
          const coverImgResult = data[1].status === "fulfilled" ? data[1].value.data : null;

          updateProfile({
            profileImg: profileImgResult?.secure_url ?? null,
            coverImg: coverImgResult?.secure_url ?? null
          })
      }
  })


  const handleAvatarFile = useCallback((file: File) => {
    setAvatar({ file, previewUrl: URL.createObjectURL(file) });
    setJustSaved(false);
  }, []);

  const handleCoverFile = useCallback((file: File) => {
    setCover({ file, previewUrl: URL.createObjectURL(file) });
    setJustSaved(false);
  }, []);

  const avatarDrop = useDropZone(handleAvatarFile);
  const coverDrop = useDropZone(handleCoverFile);

  const clearAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatar(EMPTY_IMAGE);
  };

  const clearCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCover(EMPTY_IMAGE);
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      await onSave?.({ avatar: avatar.file, cover: cover.file });
      setJustSaved(true);

      uploadImage([avatar.file!, cover.file!]);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full"      
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    > 
    <div className="w-full max-w-xl rounded-2xl border border-violet-900/50 bg-[#140b28] p-6 shadow-[0_0_0_1px_rgba(139,92,246,0.06),0_20px_50px_-20px_rgba(88,28,135,0.5)] mx-auto my-[15vh]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-violet-50">Profile images</h2>
        <p className="mt-1 text-sm text-violet-300/70">
          Upload a cover image and avatar. Drag and drop or click to browse.
        </p>
      </div>

      {/* Cover + Avatar composite */}
      <div className="relative">
        {/* Cover drop zone */}
        <div
          onClick={() => coverInputRef.current?.click()}
          onDragEnter={coverDrop.onDragEnter}
          onDragLeave={coverDrop.onDragLeave}
          onDragOver={coverDrop.onDragOver}
          onDrop={coverDrop.onDrop}
          className={`group relative flex h-44 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
            coverDrop.isDragging
              ? "border-violet-400 bg-violet-500/10"
              : "border-violet-800/60 bg-violet-950/40 hover:border-violet-600 hover:bg-violet-900/30"
          }`}
        >
          {cover.previewUrl ? (
            <>
              <img
                src={cover.previewUrl}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-lg bg-violet-950/80 px-3 py-1.5 text-xs font-medium text-violet-100">
                  Change cover
                </span>
                <button
                  type="button"
                  onClick={clearCover}
                  aria-label="Remove cover image"
                  className="rounded-lg bg-violet-950/80 p-1.5 text-violet-100 hover:bg-red-900/70 hover:text-red-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <div className="rounded-full bg-violet-800/30 p-2.5">
                <ImagePlus size={20} className="text-violet-300" />
              </div>
              <p className="text-sm font-medium text-violet-200">
                Drop a cover image, or click to browse
              </p>
              <p className="text-xs text-violet-400/70">PNG, JPG up to 10MB — 1200×400 recommended</p>
            </div>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverFile(file);
            e.target.value = "";
          }}
        />

        {/* Avatar drop zone, overlapping the cover */}
        <div className="absolute -bottom-8 left-6">
          <div
            onClick={() => avatarInputRef.current?.click()}
            onDragEnter={avatarDrop.onDragEnter}
            onDragLeave={avatarDrop.onDragLeave}
            onDragOver={avatarDrop.onDragOver}
            onDrop={avatarDrop.onDrop}
            className={`group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-[#140b28] ring-2 transition-all ${
              avatarDrop.isDragging
                ? "ring-violet-400 bg-violet-500/20"
                : "ring-violet-800/60 bg-violet-950/60 hover:ring-violet-600"
            }`}
          >
            {avatar.previewUrl ? (
              <>
                <img
                  src={avatar.previewUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={16} className="text-violet-100" />
                  <button
                    type="button"
                    onClick={clearAvatar}
                    aria-label="Remove avatar image"
                    className="absolute -right-1 -top-1 rounded-full bg-violet-950 p-1 text-violet-200 hover:bg-red-900/80 hover:text-red-200"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </>
            ) : (
              <Camera size={22} className="text-violet-400" />
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Spacer for the overlapping avatar */}
      <div className="h-10" />

      <div className="flex items-center justify-between border-t border-violet-900/50 pt-4">
        <p className="text-xs text-violet-400/70">
          {hasChanges ? "You have unsaved changes." : "No changes yet."}
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !hasChanges || isSaving
              ? "cursor-not-allowed bg-violet-900/40 text-violet-500"
              : "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : justSaved ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </div>
    </div>
  );
}