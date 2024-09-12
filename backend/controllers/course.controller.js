import Course from "../models/course.model.js"
import { uploadAtCloudinary } from "../utils/cloudinary.js"


export const createCourse = async(req,res)=>{
    const {name,description,price} = req.body

    if(!name || !description || !price){
        return res.status(401).json({
            success : false,
            message : "All fields are required"
        })
    }

    const existedCourse = await Course.findOne({name})
    if(existedCourse){
        return res.status(401).json({
            success : false,
            message : "Course already listed"
        })
    }

    try{
        if(!req.file){
            return res.status(401).json({
                success : false,
                message : "Thumbnail is required"
            })
        }
        const thumbnailLocalPath = req.file.path
        console.log(thumbnailLocalPath)
        const thumbnail = await uploadAtCloudinary(thumbnailLocalPath)
        console.log(thumbnail)
        if(!thumbnail){
            return res.status(401).json({
                success : false,
                message : "Thumnail is nrequired"
            })
        }
        const course = await Course.create({
            name,
            description,
            price,
            thumbnail : thumbnail?.data?.secure_url
        })
        await course.save()
        if(!course){
            return res.status(500).json({
                success : false,
                message : "Unable to create the course"
            })
        }
        return res.status(200).json({
            success : true,
            data : course,
            message : "Course created successfully"
        })
    }
    catch(err){
        console.log("Error : ",err.message)
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

/* Edit Existing course */

export const editCourse = async (req, res) => {
    const { name, description, price } = req.body;
    const { courseId } = req.params;

    if (!req.file && !name && !description && !price) {
        return res.status(400).json({
            success: false,
            message: "At least one field must be updated",
        });
    }

    const updateDetails = {};

    if (req.file) {
        try {
            const thumbnailLocalPath = req.file.path;
            const thumbnail = await uploadAtCloudinary(thumbnailLocalPath);
            if (!thumbnail) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to update thumbnail",
                });
            }
            updateDetails.thumbnail = thumbnail.secure_url;
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error uploading thumbnail",
            });
        }
    }

    if (name) updateDetails.name = name;
    if (description) updateDetails.description = description;
    if (price) updateDetails.price = price;

    try {
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateDetails },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: course,
            message: "Course updated successfully",
        });

    } catch (err) {
        console.log("Error: ", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/* Delete any course */

export const deleteCourse = async(req,res)=>{
    const {courseId} = req.params
    try{
        const course = await Course.findByIdAndDelete(courseId)
        return res.status(200).json({
            success : true,
            message : "Course deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

/* Get all courses */

export const getAllCourses = async(req,res)=>{
    try{
        const courses = await Course.find()
        if(!courses || courses.length === 0){
            return res.status(401).json({
                success : false,
                message : "No courses is listed yet"
            })
        }
        return res.status(200).json({
            success : true,
            data : courses,
            message : "Courses are fetched successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export const getSingleCourse = async(req,res)=>{
    try{
        const {courseId} = req.params
        const course = await Course.findById(courseId)

        if(!course){
            return res.status(400).json({
                success : false,
                message : "Course not found"
            })
        }
        return res.status(200).json({
            success : true,
            data : course,
            message : "Course fetched successfully"
        })
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}


export const getTotalCourses = async(req,res)=>{
    try{
        const courses = await Course.find()
        return res.status(200).json({
            success : true,
            count : courses.length,
            message : "Total courses fetched successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}