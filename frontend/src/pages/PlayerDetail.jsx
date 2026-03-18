import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

/**
 * PlayerDetail — Club view of a specific player's full profile + certificates
 * Route: /players/:userId
 */
const PlayerDetail = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [certLoading, setCertLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verifyData, setVerifyData] = useState(null);

    useEffect(() => {
        fetchAll();
    }, [userId]);

    const fetchAll = async () => {
        try {
            const [profileRes, certsRes] = await Promise.all([
                api.get(`/players/${userId}`),
                api.get(`/players/${userId}/certificates`)
            ]);
            setProfile(profileRes.data);
            setCertificates(certsRes.data);
        } catch (err) {
            console.error('Failed to load player details', err);
        } finally {
            setLoading(false);
            setCertLoading(false);
        }
    };

    // Verify a certificate on blockchain
    const handleVerifyCert = async (cert) => {
        setSelectedCert(cert);
        setVerifying(true);
        setVerifyData(null);
        try {
            const res = await api.get(`/certificates/verify/${cert.id}`);
            setVerifyData(res.data);
        } catch {
            setVerifyData({ error: true });
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-5xl mb-4">👤</p>
            <p className="text-xl">Player profile not found.</p>
            <Link to="/club/applications" className="mt-4 text-yellow-500 underline">← Back to Applications</Link>
        </div>
    );

    const player = profile.user;
    const stats = [
        { label: 'Position', value: profile.position || '—', icon: '⚽' },
        { label: 'Age', value: profile.age ? `${profile.age} yrs` : '—', icon: '📅' },
        { label: 'Height', value: profile.height_cm ? `${profile.height_cm} cm` : '—', icon: '📏' },
        { label: 'Weight', value: profile.weight_kg ? `${profile.weight_kg} kg` : '—', icon: '⚖️' },
        { label: 'Preferred Foot', value: profile.preferred_foot || '—', icon: '🦶' },
        { label: 'District', value: profile.district || '—', icon: '📍' },
    ];

    return (
        <div className="min-h-screen bg-neutral-900 font-sans text-gray-100">
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">

                {/* ── Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between">
                    <button onClick={() => navigate(-1)}
                        className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-yellow-400 transition flex items-center gap-2">
                        ← Back
                    </button>
                    <span className="text-xs font-bold uppercase text-neutral-600 tracking-widest">Club Scouting View</span>
                </motion.div>

                {/* ── Player Identity Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-800 border border-yellow-600/20 rounded-xl p-8 mb-6">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-yellow-600/20 border-2 border-yellow-600/40 flex items-center justify-center text-4xl shrink-0">
                            ⚽
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-serif font-bold text-white">{player?.full_name || 'Unknown Player'}</h1>
                            <p className="text-neutral-400 text-sm mt-1">{player?.email}</p>
                            <div className="mt-3 flex gap-2 flex-wrap">
                                {profile.position && (
                                    <span className="bg-yellow-700/40 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                        {profile.position}
                                    </span>
                                )}
                                {profile.district && (
                                    <span className="bg-neutral-700 text-neutral-300 text-xs px-3 py-1 rounded-full">
                                        📍 {profile.district}
                                    </span>
                                )}
                                <span className="bg-neutral-700 text-neutral-300 text-xs px-3 py-1 rounded-full">
                                    ID: #{userId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {stats.map((s, i) => (
                            <motion.div key={s.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06 }}
                                className="bg-neutral-700/50 rounded-lg p-3 flex items-center gap-3">
                                <span className="text-xl">{s.icon}</span>
                                <div>
                                    <p className="text-xs text-neutral-400">{s.label}</p>
                                    <p className="text-white font-bold text-sm">{s.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mt-4 bg-neutral-700/30 rounded-lg p-4 border border-neutral-600/30">
                            <p className="text-xs font-bold uppercase text-neutral-500 mb-2">About</p>
                            <p className="text-neutral-300 text-sm leading-relaxed">{profile.bio}</p>
                        </div>
                    )}
                </motion.div>

                {/* ── Certificates Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-sm font-bold uppercase text-yellow-500 tracking-widest mb-4 flex items-center gap-2">
                        🏆 Certificates & Credentials
                        <span className="text-xs text-neutral-500 font-normal normal-case">({certificates.length})</span>
                    </h2>

                    {/* Blockchain explanation box */}
                    <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4 mb-5 text-xs text-blue-300 leading-relaxed">
                        <p className="font-bold text-blue-400 mb-1">🔗 How Blockchain Verification Works</p>
                        <p>When a player uploads a certificate, KScouts generates a <strong>SHA-256 fingerprint</strong> of that file and stores it <strong>permanently on the blockchain</strong>. To verify: we re-compute the hash and check if it matches what's on-chain.
                        <strong className="text-blue-200"> If the certificate is altered even by 1 pixel, the hash changes completely — making forgery instantly detectable.</strong></p>
                    </div>

                    {certLoading ? (
                        <div className="text-center py-10 text-neutral-600">Loading certificates...</div>
                    ) : certificates.length === 0 ? (
                        <div className="text-center py-10 text-neutral-600">
                            <p className="text-3xl mb-2">📂</p>
                            <p>No certificates uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {certificates.map((cert, i) => (
                                <motion.div key={cert.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className={`border rounded-xl overflow-hidden transition-all ${
                                        cert.is_verified
                                            ? 'bg-neutral-800 border-green-500/30'
                                            : 'bg-neutral-800 border-red-500/20'
                                    }`}>
                                    {/* Certificate header */}
                                    <div className="p-5 flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                                                cert.is_verified ? 'bg-green-900/30 border border-green-500/40' : 'bg-red-900/20 border border-red-500/20'
                                            }`}>
                                                {cert.is_verified ? '✅' : '❌'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{cert.title}</h3>
                                                {cert.issuer && <p className="text-xs text-neutral-400">Issued by: <span className="text-neutral-300">{cert.issuer}</span></p>}
                                                {cert.description && <p className="text-xs text-neutral-500 mt-0.5">{cert.description}</p>}
                                                <p className="text-xs text-neutral-600 mt-1">
                                                    Uploaded: {cert.uploaded_at ? new Date(cert.uploaded_at).toLocaleDateString() : '—'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            {cert.is_verified ? (
                                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-900/60 text-green-400 border border-green-500/40">
                                                    ✅ BLOCKCHAIN VERIFIED
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-900/40 text-red-400 border border-red-500/30">
                                                    ❌ NOT VERIFIED
                                                </span>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                onClick={() => handleVerifyCert(cert)}
                                                className="text-xs font-bold px-3 py-1.5 bg-yellow-700/50 hover:bg-yellow-600/60 text-yellow-300 rounded border border-yellow-600/30 transition uppercase tracking-wide">
                                                🔍 Check On-Chain
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Hash display */}
                                    {cert.sha256_hash && (
                                        <div className="px-5 pb-3">
                                            <p className="text-xs text-neutral-600">
                                                <span className="font-bold text-neutral-500">SHA-256: </span>
                                                <span className="font-mono">{cert.sha256_hash}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* On-chain verification panel */}
                                    <AnimatePresence>
                                        {selectedCert?.id === cert.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden">
                                                <div className="mx-5 mb-4 rounded-lg border border-neutral-700 bg-neutral-900/70 p-4">
                                                    {verifying ? (
                                                        <div className="flex items-center gap-3 text-yellow-400">
                                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full" />
                                                            <span className="text-sm">Querying blockchain...</span>
                                                        </div>
                                                    ) : verifyData?.error ? (
                                                        <p className="text-red-400 text-sm">❌ Could not query blockchain.</p>
                                                    ) : verifyData && (
                                                        <div className="space-y-3">
                                                            {/* Big result */}
                                                            <div className={`text-center py-3 rounded-lg font-black uppercase text-lg tracking-widest ${
                                                                verifyData.is_verified
                                                                    ? 'bg-green-900/40 text-green-400 border border-green-500/40'
                                                                    : 'bg-red-950 text-red-400 border border-red-600/40'
                                                            }`}>
                                                                {verifyData.is_verified
                                                                    ? '✅ GENUINE — Hash confirmed on blockchain'
                                                                    : '❌ CANNOT VERIFY — Hash not found on chain'}
                                                            </div>

                                                            {/* Steps explanation */}
                                                            <div className="text-xs space-y-1 text-neutral-400">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-green-400">✔</span>
                                                                    <span>SHA-256 hash computed: <span className="font-mono text-neutral-300">{cert.sha256_hash?.substring(0, 24)}...</span></span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {verifyData.is_verified
                                                                        ? <span className="text-green-400">✔</span>
                                                                        : <span className="text-red-400">✘</span>}
                                                                    <span>Hash found in blockchain registry: <strong className={verifyData.is_verified ? 'text-green-400' : 'text-red-400'}>{verifyData.is_verified ? 'YES' : 'NO'}</strong></span>
                                                                </div>
                                                                {verifyData.on_chain?.exists && verifyData.on_chain.timestamp && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-green-400">✔</span>
                                                                        <span>Registered on-chain at: <span className="text-neutral-200">{new Date(verifyData.on_chain.timestamp * 1000).toLocaleString()}</span></span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Polygonscan */}
                                                            {verifyData.blockchain_tx && (
                                                                <a href={verifyData.polygonscan_url} target="_blank" rel="noopener noreferrer"
                                                                    className="block text-center text-xs text-yellow-400 hover:text-yellow-300 underline transition">
                                                                    🔗 View blockchain transaction on Polygonscan →
                                                                </a>
                                                            )}

                                                            {/* Fake certificate explanation */}
                                                            {!verifyData.is_verified && (
                                                                <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs text-red-300">
                                                                    <p className="font-bold mb-1">⚠️ This certificate cannot be verified</p>
                                                                    <p>The SHA-256 hash of this file does not exist in the blockchain registry. This could mean:
                                                                    the certificate was never uploaded through KScouts, or the file has been <strong>tampered/modified</strong> after upload.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default PlayerDetail;
