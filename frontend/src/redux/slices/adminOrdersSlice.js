import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('usertoken')}`,
});

// Get all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
    'adminOrders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update order status (Admin)
export const updateOrderStatus = createAsyncThunk(
    'adminOrders/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${orderId}`,
                { status },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete order (Admin)
export const deleteOrder = createAsyncThunk(
    'adminOrders/deleteOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${orderId}`,
                { headers: getAuthHeader() }
            );
            return orderId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const adminOrdersSlice = createSlice({
    name: 'adminOrders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAdminOrdersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch orders';
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { updatedOrder } = action.payload || {};
                if (updatedOrder) {
                    const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
                    if (index !== -1) state.orders[index] = updatedOrder;
                }
                state.error = null;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update order';
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((o) => o._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete order';
            });
    },
});

export const { clearAdminOrdersError } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
