import React, { useEffect, useMemo, useRef, useState } from 'react'

const ChatCallVideoStreaming = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  

  // 1. Request access to Camera and Microphone
  const startMedia = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // Set to false if you only need the camera
      });

      setStream(mediaStream);

      // Attach stream to the <video> element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Permission denied or device not available.");
    }
  };

  

  // 2. Stop camera/mic tracks
  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // 3. Capture a Photo Snapshot from the video stream
  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    // Create a hidden canvas element matching video dimensions
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get Data URL (base64 image)
    const imageDataUrl = canvas.toDataURL('image/png');
    setPhoto(imageDataUrl);
  };

  // Cleanup tracks on component unmount
    useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    // <div className='p-4 relative top-[10vh]'>
    //   <h2 className=''>Camera & Microphone Access</h2>

    //   {error && <p className='text-red-500'>{error}</p>}

    //   <div className='mb-4 text-white'>
    //     <button className='text-blue-500' onClick={startMedia}>Start Camera & Mic</button>
    //     {!stream ? (
    //       <button onClick={startMedia}>Start Camera & Mic</button>
    //     ) : (
    //       <>
    //         <button onClick={stopMedia}>Stop Media</button>
    //         <button onClick={takeSnapshot} className='ml-2'>
    //           Take Photo
    //         </button>
    //       </>
    //     )}
    //   </div>

    //   <div>
    //     {/* Video preview element */}
    //     <video
    //       ref={videoRef}
    //       autoPlay
    //       playsInline
    //       muted // Mute locally to prevent feedback loop audio
    //       className='w-[400px] bg-black rounded-lg scale-x-[-1]'
    //     />
    //   </div>

    //   {photo && (
    //     <div className='mt-5'>
    //       <h3>Captured Photo:</h3>
    //       <img src={photo} alt="Snapshot" className='w-[200px]' />
    //     </div>
    //   )}
    // </div>
    <DiscordCallScreen />
  );

}


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

// ---- Types ------------------------------------------------------------

interface Participant {
  id: number;
  name: string;
  color: string;
  muted: boolean;
  video: boolean;
  initials: string;
  self?: boolean;
}

interface VideoTileProps {
  participant: Participant;
  isSpeaking: boolean;
  muted: boolean;
  cameraOn: boolean;
}

interface ControlButtonProps {
  active: boolean;
  onClick: () => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  offColor: string;
}

// ---- Mock participant pool (up to 9) -----------------------------------

const POOL: Participant[] = [
  { id: 1, name: "Wick", color: "from-indigo-500 to-purple-600", muted: false, video: true, initials: "W" },
  { id: 2, name: "sable_", color: "from-emerald-500 to-teal-600", muted: true, video: false, initials: "S" },
  { id: 3, name: "nova.exe", color: "from-rose-500 to-pink-600", muted: false, video: true, initials: "N" },
  { id: 4, name: "birdcage", color: "from-amber-500 to-orange-600", muted: false, video: false, initials: "B" },
  { id: 5, name: "kessler", color: "from-sky-500 to-blue-600", muted: true, video: true, initials: "K" },
  { id: 6, name: "glitch__", color: "from-lime-500 to-green-600", muted: false, video: false, initials: "G" },
  { id: 7, name: "vantablack", color: "from-slate-500 to-gray-700", muted: true, video: true, initials: "V" },
  { id: 8, name: "ph03nix", color: "from-red-500 to-rose-700", muted: false, video: true, initials: "P" },
  { id: 9, name: "you", color: "from-fuchsia-500 to-violet-600", muted: false, video: true, initials: "Y", self: true },
];

const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 9;

// Fake moving "speaking" pulse to bring the UI to life
// function useSpeakingSimulation(ids: number[]): number {
//   const [speakerId, setSpeakerId] = useState<number>(ids[0]);
//   useEffect(() => {
//     setSpeakerId(ids[Math.floor(Math.random() * ids.length)]);
//     const t = setInterval(() => {
//       setSpeakerId(ids[Math.floor(Math.random() * ids.length)]);
//     }, 2600);
//     return () => clearInterval(t);
//   }, [ids]);
//   return speakerId;
// }

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

function VideoTile({ participant, isSpeaking, muted, cameraOn }: VideoTileProps) {
  return (
    <div
      className={`group relative w-full aspect-video rounded-xl overflow-hidden max-w-full bg-gray-100 dark:bg-[#1e1f22] ring-2 transform-gpu transition-all duration-200 ease-out hover:scale-[1.03] hover:z-10 hover:shadow-2xl ${
        isSpeaking ? "ring-emerald-400/80" : "ring-transparent"
      }`}
    >
      {/* Video surface (fixed 16:9 to match the tile) */}
      {cameraOn ? (
        <div
          className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${participant.color} relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,#fff_0%,transparent_60%)]" />
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,#000_0px,transparent_1px,transparent_2px)]" />
          <span className="text-white/90 font-semibold text-xl sm:text-2xl drop-shadow-lg select-none">
            {participant.initials}
          </span>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1e1f22]">
          <div className={`flex items-center justify-center rounded-full bg-gradient-to-br ${participant.color} shadow-lg w-12 h-12 sm:w-16 sm:h-16`}>
            <span className="text-white font-semibold select-none text-base sm:text-xl">
              {participant.initials}
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
        {muted ? (
          <MicOff size={12} className="text-red-400 shrink-0" />
        ) : (
          <Mic size={12} className={`shrink-0 ${isSpeaking ? "text-emerald-400" : "text-gray-300"}`} />
        )}
        <span className="text-[11px] sm:text-xs font-medium text-gray-100 truncate">
          {participant.name}
          {participant.self && <span className="text-gray-400"> (you)</span>}
        </span>
      </div>
    </div>
  );
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

function DiscordCallScreen() {
  const [micOn, setMicOn] = useState<boolean>(true);
  const [camOn, setCamOn] = useState<boolean>(true);
  const [deafened, setDeafened] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [layout, setLayout] = useState<"grid" | "speaker">("grid");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [participantCount, setParticipantCount] = useState<number>(6);

  const width = useWindowWidth();

  // Always keep "you" in the visible set, filled out with others from the pool
  const activePool = useMemo(() => {
    const self = POOL.find((p) => p.self)!;
    const rest = POOL.filter((p) => !p.self).slice(0, participantCount - 1);
    return [...rest, self];
  }, [participantCount]);

  const ids = activePool.map((p) => p.id);
  const activeSpeakerId = 1;

  const participantsWithState: Participant[] = activePool.map((p) => ({
    ...p,
    muted: p.self ? !micOn : p.muted,
    video: p.self ? camOn : p.video,
  }));

  const speaker =
    participantsWithState.find((p) => p.id === activeSpeakerId) ?? participantsWithState[0];
  const others = participantsWithState.filter((p) => p.id !== speaker.id);

  const cols = getGridColumns(participantsWithState.length, width);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="p-20 w-full h-screen min-h-[560px] bg-white dark:bg-[#313338] text-gray-900 dark:text-gray-100 flex flex-col font-sans select-none transition-colors">
        {/* Top bar */}
        <div className="h-auto min-h-12 shrink-0 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-black/10 dark:border-black/25 bg-gray-50 dark:bg-[#2b2d31]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#404249] flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm shrink-0">
              #
            </div>
            <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">general-voice</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs hidden sm:inline">
              {participantsWithState.length} in call
            </span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {/* participant count stepper (demo control) */}
            <div className="flex items-center gap-1 bg-gray-200 dark:bg-[#404249] rounded-md px-1 py-1 mr-1">
              <button
                onClick={() => setParticipantCount((c) => Math.max(MIN_PARTICIPANTS, c - 1))}
                disabled={participantCount <= MIN_PARTICIPANTS}
                className="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#4a4d54] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove participant"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-medium w-5 text-center text-gray-700 dark:text-gray-200">
                {participantCount}
              </span>
              <button
                onClick={() => setParticipantCount((c) => Math.min(MAX_PARTICIPANTS, c + 1))}
                disabled={participantCount >= MAX_PARTICIPANTS}
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
              className="w-full h-full overflow-y-auto"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridAutoRows: "max-content",
                alignContent: "center",
                gap: "0.5rem",
              }}
            >
              {participantsWithState.map((p) => (
                <VideoTile
                  key={p.id}
                  participant={p}
                  isSpeaking={p.id === activeSpeakerId && !p.muted}
                  muted={p.muted}
                  cameraOn={p.video}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-2 sm:gap-3">
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="w-full max-h-full" style={{ maxWidth: "calc((100vh - 220px) * 16 / 9)" }}>
                  <VideoTile
                    participant={speaker}
                    isSpeaking={!speaker.muted}
                    muted={speaker.muted}
                    cameraOn={speaker.video}
                  />
                </div>
              </div>
              <div className="h-20 sm:h-24 md:h-28 shrink-0 flex gap-2 sm:gap-3 overflow-x-auto">
                {others.map((p) => (
                  <div key={p.id} className="w-28 sm:w-36 shrink-0">
                    <VideoTile
                      participant={p}
                      isSpeaking={p.id === activeSpeakerId && !p.muted}
                      muted={p.muted}
                      cameraOn={p.video}
                    />
                  </div>
                ))}
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
              onClick={() => setMicOn((v) => !v)}
              onIcon={<Mic size={19} />}
              offIcon={<MicOff size={19} />}
              offColor="bg-red-500 hover:bg-red-500/90"
            />
            <ControlButton
              active={camOn}
              onClick={() => setCamOn((v) => !v)}
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

export default ChatCallVideoStreaming