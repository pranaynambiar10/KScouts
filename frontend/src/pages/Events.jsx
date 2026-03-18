import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events/');
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (eventId) => {
        setApplying(eventId);
        setMessage('');
        try {
            await api.post(`/events/${eventId}/apply`);
            setMessage('Application submitted successfully!');
        } catch (err) {
            setMessage(err.response?.data?.detail || 'Failed to apply');
        } finally {
            setApplying(null);
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1, y: 0,
            transition: { duration: 0.4, delay: i * 0.1 }
        })
    };

    const eventTypeColors = {
        trial: 'bg-blue-600',
        match: 'bg-green-600',
        combine: 'bg-purple-600',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black font-sans text-gray-100 bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="fixed inset-0 bg-black/80 z-0 pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Events & Trials</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                            className="mt-2 h-1 w-20 bg-green-600 origin-left" />
                    </div>
                    <Link to="/dashboard">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                            ← Back
                        </motion.button>
                    </Link>
                </motion.header>

                {message && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`mb-6 rounded p-3 text-sm font-bold ${message.includes('success') ? 'bg-green-900/50 border border-green-600 text-green-300' : 'bg-red-900/50 border border-red-600 text-red-300'}`}>
                        {message}
                    </motion.div>
                )}

                {events.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 text-gray-500 text-lg">
                        No events available yet. Check back later!
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {events.map((event, i) => (
                            <motion.div key={event.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                                whileHover={{ y: -5 }}
                                className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                                    <span className={`${eventTypeColors[event.event_type] || 'bg-gray-600'} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                                        {event.event_type}
                                    </span>
                                </div>
                                {event.description && <p className="text-gray-400 text-sm mb-4">{event.description}</p>}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                                    {event.location && <span>📍 {event.location}</span>}
                                    {event.event_date && <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>}
                                    {event.max_participants && <span>👥 Max {event.max_participants}</span>}
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleApply(event.id)}
                                    disabled={applying === event.id}
                                    className="w-full bg-green-700 hover:bg-green-600 py-2 text-white font-bold uppercase tracking-widest text-sm transition disabled:opacity-50 rounded">
                                    {applying === event.id ? 'Applying...' : 'Apply Now'}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
