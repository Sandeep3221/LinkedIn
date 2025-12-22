import express from 'express'
import { getCurrentUser, getSuggestedUser, updateProfile } from '../controllers/user.controller.js'
import isAuth from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'
let userRouter=express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)//protected routes user cannot access home page until and unless user does not havea token
userRouter.put("/updateprofile",isAuth,upload.fields([
        {name:"profileImage",maxCount:1},
        {name:"coverImage",maxCount:1}
]),updateProfile)
userRouter.get("/suggestedusers",isAuth,getSuggestedUser)
export default userRouter