import dotenv from 'dotenv'
import app from './app.js'
import { connectToDb } from './db/db.js'
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay';

dotenv.config({
    path : '.env'
})

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

cloudinary.v2.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUDINARY_APIKEY,
    api_secret : process.env.CLOUDINARY_APISECRET
})

const port = process.env.PORT || 3000

connectToDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server listen on port : ${port}`)
    })
})
.catch((err)=>{
    console.log(err.message)
})

