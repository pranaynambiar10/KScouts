import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" }
        })
    };

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-gray-100 relative overflow-hidden">
            {/* Animated scan line */}
            <motion.div
                animate={{ y: ["0%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="fixed inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent z-0 pointer-events-none"
            />

            {/* Grid dots */}
            <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

            {/* Main Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 border-b border-emerald-500/20 pb-6 flex justify-between items-start"
                >
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-emerald-400 uppercase">Admin Panel</h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-2 h-1 w-24 bg-emerald-600 origin-left"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 text-lg text-gray-400"
                        >
                            System Management & Approvals.
                        </motion.p>
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-2 bg-emerald-900/30 px-3 py-1 rounded border border-emerald-500/30"
                        >
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span className="text-xs font-mono text-emerald-300">SYSTEM ONLINE</span>
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded"
                        >
                            Logout
                        </motion.button>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Card 1: Approve Clubs */}
                    <motion.div
                        custom={0}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 0 30px rgba(16,185,129,0.1)" }}
                        className="group relative overflow-hidden rounded-lg bg-gray-900 border border-emerald-500/20 shadow-xl transition-all hover:border-emerald-400/50"
                    >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-8 relative">
                            <div className="mb-6 flex justify-between items-start">
                                <motion.div
                                    whileHover={{ rotate: 10 }}
                                    className="h-12 w-12 bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center text-2xl rounded-lg"
                                >
                                    ✅
                                </motion.div>
                                <motion.span
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                                >
                                    5 Pending
                                </motion.span>
                            </div>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Approve Clubs</h3>
                            <p className="text-gray-400 text-sm mb-6">Review and approve club/organizer registrations.</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-emerald-700 hover:bg-emerald-600 py-3 font-bold text-white uppercase tracking-widest text-sm transition"
                            >
                                Review Requests
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Card 2: Manage Users */}
                    <motion.div
                        custom={1}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 0 30px rgba(16,185,129,0.1)" }}
                        className="group relative overflow-hidden rounded-lg bg-gray-900 border border-emerald-500/20 shadow-xl transition-all hover:border-emerald-400/50"
                    >
                        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-8 relative">
                            <div className="mb-6 flex justify-between items-start">
                                <motion.div
                                    whileHover={{ rotate: 10 }}
                                    className="h-12 w-12 bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center text-2xl rounded-lg"
                                >
                                    👥
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">All Users</h3>
                            <p className="text-gray-400 text-sm mb-6">View and manage all registered users and their roles.</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full border border-emerald-500 hover:bg-emerald-500/20 py-3 font-bold text-emerald-300 uppercase tracking-widest text-sm transition"
                            >
                                View Users
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Card 3: System Overview */}
                    <motion.div
                        custom={2}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 0 30px rgba(16,185,129,0.1)" }}
                        className="group relative overflow-hidden rounded-lg bg-gray-900 border border-emerald-500/20 shadow-xl transition-all hover:border-emerald-400/50"
                    >
                        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-8 relative">
                            <div className="mb-6 flex justify-between items-start">
                                <motion.div
                                    whileHover={{ rotate: 10 }}
                                    className="h-12 w-12 bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center text-2xl rounded-lg"
                                >
                                    📊
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Overview</h3>
                            <p className="text-gray-400 text-sm mb-6">Platform stats, events count, certificate verifications.</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full border border-emerald-500 hover:bg-emerald-500/20 py-3 font-bold text-emerald-300 uppercase tracking-widest text-sm transition"
                            >
                                View Dashboard
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
