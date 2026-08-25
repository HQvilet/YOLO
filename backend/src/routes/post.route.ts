import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { commentPost, createPost, getAllComments, getAllPosts, getAllReacts, getPostByID, getUserPost, likePost, unlikePost } from "../controller/post.controller.ts";
import { get } from "node:http";


const route = express.Router();

route.use(jwtTokenVerifier)

route.get("/:postID", getPostByID)
route.get("/", getAllPosts)
route.get("/:userID/user", getUserPost)

route.post("/", createPost)

route.post("/:postID/like", likePost)
route.post("/:postID/unlike", unlikePost)

route.post("/:postID/comment", commentPost)

route.get("/:postID/like", getAllReacts)
route.get("/:postID/comment", getAllComments)

route.delete("/:postID", () => {})
route.delete("/:postID/like", () => {})
route.delete("/:postID/comment", () => {})
route.delete("/:postID/comment/:commentID", () => {})

export default route;
