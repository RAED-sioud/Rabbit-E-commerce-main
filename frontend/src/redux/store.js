import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import ordersReducer from './slices/ordersSlice';
import adminOrdersReducer from './slices/adminOrdersSlice';
import adminUsersReducer from './slices/adminUsersSlice';
import subscriberReducer from './slices/subscriberSlice';
import adminSubscribersReducer from './slices/adminSubscribersSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders: ordersReducer,
        adminOrders: adminOrdersReducer,
        adminUsers: adminUsersReducer,
        adminSubscribers: adminSubscribersReducer,
        subscriber: subscriberReducer,
    },
});

export default store;
