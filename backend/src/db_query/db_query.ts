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
                        _id: 1,
                        requestStatus: {
                            $cond: {
                                if: { $eq: ["$status", "accepted"]}, 
                                    then: "accepted",
                                else:{$cond:
                                    {if: { $eq: ["$sender", userID] },
                                        then: "waiting",
                                    else: "pending"}}
                            }
                        }
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
    },{
        $set: {
            requestStatus: {
                $ifNull: ["$requestStatus.requestStatus", "none"]
            }
        }
    }]

export const getMutualFriends = (userID: mongoose.Types.ObjectId) => 
    [{
        $lookup: {
            from: "friendrelations",
            let: { userId: "$_id" },
            pipeline: [
                {
                    $match: {
                        // userID: {
                            $expr: { 
                                $in: ["$userID", [userID, "$$userId"] ] // 2. Reference using $$
                            }
                        // }
                    }
                },
                {
                    $group: {
                        _id: null,
                        sets: { $push: "$friendIDs.userID" }
                    }
                }
                , {
                    $project: {
                        mutualFriendIDs: {
                            $setIntersection: [
                                { $ifNull: [{ $arrayElemAt: ["$sets", 0] }, []] },
                                { $ifNull: [{ $arrayElemAt: ["$sets", 1] }, []] }
                            ]
                        }
                    }
                }, 
                {
                    $lookup: {
                        from: "userprofiles",
                        let: { mutualFriendIds: "$mutualFriendIDs" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ["$_id", "$$mutualFriendIds"]
                                    }
                                }
                            }
                        ],
                        as: "mutualFriends"
                    }
                }
            ],
            as: "relation"
        }, 
    }, {
        $unwind: {
            path: "$relation",
            preserveNullAndEmptyArrays: true
        }
    }, {
        $set: {
            mutualFriends: "$relation.mutualFriends"
        }
    },{
        $unset: ["relation"]
    }]

export const getFriendsCount = () => 
[{
            $lookup:{
                from: "friendrelations",
                let: { userId: "$_id" },
                pipeline: [
                    { $match: {$expr: { $eq: ["$userID", "$$userId"] }} },
                    {
                        $project: {
                            friendCount: { $size: {
                                $filter: {
                                    input: "$friendIDs",
                                    as: "friend",
                                    cond: { $eq: ["$$friend.status", "accepted"] }
                                }
                            }}
                        }
                    }
                ],
                as: "friends"
            }
        },{
            $unwind: {
                path: "$friends",
                preserveNullAndEmptyArrays: true
            }
        },{
            $set: {
                friendCount: {
                    $ifNull: ["$friends.friendCount", 0]
                }
            }
        },{
            $unset: ["friends"]
        }]