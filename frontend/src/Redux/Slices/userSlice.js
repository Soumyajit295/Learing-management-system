import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import toast from "react-hot-toast";

const url = import.meta.env.VITE_API_URL

const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    role: localStorage.getItem('role') || '',
    userData: JSON.parse(localStorage.getItem('userData')) || {}, 
    totalUsers: 0
};

export const register = createAsyncThunk('/user/register', async (data, { rejectWithValue }) => {
    try {
        const promise = axios.post(`${url}/api/v1/users/register`, data, { withCredentials: true });
        toast.promise(promise, {
            loading: "Registering user",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const login = createAsyncThunk('/user/login', async (data, { rejectWithValue }) => {
    try {
        const promise = axios.post(`${url}/api/v1/users/login`, data, { withCredentials: true });
        toast.promise(promise, {
            loading: "Wait a minute",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const logout = createAsyncThunk('/user/logout', async (_, { rejectWithValue }) => {
    try {
        const promise = axios.get(`${url}/api/v1/users/logout`, { withCredentials: true });
        toast.promise(promise, {
            loading: "Logging out",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const changePassword = createAsyncThunk('/user/changePassword', async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
        const promise = axios.post(`${url}/api/v1/users/changepassword`, { oldPassword, newPassword }, { withCredentials: true });
        toast.promise(promise, {
            loading: "Changing password",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const changeUserName = createAsyncThunk('/user/changename', async (name, { rejectWithValue }) => {
    try {
        const promise = axios.post(`${url}/api/v1/users/changeusername`, { name }, { withCredentials: true });
        toast.promise(promise, {
            loading: "Changing username",
            success: (res) => res?.data?.message,
            error: (err) => err?.response?.data?.message
        });
        return (await promise).data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const getUserDetails = createAsyncThunk('/user/userdetails', async (userId, { rejectWithValue }) => {
    try {
        console.log("UserId from redux: ", userId);
        const response = await axios.get(`${url}/api/v1/users/getprofile/${userId}`, { withCredentials: true });
        return response.data;  
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


export const getTotalUsers = createAsyncThunk('/users/gettotalusers', async (_, { rejectWithValue }) => {
    try {
        const promise = await axios.get(`${url}/api/v1/users/gettotaluser`, { withCredentials: true });
        return promise.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('role', action?.payload?.data?.role);
            localStorage.setItem('userData', JSON.stringify(action?.payload?.data));
            state.isLoggedIn = true;
            state.role = action?.payload?.data?.role;
            state.userData = action?.payload?.data;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.role = '';
            state.userData = {};
        });
        builder.addCase(getUserDetails.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                localStorage.setItem('userData', JSON.stringify(action.payload.data));
                state.userData = action.payload.data;
            }
        });
        
        
        builder.addCase(changeUserName.fulfilled, (state, action) => {
            localStorage.setItem('userData', JSON.stringify(action?.payload?.data));
            state.userData = action?.payload?.data;
        });
        builder.addCase(getTotalUsers.fulfilled, (state, action) => {
            console.log("Payload : ",action?.payload)
            state.totalUsers = action?.payload?.count;
        });
    }
});

export default userSlice.reducer;
