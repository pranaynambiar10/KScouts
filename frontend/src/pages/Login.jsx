import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/login`, formData);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('userEmail', formData.email);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Floating particles data
    const particles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
    }));

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: "url('https://wallpapers.com/images/hd/marco-van-basten-raising-arms-happy-jlytrsp79lot805t.jpg')" }}>
            {/* Animated Dark Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/90"
            />

            {/* Floating Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-red-500/30"
                    style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.7, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20"
            >
                {/* Left Side - Visual/Branding */}
                <div className="hidden w-1/2 flex-col justify-between bg-black/40 p-10 text-white md:flex">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1 className="mb-2 text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white drop-shadow-sm font-sans animate-gradient" style={{ WebkitTextStroke: "1px black", backgroundSize: "200% 200%" }}>KScouts</h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="text-xl font-bold text-white drop-shadow-md"
                        >
                            Scouting the next Legend.
                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="border-l-4 border-red-600 bg-black/60 p-4 backdrop-blur-md rounded-r-lg animate-border-pulse">
                            <p className="font-serif italic text-white text-lg drop-shadow-md">"I don't play football to be famous. I play because I love the game."</p>
                            <p className="mt-2 text-sm font-bold text-red-500">— Marco van Basten</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full bg-black/70 p-10 backdrop-blur-md md:w-1/2 border-l border-white/10">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-2 text-center text-3xl font-bold text-white uppercase tracking-widest"
                    >
                        Login
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mx-auto mb-6 h-1 w-20 bg-red-600"
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-4 rounded bg-red-900/50 border border-red-600 p-3 text-sm text-white"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            <label className="mb-2 block text-sm font-bold text-gray-300 uppercase tracking-wide" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full rounded-none border-b-2 border-gray-500 bg-transparent px-2 py-3 text-white placeholder-gray-400 focus:border-red-600 focus:outline-none transition-all duration-300 focus:shadow-[0_2px_10px_rgba(220,38,38,0.3)]"
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="user@kscouts.com"
                                required
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <label className="mb-2 block text-sm font-bold text-gray-300 uppercase tracking-wide" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full rounded-none border-b-2 border-gray-500 bg-transparent px-2 py-3 text-white placeholder-gray-400 focus:border-red-600 focus:outline-none transition-all duration-300 focus:shadow-[0_2px_10px_rgba(220,38,38,0.3)]"
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </motion.div>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(220,38,38,0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 w-full transform bg-red-700 hover:bg-red-600 px-4 py-4 font-bold text-white uppercase tracking-widest transition duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                            className="mt-6 flex justify-between text-sm text-gray-400"
                        >
                            <a href="#" className="hover:text-red-500 transition-colors duration-300">Forgot Password?</a>
                            <Link to="/register" className="font-bold text-white hover:text-red-500 transition-colors duration-300">
                                Create Account
                            </Link>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
