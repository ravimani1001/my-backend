import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//We can configure cors and cookieParser after getting app
app.use(cors())


export { app }