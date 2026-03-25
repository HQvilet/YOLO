import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { createConversation, deleteAllConversation, getAllConversations, getConversation, markAsSeen } from "../controller/conversation.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

route.get("/", getAllConversations)
route.get("/get", getConversation)

route.patch("/seen/:conversationID", markAsSeen)

route.delete("/", deleteAllConversation)

export default route;
