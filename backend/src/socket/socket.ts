import express from "express"
import { Server } from "socket.io";
import http from "http";
import { socketAuthMiddleware } from "../library/middleware/socketMiddleware.ts";
import { getUserConversationsForSocket } from "../controller/conversation.controller.ts";
// import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";
import onlineUsers from "../memory/onlineUserSocket.ts";
import videoCallRooms from "../memory/videoCallRoom.ts";
import { setUpVideoCallEventListeners } from "./events/videoCallEvents.ts";
import { setUpSignalingServerListeners } from "./events/webRTCSignaling.ts";

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

  const conversationIds = await getUserConversationsForSocket(user._id);
  conversationIds?.forEach((conversation) => {
    socket.join(conversation._id.toString());
  });
  
  // Join a room for the user to receive direct messages
  socket.join(user._id.toString());

  socket.on("join-conversation", (data) => {
    socket.join(data.conversationID);
  });

  setUpVideoCallEventListeners(socket)

  setUpSignalingServerListeners(socket)


  //Disconnect event
  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    // io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`socket disconnected: ${socket.id}`);
  });
});

export { io, app, server };