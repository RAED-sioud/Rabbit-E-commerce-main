import React, { useEffect } from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
} from '../../redux/slices/cartSlice';
import { toast } from 'sonner';

const CartContents = () => {
    const dispatch = useDispatch();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart, loading, error } = useSelector((state) => state.cart);

    const products = cart?.products || [];

    useEffect(() => {
        dispatch(fetchCart({ userId: user?._id, guestID: guestId }));
    }, [dispatch, user?._id, guestId]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleQuantityChange = (productId, size, color, currentQty, delta) => {
        const newQty = Math.max(1, currentQty + delta);
        dispatch(
            updateCartItemQuantity({
                productID: productId,
                quantity: newQty,
                guestId: user ? undefined : guestId,
                userId: user?._id,
                size,
                color,
            })
        );
    };

    const handleRemove = (productId, size, color) => {
        dispatch(
            removeFromCart({
                productID: productId,
                guestId: user ? undefined : guestId,
                userId: user?._id,
                size,
                color,
            })
        );
    };

    if (loading && products.length === 0) {
        return (
            <div className="py-4 text-center text-gray-500">
                Loading cart...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <p className="py-6 text-center text-gray-500">Your cart is empty.</p>
        );
    }

    return (
        <>
            {products.map((product, index) => {
                const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
                const qty = product.quantity || 1;
                return (
                    <div
                        key={`${product.productId}-${product.size || ''}-${product.color || ''}-${index}`}
                        className="flex items-start justify-between py-4 border-b"
                    >
                        <div className="flex items-start gap-3">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    size: {product.size || '—'} | color: {product.color || '—'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                product.productId,
                                                product.size,
                                                product.color,
                                                qty,
                                                -1
                                            )
                                        }
                                        disabled={qty <= 1}
                                        className="border rounded px-2 py-1 text-xl font-medium disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{qty}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                product.productId,
                                                product.size,
                                                product.color,
                                                qty,
                                                1
                                            )
                                        }
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p>$ {(price * qty).toLocaleString()}</p>
                            <button
                                type="button"
                                onClick={() =>
                                    handleRemove(product.productId, product.size, product.color)
                                }
                                aria-label="Remove"
                            >
                                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default CartContents;
