import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
import axios from 'axios';
import { toast } from 'sonner';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error } = useSelector((state) => state.products);
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(null);

    const [productData, setProductData] = React.useState({
        name: '',
        description: '',
        price: 0,
        countInStock: 0,
        sku: '',
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        collections: '',
        material: '',
        gender: '',
        images: [],
    });

    useEffect(() => {
        if (id) dispatch(fetchProductDetails(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedProduct && selectedProduct._id === id) {
            setProductData({
                name: selectedProduct.name || '',
                description: selectedProduct.description || '',
                price: selectedProduct.price ?? 0,
                countInStock: selectedProduct.countInStock ?? 0,
                sku: selectedProduct.sku || '',
                category: selectedProduct.category || '',
                brand: selectedProduct.brand || '',
                sizes: Array.isArray(selectedProduct.sizes) ? selectedProduct.sizes : [],
                colors: Array.isArray(selectedProduct.colors) ? selectedProduct.colors : [],
                collections: selectedProduct.collections || '',
                material: selectedProduct.material || '',
                gender: selectedProduct.gender || 'Unisex',
                images: Array.isArray(selectedProduct.images) && selectedProduct.images.length
                    ? selectedProduct.images.map((img) => ({
                          url: typeof img === 'string' ? img : img?.url || '',
                          alt: (typeof img === 'object' && (img?.alt || img?.altText)) ? (img.alt || img.altText) : '',
                      }))
                    : [],
            });
        }
    }, [selectedProduct, id]);

    useEffect(() => {
        if (error) toast.error(error?.message || 'Error loading product');
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSizesChange = (e) => {
        const val = e.target.value;
        setProductData((prev) => ({
            ...prev,
            sizes: val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [],
        }));
    };

    const handleColorsChange = (e) => {
        const val = e.target.value;
        setProductData((prev) => ({
            ...prev,
            colors: val ? val.split(',').map((c) => c.trim()).filter(Boolean) : [],
        }));
    };

    const handleImageUrlChange = (index, url) => {
        setProductData((prev) => {
            const next = { ...prev, images: [...prev.images] };
            next.images[index] = { ...next.images[index], url };
            return next;
        });
    };

    const handleImageFileChange = async (index, file) => {
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const token = localStorage.getItem('token') || localStorage.getItem('usertoken');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const imageUrl = response.data?.imageUrl;
            if (!imageUrl) throw new Error('Upload failed');
            handleImageUrlChange(index, imageUrl);
            toast.success('Image uploaded');
        } catch (err) {
            console.error(err);
            setUploadError(err?.response?.data?.message || err.message || 'Upload failed');
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const addImageField = () => {
        setProductData((prev) => ({
            ...prev,
            images: [...prev.images, { url: '', alt: '' }],
        }));
    };

    const removeImageField = (index) => {
        setProductData((prev) => {
            const nextImages = prev.images.filter((_, i) => i !== index);
            return { ...prev, images: nextImages };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedImages = (productData.images || [])
            .map((img) => ({
                ...img,
                url: typeof img.url === 'string' ? img.url.trim() : '',
            }))
            .filter((img) => img.url);

        dispatch(
            updateProduct({
                id,
                productData: {
                    ...productData,
                    images: cleanedImages,
                    price: Number(productData.price),
                    countInStock: Number(productData.countInStock),
                },
            })
        ).then((res) => {
            if (updateProduct.fulfilled.match(res)) {
                toast.success('Product updated');
                navigate('/admin/products');
            } else {
                toast.error('Update failed');
            }
        });
    };

    if (loading && !selectedProduct) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }

    if (!selectedProduct && !loading) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <p className="text-gray-500">Product not found.</p>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="mt-4 text-blue-500 hover:underline"
                >
                    Back to products
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={4}
                        required
                    />
                </div>
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            min={0}
                            step={0.01}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Count In Stock</label>
                        <input
                            type="number"
                            name="countInStock"
                            value={productData.countInStock}
                            onChange={handleChange}
                            min={0}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-2">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={productData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={productData.brand}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        value={(productData.sizes || []).join(', ')}
                        onChange={handleSizesChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="XS, S, M, L, XL"
                    />
                </div>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        value={(productData.colors || []).join(', ')}
                        onChange={handleColorsChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Black, White, Red"
                    />
                </div>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Gender</label>
                    <select
                        name="gender"
                        value={productData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Images</label>
                    {productData.images.length === 0 && (
                        <p className="text-sm text-gray-500 mb-2">No images yet. Add one below.</p>
                    )}
                    {productData.images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(index, e.target.files?.[0])}
                                className="text-sm"
                            />
                            <input
                                type="url"
                                value={img.url}
                                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md p-2"
                                placeholder="Image URL"
                            />
                            <img
                                src={img.url || 'https://via.placeholder.com/80'}
                                alt=""
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addImageField}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Add Image
                    </button>
                    {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                    {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        Update Product
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;
