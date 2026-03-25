import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import FriendRequest from "../model/friendRequest.model.ts";
import { Types } from "mongoose"

export const sendFriendRequest = async (req: Request, res: Response) => {
    try{
        const { userID: recipientID } = req.params
        const userID = req.user._id

        if(userID.equals(recipientID)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Cannot request to yourself."
            }))
        }

        const friendRequest = new FriendRequest({
            sender: userID,
            recipient: recipientID,
        })

        await friendRequest.save()

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Sent friend request.",
            data: friendRequest
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const acceptFriendRequest = async (req: Request, res: Response) => {
    try{
        const { requestID } = req.params
        const userID = req.user._id

        const request = await FriendRequest.findById(requestID)
        if(!request)
            return res.status(404).json(serverResponseMessage({
                success: false,
                error: "Request not found."
            }))
        
        if(!request.recipient?.equals(userID)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "User Unauthorize."
            }))
        }

        request.status = "accepted"

        await request.save()

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Request accepted.",
            data: request
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const declineFriendRequest = async (req: Request, res: Response) => {
    try{
        const { requestID } = req.params
        const userID = req.user._id

        const request = await FriendRequest.findById(requestID)
        if(!request)
            return res.status(404).json(serverResponseMessage({
                success: false,
                error: "Request not found."
            }))
        
        if(!request.recipient?.equals(userID)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "User Unauthorize."
            }))
        }

        request.status = "declined"

        await request.save()

        return res.status(200).json(serverResponseMessage({
            success: true,
            message: "Request declined.",
            data: request
        }))

    }catch(error: any){
        console.log(error.stack)
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllFriendRequests = async (req: Request, res: Response) => {
    try{
        const userID = req.user._id

        const requests = await FriendRequest.find({
            recipient: userID,
            status: "pending",
        }).populate('sender')

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: requests
        }))

    }catch(error: any){
        return res.status(500).json(serverErrorMessage(error.message))
    }
}


export const getAllFriends = async (req: Request, res: Response) => {
    try{
        const userID = req.params.userID as string

        const friends = await FriendRequest.aggregate([{
                $match:{
                    sender: new Types.ObjectId(userID),
                    status: "accepted",
                }
            },{
                $lookup:{
                    from: "userprofiles",
                    localField: "recipient",
                    foreignField: "_id",
                    as: "friendDetail",
                    pipeline:[
                        {
                            $project:{
                                username: 1,
                                fullname: 1,
                                profileImg: 1,
                            }
                        }
                    ]
                },
            },{
                $unwind:{
                    path: "$friendDetail",
                    preserveNullAndEmptyArrays: true,
                }
            }
        ]).unionWith({
            coll: 'friendrequests',
            pipeline: [{
                $match:{
                    recipient: new Types.ObjectId(userID),
                    status: "accepted",
                }
            },{
                $lookup:{
                    from: "userprofiles",
                    localField: "sender",
                    foreignField: "_id",
                    as: "friendDetail",
                    pipeline:[
                        {
                            $project:{
                                username: 1,
                                fullname: 1,
                                profileImg: 1,
                            }
                        }
                    ]
                },
            },{
                $unwind:{
                    path: "$friendDetail",
                    preserveNullAndEmptyArrays: true,
                }
            }
        ]})

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: friends
        }))

    }catch(error: any){
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getRecommendedFriends = async (req: Request, res: Response) => {
    try{
        const userID = req.user._id;

        const users = await UserProfile.find({})
                                    .where("_id").ne(userID);
        
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

export const deleteAllRequest = async (req: Request, res: Response) => {
    await FriendRequest.deleteMany({})
    return res.send("Deleted all friend requests") 
}