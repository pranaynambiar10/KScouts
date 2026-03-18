import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', event_type: 'trial',
        location: '', event_date: '', max_participants: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
                event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
            };
            await api.post('/events/', payload);
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create event', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 font-sans text-gray-100">
            <div className="fixed inset-0 bg-neutral-900/95 z-0 pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-yellow-500 uppercase">Create Event</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                            className="mt-2 h-1 w-20 bg-yellow-600 origin-left" />
                    </div>
                    <Link to="/dashboard">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                            ← Back
                        </motion.button>
                    </Link>
                </motion.header>

                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-neutral-800 border border-yellow-600/20 rounded-lg p-8 space-y-5">
                    <div>
                        <label className="text-xs font-bold uppercase text-neutral-400 mb-1 block">Event Title *</label>
                        <input name="title" type="text" value={formData.title} onChange={handleChange} required
                            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none" placeholder="U-21 Scouting Combine" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-neutral-400 mb-1 block">Event Type</label>
                            <select name="event_type" value={formData.event_type} onChange={handleChange}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none">
                                <option value="trial">Trial</option>
                                <option value="match">Match</option>
                                <option value="combine">Combine</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-neutral-400 mb-1 block">Max Participants</label>
                            <input name="max_participants" type="number" value={formData.max_participants} onChange={handleChange}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none" placeholder="50" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-neutral-400 mb-1 block">Location</label>
                            <input name="location" type="text" value={formData.location} onChange={handleChange}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none" placeholder="San Siro, Milan" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-neutral-400 mb-1 block">Event Date</label>
                            <input name="event_date" type="date" value={formData.event_date} onChange={handleChange}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-neutral-400 mb-1 block">Description</label>
                        <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none resize-none"
                            placeholder="Describe the event, requirements, what to bring..." />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                        className="w-full bg-yellow-700 hover:bg-yellow-600 py-3 text-white font-bold uppercase tracking-widest transition disabled:opacity-50 rounded">
                        {loading ? 'Creating...' : 'Create Event'}
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default CreateEvent;
