import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";

//Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {products: []};
}

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart" , JSON.stringify(cart));
}

const getBaseUrl = () =>
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

//Fetch cart for a user or guest (backend expects query params: userId, guestId)
export const fetchCart = createAsyncThunk("cart/fetchCart",
    async ({ userId, guestID }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/cart`, {
                params: { userId, guestId: guestID },
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { products: [], totalPrice: 0 };
            }
            console.error("Error fetching cart:", error);
            return rejectWithValue("Failed to fetch cart");
        }
    }
);

//Add an item to the cart for a user or guest (backend: POST /api/cart)
export const addToCart = createAsyncThunk("cart/addToCart", async (
    { productID, quantity, size, color, guestId, userId },
    { rejectWithValue }
) => {
    try {
        const response = await axios.post(`${getBaseUrl()}/api/cart`, {
            productId: productID,
            quantity,
            size,
            color,
            guestId,
            userId,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

//Update the quantity of an item in the cart (backend expects productId in body)
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productID, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${getBaseUrl()}/api/cart`, {
                productId: productID,
                quantity,
                guestId,
                userId,
                size,
                color,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Remove an item from the cart (backend expects productId in body)
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productID, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios({
                method: "delete",
                url: `${getBaseUrl()}/api/cart`,
                data: { productId: productID, guestId, userId, size, color },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestId, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${getBaseUrl()}/api/cart/merge`,
                { guestId, userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("usertoken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) =>{
            state.cart = {products: []};
            localStorage.removeItem("cart");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(state.cart);
            })
            .addCase(fetchCart.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(state.cart);
            })
            .addCase(addToCart.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Failed to add cart";
            })
            .addCase(updateCartItemQuantity.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(state.cart);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity";
            })
            .addCase(removeFromCart.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(state.cart);
            })
            .addCase(removeFromCart.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove cart";
            })
            .addCase(mergeCart.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(state.cart);
            })
            .addCase(mergeCart.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            })

    }
})

export const {clearCart} = cartSlice.actions;

export default cartSlice.reducer;