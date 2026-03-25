import bcrypt from "bcryptjs"
import type { Request, Response } from "express"

import UserAuth from "../model/user.auth.model.ts"
import UserProfile from "../model/user.profile.model.ts"

import { hashPassword } from "../library/utils/utils.ts"
import { generateTokenAndSetCookies } from "../library/utils/generateToken.ts"

import { serverResponseMessage, serverErrorMessage } from "../declare/response.ts"

export const signup = async (req: Request, res: Response) => {
    try{
        const {email, password, fullname, username} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({ error:"Invalid email format." })
        }
        
        const existingUser = await UserAuth.findOne({email});
        if(existingUser){
            return res.status(400).json({ error:"Existing email." })
        }

        // email validation

        //set password
        const hashedPassword = await hashPassword(password);

        const userProfile = new UserProfile({
            username,
            fullname,
        })

        const userAuth = new UserAuth({
            email,
            password: hashedPassword,
            userID: userProfile._id,
        })
        
        if(userAuth){
            const accessToken = generateTokenAndSetCookies(userAuth.userID, res);
            
            await userAuth.save();
            await userProfile.save();            
            
            return res.status(201).json(serverResponseMessage({
                success: true,
                message: "Successfully create account.",
                data: {
                    userID: userProfile.id,
                    email: userAuth.email,
                    fullname: userProfile.fullname,
                    username: userProfile.username
                },
            }));
        }
        else{
            return res.status(400).json(serverResponseMessage({
                success: false,
                error: "Invalid User Info",
            }))
        }
    }
    catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const userAuth = await UserAuth.findOne({email});
        if(!userAuth){
            return res.status(400).json(serverResponseMessage({
                success: false,
                error:"Email not found plz sign up" 
            }))
        }

        const isPasswordCorrect = await bcrypt.compare(password, userAuth.password || "")
        if(!isPasswordCorrect){
            return res.status(400).json(serverResponseMessage({ 
                success: false,
                error:"Invalid password.",
            }))
        }

        const userProfile = await UserProfile.findById(userAuth.userID);
        if(!userProfile){
            return res.status(400).json(serverResponseMessage({ 
                success: false,
                error:"User not found.",
            }))
        }

        const accessToken = generateTokenAndSetCookies(userAuth.userID, res);

        res.status(200).json(serverResponseMessage({
            success: true,
            message: "Login successfully.",
            data: {
                userID: userAuth.id,
                email: userAuth.email,
                fullname: userProfile?.fullname,
                username: userProfile.username,
            },
        }));
    }
    catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }

}

export const logout = async (req: Request, res: Response) => {
    try{
        res.cookie("jwt", "", {maxAge: 0 });
        res.status(200).json(serverResponseMessage({ 
            success: true,
            message:"Log out successfully" 
        }))
    }
    catch(error: any){
        return res.status(500).json(serverErrorMessage(error.message))
    }
}

export const getMe = (req: Request, res: Response) => {
	try {
		res.status(200).json(serverResponseMessage({
            success: true,
            data: req.user,
        }));
	} 
    catch(error: any){
        console.log((error.message))
        return res.status(500).json(serverErrorMessage(error.message))
    }
};