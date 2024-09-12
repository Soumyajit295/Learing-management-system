import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initialState = {
  order: null,
  loading: false,
  error: null,
  paymentSuccess: null,
  key: null,
  payments: [],
};

export const createOrder = createAsyncThunk(
  "/payment/createorder",
  async ({ amount, courseId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/api/v1/payments/createorder`, {
        amount,
        courseId,
      }, {
        withCredentials: true,
      });
      return response?.data?.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "/payment/verifypayment",
  async ({ paymentData, userId, courseId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/api/v1/payments/verifypayment`, {
        ...paymentData,
        userId,
        courseId,
      }, {
        withCredentials: true,
      });
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getKey = createAsyncThunk(
  "/payments/getkey",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/api/v1/payments/getkey`, {
        withCredentials: true, 
      });
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getPayments = createAsyncThunk(
  "/payments/getpayments",
  async (_, { rejectWithValue }) => {
    try {
      const promise = await axios.get(`${url}/api/v1/payments/getpayments`, {
        withCredentials: true, 
      });
      return promise.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.order = payload;
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.paymentSuccess = payload.success;
      })
      .addCase(verifyPayment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(getKey.fulfilled, (state, { payload }) => {
        state.key = payload?.key;
      })

      .addCase(getPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPayments.fulfilled, (state, { payload }) => {
        state.payments = payload?.data || [];
        state.loading = false;
      });
  },
});

export default paymentSlice.reducer;
