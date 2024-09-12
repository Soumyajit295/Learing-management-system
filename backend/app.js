import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import courseRouter from './routes/course.route.js'
import lectureRouter from './routes/lecture.route.js'
import paymentRouter from './routes/payment.route.js'
import userRouter from './routes/user.route.js'

const app = express()

app.use(express.json({limit : '50mb'}))
app.use(express.urlencoded({extended : true,limit : '50mb'}))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser())

app.use('/api/v1/users',userRouter)
app.use('/api/v1/courses',courseRouter)
app.use('/api/v1/lectures',lectureRouter)
app.use('/api/v1/payments',paymentRouter)

export default app