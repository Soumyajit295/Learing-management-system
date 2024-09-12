import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../index.js";
import crypto from 'crypto';


export const createOrder = async (req, res) => {
    const { amount, courseId } = req.body;

    if (!courseId || !amount) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }

    try {
        const options = {
            amount: Number(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${courseId}`,
        };
        const order = await razorpay.orders.create(options);
        if (order) {
            return res.status(200).json({
                success: true,
                order,
            });
        }
    } catch (err) {
        console.log("Error from createOrder : ",err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, courseId } = req.body;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body)
            .digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            const user = await User.findById(userId);
            if (!user.courses.includes(courseId)) {
                user.courses.push(courseId);
                await user.save();
            }

            const payment = new Payment({
                user: userId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            await payment.save();

            return res.status(200).json({
                success: true,
                message: "Course purchase successful",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay signature",
            });
        }
    } catch (err) {
        console.log("Error from verify payment : ",err.message)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getRazorpayKey = async(req,res)=>{
    return res.status(200).json({
        success : true,
        key : process.env.RAZORPAY_KEY_ID
    })
}

export const getPayments = async(req,res)=>{
    try{
        const payments = await Payment.find().populate('user','name')
        return res.status(200).json({
            success : true,
            data : payments,
            message : "Payments fetched successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}