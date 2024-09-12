import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { addLecture, deleteLecture, editLecture } from "../controllers/lecture.controller.js";

const lectureRouter = Router()

lectureRouter.route('/addlecture/:courseId').post(isLoggedIn,isAdmin,upload.single('lecture'),addLecture)
lectureRouter.route('/editlecture/:courseId/:lectureId').put(isLoggedIn,isAdmin,upload.single('lecture'),editLecture)
lectureRouter.route('/deletelecture/:courseId/:lectureId').delete(isLoggedIn,isAdmin,deleteLecture)



export default lectureRouter