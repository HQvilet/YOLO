import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import Post from "../model/post.model.ts";
import Reaction from "../model/react.model.ts";
import { Types } from "mongoose";
import Comment from "../model/comment.model.ts";

export const getPostByID = async (req: Request, res: Response) => {
    try{
        const postID = req.params.postID as string;
        const authUserID = req.user._id;

        const post = await Post.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(postID)
                }
            },{
                $lookup: {
                    from: "userprofiles",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            // show if the auth user has reacted to the post
            {
                $lookup: {
                    from: "reactions",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postID", "$$postId"] },
                                        { $eq: ["$ownerID", authUserID] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isAuthUserReacted"
                }
            },{
                $unwind: "$creator"
            }
        ])
        
        if(!post || post.length === 0){
            return res.status(404).json(serverResponseMessage({
                success: false,
                error: "Post not found."
            }))
        }

        post.forEach((post: any) => {
            post.isAuthUserReacted = post.isAuthUserReacted.length > 0 ? post.isAuthUserReacted[0].type : null;
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: post[0]
        }))
    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllPosts = async (req: Request, res: Response) => {
    try{
        const authUserID = req.user._id;

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            // show if the auth user has reacted to the post
            {
                $lookup: {
                    from: "reactions",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postID", "$$postId"] },
                                        { $eq: ["$ownerID", authUserID] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isAuthUserReacted"
                }
            },{
                $unwind: "$creator"
            }
        ])

        posts.forEach((post: any) => {
            post.isAuthUserReacted = post.isAuthUserReacted.length > 0 ? post.isAuthUserReacted[0].type : null;
        })


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

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            // show if the auth user has reacted to the post
            {
                $lookup: {
                    from: "reactions",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postID", "$$postId"] },
                                        { $eq: ["$ownerID", userID] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isAuthUserReacted"
                }
            },{
                $unwind: "$creator"
            }
        ])

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

export const likePost = async (req: Request, res: Response) => {
    try{
        const postID = req.params.postID as string;
        const { type } = req.body;
        const authUserID = req.user._id;

        const react = await Reaction.findOne({
            ownerID: authUserID,
            postID: postID
        })
        
        if(react){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "You have already reacted to this post."
            }))
        }

        await Reaction.create({
            ownerID: authUserID,
            postID: postID,
            type: type
        })

        
        const post = await Post.findOneAndUpdate({_id: postID}, {
            $inc: { reactCount: 1 }
        },{
            returnDocument: "after"
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Post liked.",
            data: post
        }))

    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const unlikePost = async (req: Request, res: Response) => {
    try{
        const postID = req.params.postID as string;
        const authUserID = req.user._id;

        const react = await Reaction.deleteOne({
            ownerID: authUserID,
            postID: postID
        })

        if(react.deletedCount === 0){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "You have not reacted to this post."
            }))
        }

        const post = await Post.findOneAndUpdate({_id: postID}, {
            $inc: { reactCount: -1 }
        },{
            returnDocument: "after"
        })

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Post unliked.",
            data: post
        }))

    }catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const commentPost = async (req: Request, res: Response) => {
    try{
        const postID = req.params.postID as string;
        const { content, referenceCommentID } = req.body;
        const authUserID = req.user._id;

        const comment = await Comment.create({
            ownerID: authUserID,
            postID: postID,
            content: content,
            referenceCommentID: referenceCommentID || null
        })

        return res.status(201).json(serverResponseMessage({
            success: true,
            message: "Comment added.",
            data: comment
        }))

    } catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllReacts = async (req: Request, res: Response) => {
    try{
        const postID = req.params.postID as string;
        const { limit = 20, offset = 0 } = req.query;

        const reacts = await Reaction.aggregate([
            {
                $match: {
                    postID: new Types.ObjectId(postID)
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            }, {
                $skip: Number(offset)
            }, {
                $limit: Number(limit)
            },  {
                $lookup: {
                    from: "userprofiles",
                    localField: "ownerID",
                    foreignField: "_id",
                    as: "owner"
                }
            }, {
                $unwind: "$owner"
            }, {
                $project: {
                    _id: 1,
                    type: 1,
                    owner: 1,
                }
            }
        ])

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: reacts
        }))

    } catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllComments = async (req: Request, res: Response) => {
    try{
        const postID = req.params.postID as string;
        const { limit = 20, offset = 0 } = req.query;

        const comments = await Comment.aggregate([
            {
                $match: {
                    postID: new Types.ObjectId(postID)
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            }, {
                $skip: Number(offset)
            }, {
                $limit: Number(limit)
            }, {
                $lookup: {
                    from: "userprofiles",
                    localField: "ownerID",
                    foreignField: "_id",
                    as: "owner"
                }
            }, {
                $unwind: "$owner"
            }
        ])

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: comments
        }))

    } catch(error: any){
        console.error(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}