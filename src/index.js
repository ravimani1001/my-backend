// require('dotenv'.config({path : './env'}))
// the above line of code is not consistent with other import statements

//the better way to write the above code is -
import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({path : './env'})

connectDB()
















// function connectDB(){

// }
// connectDB()
//This approach is ok. But we will use iife.
//Remember, while connecting or communicating to a database some errors may arise.
//so we must cover the code in try catch bloc or promises
//And, Database connection and communication may take time.
//So we need to  tackle this using async await

/*
//APPROACH 1 to connect database

import express from 'express'
const app = express()
;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error" , (error)=>{
            console.log("Error : " , error)
            throw error 
        })

        app.listen(process.env.PORT , ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("ERROR: " , error)
        throw err
    }
} )()

*/