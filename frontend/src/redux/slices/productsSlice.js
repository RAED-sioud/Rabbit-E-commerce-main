import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getBaseUrl = () =>
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('usertoken')}`,
});

export const fetchProductsByFilters = createAsyncThunk(
    'products/fetchByFilters',
    async ({
        collection, size, color, gender, minPrice, maxPrice,
        sortBy, search, category, material, brand, limit,
    }) => {
        const query = new URLSearchParams();
        if (collection) query.append('collection', collection);
        if (size) query.append('size', size);
        if (color) query.append('color', color);
        if (gender) query.append('gender', gender);
        if (minPrice) query.append('minPrice', minPrice);
        if (maxPrice) query.append('maxPrice', maxPrice);
        if (sortBy) query.append('sortBy', sortBy);
        if (search) query.append('search', search);
        if (category) query.append('category', category);
        if (material) query.append('material', material);
        if (brand) query.append('brand', brand);
        if (limit) query.append('limit', limit);
        const response = await axios.get(`${getBaseUrl()}/api/products?${query.toString()}`);
        return response.data;
    }
);

export const fetchProductDetails = createAsyncThunk(
    'products/fetchProductDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/products/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${getBaseUrl()}/api/products/${id}`,
                productData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchSimilarProducts = createAsyncThunk(
    'products/fetchSimilarProducts',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/products/similar/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin: fetch all products
export const fetchAdminProducts = createAsyncThunk(
    'products/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/admin/products`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin: delete product
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${getBaseUrl()}/api/products/${id}`, {
                headers: getAuthHeader(),
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        adminProducts: [],
        selectedProduct: null, //Store the details of the single Product
        similarProducts:[],
        loading: false,
        adminProductsLoading: false,
        error: null,
        filters:{
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection: "",
        }
    },
    reducers: {
        setFilters: (state , action) =>{
            state.filters = {...state.filters , ...action.payload};
        },
        clearFilters: (state) => {
            state.filters= {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            };
        }
    },
    extraReducers: (builder) =>{
        builder
        //handle fetching products with filter
        .addCase(fetchProductsByFilters.pending , (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductsByFilters.fulfilled , (state , action) => {
            state.loading = false;
            state.products = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(fetchProductsByFilters.rejected , (state , action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //handle fetching single product details
        .addCase(fetchProductDetails.pending , (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductDetails.fulfilled , (state , action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        })
        .addCase(fetchProductDetails.rejected , (state , action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //handle updating existing product
        .addCase(updateProduct.pending , (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled , (state , action) => {
            state.loading = false;
            const updatedProduct = action.payload?.updatedproduct || action.payload;
            if (updatedProduct) {
                const index = state.products.findIndex(
                    (p) => p._id === updatedProduct._id
                );
                if (index !== -1) state.products[index] = updatedProduct;
                const adminIndex = state.adminProducts.findIndex(
                    (p) => p._id === updatedProduct._id
                );
                if (adminIndex !== -1) state.adminProducts[adminIndex] = updatedProduct;
                if (state.selectedProduct?._id === updatedProduct._id) {
                    state.selectedProduct = updatedProduct;
                }
            }
        })
        .addCase(updateProduct.rejected , (state , action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchSimilarProducts.pending , (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSimilarProducts.fulfilled , (state , action) => {
            state.loading = false;
            state.similarProducts = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(fetchSimilarProducts.rejected , (state , action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchAdminProducts.pending, (state) => {
            state.adminProductsLoading = true;
            state.error = null;
        })
        .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.adminProductsLoading = false;
            state.adminProducts = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.adminProductsLoading = false;
            state.error = action.payload;
        })
        .addCase(deleteProduct.pending, (state) => {
            state.adminProductsLoading = true;
            state.error = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.adminProductsLoading = false;
            state.adminProducts = state.adminProducts.filter((p) => p._id !== action.payload);
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.adminProductsLoading = false;
            state.error = action.payload;
        });
    }
});

export const {setFilters , clearFilters} = productsSlice.actions;
export default productsSlice.reducer;