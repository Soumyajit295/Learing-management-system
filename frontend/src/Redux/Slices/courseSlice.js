import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_API_URL;

const initialState = {
    courses: [],
    singleCourse: JSON.parse(localStorage.getItem('singleCourse')) || {},
    isLoading: true,
    totalCourses: 0
};


export const getAllCourses = createAsyncThunk('/course/getAllCourses', async (_, { rejectWithValue }) => {
    try {
        const promise = await axios.get(`${url}/api/v1/courses/getallcourses`, { withCredentials: true });
        return promise.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


export const getSingleCourse = createAsyncThunk('/course/getSingleCourse', async (courseId, { rejectWithValue }) => {
    try {
        const promise = await axios.get(`${url}/api/v1/courses/getcourse/${courseId}`, { withCredentials: true });
        return promise.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


export const createCourse = createAsyncThunk('/course/createCourse', async (data, { rejectWithValue }) => {
    try {
        const promise = axios.post(`${url}/api/v1/courses/createcourse`, data, { withCredentials: true });
        toast.promise(promise, {
            loading: "Creating course...",
            success: (res) => res?.data?.message || "Course created successfully!",
            error: (err) => err?.response?.data?.message || "Error creating course!"
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


export const dropCourse = createAsyncThunk('/course/deleteCourse', async (courseId, { rejectWithValue }) => {
    try {
        const promise = axios.delete(`${url}/api/v1/courses/deletecourse/${courseId}`, { withCredentials: true });
        toast.promise(promise, {
            loading: "Deleting the course...",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const editCourse = createAsyncThunk('/course/editCourse', async ({ data, courseId }, { rejectWithValue }) => {
    try {
        const promise = axios.put(`${url}/api/v1/courses/editcourse/${courseId}`, data, { withCredentials: true });
        toast.promise(promise, {
            loading: "Updating course...",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const getTotalCourses = createAsyncThunk('/courses/getTotalCourses', async (_, { rejectWithValue }) => {
    try {
        const promise = await axios.get(`${url}/api/v1/courses/gettotalcourses`, { withCredentials: true });
        return promise.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            state.courses = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getSingleCourse.pending, (state) => {
            localStorage.setItem('singleCourse', '{}');
            state.singleCourse = {};
            state.isLoading = true;
        });
        builder.addCase(getSingleCourse.fulfilled, (state, action) => {
            localStorage.setItem('singleCourse', JSON.stringify(action?.payload?.data));
            state.singleCourse = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getTotalCourses.fulfilled, (state, action) => {
            state.totalCourses = action?.payload?.count;
        });
    }
});

export default courseSlice.reducer;
