import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminSubscribers } from '../../redux/slices/adminSubscribersSlice';

const SubscriberManagement = () => {
    const dispatch = useDispatch();
    const { subscribers, loading, error } = useSelector((state) => state.adminSubscribers);

    React.useEffect(() => {
        dispatch(fetchAdminSubscribers());
    }, [dispatch]);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Subscribers</h2>
            {error && <p className="mb-4 text-red-600">{error?.message || error}</p>}
            <div className="overflow-x-auto shadow-sm sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={2} className="p-4 text-center text-gray-500">
                                    Loading subscribers...
                                </td>
                            </tr>
                        ) : subscribers.length > 0 ? (
                            subscribers.map((subscriber) => (
                                <tr key={subscriber._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{subscriber.email}</td>
                                    <td className="p-4">
                                        {subscriber.subscribedAt
                                            ? new Date(subscriber.subscribedAt).toLocaleString()
                                            : '—'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="p-4 text-center text-gray-500">
                                    No subscribers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriberManagement;
