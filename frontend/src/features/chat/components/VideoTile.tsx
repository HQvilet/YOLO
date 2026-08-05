import { Mic, MicOff, MoreHorizontal, Pin } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import type { UserInterface } from '../../../shared/types/user.types';

interface VideoTileProps {
  mediaStream: MediaStream | null | undefined;
  participant: UserInterface | null | undefined;
  isSpeaking: boolean;
  micOn: boolean;
  cameraOn: boolean;
  self: boolean;
}

function VideoTile({mediaStream, participant, isSpeaking, micOn, cameraOn, self }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  mediaStream?.getAudioTracks().forEach(track => {
    
  }); 
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream ?? null;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [mediaStream, cameraOn]);


  if(!participant) {
    return (
      <div className={`group relative w-full aspect-video rounded-xl overflow-hidden max-w-full bg-gray-100 dark:bg-[#1e1f22] ring-2 transform-gpu transition-all duration-200 ease-out hover:scale-[1.03] hover:z-10 hover:shadow-2xl ${isSpeaking ? "ring-emerald-400/80" : "ring-transparent"}`}>

      </div>
    );
  }

  return (
    <div
      className={`md:basis-[32%] basis-[49%] sm:flex-1 group relative w-full aspect-video rounded-xl overflow-hidden max-w-full bg-gray-100 dark:bg-[#1e1f22] ring-2 transform-gpu transition-all duration-200 ease-out hover:scale-[1.03] hover:z-10 hover:shadow-2xl ${
        isSpeaking ? "ring-emerald-400/80" : "ring-transparent"
      }`}
    >
      {/* Video surface (fixed 16:9 to match the tile) */}
      {cameraOn ? (
        // <div
        //   className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${participant.color} relative overflow-hidden`}
        // >
        //   <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,#fff_0%,transparent_60%)]" />
        //   <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,#000_0px,transparent_1px,transparent_2px)]" />
        //   <span className="text-white/90 font-semibold text-xl sm:text-2xl drop-shadow-lg select-none">
        //     {participant.initials}
        //   </span>
        // </div>
        <>
          <video ref={videoRef} autoPlay muted={self} playsInline className="w-full h-full object-contain scale-x-[-1]"/>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1e1f22]">
          <div className={`flex items-center justify-center rounded-full bg-green-400 bg-gradient-to-br shadow-lg w-12 h-12 sm:w-16 sm:h-16`}>
            <span className="text-white font-semibold select-none text-base sm:text-xl">
              {participant.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* top-right hover actions */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button className="p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-gray-200">
          <Pin size={13} />
        </button>
        <button className="p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-gray-200">
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* bottom name pill */}
      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm rounded-md px-1.5 py-1 max-w-[calc(100%-0.75rem)]">
        {!micOn ? (
          <MicOff size={12} className="text-red-400 shrink-0" />
        ) : (
          <Mic size={12} className={`shrink-0 ${isSpeaking ? "text-emerald-400" : "text-gray-300"}`} />
        )}
        <span className="text-[11px] sm:text-xs font-medium text-gray-100 truncate">
          {participant.username}
          {self && <span className="text-gray-400"> (you)</span>}
        </span>
      </div>
    </div>
  );
}

export default VideoTile