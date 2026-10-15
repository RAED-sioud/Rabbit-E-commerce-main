import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import loginImage from '../assets/login.webp';
import { loginUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            const guestId = localStorage.getItem('guestId');
            if (guestId) dispatch(mergeCart({ guestId, userId: user._id }));
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location.state?.from?.pathname, dispatch]);

    useEffect(() => {
        if (error) toast.error(error?.message || 'Login failed');
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };
    
  return (
    <div className='flex'>
        <div className='flex flex-col items-center justify-center w-full p-8 md:w-1/2 md:p-12'>
            <form 
                className='w-full max-w-md p-8 bg-white border rounded-lg shadow-sm'
                onSubmit={handleSubmit}
                >
                <div className='flex justify-center mb-6'>
                    <h2 className='text-xl font-medium'>Rabbit</h2>
                </div>
                <h2 className='mb-6 text-2xl font-bold text-center'>Hey there! 👋</h2>
                <p className='mb-6 text-center'>
                    Enter your username and password to login
                </p>
                <div className='mb-4'>
                    <label className="block mb-2 text-sm font-semibold">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border rounded'
                        placeholder='Enter your email address'
                        />
                </div>
                <div className='mb-4'>
                    <label className="block mb-2 text-sm font-semibold">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-2 border rounded'
                        placeholder='Enter your password'
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <p className='mt-6 text-sm text-center'>
                    Don't have an account? 
                    <Link to="/register" className='text-blue-500'> Register</Link>
                </p>
            </form>
        </div>

        <div className='hidden w-1/2 md:block'>
            <div className='flex items-center h-full flex-xol justify-normal'>
                <img 
                    src={loginImage} 
                    alt="Login" 
                    className='object-cover w-full h-[750px]'/>
            </div>
        </div>
    </div>
  )
}

export default Login