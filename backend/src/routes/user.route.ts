import express from "express"

import { getAllUsers, getRecommendedUsers, getUserProfile, searchUsers, updateUserProfile } from "../controller/user.controller.ts";
import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { acceptFriendRequest, deleteAllRequest, getAllFriendRequests, getAllFriends, sendFriendRequest } from "../controller/friend.controller.ts";

const route = express.Router();

route.use(jwtTokenVerifier)

// get all users
route.get("/", getAllUsers)
// get user profile 
route.get("/profile/:userID", getUserProfile)
// update user profile
route.put("/update", updateUserProfile)

route.get("/search", searchUsers)

route.get("/recommend", getRecommendedUsers)

export default route;
