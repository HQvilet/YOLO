import type { Socket } from "socket.io";
import videoCallRooms from "../../memory/videoCallRoom.ts";
import type { DefaultEventsMap } from "socket.io";
import { io } from "../socket.ts";

export function setUpVideoCallEventListeners(socket: Socket){

  //----------WebRTC signaling events-----------
  // User joins a room
  socket.on('join-room', ({roomId, streamState}: {roomId: string; streamState?: {camera: boolean; microphone: boolean}}) => { 
    try{
      const userJoined = () => {
        console.log(`User ${socket.user.username} joined ${roomId}`)
        // socket.join(roomId);
        const existingUsers = videoCallRooms.get(roomId)?.participantsWithState;
        const users = Array.from(existingUsers?.entries() ?? []).map(
          ([k, v]) => ({participantId: k, camera: v.camera, microphone: v.microphone})
        )

        socket.to(roomId).emit('user-joined', { userId: socket.user._id.toString(), roomId });
        io.to(roomId).emit('existing-users', { participants: users, roomId });
      }

      let room = videoCallRooms.get(roomId);
      if(!room){
        room = {
            participantsWithState: new Map([[socket.user._id, streamState ?? { camera: true, microphone: true }]]), 
            roomId
          }
        videoCallRooms.set(
          roomId, room
        );
        userJoined()
        return;
      }

      if(room.participantsWithState.has(socket.user._id)){
        console.log(`User ${socket.user.username} already in room.`)
        return;
      }
      
      if(videoCallRooms.has(roomId)){
        if(!videoCallRooms.get(roomId)?.participantsWithState.has(socket.user._id)){
          videoCallRooms.get(roomId)?.participantsWithState.set(socket.user._id, streamState ?? { camera: true, microphone: true });
          userJoined()
        }
      }else{
        videoCallRooms.set(
          roomId, {
            participantsWithState: new Map([[socket.user._id, streamState ?? { camera: true, microphone: true }]]), 
            roomId
          }
        );
        userJoined()
      } 
    } catch(err){
      console.log("Error joining room:", err)
      io.to(socket.id).emit('error', { message: "Error joining room." });
    }
  });

  socket.on('leave-room', ({roomId}: {roomId: string}) => {
    const room = videoCallRooms.get(roomId);

    if(!room){
      console.log("Room not found.")
      return;    
    }

    if(room.participantsWithState.has(socket.user._id)){
      console.log(`User ${socket.user.username} had left the room ${roomId}.`)
      room.participantsWithState.delete(socket.user._id);
      socket.to(roomId).emit('user-left', { userId: socket.user._id.toString() });
    }
      
  });

  socket.on('user-change-stream-state', ({roomId, streamState}: {roomId: string; streamState?: {camera?: boolean; microphone?: boolean}}) => {
    if(videoCallRooms.has(roomId)){
      const participantState = videoCallRooms.get(roomId)?.participantsWithState.get(socket.user._id);
      if(participantState){
        participantState.camera = streamState?.camera ?? participantState.camera;
        participantState.microphone = streamState?.microphone ?? participantState.microphone;
      }
      socket.to(roomId).emit('user-change-stream-state', { userId: socket.user._id.toString(), roomId, streamState: participantState });
    }
  });
}