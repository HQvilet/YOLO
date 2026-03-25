import express from "express"
import { Server } from "socket.io";
import http from "http";
import { socketAuthMiddleware } from "../library/middleware/socketMiddleware.ts";
import { getUserConversationsForSocket } from "../controller/conversation.controller.ts";
// import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";
import onlineUsers from "../memory/onlineUserSocket.ts";

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
  conversationIds?.forEach((c) => {
    socket.join(c._id.toString());
  });

  socket.on("join-conversation", (data) => {
    socket.join(data.conversationID);
  });

  socket.join(user._id.toString());

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`socket disconnected: ${socket.id}`);
  });
});

export { io, app, server };