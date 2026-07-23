import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import mongoose from "mongoose";
import { getUserQueryWithRequestStatus } from "../db_query/db_query.ts";

export const getUserProfile = async (req: Request, res: Response) => {
    try{
        const { userID } = req.params;
        const authUserID = req.user._id

        const [user] = await UserProfile.aggregate([{
            $match: {
                _id: new mongoose.Types.ObjectId(userID as string)
            }
        },
            ...getUserQueryWithRequestStatus(authUserID)
        ])
        if(!user){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error:"User not found."
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
        const userID = req.user._id
        const users = await UserProfile.aggregate([{
            $match: {
                _id: {$ne : userID},
            }
        },
            ...getUserQueryWithRequestStatus(userID)
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