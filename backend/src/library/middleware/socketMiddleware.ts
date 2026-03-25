import type { NextFunction } from "express";
import type { ExtendedError, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import UserProfile from "../../model/user.profile.model.ts";

import cookieParser from "cookie-parser";
import cookie from "cookie"

export const socketAuthMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "")
    const token = cookies.jwt;
    if (!token) {
      return next(new Error("Unauthorized - Token không tồn tại"));
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    if (!decoded) {
      return next(new Error("Unauthorized - Token không hợp lệ hoặc đã hết hạn"));
    }

    const user = await UserProfile.findById(decoded.userID);

    if (!user) {
      return next(new Error("User không tồn tại"));
    }

    socket.user = user;
    next();

  } catch (error) {
    console.error("Lỗi khi verify JWT trong socketMiddleware", error);
    next(new Error("Unauthorized"));
  }
};