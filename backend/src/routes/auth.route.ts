import express from "express"

import {signup, login, logout, getMe } from "../controller/auth.controller.ts"
import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.get("/me", jwtTokenVerifier, getMe)

export default route;
