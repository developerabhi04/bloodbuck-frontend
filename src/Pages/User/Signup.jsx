import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdAccountCircle, MdEmail, MdLock } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { googleLogin, registerUser } from '../../redux/slices/userSlices';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector(s => s.user);

    const [avatar, setAvatar] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Handle inputs
    const handleChange = e => {
        const { id, value } = e.target;
        setFormData(f => ({ ...f, [id]: value }));
    };
    const handleAvatar = e => {
        const file = e.target.files[0];
        if (file) setAvatar(file);
    };

    // Submit
    const handleSubmit = e => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (avatar) data.append('avatar', avatar);
        dispatch(registerUser(data));
    };

    const handleGoogle = () => dispatch(googleLogin());

    useEffect(() => {
        if (error) toast.error(error);
        if (user) {
            toast.success('Registration successful! Redirecting…');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [error, user, navigate]);

    return (
        <>
            <Helmet>
                <title>Create Account | Your Site</title>
                <meta
                    name="description"
                    content="Sign up for a Your Site account to access exclusive features, track orders, and more."
                />
                <link rel="canonical" href={window.location.href} />
            </Helmet>

            <div className="min-h-screen flex">
                {/* Illustration side */}
                <div className="hidden lg:flex w-1/2 bg-green-600 items-center justify-center">
                    <div className="text-center px-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Join Us!</h1>
                        <p className="text-green-200">
                            Create an account to track orders, manage your profile, and enjoy exclusive deals.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex flex-col w-full lg:w-1/2 justify-center items-center bg-gray-50 p-6">
                    <ToastContainer position="top-right" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                            Create Account
                        </h2>

                        {/* Avatar upload */}
                        <div className="flex justify-center mb-6">
                            <label className="relative cursor-pointer">
                                {avatar ? (
                                    <img
                                        src={URL.createObjectURL(avatar)}
                                        alt="avatar"
                                        className="h-24 w-24 rounded-full object-cover border-2 border-green-500"
                                    />
                                ) : (
                                    <MdAccountCircle className="h-24 w-24 text-gray-400" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatar}
                                    className="absolute inset-0 opacity-0"
                                />
                            </label>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="relative">
                                <MdAccountCircle className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <MdEmail className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <MdLock className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <MdLock className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50"
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                ) : null}
                                {loading ? 'Signing up...' : 'Sign up'}
                            </motion.button>
                        </form>

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm text-gray-500">
                                <span className="px-2 bg-white">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                onClick={handleGoogle}
                                disabled={loading}
                                className="p-2 border border-gray-300 rounded-full hover:bg-gray-50"
                            >
                                <FcGoogle size={28} />
                            </button>
                            {/* Additional social providers */}
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/sign-in"
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
