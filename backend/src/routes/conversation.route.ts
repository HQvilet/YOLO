import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { createConversation, deleteAllConversation, getAllConversations, getConversation, markAsSeen } from "../controller/conversation.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

// get conversations of user
route.get("/", getAllConversations)

// get conversation data by userID or conversationID
route.get("/get", getConversation)

route.patch("/seen/:conversationID", markAsSeen)
// route.put("/")

route.delete("/", deleteAllConversation)

export default route;
