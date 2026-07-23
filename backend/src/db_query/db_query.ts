import type mongoose from "mongoose";

export const getUserQueryWithRequestStatus = (userID: mongoose.Types.ObjectId) => 
    [{
        $lookup: {
            from: "friendrequests",
            let: { profileId: "$_id" },
            pipeline: [{
                    $match: {
                        $expr: {
                            $or: [
                                { $and: [
                                    { $eq: ["$sender", userID] }, 
                                    { $eq: ["$recipient", "$$profileId"] }
                                ]},
                                { $and: [
                                    { $eq: ["$recipient", userID] }, 
                                    { $eq: ["$sender", "$$profileId"] }
                                ]}
                            ]
                        }
                    }
                },{
                    $project: { 
                        status: 1, 
                        sender: 1, 
                        recipient: 1 
                    } 
                }
            ],
            as: "requestStatus"
        }
    }, {
        $unwind: {
            path: "$requestStatus",
            preserveNullAndEmptyArrays: true
        }
    }]