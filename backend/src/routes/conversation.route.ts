import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { createConversation, deleteAllConversation, getAllConversations, getConversationById, getConversationByParticipantID, markAsSeen, inviteUsersToConversation, leaveConversation } from "../controller/conversation.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

// get conversations of user
route.get("/", getAllConversations)

// get conversation data by conversationID
route.get("/:conversationID", getConversationById)

route.get("/:participantID/user", getConversationByParticipantID)

route.patch("/seen/:conversationID", markAsSeen)

// create a new conversation
route.post("/", createConversation)

// invite users to a conversation
route.post("/:conversationID/invite", inviteUsersToConversation)

route.delete("/:conversationID/leave", leaveConversation)


route.delete("/", deleteAllConversation)

export default route;
