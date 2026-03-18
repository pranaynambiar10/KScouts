import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const KERALA_DISTRICTS = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const PlayerProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        position: '', height_cm: '', weight_kg: '', age: '',
        preferred_foot: 'Right', district: '', bio: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/players/me');
            setProfile(res.data);
            setFormData({
                position: res.data.position || '',
                height_cm: res.data.height_cm || '',
                weight_kg: res.data.weight_kg || '',
                age: res.data.age || '',
                preferred_foot: res.data.preferred_foot || 'Right',
                district: res.data.district || '',
                bio: res.data.bio || '',
            });
        } catch (err) {
            if (err.response?.status === 404) {
                setEditing(true); // No profile yet, show form
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
                weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                age: formData.age ? parseInt(formData.age) : null,
            };
            const res = await api.put('/players/me', payload);
            setProfile(res.data);
            setEditing(false);
        } catch (err) {
            console.error('Failed to save profile', err);
        } finally {
            setSaving(false);
        }
    };

    const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF'];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black font-sans text-gray-100 bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="fixed inset-0 bg-black/80 z-0 pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">My Profile</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                            className="mt-2 h-1 w-20 bg-red-600 origin-left" />
                    </div>
                    <Link to="/dashboard">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                            ← Back
                        </motion.button>
                    </Link>
                </motion.header>

                {!editing && profile ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <StatCard label="Position" value={profile.position || '—'} icon="⚽" />
                            <StatCard label="Age" value={profile.age ? `${profile.age} yrs` : '—'} icon="📅" />
                            <StatCard label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : '—'} icon="📏" />
                            <StatCard label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : '—'} icon="⚖️" />
                            <StatCard label="Foot" value={profile.preferred_foot || '—'} icon="🦶" />
                            <StatCard label="District" value={profile.district || '—'} icon="📍" />
                        </div>
                        {profile.bio && (
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-white/5">
                                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Bio</p>
                                <p className="text-gray-200">{profile.bio}</p>
                            </div>
                        )}
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setEditing(true)}
                            className="w-full bg-red-700 hover:bg-red-600 py-3 text-white font-bold uppercase tracking-widest transition">
                            Edit Profile
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Position</label>
                                <select name="position" value={formData.position} onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition">
                                    <option value="">Select</option>
                                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Age</label>
                                <input name="age" type="number" min="1" max="60" value={formData.age} onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition" placeholder="21" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Height (cm)</label>
                                <input name="height_cm" type="number" step="0.1" value={formData.height_cm} onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition" placeholder="175" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Weight (kg)</label>
                                <input name="weight_kg" type="number" step="0.1" value={formData.weight_kg} onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition" placeholder="70" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Preferred Foot</label>
                                <select name="preferred_foot" value={formData.preferred_foot} onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition">
                                    <option value="Right">Right</option>
                                    <option value="Left">Left</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">District</label>
                                <select name="district" value={formData.district} onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition">
                                    <option value="">Select District</option>
                                    {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Bio</label>
                            <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none transition resize-none"
                                placeholder="Tell clubs about yourself, your experience, achievements..." />
                        </div>
                        <div className="flex gap-3">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={saving}
                                className="flex-1 bg-red-700 hover:bg-red-600 py-3 text-white font-bold uppercase tracking-widest transition disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Profile'}
                            </motion.button>
                            {profile && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                                    onClick={() => setEditing(false)}
                                    className="px-6 bg-gray-700 hover:bg-gray-600 py-3 text-white font-bold uppercase tracking-widest transition">
                                    Cancel
                                </motion.button>
                            )}
                        </div>
                    </motion.form>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon }) => (
    <motion.div whileHover={{ scale: 1.03 }}
        className="bg-gray-800/50 rounded-lg p-4 border border-white/5 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
            <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

export default PlayerProfile;
