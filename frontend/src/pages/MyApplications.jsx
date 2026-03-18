import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

/**
 * MyApplications — Player's view of all events they've applied to
 * Shows the selection status for each application: ✅ Selected / ❌ Rejected / ⏳ Pending
 * Route: /my-applications
 */
const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/events/my/applications');
            console.log("FETCHED APPLICATIONS:", res.data);
            setApplications(res.data);

            // Fetch event details for each application
            const eventData = {};
            for (const app of res.data) {
                if (!eventData[app.event_id]) {
                    try {
                        const eventRes = await api.get(`/events/${app.event_id}`);
                        eventData[app.event_id] = eventRes.data;
                    } catch {
                        eventData[app.event_id] = null;
                    }
                }
            }
            setEvents(eventData);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        accepted: {
            badge: '✅ SELECTED',
            card: 'bg-green-950/40 border-green-500/40',
            badgeClass: 'bg-green-900/60 text-green-400 border-green-500/40',
            message: '🎉 Congratulations! You have been selected for this event.',
            msgClass: 'bg-green-900/20 text-green-400 border-green-600/30',
        },
        rejected: {
            badge: '❌ NOT SELECTED',
            card: 'bg-red-950/30 border-red-600/20',
            badgeClass: 'bg-red-900/40 text-red-400 border-red-500/30',
            message: 'You were not selected for this event. Keep applying!',
            msgClass: 'bg-red-900/20 text-red-400 border-red-600/20',
        },
        pending: {
            badge: '⏳ PENDING',
            card: 'bg-neutral-800 border-yellow-600/20',
            badgeClass: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
            message: 'Your application is under review. Check back soon.',
            msgClass: 'bg-yellow-900/20 text-yellow-400 border-yellow-600/20',
        },
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-900 font-sans text-gray-100">
            <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">

                {/* Header */}
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-yellow-500 uppercase">My Applications</h1>
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                                className="mt-2 h-1 w-24 bg-yellow-600 origin-left" />
                            <p className="mt-2 text-neutral-400 text-sm">Track your event applications and selection results</p>
                        </div>
                        <button onClick={() => navigate('/dashboard')}
                            className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-yellow-400 transition">
                            ← Dashboard
                        </button>
                    </div>

                    {/* Summary counts */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Selected', count: applications.filter(a => a.status === 'accepted').length, color: 'text-green-400 bg-green-900/20 border-green-600/30' },
                            { label: 'Pending', count: applications.filter(a => a.status === 'pending').length, color: 'text-yellow-400 bg-yellow-900/20 border-yellow-600/30' },
                            { label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length, color: 'text-red-400 bg-red-900/20 border-red-600/20' },
                        ].map(s => (
                            <div key={s.label} className={`rounded-lg border p-3 text-center ${s.color}`}>
                                <p className="text-2xl font-black">{s.count}</p>
                                <p className="text-xs font-bold uppercase">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.header>

                {/* Application list */}
                {applications.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 text-neutral-500">
                        <p className="text-5xl mb-4">📋</p>
                        <p className="text-xl">No applications yet.</p>
                        <p className="text-sm mt-2">Browse events and apply to trials and tournaments.</p>
                        <Link to="/events">
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                className="mt-6 bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-2 font-bold uppercase tracking-wide transition rounded">
                                Browse Events
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app, i) => {
                            console.log("RENDERING APP:", app);
                            const cfg = statusConfig[app.status] || statusConfig.pending;
                            console.log("MAPPED CONFIG:", cfg);
                            const event = events[app.event_id];
                            return (
                                <motion.div key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className={`border rounded-xl overflow-hidden ${cfg.card}`}>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {event?.title || `Event #${app.event_id}`}
                                                </h3>
                                                <div className="flex gap-2 mt-1 flex-wrap">
                                                    {event?.event_type && (
                                                        <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full capitalize">
                                                            {event.event_type}
                                                        </span>
                                                    )}
                                                    {event?.location && (
                                                        <span className="text-xs text-neutral-500">📍 {event.location}</span>
                                                    )}
                                                    {event?.event_date && (
                                                        <span className="text-xs text-neutral-500">
                                                            📅 {new Date(event.event_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-600 mt-1">
                                                    Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase border ${cfg.badgeClass}`}>
                                                {cfg.badge}
                                            </span>
                                        </div>

                                        {/* Status message */}
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                                            className={`mt-3 rounded-lg border px-4 py-2 text-xs font-medium ${cfg.msgClass}`}>
                                            {cfg.message}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
