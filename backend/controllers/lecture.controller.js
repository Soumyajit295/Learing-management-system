import Course from "../models/course.model.js";
import { uploadAtCloudinary } from "../utils/cloudinary.js";
import cloudinary from 'cloudinary'

/* Add new lecture in a particular course */

export const addLecture = async (req, res) => {
    console.log(req.file)
    const { title, description } = req.body;
    const { courseId } = req.params;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Video is not available"
            });
        }

        const videoLocalPath = req.file.path;
        console.log("videoLocalPath:", videoLocalPath);

        const lecture = await uploadAtCloudinary(videoLocalPath);
        if (!lecture) {
            return res.status(400).json({
                success: false,
                message: "Video is required"
            });
        }

        const newLecture = {
            title,
            description,
            lecture: lecture?.data?.secure_url
        };

        course.lectures.push(newLecture);
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Video uploaded successfully"
        });
    } catch (err) {
        console.log("Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/* Edit any particular lecture of any course */

export const editLecture = async(req,res)=>{
    const {courseId,lectureId} = req.params
    const {title,description} = req.body

    console.log("Lecture Id : ",lectureId)
    console.log("Course id : ",courseId)

    if(!req.file && !title && !description){
        return res.status(401).json({
            success : false,
            message : "At least one field is need to update"
        })
    }

    try{
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(401).json({
                success : false,
                message : "Course not found"
            })
        }
        const index = course.lectures.findIndex((item)=>item._id.toString()===lectureId)
        if(index === -1){
            return res.status(401).json({
                success : false,
                message : "Lecture not found"
            })
        }
        const editedLecture = course.lectures[index]
        if(req.file){
            try{
                if (editedLecture.lecture) {
                    const oldVideoUrl = editedLecture.lecture
                    const publicId = oldVideoUrl.split('/').pop().split('.')[0]
                    await cloudinary.v2.uploader.destroy(publicId) 
                }
                const videoLocalPath = req.file.path
                const lecture = await uploadAtCloudinary(videoLocalPath)
                if(!lecture){
                    return res.status(401).json({
                        success : false,
                        message : "Failed to upload the video"
                    })
                }
                editedLecture.lecture = lecture?.data?.secure_url
            }
            catch(err){
                return res.status(500).json({
                    success : false,
                    message : "Mein chai raha hu"
                })
            }
        }
        if(title){
            editedLecture.title = title
        }
        if(description){
            editedLecture.description = description
        }
        await course.save()
        return res.status(200).json({
            success : true,
            message : "Lecture updated successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

/* Delete any lecture */

export const deleteLecture = async(req,res)=>{
    const {courseId,lectureId} = req.params
    try{
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({
                success : false,
                message : "Course not found"
            })
        }
        const index = course.lectures.findIndex((item)=>item._id.toString()===lectureId)
        if(index !== -1){
            const videoUrl = course.lectures[index].lecture
            const publicId = videoUrl.split('/').pop().split('.')[0]
            await cloudinary.v2.uploader.destroy(publicId)
            course.lectures.splice(index,1)
            await course.save()
            return res.status(200).json({
                success : true,
                message : "Lecture deleted successfully"
            })
        }
        return res.status(400).json({
            success : false,
            message : "Lecture not found"
        })
    }
    catch(err){

    }
}

/* Get all lectures */

export const getAllLectures = async(req,res)=>{
    const {courseId} = req.params
    try{
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({
                success : false,
                message : "Course not found"
            })
        }
        const lectures = course.lectures
        return res.status(200).json({
            success : true,
            data : lectures,
            message : "Lectures fetched successfully"
        })
    }   
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}