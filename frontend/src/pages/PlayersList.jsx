import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const PlayersList = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await api.get('/players/');
            setPlayers(res.data);
        } catch (err) {
            console.error('Failed to fetch players', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = players.filter(p =>
        p.position?.toLowerCase().includes(search.toLowerCase()) ||
        p.district?.toLowerCase().includes(search.toLowerCase()) ||
        p.bio?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-900 font-sans text-gray-100">
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-yellow-500 uppercase">Player Profiles</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                            className="mt-2 h-1 w-20 bg-yellow-600 origin-left" />
                        <p className="mt-2 text-neutral-400 text-sm">{filtered.length} player{filtered.length !== 1 ? 's' : ''} found</p>
                    </div>
                    <Link to="/dashboard">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded border border-yellow-600/30">
                            ← Back
                        </motion.button>
                    </Link>
                </motion.header>

                {/* Search */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search by position, district..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-neutral-800 border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-neutral-500 focus:border-yellow-500 focus:outline-none transition"
                    />
                </div>

                {filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 text-neutral-500">
                        <div className="text-6xl mb-4">👥</div>
                        <p className="text-xl">No player profiles found.</p>
                        <p className="text-sm mt-2">Players need to complete their profiles first.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((player, i) => (
                            <motion.div key={player.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4, boxShadow: "0 0 24px rgba(234,179,8,0.15)" }}
                                className="bg-neutral-800 border border-yellow-600/20 rounded-lg p-6 hover:border-yellow-500/50 transition-all">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-600/20 border border-yellow-600/40 flex items-center justify-center text-xl">
                                        ⚽
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{player.user?.full_name || 'Player'}</p>
                                        <span className="text-xs bg-yellow-700/50 text-yellow-300 px-2 py-0.5 rounded font-bold uppercase">
                                            {player.position || 'No Position'}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                    <div className="bg-neutral-700/50 rounded p-2">
                                        <p className="text-neutral-400 text-xs">Age</p>
                                        <p className="text-white font-semibold">{player.age ? `${player.age} yrs` : '—'}</p>
                                    </div>
                                    <div className="bg-neutral-700/50 rounded p-2">
                                        <p className="text-neutral-400 text-xs">District</p>
                                        <p className="text-white font-semibold">{player.district || '—'}</p>
                                    </div>
                                    <div className="bg-neutral-700/50 rounded p-2">
                                        <p className="text-neutral-400 text-xs">Height</p>
                                        <p className="text-white font-semibold">{player.height_cm ? `${player.height_cm} cm` : '—'}</p>
                                    </div>
                                    <div className="bg-neutral-700/50 rounded p-2">
                                        <p className="text-neutral-400 text-xs">Foot</p>
                                        <p className="text-white font-semibold">{player.preferred_foot || '—'}</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                {player.bio && (
                                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">{player.bio}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayersList;
