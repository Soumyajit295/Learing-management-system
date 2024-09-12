import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import { createCourse, deleteCourse, editCourse, getAllCourses, getSingleCourse, getTotalCourses } from "../controllers/course.controller.js";
import upload from "../middleware/multer.middleware.js";

const courseRouter = Router()

courseRouter.route('/createcourse').post(isLoggedIn,isAdmin,upload.single('thumbnail'),createCourse)
courseRouter.route('/editcourse/:courseId').put(isLoggedIn,isAdmin,upload.single('thumbnail'),editCourse)
courseRouter.route('/deletecourse/:courseId').delete(isLoggedIn,isAdmin,deleteCourse)
courseRouter.route('/getallcourses').get(getAllCourses)
courseRouter.route('/getcourse/:courseId').get(getSingleCourse)
courseRouter.route('/gettotalcourses').get(isLoggedIn,isAdmin,getTotalCourses)

export default courseRouter