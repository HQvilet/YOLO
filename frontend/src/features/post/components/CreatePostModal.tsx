import React, { useState } from 'react'
import { FaImages } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { asyncReadFileData, useUploadImage } from '../../../shared/hooks/handleUploadImage';
import type { PostContent } from '../../../shared/types/post.types';
import { useQueryAuthUser } from '../../auth/hooks/useAuthUser';
import { useUploadPost } from '../hooks/usePostHooks';

const CreatePostModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [postTextContent, setPostTextContent] = useState("");
  const [imageContent, setImageContent] = useState<string[]>([]);

  const [hasFileDragOver, setFileDragOver] = useState(false)

  const {data: authUser} = useQueryAuthUser()

  const handleFileDrop = async (files: FileList) => {
    const arrayFiles = [...files].filter(file => file.type.startsWith("image/"))
    const data: any[] = await Promise.all(arrayFiles.map(file => asyncReadFileData(file)))
    setImageContent(data.map(imgFile => imgFile.content))
  }

  const {
    mutate: createPost
  } = useUploadPost()

  const {
    mutate: uploadImage
  } = useUploadImage({
    onSuccess: (data: any[]) => {
      setImageContent(data.map(img => img.data.secure_url))
      createPost({
        textContent: postTextContent,
        imgContent: imageContent[0],
      })
    }
  })

  const handleUploadPost = async () => {
    uploadImage([imageContent[0]])
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className=" rounded-lg w-full max-w-[500px] bg-zinc-900 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center py-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Tạo bài viết</h2>
          <button
            onClick={onClose}
            className="absolute right-3 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <IoClose className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 pt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
            <img
              src={authUser?.profileImg}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Hồ Quốc Việt</p>
            <button className="flex items-center gap-1 bg-white/10 rounded px-2 py-0.5 text-xs text-muted-foreground mt-0.5 hover:bg-muted transition-colors">
              <FaImages className="w-3 h-3" />
              <span>Công khai</span>
              <FaImages className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className={`chatbox relative px-4 pt-3 pb-2 my-1 ${hasFileDragOver && ""}`}
          onDragOver={(e) => {
              if(e.dataTransfer.files && !hasFileDragOver){
                setFileDragOver(true)
              }
          }}
          onDragLeave={(e) => {
            setFileDragOver(false)
          }}
          onDrop={(e) => {
              e.preventDefault();
              setFileDragOver(false)
              if(hasFileDragOver)
                handleFileDrop(e.dataTransfer.files)
          }}
        >
          <textarea
            value={postTextContent}
            onChange={(e) => setPostTextContent(e.target.value)}
            placeholder="Quốc Việt ơi, bạn đang nghĩ gì thế?"
            className="w-full bg-transparent text-foreground text-2xl placeholder:text-muted-foreground resize-none outline-none min-h-[120px] p-1"
          />
          {hasFileDragOver && <div className='absolute flex items-center inset-0 z-10 border-2 border-violet-500 border-dashed rounded-lg bg-black/70 pointer-events-none'>
              <div className='mx-auto my-auto text-3xl text-white font-bold'>
                <h2>Drop Files Here</h2>
              </div>
          </div>}
        </div>
        <div className='p-2 mx-auto'>
          <div className='flex gap-2 mx-auto justify-center'>
            {imageContent.map((img, i) => ( i < 4 &&
              <div className='size-32 hover:border-2 hover:border-green-700 hover:scale-[1.05] rounded-md overflow-hidden'>
                <img
                  src={img}
                  className='size-full object-cover'/>
              </div>
            ))}
          </div>
        </div>

        {/* Color/font & emoji row */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 via-yellow-400 to-green-500 flex items-center justify-center cursor-pointer">
            <span className="text-primary-foreground font-bold text-sm">Aa</span>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
            <FaImages className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Add to post bar */}
        <div className="mx-4 mb-3 border border-border rounded-lg flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-foreground">Thêm vào bài viết của bạn</span>
          <div className="flex items-center gap-2">
            <button className="hover:bg-secondary p-1.5 rounded-full transition-colors">
              <FaImages className="w-6 h-6 text-[hsl(var(--fb-green))]" />
            </button>
            <button className="hover:bg-secondary p-1.5 rounded-full transition-colors">
              <FaImages className="w-6 h-6 text-[hsl(var(--primary))]" />
            </button>
            <button className="hover:bg-secondary p-1.5 rounded-full transition-colors">
              <FaImages className="w-6 h-6 text-[hsl(var(--fb-yellow))]" />
            </button>
            <button className="hover:bg-secondary p-1.5 rounded-full transition-colors">
              <FaImages className="w-6 h-6 text-[hsl(var(--fb-red))]" />
            </button>
            <button className="hover:bg-secondary p-1.5 rounded-full transition-colors">
              <span className="font-bold text-xs text-[hsl(var(--fb-green))]">GIF</span>
            </button>
            <button className="hover:bg-secondary p-1.5 rounded-full transition-colors">
              <FaImages className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Post button */}
        <div className="px-4 pb-4">
          <button
            disabled={!postTextContent.trim()}
            className="w-full py-2 rounded-lg font-semibold text-sm transition-colors disabled:bg-zinc-600 disabled:text-gray-500 bg-violet-500 text-violet-900 hover:bg-primary/90"
            onClick={() => {
              handleUploadPost()
            }}
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal