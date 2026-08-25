import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import mongoose, { Types } from "mongoose";
import { getFriendsCount, getMutualFriends, getUserQueryWithRequestStatus } from "../db_query/db_query.ts";
import FriendRequest from "../model/friendRequest.model.ts";

export const getUserProfile = async (req: Request, res: Response) => {
    try{
        const userID = req.params.userID as string;
        const authUserID = req.user._id as string

        const isAuthUser = userID === authUserID;

        const [user] = await UserProfile.aggregate([{
            $match: {
                _id: new mongoose.Types.ObjectId(userID)
            }
        },
            ...getUserQueryWithRequestStatus(new Types.ObjectId(authUserID)),
            ...getFriendsCount(),
            ...getMutualFriends(new Types.ObjectId(authUserID)),
    ])
        
        if(!user){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error:`User not found ${userID}`
            }))
        }
        

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: user,
        }));
    }
    catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    
    try{
        const {
            username,
            fullname,
            coverImg,
            profileImg,
        } = req.body

        const user = await UserProfile.findById(req.user._id)
        if(!user){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "User not found."
            }))
        }

        if(profileImg){
            if(user.profileImg){
            }
            user.profileImg = profileImg;
        }
        if(coverImg){
            if(user.coverImg){
            }
            user.coverImg = coverImg;
        }

        user.fullname = fullname || user.fullname;
        user.username = username || user.username;
        await user.save();

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Update profile successfully.",
            data: user
        }))

    }
    catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        // const users = await UserProfile.find({ });
        const authUserID = req.user._id
        const users = await UserProfile.aggregate([{
            $match: {
                _id: {$ne : authUserID},
            }
        },
            ...getUserQueryWithRequestStatus(authUserID)
        ])
        
        return res.status(200).json(serverResponseMessage({
            success: true,
            data: users,
        }));
    }
    catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const searchUsers = async (req: Request, res: Response) => {
    try{
        const searchQuery = req.query.q as string;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (parseInt(req.query.page as string) || 1) * limit;
        const authUserID = req.user._id

        const users = await UserProfile.aggregate([{
            $match: {
                _id: {$ne : authUserID},
                $or: [
                    { username: { $regex: searchQuery, $options: "i" } },
                    { fullname: { $regex: searchQuery, $options: "i" } }
                ]
            }
        },
        ...getUserQueryWithRequestStatus(authUserID), 
        ...getMutualFriends(authUserID)
        ])

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: users,
        }));
    } catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getRecommendedUsers = async (req: Request, res: Response) => {
    try{
        const authUserID = req.user._id

        const recommendedUsers = await UserProfile.aggregate([
            {
                $match: {
                    _id: { $ne: authUserID }
                }
            },
            ...getFriendsCount(),
            {
                $sort: { friendCount: -1 }
            },
            {
                $limit: 5
            }
        ])

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: recommendedUsers
        }));
    } catch(error: any){
        return res.status(500).json(serverErrorMessage(error.message))
    }
}