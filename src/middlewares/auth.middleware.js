import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler( async (req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            // Discuss in frontend
            throw new ApiError(401 , "Invalid Access Token")
        }
    
        // If everything goes fine. Token is present and verified and we got a user
        // Then add a user property to req object
        req.user = user
    
        next()
    
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid access token")
    }
} )