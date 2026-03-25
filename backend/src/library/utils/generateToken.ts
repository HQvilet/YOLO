import jwt from "jsonwebtoken"
import type { Response } from "express";

export const generateTokenAndSetCookies = (userID: any, res: Response) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET || "",{
        expiresIn : '1d',
    });
    
    res.cookie("jwt", token, {
        maxAge : 24*60*60*1000,
        httpOnly : true,
        sameSite : "strict",
        secure : process.env.NODE_ENV !== "development",
    })

    return token
    
}