import express from "express"
import dotenv from "dotenv"
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

import  cors from "cors"
import userRouter from "./routes/user.route.js"

import bookRouter from "./routes/book.route.js"
dotenv.config({})
const app = express();

app.use(express.json())
app.use(cookieParser())



const allowedOrigin =
    process.env.NODE_ENV === "production"
        ? "https://pafto-xml-client.vercel.app"
        : "http://localhost:5173"; 

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use('/api/v1/user',userRouter)
app.use('/api/v1/book',bookRouter)


app.get("/",(req,res)=>{
    res.send("hello from Book")
})

app.listen(process.env.PORT,()=>{
    connectDB();
    console.log(`Server started At ${process.env.PORT}`)
})

