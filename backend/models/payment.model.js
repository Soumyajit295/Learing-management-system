import mongoose from "mongoose";

const paymentScehma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
},{
    timestamps : true
})

const Payment = mongoose.model('Payment',paymentScehma)

export default Payment
