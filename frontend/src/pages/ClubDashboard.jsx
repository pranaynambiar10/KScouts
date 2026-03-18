import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ClubDashboard = () => {
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
        <div className="min-h-screen bg-neutral-900 font-sans text-gray-100 bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="fixed inset-0 bg-neutral-900/95 z-0 pointer-events-none"></div>
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }}></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="mb-10 border-b border-yellow-500/20 pb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-serif font-bold tracking-tight text-yellow-500 uppercase">Club HQ</h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="mt-2 text-lg text-neutral-400 font-light">Management & Operations Console.</motion.p>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
                        className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                        Logout
                    </motion.button>
                </motion.header>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Card 1: Player Profiles */}
                    <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 0 30px rgba(234,179,8,0.15)" }}
                        className="group relative overflow-hidden rounded-lg bg-neutral-800 border border-yellow-600/20 shadow-xl transition-all hover:border-yellow-500/50 cursor-pointer"
                        onClick={() => navigate('/players')}>
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-8 relative">
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                                className="mb-4 h-1 w-10 bg-yellow-600 origin-left" />
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Player Profiles</h3>
                            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Browse player profiles and view their blockchain-verified certificates.</p>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="w-full bg-yellow-700 hover:bg-yellow-600 text-white py-2 px-4 text-sm font-bold uppercase tracking-wide transition">
                                View Players
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Card 2: Host Events */}
                    <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 0 30px rgba(234,179,8,0.15)" }}
                        className="group relative overflow-hidden rounded-lg bg-neutral-800 border border-yellow-600/20 shadow-xl transition-all hover:border-yellow-500/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-8 relative">
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.4 }}
                                className="mb-4 h-1 w-10 bg-yellow-600 origin-left" />
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Events & Trials</h3>
                            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Host tryouts, organize matches, and manage scouting events.</p>
                            <div className="flex space-x-2">
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/events/create')}
                                    className="flex-1 bg-yellow-700 hover:bg-yellow-600 text-white py-2 px-4 text-sm font-bold uppercase tracking-wide transition">
                                    Create Event
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/events')}
                                    className="flex-1 border border-neutral-600 hover:bg-neutral-700 text-neutral-300 py-2 px-4 text-sm font-bold uppercase tracking-wide transition">
                                    View All
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Applications */}
                    <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
                        whileHover={{ y: -5, boxShadow: "0 0 30px rgba(234,179,8,0.15)" }}
                        className="group relative overflow-hidden rounded-lg bg-neutral-800 border border-yellow-600/20 shadow-xl transition-all hover:border-yellow-500/50 cursor-pointer"
                        onClick={() => navigate('/club/applications')}>
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-8 relative">
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.4 }}
                                className="mb-4 h-1 w-10 bg-yellow-600 origin-left" />
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Applications</h3>
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-8 right-8 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                NEW
                            </motion.div>
                            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Review player applications for your listed events.</p>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="w-full bg-yellow-700 hover:bg-yellow-600 text-white py-2 px-4 text-sm font-bold uppercase tracking-wide transition">
                                Review Inbox
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ClubDashboard;
