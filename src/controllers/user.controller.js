import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })

        return {accessToken , refreshToken}

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating access and refresh token")
    }
}

//Register controller
const registerUser = asyncHandler( async (req , res) => {
    
    // get user details from frontend
    // validation - not empty
    // check if the user already exist : check username, email
    // check images and avatar(required)
    // upload files on cloudinary, check if avatar is uploaded or not
    // create user object - and create entry in database
    // remove password and refrsh token field from response
    // check if user is created
    // return the response for the use on frontend

    const {fullName , email , username , password} = req.body
    // console.log("email : " , email)


    //Validation 1 => Checking for empty fields

    // Either we can check each field with separate if statement
    // Or we can use "some" method of array
    // if(fullName === ""){
    //     throw new ApiError(400 , "fullName is required")
    // }
    if(
        [fullName, email, username, password].some( (field) => field?.trim()==="" )
    ){
        throw new ApiError(400 , "All fields are required")
    }

    //Validation 2 => Checking if user already exists
    const existedUser = await User.findOne({
        $or : [{ email } , { username }]
    })
    if(existedUser){
        throw new ApiError(409 , "User with email or username already exists")
    }

    //We can access multiple file upload using req.files object.
    //The multer middleware injects this files object in the req
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required")
    }

    //uplaoding on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    //check for avatar
    if(!avatar){
        throw new ApiError(400 , "Avatar file is required")
    }

    //Create an user 
    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )

} )//register controller created


//login controller
const loginUser = asyncHandler( async (req , res) => {
    // get data from the user from req.body - email/username and password
    // Validate if fields are empty
    // Find user with the given email - Also check if user exists or not
    // compare password
    // generate access and refresh tokens
    // save tokens to database
    // send cookies

    const {email , username , password} = req.body

    if(!username && !email){
        throw new ApiError(400 , "Email or username is required")
    }

    const user = await User.findOne({
        $or : [{email} , {username}]
    })
    if(!user){
        throw new ApiError(404 , "User does not exist")
    }

    //checking password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid user credentials")
    }

    // Generating access and refresh token
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

    // We have to send cookies. We dont want to send information like password and refreshtoken
    // So we have to get the updated/loggedIn user
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //To send cookies we need to define some parameters. Here we created an object - options
    // By default, the cookies can  be modified from the frontend.
    // by setting httpOnly = true and secure = true, the cookies can only be modified from the backend/server
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in succesfully"
        )
    )

} )

//logout controller
const logoutUser = asyncHandler( async (req , res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "User logged out"))
} )

//Refresh Access Token controller
const refreshAccessToken = asyncHandler( async (req , res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401 , "Unauthorized access")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401 , "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401 , "Refresh token is expired or used")
        }
    
        //Options for setting the cookies
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const { accessToken , newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , newRefreshToken , options)
        .json(
            new ApiResponse(
                200,
                {accessToken , refreshToken : newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid refresh token")
    }

} )

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}