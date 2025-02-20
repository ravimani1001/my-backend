import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        //mongoose returns an object which can be stored in a varibale as response from mongoose
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected !!!  DB HOST : ${connectionInstance.connection.host}`)
        // console.log(`This is connectionInstance \n${connectionInstance}`)
    } catch (error) {
        console.error("Database connection FAILED : ",error)
        process.exit(1)
        //NodeJs gives us the access of 'process'.
        //Current application runs on a process whose reference is given to us by 'process'
        //here exit code given = 1
    }
}

export default connectDB