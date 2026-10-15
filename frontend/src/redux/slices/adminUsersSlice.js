import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('usertoken')}`,
});

export const fetchAdminUsers = createAsyncThunk(
    'adminUsers/fetchAdminUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createUser = createAsyncThunk(
    'adminUsers/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'adminUsers/updateUserRole',
    async ({ userId, name, email, role }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
                { name, email, role },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'adminUsers/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
                { headers: getAuthHeader() }
            );
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const adminUsersSlice = createSlice({
    name: 'adminUsers',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAdminUsersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.user) {
                    state.users.push(action.payload.user);
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create user';
            })
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload?.updatedUser;
                if (updated) {
                    const i = state.users.findIndex((u) => u._id === updated._id);
                    if (i !== -1) state.users[i] = updated;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update user';
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((u) => u._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete user';
            });
    },
});

export const { clearAdminUsersError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
