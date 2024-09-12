import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Course name is required"]
    },
    description : {
        type : String,
        required : [true,"Course description is required"]
    },
    thumbnail : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    lectures : [
        {
            title : {
                type : String,
                required : [true,"Lecture title is required"]
            },
            description : {
                type : String,
                required : [true,"Lecture description is required"]
            },
            lecture : {
                type : String,
                required : true
            },
            addedOn : {
                type : Date,
                default : Date.now
            }
        }
    ]
},{
    timestamps : true
})

const Course = mongoose.model('Course',courseSchema)

export default Course