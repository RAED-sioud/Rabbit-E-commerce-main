import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('usertoken')}`,
});

// Create checkout session
export const createCheckout = createAsyncThunk(
    'checkout/createCheckout',
    async (
        { checkoutItems, shippingAddress, paymentMethod, totalPrice },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                { checkoutItems, shippingAddress, paymentMethod, totalPrice },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Mark checkout as paid (after payment success)
export const updateCheckoutPay = createAsyncThunk(
    'checkout/updateCheckoutPay',
    async ({ checkoutId, paymentStatus, paymentDetails }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus, paymentDetails },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Finalize checkout → creates order and clears cart
export const finalizeCheckout = createAsyncThunk(
    'checkout/finalizeCheckout',
    async (checkoutId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        currentCheckout: null,
        finalOrder: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCheckout: (state) => {
            state.currentCheckout = null;
            state.finalOrder = null;
            state.error = null;
        },
        clearFinalOrder: (state) => {
            state.finalOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // createCheckout
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCheckout = action.payload;
                state.error = null;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create checkout';
            })
            // updateCheckoutPay
            .addCase(updateCheckoutPay.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCheckoutPay.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCheckout = action.payload;
                state.error = null;
            })
            .addCase(updateCheckoutPay.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Payment update failed';
            })
            // finalizeCheckout
            .addCase(finalizeCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finalizeCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.finalOrder = action.payload;
                state.currentCheckout = null;
                state.error = null;
            })
            .addCase(finalizeCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to finalize checkout';
            });
    },
});

export const { clearCheckout, clearFinalOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer;
