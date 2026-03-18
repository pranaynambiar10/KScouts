import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const PlayerDashboard = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/my');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" }
        })
    };

    const cards = [
        {
            icon: "👤", title: "My Profile", desc: "Height, Weight, Position, Bio & Stats",
            btn: "Manage Profile", color: "red", badge: "Active",
            badgeColor: "bg-red-600", hoverBorder: "hover:border-red-500",
            gradient: "from-red-600/20", route: "/profile"
        },
        {
            icon: "🗓️", title: "Events", desc: "View & apply for upcoming tryouts",
            btn: "View Events", color: "green", badge: "Browse",
            badgeColor: "bg-green-600", hoverBorder: "hover:border-green-500",
            gradient: "from-green-600/20", route: "/events"
        },
        {
            icon: "📋", title: "Applications", desc: "Track your trial applications",
            btn: "My Applications", color: "blue", badge: "Track",
            badgeColor: "bg-blue-600", hoverBorder: "hover:border-blue-500",
            gradient: "from-blue-600/20", route: "/my-applications"
        },
        {
            icon: "🏆", title: "Certificates", desc: "Blockchain Verified Achievements",
            btn: "View Certificates", color: "amber", badge: "Verified",
            badgeColor: "bg-amber-500", hoverBorder: "hover:border-amber-500",
            gradient: "from-amber-600/20", route: "/certificates"
        },
    ];

    const hoverColors = {
        red: "hover:bg-red-600",
        green: "hover:bg-green-600",
        blue: "hover:bg-blue-600",
        amber: "hover:bg-amber-500",
    };

    return (
        <div className="min-h-screen bg-black font-sans text-gray-100 bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="fixed inset-0 bg-black/75 z-0 pointer-events-none"></div>
            <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#dc2626 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Locker Room</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-2 h-1 w-24 bg-red-600 origin-left" />
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="mt-4 text-lg text-gray-300">Prepare for your next match.</motion.p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative rounded-full p-2 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition">
                                🔔
                                {notifications.filter(n => !n.read_status).length > 0 && (
                                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-600 rounded-full border-2 border-black"></span>
                                )}
                            </motion.button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                                        <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
                                            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">{notifications.length}</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-gray-500 text-sm">No new notifications</div>
                                            ) : (
                                                <div className="divide-y divide-gray-800">
                                                    {notifications.map((notif) => (
                                                        <div key={notif.id} className={`p-4 transition hover:bg-gray-800/50 ${notif.read_status ? 'opacity-60' : ''}`}>
                                                            <p className="text-sm text-gray-200">{notif.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(notif.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
                            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                            Logout
                        </motion.button>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, i) => (
                        <motion.div key={card.title} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className={`group relative overflow-hidden rounded-xl bg-gray-900/80 border border-white/10 shadow-2xl backdrop-blur-md transition-all ${card.hoverBorder} cursor-pointer`}
                            onClick={() => navigate(card.route)}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}></div>
                            <div className="p-6 relative">
                                <div className="mb-6 flex justify-between items-start">
                                    <motion.div whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                                        className="h-16 w-16 rounded-full bg-gray-700 border-2 border-white/20 flex items-center justify-center text-3xl shadow-lg">
                                        {card.icon}
                                    </motion.div>
                                    <span className={`${card.badgeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase animate-subtle-bounce`}>{card.badge}</span>
                                </div>
                                <h3 className="text-2xl font-black text-white italic uppercase">{card.title}</h3>
                                <p className="text-gray-400 text-sm mb-6">{card.desc}</p>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className={`w-full rounded bg-white py-3 font-bold text-black uppercase tracking-wider transition ${hoverColors[card.color]} hover:text-white hover:shadow-lg`}>
                                    {card.btn}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayerDashboard;
