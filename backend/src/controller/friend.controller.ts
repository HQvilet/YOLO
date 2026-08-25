import type { Request, Response } from "express"
import UserProfile from "../model/user.profile.model.ts";
import { serverErrorMessage, serverResponseMessage } from "../declare/response.ts";
import FriendRequest from "../model/friendRequest.model.ts";
import { Types } from "mongoose"
import FriendRelation from "../model/friendRelation.model.ts";
import { getMutualFriends } from "../db_query/db_query.ts";

export const sendFriendRequest = async (req: Request, res: Response) => {
    try{
        const { userID: recipientID } = req.params
        const authUserID = req.user._id

        if(authUserID.equals(recipientID)){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Cannot request to yourself."
            }))
        }
        
        const existRequest = await FriendRequest.findOne({
            sender: recipientID as string,
            recipient: authUserID
        })
        if(existRequest){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "User has already sent you a friend request."
            }))
        }
        const friendRequest = new FriendRequest({
            sender: authUserID,
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

const addFriendRelation = async (userID: any, friendID: any) => {

    await FriendRelation.findOneAndUpdate({userID}, {
        $push: {
            friendIDs: {
                userID: friendID,
                status: "accepted"
            }
        }
    },{ 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true 
    })
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

        await Promise.all([
            addFriendRelation(userID, request.sender),
            addFriendRelation(request.sender, userID)
        ])

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

export const acceptRequestFromUser = async (req: Request, res: Response) => {

    try{
        const userID = req.params.userID as string
        const authUserID = req.user._id

        const request = await FriendRequest.findOne({
            sender: userID,
            recipient: authUserID,
            status: "pending"
        })
        
        if(!request)
            return res.status(404).json(serverResponseMessage({
                success: false,
                error: "Request not found."
            }))

        request.status = "accepted"
        await request.save()

        await Promise.all([
            addFriendRelation(userID, request.sender),
            addFriendRelation(request.sender, userID)
        ])

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

export const declineRequestFromUser = async (req: Request, res: Response) => {
    try{
        const userID = req.params.userID as string
        const authUserID = req.user._id

        const request = await FriendRequest.findOne({
            sender: userID,
            recipient: authUserID,
            status: "pending"
        })
        
        if(!request)
            return res.status(404).json(serverResponseMessage({
                success: false,
                error: "Request not found."
            }))
        

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

export const getAllSentFriendRequests = async (req: Request, res: Response) => {
    try{
        const userID = req.user._id

        const requests = await FriendRequest.find({
            sender: userID,
            status: "pending",
        }).populate('recipient')

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
        const authUserID = req.user._id
        const userID = req.params.userID as string
        const {limit, offset} = req.params

        const [user] = await FriendRelation
            .aggregate([{
                    $match: {
                        userID: new Types.ObjectId(userID),
                    }
                },{
                    $project: {
                        friendIDs: {
                            $filter: {
                                input: "$friendIDs",
                                as: "friend",
                                cond: { $eq: ["$$friend.status", "accepted"]}
                            }
                        }
                    }
                },{
                    $skip: parseInt(offset as string ?? "0")
                },{
                    $limit: parseInt(limit as string ?? "10")
                },
                {
                    $lookup: {
                        from: "userprofiles",
                        // let: {userId: "friendIDs.userID"},
                        localField: "friendIDs.userID",
                        foreignField: "_id",
                        pipeline:[
                            ...getMutualFriends(authUserID)
                        ],
                        as: "friends"
                    }
                }
            ])

        return res.status(200).json(serverResponseMessage({
            success: true,
            data: user.friends
        }))

    }catch(error: any){
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getAllMutualFriends = async (req: Request, res: Response) => {
    try{
        const { userID } = req.params
        const authUserID = req.user._id

        const mutualFriends = await FriendRelation.aggregate([
            // 1. Fetch only the 2 target user documents using primary key index
            { $match: { userID: { $in: 
                [new Types.ObjectId(userID as string), new Types.ObjectId(authUserID)] 
            } } },
            
            // 2. Group arrays into a single array containing both sets
            {
                $group: {
                    _id: null,
                    sets: { $push: "$friendIDs" }
                }
            },
            
            // 3. Compute array intersection on the database server
            {
                $project: {
                    mutualFriendIDs: {
                        $setIntersection: [
                            { $arrayElemAt: ["$sets", 0] },
                            { $arrayElemAt: ["$sets", 1] }
                        ]
                    }
                }
            },
            
            // 4. Join user details ONLY for the intersected IDs
            {
                $lookup: {
                    from: "users",
                    localField: "mutualFriendIds",
                    foreignField: "_id",
                    // pipeline: [{ $project: { name: 1, avatar: 1 } }],
                    as: "mutualFriends"
                }
            }
        ])

    return res.status(200).json(serverResponseMessage({
        success: true,
        data: mutualFriends
    }))
    } catch (error: any) {
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const deleteAllRequest = async (req: Request, res: Response) => {
    await FriendRequest.deleteMany({})
    await FriendRelation.deleteMany({})
    return res.send("Deleted all friend requests") 
}
