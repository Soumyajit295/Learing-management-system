import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import courseSlice from "./Slices/courseSlice";
import paymentSlice from "./Slices/paymentSlice";
import lectureSlice from "./Slices/lectureSlice";

const store = configureStore({
    reducer : {
        user : userSlice,
        course : courseSlice,
        payment : paymentSlice,
        lecture : lectureSlice
    }
})

export default store