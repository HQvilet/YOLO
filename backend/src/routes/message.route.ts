import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { deleteAllMessages, getAllMessageFromConversation, sendDirectMessage, sendGroupMessage, sendMessage } from "../controller/message.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

route.get("/:conversationID", getAllMessageFromConversation)

route.post("/send", sendMessage)
route.post("/direct", sendDirectMessage)
route.post("/group", sendGroupMessage)

route.delete("/", deleteAllMessages)

export default route;
