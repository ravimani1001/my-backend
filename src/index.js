// require('dotenv'.config({path : './env'}))
// the above line of code is not consistent with other import statements

//the better way to write the above code is -
import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import {app} from './app.js'

dotenv.config({path : './env'})

//since connectDB() is an async function, it will return a promise.
connectDB()
.then( ()=>{
    //before starting the server we can also handle errors.
    app.on("errors" , (error)=>{
        console.log("ERROR : ", error)
        throw error
    })

    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server running on port ${process.env.PORT}`)
    })

} )
.catch( (err)=>{
    console.log("MONGO DB CONNECTION FAILED !" , err)
} )
















// function connectDB(){

// }
// connectDB()
//This approach is ok. But we will use iife.
//Remember, while connecting or communicating to a database some errors may arise.
//so we must cover the code in try catch block or promises
//And, Database connection and communication may take time.
//So we need to  tackle this using async await

/*
//APPROACH 1 to connect database

import express from 'express'
import mongoose from 'mongoose'
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