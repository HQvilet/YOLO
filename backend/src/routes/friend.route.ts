import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { acceptFriendRequest, acceptRequestFromUser, declineFriendRequest, declineRequestFromUser, deleteAllRequest, getAllFriendRequests, getAllFriends, getAllSentFriendRequests, sendFriendRequest } from "../controller/friend.controller.ts";
import { getAllUsers } from "../controller/user.controller.ts";

const route = express.Router();

route.use(jwtTokenVerifier)

// get all friends of a user
route.get("/:userID/all", getAllFriends)

// get all requests
route.get("/request", getAllFriendRequests)
route.get("/sent-request", getAllSentFriendRequests)

// get recommended user
route.get("/recommend", getAllUsers)

// send friend request
route.post("/request/:userID", sendFriendRequest)

// accept friend request
route.put("/request/:requestID/accept", acceptFriendRequest)
route.put("/request/user/:userID/accept", acceptRequestFromUser)

// decline friend request
route.put("/request/:requestID/decline", declineFriendRequest)
route.put("/request/user/:userID/decline", declineRequestFromUser)
//test:
route.delete("/request/delete", deleteAllRequest)


export default route;
