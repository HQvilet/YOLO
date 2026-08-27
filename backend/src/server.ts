import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
//routes
import authRoute from "./routes/auth.route.ts"
import userRoute from "./routes/user.route.ts"
import friendRoute from "./routes/friend.route.ts"
import cloudinaryRoute from "./routes/cloudinaryServices.route.ts"
import conversationRoute from "./routes/conversation.route.ts"
import messageRoute from "./routes/message.route.ts"
import postRoute from "./routes/post.route.ts"
import { setupSwagger } from "./config/swagger.ts";
//controllers

//services

import { connectDB } from "./services/connectDB.service.ts";
import "./services/storage.service.ts";
dotenv.config();
import { app, server } from "./socket/socket.ts"

const PORT = parseInt(process.env.PORT || "5000");

const allowedOrigins = ["http://localhost:5001", "http://192.168.1.52:5001"];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());

setupSwagger(app);

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)

app.use("/api/friend", friendRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", messageRoute)
app.use("/api/post", postRoute)

app.use("/api/cloudinary", cloudinaryRoute)

app.get("/*splat", (req: Request, res: Response) => {
    res.status(404).send("Page not found : 404");
})

server.listen(PORT, () => {
    connectDB();
    console.log(`+ Listening on port ${PORT}`);
});