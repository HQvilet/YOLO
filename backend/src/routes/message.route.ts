import express from "express"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import { sendMessage } from "../controller/message.controller.ts";


const route = express.Router();

route.use(jwtTokenVerifier)

route.post("/send", sendMessage)


export default route;
