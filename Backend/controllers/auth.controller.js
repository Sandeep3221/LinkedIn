import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import genToken from "../config/token.js"
export const signUp=async (req,res)=>{
        try {
                let {firstName, lastName, userName, email, password}=req.body
                let existEmail=await User.findOne({email})
                if(existEmail){
                        return res.status(400).json({message:"email already exist"})
                }
                let existUsername=await User.findOne({userName})
                if(existUsername){
                        return res.status(400).json({message:"UserName already exist"})
                }
                if(password.length<8){
                        return res.status(400).json({message:"Password must be atleast 8 letters"})
                }
                let hassedPassword=await bcrypt.hash(password,10)
                const user=await User.create({
                        firstName, 
                        lastName, 
                        userName, 
                        email, 
                        password:hassedPassword
                })
                let token=genToken(user._id)
                //token is stord inside cookie
                res.cookie("token",token,{
                        httpOnly:true,
                        maxAge:7*24*60*60*1000,
                        sameSite:"strict",
                        secure:process.env.NODE_ENVIRONMENT==="production"
                })
                res.status(201).json(user)
        } catch (error) {
                console.log(error);
                return res.status(500).json({message:error})
        }
}
export const login=async (req,res)=>{
        try {
              let {email, password}=req.body
                let user=await User.findOne({email})
                if(!user){
                        return res.status(400).json({message:"user does not exist"})
                }
                
                const isMatch=await bcrypt.compare(password,user.password)
                if(!isMatch){
                        return res.status(400).json({message:"Incorrect Password"})
                }
                
                let token=genToken(user._id)
                //token is stored inside cookie
                res.cookie("token",token,{
                        httpOnly:true,
                        maxAge:7*24*60*60*1000,
                        sameSite:"lax",
                        secure: false,
                        secure:process.env.NODE_ENVIRONMENT==="production"
                })
                res.status(200).json(user)  
        } catch (error) {
               console.log(error);
               return res.status(500).json({message:"Login Error"}) 
        }
}
//for logout cookies ke ander ka token ko clear kar denge
export const logout=async (req,res)=>{
        try {
               res.clearCookie("token")
               return res.status(200).json({message:"Logout successfully"})
        } catch (error) {
                console.log(error);
               return res.status(500).json({message:"Logout Error"})
        }
}