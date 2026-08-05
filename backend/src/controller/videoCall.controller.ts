import videoCallRooms from "../memory/videoCallRoom.ts";
import { io } from "../socket/socket.ts";

const joinVideoCallRoom = async (roomId: string, userId: string) => {
    io.to(roomId).emit('user-joined', { userId });
}

const leaveVideoCallRoom = async (roomId: string, userId: string) => {
    io.to(roomId).emit('user-left', { userId });
}