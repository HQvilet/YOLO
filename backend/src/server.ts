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

//controllers

//services
import { connectDB } from "./services/connectDB.service.ts";
import "./services/storage.service.ts";

dotenv.config();
 
const PORT = parseInt(process.env.PORT || "5000");

const app = express()

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)

app.use("/api/user/friend", friendRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", messageRoute)

app.use("/api/cloudinary", cloudinaryRoute)


app.get("/*splat", (req: Request, res: Response) => {
    res.status(404).send("Page not found : 404");
})

app.listen(PORT, () => {
    connectDB();
    console.log(`+ Listening on port ${PORT}`);
});