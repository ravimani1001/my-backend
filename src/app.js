import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//We can configure cors and cookieParser after getting app
//We can also add some addtional options while configuring the cors
//the most basic cors use =>  app.use(cors())
app.use(cors( {
    origin : process.env.CORS_ORIGIN,//we have given this value as * in env file which allows access from anywhere
    credentials : true
} ))



//We will get data from many sources. Here we are configuring those sources

app.use(express.json({ limit : "16kb" }))//configuring json with limit 16kb

app.use(express.urlencoded({extended : true , limit : "16kb"}))
//this configuration is to accept data from different url encoding
//There wont be any problem if we dont pass any object to the above json() and urlencoded()

app.use(express.static("public"))
//the above code is to access the static files that will stored in the public folder

app.use(cookieParser())
//cookie parser is used to perform CRUD operation on cookies on the user browser from the server
//this helps to add and remove the secured cookies on the user browser 



//Import Routes
import userRoute from './routes/user.routes.js'

//declaring routes
app.use("/api/v1/users" , userRoute)


//eg url - http://localhost:8000/api/v1/users/register

export { app }