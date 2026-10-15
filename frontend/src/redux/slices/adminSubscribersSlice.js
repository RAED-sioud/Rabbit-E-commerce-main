import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('usertoken')}`,
});

export const fetchAdminSubscribers = createAsyncThunk(
    'adminSubscribers/fetchAdminSubscribers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/subscribers`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const adminSubscribersSlice = createSlice({
    name: 'adminSubscribers',
    initialState: {
        subscribers: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAdminSubscribersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminSubscribers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminSubscribers.fulfilled, (state, action) => {
                state.loading = false;
                state.subscribers = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchAdminSubscribers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch subscribers';
            });
    },
});

export const { clearAdminSubscribersError } = adminSubscribersSlice.actions;
export default adminSubscribersSlice.reducer;
