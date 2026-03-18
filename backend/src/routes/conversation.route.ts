import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { createConversation, getAllConversations, getOrCreateConversation } from "../controller/conversation.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

// route.post("/create", createConversation)
// route.post("/get", getOrCreateConversation)

route.get("/", getAllConversations)

export default route;
