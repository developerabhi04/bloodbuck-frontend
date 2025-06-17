import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";



// ✅ Fetch All Payments (Admin)
export const fetchPayments = createAsyncThunk("payment/fetchPayments",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${server}/payment/all-payments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.payments; // List of payments
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create the Payment Slice
const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        payments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Fetch Payments
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload; // Store list of payments
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default paymentSlice.reducer;
