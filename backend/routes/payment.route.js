import {Router} from 'express'
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import { createOrder, getPayments, getRazorpayKey, verifyPayment } from '../controllers/payment.controller.js';

const paymentRouter = Router()

paymentRouter.route('/createorder').post(isLoggedIn,createOrder)
paymentRouter.route('/verifypayment').post(isLoggedIn,verifyPayment)
paymentRouter.route('/getkey').get(getRazorpayKey)
paymentRouter.route('/getpayments').get(isLoggedIn,isAdmin,getPayments)

export default paymentRouter