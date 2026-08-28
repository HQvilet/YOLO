import type { Socket } from "socket.io";
import { io } from "../socket.ts";
import onlineUsers from "../../memory/onlineUserSocket.ts";


export function setUpSignalingServerListeners(socket: Socket){
  // Relay Offer to peer
  socket.on('offer', ({ offer, roomId, recipientId }: any) => {
    // console.log(`Relaying offer from ${socket.id} to room ${roomId}`);
    io.to(onlineUsers.get(recipientId)).emit('offer', { offer, senderId: socket.user._id });
  });

  // Relay Answer to peer
  socket.on('answer', ({ answer, roomId, recipientId }: any) => {
    // console.log(`Relaying answer from ${socket.id} to room ${roomId}`);
    io.to(onlineUsers.get(recipientId)).emit('answer', { answer, senderId: socket.user._id, recipientId });
  });

  // Relay ICE Candidates
  socket.on('ice-candidate', ({ candidate, roomId, recipientId }: any) => {
    // console.log(`Relaying ICE candidate from ${socket.id} to room ${roomId}`);
    io.to(onlineUsers.get(recipientId)).emit('ice-candidate', { candidate, senderId: socket.user._id });
  });
}