import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { createPost, getAllPosts, getUserPost } from "../controller/post.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

route.get("/", getAllPosts)

route.get("/:userID", getUserPost)

// route.get("/forme")

route.post("/", createPost)

export default route;
