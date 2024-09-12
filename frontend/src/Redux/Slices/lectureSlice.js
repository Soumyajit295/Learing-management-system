import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_API_URL;

const initialState = {
  singleLecture: {},
  loading: false,
};

export const addLecture = createAsyncThunk(
  "/lecture/create",
  async ({ data, courseId }, { rejectWithValue }) => {
    try {
      const promise = axios.post(
        `${url}/api/v1/lectures/addlecture/${courseId}`,
        data,
        { withCredentials: true }
      );
      toast.promise(promise, {
        loading: "Adding lecture...",
        success: (res) => res?.data?.message || "Lecture added successfully!",
        error: (err) => err?.response?.data?.message || "Error adding lecture!",
      });
      return (await promise).data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLecture = createAsyncThunk(
  "/lectures/delete",
  async ({ courseId, lectureId }, { rejectWithValue }) => {
    try {
      const promise = axios.delete(
        `${url}/api/v1/lectures/deletelecture/${courseId}/${lectureId}`,
        { withCredentials: true }
      );
      toast.promise(promise, {
        loading: "Removing lecture...",
        success: (res) => res?.data?.message || "Lecture removed successfully!",
        error: (err) =>
          err?.response?.data?.message || "Error removing lecture!",
      });
      return (await promise).data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getSingleLecture = createAsyncThunk(
  "/lecture/getLecture",
  async ({ courseId, lectureId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/api/v1/courses/getcourse/${courseId}`,
        { withCredentials: true }
      );
      const lecture = response?.data?.lectures?.find(
        (lecture) => lecture._id === lectureId
      );
      if (!lecture) {
        throw new Error("Lecture not found");
      }
      return lecture;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editLecture = createAsyncThunk(
  "/lectures/edit",
  async ({ data, courseId, lectureId }, { rejectWithValue }) => {
    try {
      const promise = axios.put(
        `${url}/api/v1/lectures/editlecture/${courseId}/${lectureId}`,
        data,
        { withCredentials: true }
      );
      toast.promise(promise, {
        loading: "Updating lecture...",
        success: (res) => res?.data?.message || "Lecture updated successfully!",
        error: (err) =>
          err?.response?.data?.message || "Error updating lecture!",
      });
      return (await promise).data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleLecture.fulfilled, (state, action) => {
        state.singleLecture = action.payload;
      })
      .addCase(addLecture.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLecture.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addLecture.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default lectureSlice.reducer;
