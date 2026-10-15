import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const subscribeNewsletter = createAsyncThunk(
    'subscriber/subscribeNewsletter',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/subscriber/subscribe`,
                { email }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const subscriberSlice = createSlice({
    name: 'subscriber',
    initialState: {
        success: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetSubscriber: (state) => {
            state.success = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeNewsletter.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(subscribeNewsletter.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message || 'Subscribed successfully';
                state.error = null;
            })
            .addCase(subscribeNewsletter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Subscription failed';
                state.success = null;
            });
    },
});

export const { resetSubscriber } = subscriberSlice.actions;
export default subscriberSlice.reducer;
