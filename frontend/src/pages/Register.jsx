import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'player',
    });
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
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/register`, formData);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('userEmail', formData.email);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-900 overflow-hidden">
            {/* Blurred Background Layer */}
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[4px]"
                style={{ backgroundImage: "url('https://akm-img-a-in.tosshub.com/indiatoday/images/story/201406/germany_650_060214093027.jpg?size=690:388')" }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 z-0 bg-black/60"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-red-900/40 to-transparent"></div>

            {/* Floating particles */}
            {Array.from({ length: 10 }, (_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-red-400/40"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-black/80 shadow-2xl backdrop-blur-md border border-red-500/20"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-red-700 p-6 text-center shadow-lg relative overflow-hidden"
                >
                    {/* Shimmer effect on header */}
                    <div className="absolute inset-0 animate-shimmer"></div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white relative">Join the Squad</h2>
                    <p className="text-red-100 font-medium relative">Begin your legendary career</p>
                </motion.div>

                <div className="p-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-4 rounded bg-red-900/50 border border-red-600 p-3 text-sm text-white"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.form
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <motion.div variants={itemVariants}>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                className="w-full rounded bg-gray-900/80 px-4 py-2 text-white border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-300 focus:shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                                id="name"
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Marco van Basten"
                                required
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full rounded bg-gray-900/80 px-4 py-2 text-white border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-300 focus:shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="marco@milan.ac"
                                required
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full rounded bg-gray-900/80 px-4 py-2 text-white border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-300 focus:shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400" htmlFor="role">
                                Select Your Position
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded bg-gray-900/80 px-4 py-2 text-white border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-300 focus:shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="player">Player (Talent)</option>
                                    <option value="club">Club (Organization)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 w-full transform bg-white text-red-700 px-4 py-3 font-black text-lg uppercase italic hover:bg-gray-200 transition duration-200 focus:outline-none shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="inline-block w-5 h-5 border-2 border-red-300 border-t-red-700 rounded-full"
                                    />
                                    Creating Account...
                                </span>
                            ) : 'Sign Contract'}
                        </motion.button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                        className="mt-6 text-center text-sm text-gray-500"
                    >
                        Already in the squad?{' '}
                        <Link to="/login" className="font-bold text-red-500 hover:text-red-400 transition-colors duration-300">
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
