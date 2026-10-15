import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";

//Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

//Retrieve guest ID from localStorage if available or generate a new one
const initialGuestId = 
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
    localStorage.setItem("guestId" , initialGuestId);

//Initial State
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
}

//Async Thunk for User Login
export const loginUser = createAsyncThunk(
        "auth/loginUser" 
        , async(userData , {rejectWithValue}) =>{
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                    userData
                )
                localStorage.setItem("userInfo" , JSON.stringify(response.data.user));
                localStorage.setItem("token" , response.data.token);
                return response.data.user; // Return the user object from the response
            } catch (error) {
                return rejectWithValue(error.response.data);
            }
        }
);

//Async Thunk for User Registration
export const registerUser = createAsyncThunk(
        "auth/registerUser" 
        , async(userData , {rejectWithValue}) =>{
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                    userData
                )
                localStorage.setItem("userInfo" , JSON.stringify(response.data.user));
                localStorage.setItem("token" , response.data.token);
                return response.data.user; // Return the user object from the response
            } catch (error) {
                return rejectWithValue(error.response.data);
            }
        }
);

//Async Thunk to fetch user profile (protected)
export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("usertoken");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; //Reset guest Id on logout 
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            localStorage.removeItem("usertoken");
            localStorage.setItem("guestId" , state.guestId); //Set new guest Id in localStorage
        },
        generateNewGuestId: (state) =>{
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId" , state.guestId);
        }
    },
    extraReducers: (builder) =>{
        builder
            .addCase(loginUser.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled , (state , action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected , (state , action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(registerUser.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled , (state , action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected , (state , action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const {logout , generateNewGuestId} = authSlice.actions;
export default authSlice.reducer;