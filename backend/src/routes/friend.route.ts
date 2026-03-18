import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { acceptFriendRequest, deleteAllRequest, getAllFriendRequests, getAllFriends, getRecommendedFriends, sendFriendRequest } from "../controller/friend.controller.ts";

const route = express.Router();

route.use(jwtTokenVerifier)

// get all friends of a user
route.get("/:userID/all", getAllFriends)
// get all request
route.get("/request", getAllFriendRequests)
// get recommended user
route.get("/recommend", getRecommendedFriends)
// send friend request
route.post("/request/:userID", sendFriendRequest)
// accept friend request
route.put("/request/:requestID/accept", acceptFriendRequest)

//test:
route.delete("/request/delete", deleteAllRequest)


export default route;
