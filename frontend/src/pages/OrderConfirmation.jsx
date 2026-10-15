import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const location = useLocation();
    const order = location.state?.order;

    const calculateEstimatedDelivery = (createdAt) => {
        if (!createdAt) return '—';
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 5);
        return orderDate.toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                THANK YOU FOR YOUR ORDER!
            </h1>
            {order ? (
                <div className="p-6 rounded-lg border">
                    <div className="flex justify-between mb-20">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Order ID: {order._id?.slice(-8)}
                            </h2>
                            <p className="text-gray-500">
                                Order date:{' '}
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-emerald-700 text-sm">
                                Estimated Delivery:{' '}
                                {calculateEstimatedDelivery(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="mb-20">
                        {(order.orderItems || order.checkoutItems || []).map((item, i) => (
                            <div
                                key={item.productId?._id || i}
                                className="flex items-center mb-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                />
                                <div>
                                    <h4 className="text-md font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        {item.color || ''} | {item.size || ''}
                                    </p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-md">${item.price}</p>
                                    <p className="text-sm text-gray-500">
                                        QTY: {item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Payment</h4>
                            <p className="text-gray-600">
                                {order.paymentMethod || 'PayPal'}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                            {order.shippingAddress ? (
                                <>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.address}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.city},{' '}
                                        {order.shippingAddress.country}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-600">—</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8">
                        <Link
                            to="/my-orders"
                            className="text-blue-500 hover:underline"
                        >
                            View my orders
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-lg border text-center text-gray-600">
                    <p>Order details are not available on this page.</p>
                    <Link to="/my-orders" className="text-blue-500 hover:underline mt-2 inline-block">
                        Go to My Orders
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrderConfirmation;
