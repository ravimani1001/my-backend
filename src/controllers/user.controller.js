import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"


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
    console.log("email : " , email)


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
    const existedUser = User.findOne({
        $or : [{ email } , { username }]
    })
    if(existedUser){
        throw new ApiError(409 , "User with email or username already exists")
    }

    //We can access multiple file upload using req.files object.
    //The multer middleware injects this files object in the req
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

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
        username : username.toLowercase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )

} )

export {registerUser}