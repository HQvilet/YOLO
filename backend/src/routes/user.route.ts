import express from "express"

import { getAllUsers, getUserProfile, updateUserProfile } from "../controller/user.controller.ts";
import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { acceptFriendRequest, deleteAllRequest, getAllFriendRequests, getAllFriends, getRecommendedFriends, sendFriendRequest } from "../controller/friend.controller.ts";

const route = express.Router();

route.use(jwtTokenVerifier)

// get all users
route.get("/", getAllUsers)
// get user profile 
route.get("/profile/:userID", getUserProfile)
// update user profile
route.put("/update", updateUserProfile)

export default route;
