import jwt from "jsonwebtoken"
import UserProfile from "../../model/user.profile.model.ts"
import type { NextFunction, Request, Response } from "express";


export const jwtTokenVerifier = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorized : No token provided"});
        }
        
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "qwert");
        if(!decoded){
            return res.status(401).json({error:"Unauthorized : No token provided"});
        }
        const user = await UserProfile.findById(decoded.userID);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        
        req.user = user;
        next();
    }catch(error: any){
        console.log(error.stack)
        res.status(500).json({error:"Internal server error."})
    }
}
