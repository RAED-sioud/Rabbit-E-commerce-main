import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import ProductGrid from './ProductGrid';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user, guestId } = useSelector((state) => state.auth);
    const { selectedProduct, similarProducts, loading } = useSelector((state) => state.products);

    const [mainImage, setMainImage] = React.useState('');
    const [selectedSize, setSelectedSize] = React.useState('');
    const [selectedColor, setSelectedColor] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [adding, setAdding] = React.useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
            dispatch(fetchSimilarProducts({ id }));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            const first = selectedProduct.images[0];
            const url = typeof first === 'string' ? first : first?.url;
            if (url) setMainImage(url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (type) => {
        if (type === 'plus') setQuantity((q) => q + 1);
        else if (type === 'minus' && quantity > 1) setQuantity((q) => q - 1);
    };

    const handleAddToCart = () => {
        const sizes = selectedProduct?.sizes || [];
        const colors = selectedProduct?.colors || [];
        const needSize = sizes.length > 0;
        const needColor = colors.length > 0;
        if (needSize && !selectedSize) {
            toast.error('Please select a size.');
            return;
        }
        if (needColor && !selectedColor) {
            toast.error('Please select a color.');
            return;
        }
        setAdding(true);
        const imageUrl = selectedProduct?.images?.[0];
        const img = typeof imageUrl === 'string' ? imageUrl : imageUrl?.url || '';
        dispatch(
            addToCart({
                productID: selectedProduct._id,
                quantity,
                size: selectedSize || undefined,
                color: selectedColor || undefined,
                guestId: user ? undefined : guestId,
                userId: user?._id,
            })
        ).then((res) => {
            setAdding(false);
            if (addToCart.fulfilled.match(res)) {
                toast.success('Product added to cart.');
            } else {
                toast.error(res.error?.message || 'Failed to add to cart');
            }
        });
    };

    if (loading && !selectedProduct) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }
    if (!selectedProduct) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <p className="text-gray-500">Product not found.</p>
            </div>
        );
    }

    const images = selectedProduct.images || [];
    const imgList = images.map((im) => (typeof im === 'string' ? { url: im, alt: '' } : { url: im?.url || '', alt: im?.alt || '' }));
    const sizes = selectedProduct.sizes || [];
    const colors = selectedProduct.colors || [];
    const price = selectedProduct.discountPrice ?? selectedProduct.price;
    const originalPrice = selectedProduct.discountPrice != null ? selectedProduct.price : null;

    return (
        <div className="p-6">
            <div className="max-w-6xl p-8 mx-auto bg-white rounded-lg">
                <div className="flex flex-col md:flex-row">
                    <div className="flex-col hidden mr-6 space-y-4 md:flex">
                        {imgList.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.alt}
                                className={`object-cover w-20 h-20 border rounded-lg cursor-pointer ${
                                    mainImage === image.url ? 'border-black' : 'border-gray-300'
                                }`}
                                onClick={() => setMainImage(image.url)}
                            />
                        ))}
                    </div>
                    <div className="md:w-1/2">
                        <div className="mb-4">
                            <img
                                src={mainImage || imgList[0]?.url}
                                alt={selectedProduct.name}
                                className="object-cover w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="flex mb-4 space-x-4 md:hidden overflow-x-auto">
                        {imgList.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.alt}
                                className={`object-cover w-20 h-20 border rounded-lg cursor-pointer shrink-0 ${
                                    mainImage === image.url ? 'border-black' : 'border-gray-300'
                                }`}
                                onClick={() => setMainImage(image.url)}
                            />
                        ))}
                    </div>
                    <div className="md:w-1/2 md:ml-10">
                        <h1 className="mb-2 text-2xl font-semibold md:text-3xl">
                            {selectedProduct.name}
                        </h1>
                        {originalPrice != null && (
                            <p className="mb-1 text-lg text-gray-600 line-through">
                                ${originalPrice}
                            </p>
                        )}
                        <p className="mb-2 text-xl text-gray-500">${price}</p>
                        <p className="mb-4 text-gray-600">{selectedProduct.description}</p>
                        {colors.length > 0 && (
                            <div className="mb-4">
                                <p className="text-gray-700">Color:</p>
                                <div className="flex gap-2 mt-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`min-w-8 h-8 px-2 border rounded-full text-xs ${
                                                selectedColor === color ? 'border-black' : 'border-gray-300'
                                            }`}
                                            style={
                                                isValidColor(color)
                                                    ? { backgroundColor: color, filter: 'brightness(0.95)' }
                                                    : { backgroundColor: '#f3f4f6' }
                                            }
                                            title={color}
                                        >
                                            {!isValidColor(color) ? color : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {sizes.length > 0 && (
                            <div className="mb-4">
                                <p className="text-gray-700">Size:</p>
                                <div className="flex gap-2 mt-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded ${
                                                selectedSize === size ? 'bg-black text-white' : ''
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-6">
                            <p className="text-gray-700">Quantity:</p>
                            <div className="flex items-center mt-2 space-x-4">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange('minus')}
                                    className="px-2 py-1 text-lg bg-gray-200 rounded"
                                >
                                    -
                                </button>
                                <span className="text-lg">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange('plus')}
                                    className="px-2 py-1 text-lg bg-gray-200 rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={adding}
                            className={`w-full px-6 py-2 mb-4 text-white bg-black rounded ${
                                adding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                            }`}
                        >
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <div className="mt-10 text-gray-700">
                            <h3 className="mb-4 text-xl font-bold">Details</h3>
                            <table className="w-full text-sm text-left text-gray-600">
                                <tbody>
                                    {selectedProduct.brand && (
                                        <tr>
                                            <td className="py-1">Brand</td>
                                            <td className="py-1">{selectedProduct.brand}</td>
                                        </tr>
                                    )}
                                    {selectedProduct.material && (
                                        <tr>
                                            <td className="py-1">Material</td>
                                            <td className="py-1">{selectedProduct.material}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {similarProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="mb-4 text-2xl font-medium text-center">
                            You may also like
                        </h2>
                        <ProductGrid products={similarProducts} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
    const isValidColor = (value) => {
        if (!value) return false;
        if (typeof window === 'undefined' || !window.CSS || !window.CSS.supports) return true;
        return CSS.supports('color', value);
    };
