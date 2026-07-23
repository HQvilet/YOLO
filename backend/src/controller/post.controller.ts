import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import Post from "../model/post.model.ts";

export const getAllPosts = async (req: Request, res: Response) => {
    try{
        const posts = await Post.find({ })
                                .populate("creator")

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: posts
        }))

    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getUserPost = async (req: Request, res: Response) => {
    try{
        const userID = req.params.userID as string;

        const posts = await Post.find({ 
            creator: userID,
        }).populate("creator")

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: posts
        }))

    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const createPost = async (req: Request, res: Response) => {
    try{
        const {
            textContent,
            imgContent,
        } = req.body
        const userID = req.user._id;

        if(!textContent && !imgContent){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Missing content."
            }))
        }

        const post = await Post.create({
            creator: userID,
            content: {
                text: textContent,
                img: imgContent
            }
        })

        return res.status(201).json(serverResponseMessage({
            success: true,
            message: "Post created.",
            data: post
        }))

    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}