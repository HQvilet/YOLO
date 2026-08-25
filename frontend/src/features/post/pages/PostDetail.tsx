import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCommentPost, useLikePost, useQueryAllComments, useQueryPostByID, useUnlikePost } from "../hooks/usePostHooks";
import type { Comment, PostInterface } from "../../../shared/types/post.types";
import { useQueryClient } from "@tanstack/react-query";
import { AiFillLike, AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import AvatarImage from "../../../assets/AvatarImage";
import { useQueryAuthUser } from "../../auth/hooks/useAuthUser";
import { IoClose } from "react-icons/io5";


// ---------- Photo Viewer ----------
const PhotoView = ({post}: {post: PostInterface}) => {

  const PHOTOS = [post?.content.img]

  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i === 0 ? PHOTOS.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === PHOTOS.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-black">
      {/* Image */}
      <img
        key={PHOTOS[index]}
        src={PHOTOS[index]}
        alt={`Post photo ${index + 1} of ${PHOTOS.length}`}
        className="h-full w-full object-contain select-none animate-[fadeIn_0.25s_ease-out]"
        draggable={false}
      />

      {/* Prev / Next controls */}
      <button
        onClick={goPrev}
        aria-label="Previous photo"
        className={"group absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-neutral-200 backdrop-blur-sm transition hover:bg-black/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/70" + (index === 0 ? " opacity-50 pointer-events-none" : "")}
        
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goNext}
        aria-label="Next photo"
        className={"group absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-neutral-200 backdrop-blur-sm transition hover:bg-black/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/70" + (index === PHOTOS.length - 1 ? " opacity-50 pointer-events-none" : "")}
        disabled={index === PHOTOS.length - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-neutral-200 backdrop-blur-sm">
        {index + 1} / {PHOTOS.length}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-violet-500" : "w-1.5 bg-neutral-500/70 hover:bg-neutral-300/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ---------- Comment Item ----------
  const CommentItem = ({comment}: {comment: Comment}) => (
    
  <div className="flex gap-3 py-3">
    <AvatarImage src={comment.owner.profileImg} className="size-9 rounded-full ring-1 ring-neutral-800" />
    <div className="min-w-0 flex-1">
      <p className="leading-relaxed text-neutral-200 ">
        <span className="mr-1.5 font-semibold text-base text-neutral-50 hover:underline">{comment.owner.username}</span>
        <span className="text-neutral-500 text-sm">{comment.createdAt.toUTCString()}</span>
      </p>
      <p className="text-neutral-300 ml-1">
        {comment.content}
      </p>
      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
        
        <button className="font-medium hover:text-neutral-300">Reply</button>
      </div>
    </div>
  </div>
);

// ---------- Comment Panel ----------
const CommentPanel = ({ post }: { post: PostInterface }) => {

  const queryClient = useQueryClient();
  const {data: authUser} = useQueryAuthUser()
  const {
    data: comments
  } = useQueryAllComments(post._id)
  
  const {
      mutate: likePost,
  } = useLikePost({
      onSuccess: (data) => {
        queryClient.setQueryData(["post", post._id], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              isAuthUserReacted: "like",
              reactCount: oldData.reactCount + 1
            };
          }
          return oldData;
        });
      }
  })

  const {
      mutate: unlikePost,
  } = useUnlikePost({
      onSuccess: (data) => {
        queryClient.setQueryData(["post", post._id], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              isAuthUserReacted: null,
              reactCount: oldData.reactCount - 1
            };
          }
          return oldData;
        });
      }
  })

   
  const handleLikeOrUnlikePost = () => {
      if(post.isAuthUserReacted === null){
          likePost(post._id)
      } else {
          unlikePost(post._id)
      }
  }

  const [draft, setDraft] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const firstElement = useRef<HTMLDivElement>(null);
  
  const {
    mutate: commentPost,
  } = useCommentPost({
    onSuccess: (data) => {
      setDraft("");
      firstElement.current?.scrollIntoView({behavior: "smooth"})
      queryClient.setQueryData(["post-comment", post._id], (oldData: any) => {
        if (oldData) {
          data.owner = authUser
          return [data, ...oldData];
        }
      });
    }
  })

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;

    commentPost({postID: post._id, comment: text})
  };

  return (
    <div className="chatbox flex h-full w-full flex-col bg-neutral-950">
      {/* Owner header */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={post.creator?.profileImg}
            alt={post.creator?.username}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-400/40"
          />
          <div>
            <p className="text-sm font-semibold text-neutral-50">{post.creator?.username}</p>
            <p className="text-xs text-neutral-500">{post.createdAt?.toUTCString()}</p>
          </div>
        </div>
        <button
          aria-label="More options"
          className="rounded-full p-1.5 text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-200"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Caption */}
      <div className="border-b border-neutral-800 px-5 py-3">
        <p className="text-sm text-neutral-300">
          <span className="mr-1.5 font-semibold text-neutral-50">{post.creator?.username}</span>
          {post.content?.text}
        </p>
      </div>

      <div className={"flex gap-10 p-2 border-b border-neutral-800 px-5 py-3"}>
        <button className={"flex gap-1 " + (post.isAuthUserReacted !== null ? "text-violet-400" : "")}
          onClick={handleLikeOrUnlikePost}
        >
          {!post.isAuthUserReacted ?
            <AiOutlineLike className="size-6"/>
            : 
            <AiFillLike className="size-6"/>
          }
          <span>{post.reactCount}</span>
        </button>
        <button className="flex">
          <AiOutlineComment className="size-6"/>
          {post.commentCount}
        </button>
      </div>

      {/* Comments list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-5 divide-y divide-neutral-900">
        <div ref={firstElement}></div>
        {!comments || comments.length === 0  ? (
          <p className="py-8 text-center text-sm text-neutral-600">No comments yet.</p>
        ) 
        : comments.map((c) => (
          <CommentItem key={c._id} comment={c} />
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-neutral-800 p-3">
        <div className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitComment()}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none"
          />
          <button
            onClick={submitComment}
            disabled={!draft.trim()}
            aria-label="Post comment"
            className="text-violet-500 transition disabled:cursor-not-allowed disabled:text-neutral-700 hover:text-amber-300"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Page ----------
const PostDetail = () => {
  const { postID } = useParams()

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const {
    data: post,
    isSuccess
  } = useQueryPostByID(postID!)
  
  if(!isSuccess || !post){
    return (
      <div className="flex h-screen w-full items-center justify-center text-neutral-500">
        <p>Loading post...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="absolute top-5 left-5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white bg-neutral-800 hover:text-violet-400 rounded-full p-2 transition"
        >
          <IoClose className="size-8" />
        </button>
      </div>
      <div className="mx-auto flex h-full max-w-6xl flex-col md:flex-row">
        {/* Go back to feed */}
        
        <div className="h-[55vh] w-full md:h-full md:w-[62%]">
          <PhotoView post={post}/>
        </div>
        <div className="h-[45vh] w-full border-t border-neutral-800 md:h-full md:w-[38%] md:border-l md:border-t-0">
          <CommentPanel post={post}/>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;