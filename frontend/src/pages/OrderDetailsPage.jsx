import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, clearSelectedOrder } from '../redux/slices/ordersSlice';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedOrder, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        if (id) dispatch(fetchOrderById(id));
        return () => dispatch(clearSelectedOrder());
    }, [id, dispatch]);

    if (loading && !selectedOrder) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <p className="text-gray-500">Loading order...</p>
            </div>
        );
    }

    if (error || !selectedOrder) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <p className="text-red-600">{error || 'Order not found.'}</p>
                <Link to="/my-orders" className="text-blue-500 hover:underline">
                    Back to My Orders
                </Link>
            </div>
        );
    }

    const order = selectedOrder;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
            <div className="p-4 sm:p-6 rounded-lg border">
                <div className="flex flex-col sm:flex-row justify-between mb-8">
                    <div>
                        <h3 className="text-lg md:text-xl font-semibold">
                            Order ID: #{order._id?.slice(-8)}
                        </h3>
                        <p className="text-gray-600">
                            {order.createdAt &&
                                new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                        <span
                            className={`${
                                order.isPaid
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                        >
                            {order.isPaid ? 'Approved' : 'Pending'}
                        </span>
                        <span
                            className={`${
                                order.isDelivered
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                        >
                            {order.isDelivered ? 'Delivered' : 'Pending Delivery'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                        <p>Payment Method: {order.paymentMethod || '—'}</p>
                        <p>Status: {order.isPaid ? 'Paid' : 'Unpaid'}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                        <p>
                            Address:{' '}
                            {order.shippingAddress
                                ? `${order.shippingAddress.address || ''}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                : '—'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <h4 className="text-lg font-semibold mb-4">Products</h4>
                    <table className="min-w-full text-gray-600 mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Unit Price</th>
                                <th className="py-2 px-4">Quantity</th>
                                <th className="py-2 px-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.orderItems || []).map((item, idx) => (
                                <tr key={item.productId?._id || idx} className="border-b">
                                    <td className="py-2 px-4 flex items-center">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg mr-4"
                                            />
                                        )}
                                        <Link
                                            to={`/product/${item.productId?._id || item.productId}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4">${item.price}</td>
                                    <td className="py-2 px-4">{item.quantity}</td>
                                    <td className="py-2 px-4">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Link to="/my-orders" className="text-blue-500 hover:underline">
                    Back to My Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
