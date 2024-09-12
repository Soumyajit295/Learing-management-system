import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { changePassword, changeUserName, getTotalUsers, getUserData, login, logout, register } from "../controllers/user.controller.js";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.route('/register').post(upload.single('avatar'),register)
userRouter.route('/login').post(login)
userRouter.route('/changepassword').post(isLoggedIn,changePassword)
userRouter.route('/changeusername').post(isLoggedIn,changeUserName)
userRouter.route('/logout').get(isLoggedIn,logout)
userRouter.route('/getprofile/:userId').get(isLoggedIn,getUserData)
userRouter.route('/gettotaluser').get(isLoggedIn,isAdmin,getTotalUsers)

export default userRouter