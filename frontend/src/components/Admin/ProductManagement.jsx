import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, deleteProduct } from '../../redux/slices/productsSlice';
import { toast } from 'sonner';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { adminProducts, adminProductsLoading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error?.message || error);
    }, [error]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Products Management</h2>
            {adminProductsLoading && adminProducts.length === 0 ? (
                <p className="text-gray-500">Loading products...</p>
            ) : (
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="min-w-full text-left text-gray-500">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Sku</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminProducts.length > 0 ? (
                                adminProducts.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                                            {product.name}
                                        </td>
                                        <td className="p-4">${product.price}</td>
                                        <td className="p-4">{product.sku || '—'}</td>
                                        <td className="p-4">
                                            <Link
                                                to={`/admin/products/${product._id}/edit`}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
