import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true //this field optimizes the search in mongodb
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String, //Cloudinary url
        required : true
    },
    coverImage : {
        type : String, //Cloudinary url
    },
    //watchHistory will be an array of objects
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : [true , "Password is required"]
    }, 
    refreshToken : {
        type : String
    }
} , {timestamps : true})

//We are going to add pre middleware that will be executed before anything is saved.
//the pre middleware takes a callback function. This callback function is not made as an arrow function since arrow functions do not have the access to the current context i.e. 'this'
//The process of encryption may take time, hence the callback funtion is made async
//And since this is a middleware, the callback function has the access to the 'next'

userSchema.pre("save" , async function (next){
    //We will check if password is changed or set then only we will encrypt the password
    if(!this.isModified("password"))
    {
        return next()
    }

    this.password = await bcrypt.hash(this.password , 10)//here 10 is salt rounds
    next()
})

//We will add a method to userSchema. The added methowill be available to all instances of the schema
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {//Payload
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName   
        },
        //Secret key
        process.env.ACCESS_TOKEN_SECRET,
        //Options or we can say expiry object to customize jwt
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {//Payload
            _id : this._id,  
        },
        //Secret key
        process.env.REFRESH_TOKEN_SECRET,
        //Options or we can say expiry object to customize jwt
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema)