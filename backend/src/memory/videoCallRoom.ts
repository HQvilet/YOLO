type VideoCallRoom = {
  roomId: string;
  participantsWithState: Map<string, { camera: boolean; microphone: boolean }>;
};

const videoCallRooms: Map<string, VideoCallRoom> = new Map();

export default videoCallRooms;