import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PayPalButton from './PayPalButton';
import {
    createCheckout,
    updateCheckoutPay,
    finalizeCheckout,
    clearCheckout,
    clearFinalOrder,
} from '../../redux/slices/checkoutSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { toast } from 'sonner';

const countries = [
    { name: 'Tunisia', code: '+216' },
    { name: 'France', code: '+33' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Germany', code: '+49' },
    { name: 'Canada', code: '+1' },
    { name: 'Italy', code: '+39' },
    { name: 'Spain', code: '+34' },
    { name: 'Morocco', code: '+212' },
    { name: 'Algeria', code: '+213' },
    { name: 'Turkey', code: '+90' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'India', code: '+91' },
    { name: 'China', code: '+86' },
    { name: 'Japan', code: '+81' },
    { name: 'Egypt', code: '+20' },
    { name: 'United Arab Emirates', code: '+971' },
    { name: 'Brazil', code: '+55' },
    { name: 'Russia', code: '+7' },
    { name: 'South Africa', code: '+27' },
];

const phoneLengths = {
    Tunisia: 8,
    France: 9,
    'United States': 10,
    'United Kingdom': 10,
    Germany: 10,
    Canada: 10,
    Italy: 9,
    Spain: 9,
    Morocco: 9,
    Algeria: 9,
    Turkey: 10,
    'Saudi Arabia': 9,
    India: 10,
    China: 11,
    Japan: 10,
    Egypt: 10,
    'United Arab Emirates': 9,
    Brazil: 11,
    Russia: 10,
    'South Africa': 9,
};

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const { currentCheckout, finalOrder, loading, error } = useSelector((state) => state.checkout);

    const [shippingAddress, setShippingAddress] = React.useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        countryCode: '',
        phone: '',
    });

    const handleCountryChange = (e) => {
        const selected = countries.find((c) => c.name === e.target.value);
        setShippingAddress({
            ...shippingAddress,
            country: selected?.name || '',
            countryCode: selected?.code || '',
            phone: '',
        });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const maxLength = phoneLengths[shippingAddress.country] || 15;
        if (value.length <= maxLength) {
            setShippingAddress({ ...shippingAddress, phone: value });
        }
    };

    const phoneLength = phoneLengths[shippingAddress.country];
    const isPhoneValid =
        !phoneLength || shippingAddress.phone.length === phoneLength || shippingAddress.phone.length === 0;

    const products = cart?.products || [];
    const totalPrice = cart?.totalPrice || 0;
    const [paymentMethod, setPaymentMethod] = React.useState('PayPal');
    const shippingFee = shippingAddress.country ? 10 : 0;
    const totalWithShipping = Number(totalPrice) + shippingFee;

    useEffect(() => {
        return () => {
            dispatch(clearFinalOrder());
        };
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    useEffect(() => {
        if (finalOrder) {
            dispatch(clearCart());
            dispatch(clearCheckout());
            navigate('/order-confirmation', { state: { order: finalOrder } });
        }
    }, [finalOrder, dispatch, navigate]);

    const handleCreateCheckout = (e) => {
        e.preventDefault();
        if (products.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        if (!isPhoneValid && phoneLength) {
            toast.error(`Phone must contain ${phoneLength} digits`);
            return;
        }
        const addressLine = [shippingAddress.firstName, shippingAddress.lastName, shippingAddress.address]
            .filter(Boolean)
            .join(', ');
        const checkoutItems = products.map((p) => ({
            productId: p.productId,
            name: p.name,
            image: p.image,
            price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
            quantity: p.quantity,
        }));
        const shipping = {
            address: addressLine || shippingAddress.address,
            city: shippingAddress.city,
            postalCode: String(shippingAddress.postalCode),
            country: shippingAddress.country,
        };
        dispatch(
            createCheckout({
                checkoutItems,
                shippingAddress: shipping,
                paymentMethod,
                totalPrice: totalWithShipping,
            })
        );
    };

    const handlePaymentSuccess = (details) => {
        if (!currentCheckout?._id) return;
        dispatch(
            updateCheckoutPay({
                checkoutId: currentCheckout._id,
                paymentStatus: 'paid',
                paymentDetails: details,
            })
        ).then(() => {
            dispatch(finalizeCheckout(currentCheckout._id));
        });
    };

    const handleCashOnDelivery = () => {
        if (!currentCheckout?._id) return;
        dispatch(finalizeCheckout(currentCheckout._id));
    };

    if (products.length === 0 && !currentCheckout) {
        return (
            <div className="max-w-7xl mx-auto py-10 px-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-black text-white py-2 px-6 rounded"
                >
                    Continue shopping
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            className="w-full p-2 border rounded bg-gray-50"
                            readOnly
                        />
                    </div>

                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, address: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Country</label>
                            <select
                                value={shippingAddress.country}
                                onChange={handleCountryChange}
                                className="w-full p-2 border rounded bg-white"
                                required
                            >
                                <option value="">Select a country</option>
                                {countries.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Phone</label>
                            <div className="flex items-center border rounded">
                                <span className="px-3 text-gray-600 bg-gray-100 border-r">
                                    {shippingAddress.countryCode || '+___'}
                                </span>
                                <input
                                    type="tel"
                                    value={shippingAddress.phone}
                                    onChange={handlePhoneChange}
                                    className="flex-1 p-2 focus:outline-none"
                                    required
                                />
                            </div>
                            {shippingAddress.country && phoneLength && (
                                <p
                                    className={`text-sm mt-1 ${
                                        isPhoneValid ? 'text-gray-500' : 'text-red-500'
                                    }`}
                                >
                                    Must contain {phoneLength} digits
                                </p>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg mb-4">Payment Method</h3>
                    <div className="mb-6 space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="PayPal"
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span>PayPal</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked={paymentMethod === 'Cash on Delivery'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span>Cash on Delivery</span>
                        </label>
                    </div>

                    <div className="mt-6">
                        {!currentCheckout ? (
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Continue to Payment'}
                            </button>
                        ) : (
                            <div>
                                {paymentMethod === 'PayPal' ? (
                                    <div>
                                        <h3 className="text-lg mb-4">Pay with PayPal</h3>
                                        <PayPalButton
                                            amount={String(Number(totalWithShipping).toFixed(2))}
                                            onSuccess={handlePaymentSuccess}
                                            onError={() => toast.error('Payment failed. Please try again.')}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg mb-4">Cash on Delivery</h3>
                                        <p className="text-gray-600 mb-4">
                                            You will pay the courier upon delivery.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleCashOnDelivery}
                                            className="w-full bg-black text-white py-3 rounded"
                                        >
                                            Place Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t py-4 mb-4">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-2 border-b"
                        >
                            <div className="flex items-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-14 object-cover rounded mr-4"
                                />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    {product.size && (
                                        <p className="text-gray-500">Size: {product.size}</p>
                                    )}
                                    {product.color && (
                                        <p className="text-gray-500">Color: {product.color}</p>
                                    )}
                                </div>
                            </div>
                            <p className="text-xl">
                                $
                                {(typeof product.price === 'number'
                                    ? product.price * product.quantity
                                    : parseFloat(product.price) * (product.quantity || 1)
                                ).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-lg mb-4">
                    <p>Subtotal</p>
                    <p>${Number(totalPrice).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-lg">
                    <p>Shipping</p>
                    <p>${shippingFee.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                    <p>Total</p>
                    <p>${Number(totalWithShipping).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
