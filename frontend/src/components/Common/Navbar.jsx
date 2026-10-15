import React, { useEffect } from 'react';
import { HiOutlineUser, HiOutlineShoppingBag } from 'react-icons/hi';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from './SearchBar';
import CardDrawer from '../Layout/CardDrawer';
import { IoMdClose } from 'react-icons/io';
import { fetchCart } from '../../redux/slices/cartSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const isAdmin = user?.role === 'admin';

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = React.useState(false);

    const cartCount = (cart?.products || []).reduce((sum, p) => sum + (p.quantity || 1), 0);

    useEffect(() => {
        if (user?._id || typeof window !== 'undefined') {
            const guestId = localStorage.getItem('guestId');
            dispatch(fetchCart({ userId: user?._id, guestID: guestId }));
        }
    }, [dispatch, user?._id]);

    const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
    const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

    return (
        <>
            <nav className="container flex items-center justify-between px-6 py-4 mx-auto">
                <div>
                    <Link to="/" className="text-2xl font-medium">
                        Rabbit
                    </Link>
                </div>
                <div className="hidden space-x-6 md:flex">
                    <Link
                        to="/collections/all?gender=Men"
                        className="text-sm text-gray-700 uppercase hover:text-black font-medium"
                    >
                        Men
                    </Link>
                    <Link
                        to="/collections/all?gender=Women"
                        className="text-sm text-gray-700 uppercase hover:text-black font-medium"
                    >
                        Women
                    </Link>
                    <Link
                        to="/collections/all"
                        className="text-sm text-gray-700 uppercase hover:text-black font-medium"
                    >
                        All
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="block bg-black px-2 rounded text-sm text-white"
                        >
                            Admin
                        </Link>
                    )}
                    {!isAdmin && (
                        user ? (
                            <Link to="/profile" className="text-black" aria-label="Profile">
                                <HiOutlineUser className="w-6 h-6 text-gray-700" />
                            </Link>
                        ) : (
                            <Link to="/login" className="text-black" aria-label="Login">
                                <HiOutlineUser className="w-6 h-6 text-gray-700" />
                            </Link>
                        )
                    )}
                    <button
                        onClick={toggleCartDrawer}
                        className="relative hover:text-black"
                        aria-label="Cart"
                    >
                        <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <div className="overflow-hidden">
                        <SearchBar />
                    </div>
                    <button onClick={toggleNavDrawer} className="md:hidden" aria-label="Menu">
                        <HiBars3BottomRight className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </nav>
            <CardDrawer drawerOpen={drawerOpen} toogleCartDrawer={toggleCartDrawer} />
            <div
                className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
                    navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex justify-end">
                    <button onClick={toggleNavDrawer} aria-label="Close menu">
                        <IoMdClose className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="p-4">
                    <h2 className="mb-4 text-xl font-semibold">Menu</h2>
                    <nav className="space-y-2">
                        <Link
                            to="/collections/all?gender=Men"
                            className="block text-gray-600 hover:text-black"
                            onClick={toggleNavDrawer}
                        >
                            Men
                        </Link>
                        <Link
                            to="/collections/all?gender=Women"
                            className="block text-gray-600 hover:text-black"
                            onClick={toggleNavDrawer}
                        >
                            Women
                        </Link>
                        <Link
                            to="/collections/all"
                            className="block text-gray-600 hover:text-black"
                            onClick={toggleNavDrawer}
                        >
                            All
                        </Link>
                        {!isAdmin && (
                            user ? (
                                <Link
                                    to="/profile"
                                    className="block text-gray-600 hover:text-black"
                                    onClick={toggleNavDrawer}
                                >
                                    Profile
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block text-gray-600 hover:text-black"
                                    onClick={toggleNavDrawer}
                                >
                                    Login
                                </Link>
                            )
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
