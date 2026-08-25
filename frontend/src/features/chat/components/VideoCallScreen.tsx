import React, { use, useEffect, useMemo, useRef, useState } from 'react'

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  Headphones,
  Settings,
  MonitorUp,
  Users,
  Grid3x3,
  ChevronDown,
  Pin,
  MoreHorizontal,
  Sun,
  Moon,
  Plus,
  Minus,
} from "lucide-react";
import VideoTile from './VideoTile';
import { useSocketStore } from '../store/chatSocketStore';
import type { Conversation } from '../../../shared/types/conversation.types';
import type { UserInterface } from '../../../shared/types/user.types';
import { useQueryAuthUser } from '../../auth/hooks/useAuthUser';

// ---- Types ------------------------------------------------------------
// id - stream
// id - state
// id - peerconnection

interface UserStreamWithState {
  participantId: string;
  stream: MediaStream;
  micOn: boolean;
  cameraOn: boolean;
}

interface ControlButtonProps {
  active: boolean;
  onClick: () => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  offColor: string;
}

// Tracks viewport width so the grid can recompute its column count live
function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

// Chooses a near-square column count, capped by how much horizontal room we have
function getGridColumns(count: number, width: number): number {
  const maxColsForWidth = width < 560 ? 1 : width < 800 ? 2 : width < 1180 ? 3 : 4;
  const ideal = Math.ceil(Math.sqrt(count));
  return Math.max(1, Math.min(ideal, maxColsForWidth, count));
}

function ControlButton({ active, onClick, onIcon, offIcon, offColor }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 sm:p-3 rounded-full transition-colors ${
        active
          ? "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-[#404249] dark:hover:bg-[#4a4d54] dark:text-gray-200"
          : `${offColor} text-white`
      }`}
    >
      {active ? onIcon : offIcon}
    </button>
  );
}
const peerConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};
function VideoCallScreen({ roomId, conversation, isMicrophoneOn = true, isCameraOn = true, onClose }: { roomId: string, conversation: Conversation | undefined, isMicrophoneOn: boolean, isCameraOn: boolean, onClose: () => void }) {
  // const videoRef = useRef<HTMLVideoElement | null>(null);
  const {data: authUser} = useQueryAuthUser()
  const socket = useSocketStore((state) => state.socket);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection | null> | null | undefined>(null)
  const peerConnections = useRef<Map<string, RTCPeerConnection | null> | null | undefined>(new Map());
  const userMapping = useMemo(() => {
    const map = new Map<string, UserInterface>();
    conversation?.participants.forEach((p) => {
      map.set(p.userID._id, p.userID);
    });
    return map;
  }, [conversation]);

  const [userStreams, setUserStreams] = useState<UserStreamWithState[]>([]);
  const participantCount = userStreams.length;

  // Hàm khởi tạo RTCPeerConnection chuẩn
  const createPeerConnection = (userId: string) => {
    const pc = new RTCPeerConnection(peerConfiguration);
    console.log('Tạo RTCPeerConnection mới cho userId:', userId);
    // Thêm các luồng âm thanh/hình ảnh local vào kết nối P2P
    if (localStreamRef.current) {
      console.log("Them cac luong vao ket noi P2P ", localStreamRef.current.getTracks())
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Ensure we have transceivers for both audio and video to allow toggling/receiving them later
    const transceivers = pc.getTransceivers();
    const hasAudio = transceivers.some(
      (t) => t.sender.track?.kind === 'audio' || t.receiver.track?.kind === 'audio'
    );
    const hasVideo = transceivers.some(
      (t) => t.sender.track?.kind === 'video' || t.receiver.track?.kind === 'video'
    );
    
    if (!hasAudio) {
      console.log("No audio transceiver found, adding audio transceiver");
      const init: RTCRtpTransceiverInit = { direction: 'sendrecv' };
      if (localStreamRef.current) {
        init.streams = [localStreamRef.current];
      }
      pc.addTransceiver('audio', init);
    }
    if (!hasVideo) {
      console.log("No video transceiver found, adding video transceiver");
      const init: RTCRtpTransceiverInit = { direction: 'sendrecv' };
      if (localStreamRef.current) {
        init.streams = [localStreamRef.current];
      }
      pc.addTransceiver('video', init);
    }

    // Nhận luồng video từ Peer đối phương và hiển thị lên UI
    pc.ontrack = (event) => {
      console.log("Nhan luong media tu ket noi", event.track.kind);

      setUserStreams((prevMapping) => { 
        // Kiểm tra xem luồng đã tồn tại chưa
        const existingIndex = prevMapping.findIndex(
          (userStream) => userStream.participantId === userId
        );

        let streamToUse = event.streams[0];
        if (!streamToUse) {
          console.log("No stream associated with track, using fallback");
          if (existingIndex !== -1 && prevMapping[existingIndex].stream) {
            streamToUse = prevMapping[existingIndex].stream;
          } else {
            streamToUse = new MediaStream();
          }
          streamToUse.addTrack(event.track);
        }

        if (existingIndex !== -1) {
          // Nếu đã tồn tại, cập nhật luồng video
          const prevStream = prevMapping[existingIndex];
          const updatedStreams = [...prevMapping];
          updatedStreams[existingIndex] = {
            ...prevStream,
            stream: streamToUse,
          };
          return updatedStreams;
        }

        // Nếu chưa tồn tại, thêm mới
        return [...prevMapping, {
          participantId: userId,
          stream: streamToUse,
          micOn: true,
          cameraOn: true,
        }];
      });

    };

    // Khi tìm thấy ICE Candidate -> Gửi cho đối phương qua Signaling Server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
          recipientId: userId
        });
      }
    };
    
    // setPeerConnections(prev => {
    //   const map = new Map([...(prev?.entries() ?? []), [userId, pc]])
    //   map.set(userId, pc);
    //   return map
    // })
    peerConnections.current?.set(userId, pc);
    peerConnectionRef.current = pc;
    return pc;
  };
  
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(mediaStream);
        localStreamRef.current = mediaStream;
        setUserStreams((prevMapping) => [...prevMapping, {
          participantId: authUser?._id ?? 'local',
          stream: mediaStream,
          micOn: true,
          cameraOn: true,
        }]);

        socket?.emit('join-room', { roomId, streamState: { camera: true, microphone: true } });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    getLocalStream();

    return () => {
      
    }
    
  }, [roomId]);

  const changeStreamState = (userId: string, streamState: any) => {
    setUserStreams((prevStreams) => {
        return prevStreams.map((userStream) => {
          if (userStream.participantId === userId) {
            return { 
              ...userStream, 
              micOn: streamState.microphone, 
              cameraOn: streamState.camera,
            };
          }
          return userStream;
        });
      });
  }

  const setupSocketListeners = () => {
    socket?.on('user-left', ({userId}) => {
      console.log(`User ${userMapping.get(userId)?.username} left the room.`)
      setUserStreams(prev => prev.filter(userStream => userStream.participantId !== userId))
    });

    socket?.on('existing-users', async ({ participants }: {participants: {participantId: string, microphone: boolean, camera: boolean}[]}) => {
      console.log("Participants :", participants)
      
      setUserStreams((prev) => {
        return participants.map(user => {
          return ({
            participantId: user.participantId,
            cameraOn: user.camera,
            micOn: user.microphone,
            stream: prev.find(p => p.participantId === user.participantId)?.stream ?? new MediaStream()
          });
        })
      })
      socket.removeAllListeners('existing-users')
    });

    socket?.on('user-change-stream-state', ({ userId, streamState }) => {
      console.log(`User ${userId} changed stream state:`, streamState);
      changeStreamState(userId, streamState)
    });

    // --- KỊCH BẢN NGUỜI GỌI (CALLER - Người ở trong phòng trước) ---
    socket?.on('user-joined', async ( {userId, socketId} ) => {
      console.log('Có người tham gia phòng, bắt đầu gửi Offer...');
      const pc = createPeerConnection(userId);

      // Tạo Offer và cài đặt Local Description
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Gửi Offer tới đối phương qua Signaling Server
      socket.emit('offer', { roomId, offer, recipientId: userId });
    });

    // --- KỊCH BẢN NGƯỜI NHẬN (CALLEE - Người vào phòng sau) ---
    socket?.on('offer', async ({offer, senderId}) => {
      console.log('Nhận được Offer, đang phản hồi Answer...');
      const pc = createPeerConnection(senderId);

      // Lưu Offer của đối phương làm Remote Description
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Tạo Answer phản hồi và lưu làm Local Description
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Gửi Answer lại cho đối phương
      socket.emit('answer', { answer, roomId, recipientId: senderId });
    });

    // Nhận Answer từ người nhận (Dành cho Caller)
    socket?.on('answer', async ({answer, senderId, recipientId}) => {
      console.log('Nhận được Answer, hoàn tất Handshake!');
      const pc = peerConnections.current?.get(senderId); 
      // if (pc) {
      //   await pc.setRemoteDescription(new RTCSessionDescription(answer));
      // }
      if(!pc){
        return;
      }

      if (pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } 
    });

    // Nhận thông tin ICE Candidate từ đối phương
    socket?.on('ice-candidate', async ({candidate, senderId}) => {
      console.log('Nhận được ICE Candidate:');
      const pc = peerConnections.current?.get(senderId);
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    
  };

  const leaveRoom = () => {
    socket?.emit("leave-room", { roomId });
    
    // clean socket beffore leaving
    socket?.removeAllListeners("user-left")
    // socket?.removeAllListeners("existing-users")
    socket?.removeAllListeners("user-change-stream-state")
    socket?.removeAllListeners("user-joined")
    socket?.removeAllListeners("offer")
    socket?.removeAllListeners("answer")
    socket?.removeAllListeners("ice-candidate")
    
    peerConnectionRef.current?.close();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  }
  
  // Cleanup tracks on component unmount
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      // Logic bạn muốn chạy khi người dùng refresh hoặc đóng tab
      // event.preventDefault();
      leaveRoom()
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    setupSocketListeners();

    return () => {
      console.log('Cleaning up: closing peer connection and stopping local tracks');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      leaveRoom()
    };
  }, []);
  

  const [micOn, setMicOn] = useState<boolean>(isMicrophoneOn);
  const [cameraOn, setCameraOn] = useState<boolean>(isCameraOn);
  const [deafened, setDeafened] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [layout, setLayout] = useState<"grid" | "speaker">("grid");
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const width = useWindowWidth();
  const cols = getGridColumns(participantCount, width);
  
  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      // Toggle track status (false = muted/silence, true = active)
      audioTrack.enabled = !micOn;
      setMicOn(prev => !prev);
      changeStreamState(authUser?._id ?? "", {microphone: !micOn, camera: cameraOn})
      socket?.emit('user-change-stream-state', { roomId, streamState: { microphone: !micOn } });
    }

  };

  const toggleCam = async () => {
    const stream = localStreamRef.current;
    const pc = peerConnectionRef.current;
    if (!stream) return;
    
    // Find the video sender inside the RTCPeerConnection
    const videoTransceiver = pc?.getTransceivers().find(
      (transceiver) => {
        return transceiver.sender.track?.kind === 'video' || 
        transceiver.receiver.track?.kind === 'video';
      }
    );
    if (!cameraOn) {
      // --- TURN CAMERA BACK ON ---
      try {
        // Fetch a fresh camera track
        const newMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newVideoTrack = newMediaStream.getVideoTracks()[0];
        console.log('Re-enabled camera track:', newVideoTrack);

        // Add back to local stream
        stream.addTrack(newVideoTrack);
        
        // Swap the track on the WebRTC connection without renegotiation
        if (videoTransceiver) {
          await videoTransceiver.sender.replaceTrack(newVideoTrack);
        }
        setCameraOn(true);
      } catch (err) {
        console.error('Failed to re-enable camera:', err);
      }
    } else {
      // --- TURN CAMERA OFF ---
      const videoTrack = stream.getVideoTracks()[0];

      if (videoTrack) {
        console.log('Stopping camera track:', videoTrack);
        // 1. Tell WebRTC sender to send nothing (black frames/no media)
        if (videoTransceiver) {
          await videoTransceiver.sender.replaceTrack(null);
        }

        // 2. Stop camera hardware (turns off physical camera LED light)
        videoTrack.stop();

        // 3. Unbind track from local stream object
        stream.removeTrack(videoTrack);

        setCameraOn(false);
      }
    }
    // setUserStreams((prevMapping) => [...prevMapping]);
    changeStreamState(authUser?._id ?? "", {microphone: micOn, camera: !cameraOn})
    // setCamOn((prev) => !prev);
    socket?.emit('user-change-stream-state', { roomId, streamState: { camera: !cameraOn } });
  };

  return (
    <div className={`${darkMode ? "dark" : ""} w-full h-full flex items-center justify-center`}>
      <div className="w-[80vw] h-[90vh] min-h-[560px] bg-white dark:bg-[#313338] text-gray-900 dark:text-gray-100 flex flex-col font-sans select-none transition-colors">
        {/* Top bar */}
        <div className="h-auto min-h-12 shrink-0 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-black/10 dark:border-black/25 bg-gray-50 dark:bg-[#2b2d31]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#404249] flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm shrink-0">
              #
            </div>
            <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">general-voice</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs hidden sm:inline">
              {participantCount} in call
            </span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {/* participant count stepper (demo control) */}
            <div className="flex items-center gap-1 bg-gray-200 dark:bg-[#404249] rounded-md px-1 py-1 mr-1">
              <button
                className="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#4a4d54] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove participant"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-medium w-5 text-center text-gray-700 dark:text-gray-200">
                {participantCount}
              </span>
              <button
                className="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#4a4d54] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Add participant"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => setDarkMode((v) => !v)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#404249] hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setLayout(layout === "grid" ? "speaker" : "grid")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#404249] hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
              title="Toggle layout"
            >
              <Grid3x3 size={16} />
              <span className="hidden md:inline">{layout === "grid" ? "Grid" : "Speaker"}</span>
              <ChevronDown size={14} />
            </button>
            <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#404249] hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:inline-flex">
              <Users size={18} />
            </button>
            <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#404249] hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:inline-flex">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 min-h-0 p-2 sm:p-3 overflow-hidden">
          {layout === "grid" ? (
            <div
              className={`w-full h-full overflow-y-hidden px-8 py-4 flex flex-row flex-wrap justify-center ${participantCount > 2 ? "items-start" : "items-center"} gap-2`}
            >
              {userStreams.map((userStream) => (
                <VideoTile
                  key={userStream.participantId}
                  participant={userMapping.get(userStream.participantId)}
                  isSpeaking={false}
                  micOn={userStream.micOn}   
                  cameraOn={userStream.cameraOn}
                  mediaStream={userStream.stream}
                  self={userStream.participantId === authUser?._id}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-2 sm:gap-3">
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="w-full max-h-full" style={{ maxWidth: "calc((100vh - 220px) * 16 / 9)" }}>
                  {/* <VideoTile
                    participant={speaker}
                    isSpeaking={!speaker.muted}
                    muted={speaker.muted}
                    cameraOn={speaker.video}
                    mediaStream={localStream}
                  /> */}
                </div>
              </div>
              <div className="h-20 sm:h-24 md:h-28 shrink-0 flex gap-2 sm:gap-3 overflow-x-auto">
                {/* {others.map((p) => (
                  <div key={p.id} className="w-28 sm:w-36 shrink-0">
                    <VideoTile
                      participant={p}
                      isSpeaking={p.id === activeSpeakerId && !p.muted}
                      muted={p.muted}
                      cameraOn={p.video}
                      mediaStream={localStream}
                    />
                  </div>
                ))} */}
              </div>
            </div>
          )}
        </div>

        {/* Screen share banner */}
        {sharing && (
          <div className="mx-2 sm:mx-3 mb-2 flex items-center justify-between bg-blue-50 dark:bg-[#3b82f6]/15 border border-blue-200 dark:border-[#3b82f6]/40 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
              <MonitorUp size={16} />
              <span className="hidden xs:inline">You are sharing your screen</span>
            </div>
            <button
              onClick={() => setSharing(false)}
              className="text-xs font-medium px-2 py-1 rounded bg-red-500/90 hover:bg-red-500 text-white transition-colors"
            >
              Stop sharing
            </button>
          </div>
        )}

        {/* Bottom control bar */}
        <div className="shrink-0 bg-gray-50 dark:bg-[#232428] border-t border-black/10 dark:border-black/25 px-2 sm:px-3 py-2 sm:py-2.5 flex items-center justify-between">
          {/* left: user chip */}
          <div className="hidden sm:flex items-center gap-2 min-w-0 w-32 md:w-40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-xs font-semibold shrink-0 text-white">
              Y
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">you</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">Voice connected</p>
            </div>
          </div>

          {/* center: main controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto">
            <ControlButton
              active={micOn}
              onClick={() => toggleMic()}
              onIcon={<Mic size={19} />}
              offIcon={<MicOff size={19} />}
              offColor="bg-red-500 hover:bg-red-500/90"
            />
            <ControlButton
              active={cameraOn}
              onClick={() => toggleCam()}
              onIcon={<Video size={19} />}
              offIcon={<VideoOff size={19} />}
              offColor="bg-red-500 hover:bg-red-500/90"
            />
            <ControlButton
              active={!deafened}
              onClick={() => setDeafened((v) => !v)}
              onIcon={<Headphones size={19} />}
              offIcon={<Headphones size={19} />}
              offColor="bg-red-500 hover:bg-red-500/90"
            />
            <button
              onClick={() => setSharing((v) => !v)}
              className={`p-2.5 sm:p-3 rounded-full transition-colors ${
                sharing
                  ? "bg-blue-500 hover:bg-blue-500/90 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-[#404249] dark:hover:bg-[#4a4d54] dark:text-gray-200"
              }`}
              title="Share screen"
            >
              <ScreenShare size={19} />
            </button>

            <button
              className="p-2.5 sm:p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors ml-1"
              title="Leave call"
              onClick={() => {
                // leaveRoom()
                onClose()
              }}
            >
              <PhoneOff size={19} />
            </button>
          </div>

          {/* right spacer to balance flex */}
          <div className="hidden sm:block w-32 md:w-40" />
        </div>
      </div>
    </div>
  );
}

export default VideoCallScreen