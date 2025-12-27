import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import http from "http"
import { Server } from "socket.io"
dotenv.config()
let app=express()
let server=http.createServer(app)
export const io=new Server(server,{
        cors:({
                origin:"https://linked-in-omega-six.vercel.app",
                credentials:true 
        })
})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
        origin:"https://linked-in-omega-six.vercel.app",
        credentials:true
}))
let port=process.env.PORT || 5000
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
export const userSocketMap=new Map()
io.on("connection",(socket)=>{
        socket.on("register",(userId)=>{
                userSocketMap.set(userId,socket.id)
                console.log(userSocketMap)
        })
        socket.on("disconnect",()=>{
                console.log("user disconnected",socket.id)
        })
})
app.get("/",(req,res)=>{
        res.send("Hello")
})
server.listen(port,()=>{
        connectDb();
        console.log("Server is started");
})
