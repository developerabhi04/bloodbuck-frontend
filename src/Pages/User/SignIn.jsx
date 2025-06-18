import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { googleLogin, loginUser } from '../../redux/slices/userSlices';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, user } = useSelector(s => s.user);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    // Handle form inputs
    const handleChange = e => {
        const { id, value } = e.target;
        setFormData(f => ({ ...f, [id]: value }));
    };
    const handleBlur = e => {
        const { id } = e.target;
        setTouched(t => ({ ...t, [id]: true }));
    };

    // Submit
    const handleSubmit = e => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setTouched({ email: true, password: true });
            return;
        }
        dispatch(loginUser(formData));
    };

    // Google
    const handleGoogle = async () => {
        try {
            await dispatch(googleLogin()).unwrap();
            toast.success('Google login successful!');
        } catch (err) {
            toast.error(err || 'Google login failed');
        }
    };

    // Redirect on success / show error
    useEffect(() => {
        if (error) toast.error(error);
        if (user) {
            // honor any redirectTo passed in state, else go home
            const to = location.state?.redirectTo || '/';
            navigate(to, { replace: true });
        }
    }, [error, user, navigate, location.state]);

    const pageTitle = 'Sign In | Your Store';
    const pageDescription =
        'Sign in to Your Store to manage your account, view orders, and shop with ease.';
    const pageUrl = window.location.href;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Sign In',
        description: pageDescription,
        url: pageUrl,
        potentialAction: {
            '@type': 'LoginAction',
            target: { '@type': 'EntryPoint', urlTemplate: pageUrl }
        }
    };

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={pageUrl} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            <div className="min-h-screen flex">
                {/* Left graphic */}
                <div className="hidden lg:flex w-1/2 bg-[#06032B] relative">
                    {/* 👇 Go Back Button Positioned Absolutely */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-sm text-white hover:text-gray-300 transition flex items-center gap-1"
                    >
                        <span className="text-lg">←</span> Go Back
                    </button>

                    <div className="text-center px-8 m-auto">
                        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
                        <p className="text-gray-400">
                            Sign in to manage your account, view orders, and explore new products.
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
                        <h2 className="text-2xl font-semibold text-[#06032B] mb-6 text-center">
                            Sign In
                        </h2>

                        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                            {/* Email */}
                            <div className="relative">
                                <MdEmail className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${touched.email && !formData.email
                                        ? 'border-red-500 focus:ring-red-300'
                                        : 'border-gray-300 focus:ring-indigo-300'
                                        }`}
                                    required
                                />
                                {touched.email && !formData.email && (
                                    <p className="text-red-500 text-sm mt-1">Email is required</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <MdLock className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${touched.password && !formData.password
                                        ? 'border-red-500 focus:ring-red-300'
                                        : 'border-gray-300 focus:ring-indigo-300'
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute top-2.5 right-3 text-gray-500"
                                >
                                    {showPassword ? (
                                        <MdVisibilityOff size={24} />
                                    ) : (
                                        <MdVisibility size={24} />
                                    )}
                                </button>
                                {touched.password && !formData.password && (
                                    <p className="text-red-500 text-sm mt-1">Password is required</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                {/* <Link
                                    to="/forgot-password"
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </Link> */}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center py-2 px-4 bg-[#06032B] hover:bg-gray-700 text-white font-semibold rounded-lg disabled:opacity-50"
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
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                ) : null}
                                {loading ? 'Signing in...' : 'Sign in'}
                            </motion.button>
                        </form>

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
                            {/* Placeholder icons for future providers */}

                        </div>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don’t have an account?{' '}
                            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
