import express from "express"
import {v2 as cloudinary} from "cloudinary"

import { jwtTokenVerifier } from "../library/middleware/jwtTokenVerify.ts";
import type { Request, Response } from "express";
const route = express.Router();

route.get("/sign-delivery", jwtTokenVerifier, async (req: Request, res: Response) => {
  // Every signature is parametrized for the specific upload needed
  const paramsToSign= {
    timestamp: Math.floor(new Date().getTime() / 1000),
  };

  // Call the Cloudinary SDK to sign the parameters
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET ?? ""
  );
  res.status(200).json({
    signature: signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    timestamp: paramsToSign.timestamp
  })
});


export default route;
