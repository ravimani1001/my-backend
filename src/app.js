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


app.use(express.json({ limit : "16kb" }))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
//There wont be any problem if we dont give pass any object to the above json() and urlencoded()

app.use(express.static("public"))
//the above code is to access the static files that will stored in the public folder

app.use(cookieParser())


export { app }