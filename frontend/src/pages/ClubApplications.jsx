import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const ClubApplications = () => {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [applications, setApplications] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeEvent, setActiveEvent] = useState(null);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const res = await api.get('/events/my');
            setMyEvents(res.data);
            const appData = {};
            for (const event of res.data) {
                try {
                    const appRes = await api.get(`/events/${event.id}/applications`);
                    appData[event.id] = appRes.data;
                } catch {
                    appData[event.id] = [];
                }
            }
            setApplications(appData);
            if (res.data.length > 0) setActiveEvent(res.data[0].id);
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (eventId, appId, newStatus) => {
        try {
            await api.patch(`/events/${eventId}/applications/${appId}`, { status: newStatus });
            // Optimistic update — change status in local state instantly
            setApplications(prev => ({
                ...prev,
                [eventId]: prev[eventId].map(app =>
                    app.id === appId ? { ...app, status: newStatus } : app
                )
            }));
        } catch (err) {
            console.error('Failed to update application status', err);
            alert('Failed to update status. Please try again.');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
        </div>
    );

    const activeApps = activeEvent ? (applications[activeEvent] || []) : [];

    return (
        <div className="min-h-screen bg-neutral-900 font-sans text-gray-100">
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-yellow-500 uppercase">Applications Inbox</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                            className="mt-2 h-1 w-24 bg-yellow-600 origin-left" />
                        <p className="mt-2 text-neutral-400 text-sm">Review player applications for your events</p>
                    </div>
                    <Link to="/dashboard">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded border border-yellow-600/30">
                            ← Back
                        </motion.button>
                    </Link>
                </motion.header>

                {myEvents.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 text-neutral-500">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-xl">No events created yet.</p>
                        <p className="text-sm mt-2">Create an event first to receive applications.</p>
                        <Link to="/events/create">
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                className="mt-6 bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-2 font-bold uppercase tracking-wide transition rounded">
                                Create Event
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex gap-6">
                        {/* Left: Event list */}
                        <div className="w-72 shrink-0 space-y-3">
                            <p className="text-xs font-bold uppercase text-neutral-500 mb-3">Your Events</p>
                            {myEvents.map(event => (
                                <motion.div key={event.id}
                                    whileHover={{ x: 3 }}
                                    onClick={() => setActiveEvent(event.id)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all ${activeEvent === event.id
                                        ? 'bg-yellow-700/20 border-yellow-500/60'
                                        : 'bg-neutral-800 border-yellow-600/20 hover:border-yellow-500/40'}`}>
                                    <p className="font-bold text-white text-sm">{event.title}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-neutral-400">{event.event_type}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${(applications[event.id]?.length || 0) > 0 ? 'bg-red-600 text-white' : 'bg-neutral-700 text-neutral-400'}`}>
                                            {applications[event.id]?.length || 0}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right: Applications */}
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase text-neutral-500 mb-3">
                                Applicants — {myEvents.find(e => e.id === activeEvent)?.title}
                            </p>
                            {activeApps.length === 0 ? (
                                <div className="text-center py-16 text-neutral-600">
                                    <div className="text-5xl mb-3">📭</div>
                                    <p>No applications yet for this event.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeApps.map((app, i) => (
                                        <motion.div key={app.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                            className={`border rounded-lg p-5 transition-all ${
                                                app.status === 'accepted' ? 'bg-green-950/40 border-green-600/30' :
                                                app.status === 'rejected' ? 'bg-red-950/40 border-red-600/20' :
                                                'bg-neutral-800 border-yellow-600/20 hover:border-yellow-500/40'
                                            }`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-lg">⚽</div>
                                                    <div>
                                                        <p className="font-bold text-white">{app.player?.full_name || 'Unknown Player'}</p>
                                                        <p className="text-xs text-neutral-400">{app.player?.email}</p>
                                                        <p className="text-xs text-neutral-600 mt-0.5">
                                                            Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Status badge */}
                                                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${
                                                    app.status === 'accepted' ? 'bg-green-900/60 text-green-400 border-green-500/40' :
                                                    app.status === 'rejected' ? 'bg-red-900/40 text-red-400 border-red-500/30' :
                                                    'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                                                }`}>
                                                    {app.status === 'accepted' ? '✅ Selected' :
                                                     app.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                                                </span>
                                            </div>

                                            {/* Player stats */}
                                            {app.player_profile && (
                                                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                                                    <div className="bg-neutral-700/50 rounded p-2">
                                                        <p className="text-neutral-400">Position</p>
                                                        <p className="text-white font-semibold">{app.player_profile.position || '—'}</p>
                                                    </div>
                                                    <div className="bg-neutral-700/50 rounded p-2">
                                                        <p className="text-neutral-400">Age</p>
                                                        <p className="text-white font-semibold">{app.player_profile.age || '—'}</p>
                                                    </div>
                                                    <div className="bg-neutral-700/50 rounded p-2">
                                                        <p className="text-neutral-400">District</p>
                                                        <p className="text-white font-semibold">{app.player_profile.district || '—'}</p>
                                                    </div>
                                                    <div className="bg-neutral-700/50 rounded p-2">
                                                        <p className="text-neutral-400">Foot</p>
                                                        <p className="text-white font-semibold">{app.player_profile.preferred_foot || '—'}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className="mt-3 flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleStatusUpdate(activeEvent, app.id, 'accepted')}
                                                    disabled={app.status === 'accepted'}
                                                    className="flex-1 bg-green-800/50 hover:bg-green-700/70 text-green-300 border border-green-600/40 py-2 text-xs font-bold uppercase tracking-wide transition rounded disabled:opacity-40 disabled:cursor-not-allowed">
                                                    ✅ Accept
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleStatusUpdate(activeEvent, app.id, 'rejected')}
                                                    disabled={app.status === 'rejected'}
                                                    className="flex-1 bg-red-900/40 hover:bg-red-800/60 text-red-400 border border-red-600/30 py-2 text-xs font-bold uppercase tracking-wide transition rounded disabled:opacity-40 disabled:cursor-not-allowed">
                                                    ❌ Reject
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => navigate(`/players/${app.player_id}`)}
                                                    className="flex-1 bg-yellow-700/30 hover:bg-yellow-700/60 text-yellow-300 border border-yellow-600/30 py-2 text-xs font-bold uppercase tracking-wide transition rounded">
                                                    👤 Profile
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubApplications;
