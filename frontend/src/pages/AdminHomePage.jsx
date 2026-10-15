import React from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../redux/slices/adminOrdersSlice';
import { fetchAdminProducts } from '../redux/slices/productsSlice';

const AdminHomePage = () => {

    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.adminOrders);
    const { adminProducts, adminProductsLoading } = useSelector((state) => state.products);

    React.useEffect(() => {
        dispatch(fetchAllOrders());
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const totalRevenue = (orders || []).reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders?.length || 0;
    const completedOrders = (orders || []).filter(
        (order) => order.status === 'Delivered' || order.status === 'Completed'
    ).length;
    const totalProducts = adminProducts?.length || 0;

    const recentOrders = [...(orders || [])]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
  return (
    <div className='max-w-7xl mx-auto p-6'>
        <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='p-4 shadow-md rounded-lg'>
                <h2 className='text-xl font-semibold'>Revenue</h2>
                <p className='text-2xl '>${totalRevenue.toFixed(2)}</p>
            </div>
            <div className='p-4 shadow-md rounded-lg'>
                <h2 className='text-xl font-semibold'>Total Orders</h2>
                <p className='text-2xl '>{totalOrders}</p>
                <p className='text-sm text-gray-500'>Completed: {completedOrders}</p>
                <Link to="/admin/orders" className='text-blue-500 hover:underline'>
                    Manage Orders
                </Link>
            </div>
            <div className='p-4 shadow-md rounded-lg'>
                <h2 className='text-xl font-semibold'>Total Products</h2>
                <p className='text-2xl '>{totalProducts}</p>
                <Link to="/admin/products" className='text-blue-500 hover:underline'>
                    Manage Products
                </Link>
            </div>
        </div>
        <div className='mt-6'>
            <h2 className='text-2xl font-bold mb-4'>Recent Orders</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Order ID</th>
                            <th className='py-3 px-4'>User</th>
                            <th className='py-3 px-4'>Total Price</th>
                            <th className='py-3 px-4'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading || adminProductsLoading ? (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    Loading orders...
                                </td>
                            </tr>
                        ) : recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <tr key={order._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                                    <td className='p-4'>{order._id}</td>
                                    <td className='p-4'>{order.user?.name || '—'}</td>
                                    <td className='p-4'>${order.totalPrice}</td>
                                    <td className='p-4'>{order.status || 'Processing'}</td>
                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    No recent orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default AdminHomePage
