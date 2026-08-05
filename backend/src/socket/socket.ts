import express from "express"
import { Server } from "socket.io";
import http from "http";
import { socketAuthMiddleware } from "../library/middleware/socketMiddleware.ts";
import { getUserConversationsForSocket } from "../controller/conversation.controller.ts";
// import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";
import onlineUsers from "../memory/onlineUserSocket.ts";
import videoCallRooms from "../memory/videoCallRoom.ts";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5001",
    credentials: true,
  },
});


io.use(socketAuthMiddleware);

io.on("connection", async (socket) => {
  const user = socket.user;

  console.log(`${user.username} online với socket ${socket.id}`);

  onlineUsers.set(user._id.toString(), socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  const conversationIds = await getUserConversationsForSocket(user._id);
  conversationIds?.forEach((conversation) => {
    socket.join(conversation._id.toString());
  });
  
  // Join a room for the user to receive direct messages
  socket.join(user._id.toString());

  socket.on("join-conversation", (data) => {
    socket.join(data.conversationID);
  });

  //----------WebRTC signaling events-----------
  // User joins a room
  socket.on('join-room', ({roomId, streamState}) => {
    const userJoined = () => {
      console.log(`User ${socket.user.username} joined ${roomId}`)
      const existingUsers = videoCallRooms.get(roomId)?.participantsWithState;
      socket.to(roomId).emit('existing-users', { participants: existingUsers, roomId });
      socket.to(roomId).emit('user-joined', { userId: socket.user._id.toString(), roomId });
    }
    const room = videoCallRooms.get(roomId);
    if(!room){
      
    }

    if(videoCallRooms.has(roomId) && videoCallRooms.get(roomId)?.participantsWithState.has(socket.user._id)){
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
  });

  socket.on('leave-room', ({roomId}) => {
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

  socket.on('user-change-stream-state', ({roomId, streamState}) => {
    if(videoCallRooms.has(roomId)){
      const participantState = videoCallRooms.get(roomId)?.participantsWithState.get(socket.user._id);
      if(participantState){
        participantState.camera = streamState?.camera ?? participantState.camera;
        participantState.microphone = streamState?.microphone ?? participantState.microphone;
      }
      socket.to(roomId).emit('user-change-stream-state', { userId: socket.user._id.toString(), roomId, streamState: participantState });
    }
  });

  // Relay Offer to peer
  socket.on('offer', ({ offer, roomId }) => {
    console.log(`Relaying offer from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit('offer', { offer, senderId: socket.user._id });
  });

  // Relay Answer to peer
  socket.on('answer', ({ answer, roomId }) => {
    console.log(`Relaying answer from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit('answer', { answer, senderId: socket.user._id });
  });

  // Relay ICE Candidates
  socket.on('ice-candidate', ({ candidate, roomId }) => {
    console.log(`Relaying ICE candidate from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  //Disconnect event
  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`socket disconnected: ${socket.id}`);
  });
});

export { io, app, server };