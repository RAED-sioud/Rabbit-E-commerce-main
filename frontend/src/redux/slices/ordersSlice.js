import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('usertoken')}`,
});

// Get logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get single order by ID
export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        selectedOrder: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch orders';
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
                state.error = null;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch order';
            });
    },
});

export const { clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
