import mongoose from "mongoose";

export const connectToDb = async()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((conn)=>{
        console.log(`Database connected successfully`)
    })
    .catch((err)=>{
        console.log(`Database connection failed`)
    })
}
