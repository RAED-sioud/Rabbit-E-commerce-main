import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeNewsletter, resetSubscriber } from '../../redux/slices/subscriberSlice';
import { toast } from 'sonner';

const Footer = () => {
    const dispatch = useDispatch();
    const { success, loading, error } = useSelector((state) => state.subscriber);
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        if (success) {
            toast.success(success);
            setEmail('');
            dispatch(resetSubscriber());
        }
    }, [success, dispatch]);

    React.useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email?.trim()) return;
        dispatch(subscribeNewsletter(email.trim()));
    };

    return (
        <footer className="border-t py-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
                    <p className="text-gray-500 mb-4 text-sm">
                        Be the first to hear about new products, exclusive events, and online offers.
                    </p>
                    <p className="font-medium text-sm text-gray-600 mb-6">
                        Sign up and get 10% off your first order!
                    </p>
                    <form className="flex" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 w-full text-sm border border-gray-300 focus:outline-none"
                            required
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-4 text-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {loading ? '...' : 'Subscribe'}
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>
                            <Link to="/collections/all?gender=Men" className="hover:text-gray-500 transition-colors">
                                Men
                            </Link>
                        </li>
                        <li>
                            <Link to="/collections/all?gender=Women" className="hover:text-gray-500 transition-colors">
                                Women
                            </Link>
                        </li>
                        <li>
                            <Link to="/collections/all" className="hover:text-gray-500 transition-colors">
                                All Collections
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li><Link to="#" className="hover:text-gray-500 transition-colors">Contact Us</Link></li>
                        <li><Link to="#" className="hover:text-gray-500 transition-colors">About Us</Link></li>
                        <li><Link to="#" className="hover:text-gray-500 transition-colors">FAQs</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
                    <div className="flex space-x-4 text-gray-600 mb-4">
                        <a href="#"><FaFacebook className="hover:text-gray-800" size={18} /></a>
                        <a href="#"><FaInstagram className="hover:text-gray-800" size={18} /></a>
                        <a href="#"><FaTwitter className="hover:text-gray-800" size={18} /></a>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <FiPhone className="mr-2" /> 0123-456-789
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()}, Rabbit. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
