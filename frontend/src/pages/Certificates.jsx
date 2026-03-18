import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

// ─── Verification Step Component ───────────────────────────────────────────
const VerifyStep = ({ step, label, status }) => {
    const icons = { waiting: '⏳', active: '⚡', done: '✅', error: '❌' };
    const colors = {
        waiting: 'text-neutral-500 border-neutral-700 bg-neutral-800/50',
        active:  'text-yellow-400 border-yellow-500 bg-yellow-900/20',
        done:    'text-green-400 border-green-500 bg-green-900/20',
        error:   'text-red-400 border-red-500 bg-red-900/20',
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step * 0.15 }}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${colors[status]}`}
        >
            <motion.span
                animate={status === 'active' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-xl"
            >
                {icons[status]}
            </motion.span>
            <span className="text-sm font-semibold">{label}</span>
        </motion.div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', issuer: '', description: '' });
    const [file, setFile] = useState(null);

    // Verification animation state
    const [verifying, setVerifying] = useState(false);
    const [verifySteps, setVerifySteps] = useState(['waiting', 'waiting', 'waiting', 'waiting']);
    const [verifyResult, setVerifyResult] = useState(null); // 'success' | 'fail' | null
    const [generatedHash, setGeneratedHash] = useState('');

    // Inline verifier
    const [verifyInput, setVerifyInput] = useState('');
    const [verifyCheckResult, setVerifyCheckResult] = useState(null);
    const [verifyChecking, setVerifyChecking] = useState(false);

    useEffect(() => { fetchCertificates(); }, []);

    const fetchCertificates = async () => {
        try {
            const res = await api.get('/certificates/my');
            setCertificates(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── Animated step updater
    const setStep = (index, status) => {
        setVerifySteps(prev => {
            const next = [...prev];
            next[index] = status;
            return next;
        });
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !formData.title) return;

        setVerifying(true);
        setVerifyResult(null);
        setGeneratedHash('');
        setVerifySteps(['waiting', 'waiting', 'waiting', 'waiting']);

        try {
            // Step 1: Uploading file
            setStep(0, 'active');
            await sleep(600);
            setStep(0, 'done');

            // Step 2: Generating hash (simulate reading file locally)
            setStep(1, 'active');
            await sleep(800);

            // Build FormData
            const data = new FormData();
            data.append('title', formData.title);
            data.append('issuer', formData.issuer);
            data.append('description', formData.description);
            data.append('file', file);

            // Step 3: Sending to blockchain
            setStep(1, 'done');
            setStep(2, 'active');

            // Make the real API call
            const res = await api.post('/certificates/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const cert = res.data;
            setGeneratedHash(cert.sha256_hash || '');

            await sleep(600);
            setStep(2, 'done');

            // Step 4: Confirming
            setStep(3, 'active');
            await sleep(700);

            if (cert.is_verified) {
                setStep(3, 'done');
                setVerifyResult('success');
            } else {
                setStep(3, 'error');
                setVerifyResult('fail');
            }

            // Add to list
            setCertificates(prev => [cert, ...prev]);
            setFormData({ title: '', issuer: '', description: '' });
            setFile(null);
            setShowForm(false);

        } catch (err) {
            setStep(verifySteps.findIndex(s => s === 'active'), 'error');
            setVerifyResult('fail');
        }
    };

    // ── Inline verify by certificate ID
    const handleVerifyCheck = async (e) => {
        e.preventDefault();
        if (!verifyInput.trim()) return;
        setVerifyChecking(true);
        setVerifyCheckResult(null);
        try {
            const res = await api.get(`/certificates/verify/${verifyInput.trim()}`);
            setVerifyCheckResult(res.data);
        } catch {
            setVerifyCheckResult({ error: true });
        } finally {
            setVerifyChecking(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black font-sans text-gray-100"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="fixed inset-0 bg-black/85 z-0 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">

                {/* ── Header */}
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Certificates</h1>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                            className="mt-2 h-1 w-20 bg-amber-500 origin-left" />
                        <p className="mt-2 text-gray-400 text-sm">Your blockchain-verified credentials</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => { setShowForm(!showForm); setVerifying(false); setVerifyResult(null); }}
                            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                            {showForm ? '✕ Close' : '+ Upload'}
                        </motion.button>
                        <Link to="/dashboard">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition rounded">
                                ← Back
                            </motion.button>
                        </Link>
                    </div>
                </motion.header>

                {/* ── Upload Form + Verification Animation */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Left: Upload form */}
                                <motion.form onSubmit={handleUpload}
                                    className="bg-gray-900/80 backdrop-blur-md border border-amber-500/20 rounded-xl p-6 space-y-4">
                                    <h3 className="text-sm font-bold uppercase text-amber-400 tracking-widest mb-4">Upload Certificate</h3>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Title *</label>
                                        <input type="text" value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })} required
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                            placeholder="FIFA C License" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Issuer</label>
                                        <input type="text" value={formData.issuer}
                                            onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                            placeholder="FIFA" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Certificate File *</label>
                                        <input type="file" onChange={e => setFile(e.target.files[0])} required
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-amber-700 file:text-white file:font-bold file:uppercase file:text-xs file:tracking-widest file:cursor-pointer hover:file:bg-amber-600" />
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        type="submit" disabled={verifying}
                                        className="w-full bg-amber-600 hover:bg-amber-500 py-3 text-white font-bold uppercase tracking-widest transition disabled:opacity-50 rounded">
                                        {verifying ? 'Verifying...' : 'Upload & Verify'}
                                    </motion.button>
                                </motion.form>

                                {/* Right: Verification Animation Panel */}
                                <div className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col justify-between">
                                    <h3 className="text-sm font-bold uppercase text-gray-400 tracking-widest mb-4">Verification Process</h3>
                                    <div className="space-y-3 flex-1">
                                        <VerifyStep step={0} label="📁  File received & uploaded" status={verifySteps[0]} />
                                        <VerifyStep step={1} label="🔐  SHA-256 hash generated" status={verifySteps[1]} />
                                        <VerifyStep step={2} label="⛓️  Hash sent to blockchain" status={verifySteps[2]} />
                                        <VerifyStep step={3} label="✔️  On-chain confirmation" status={verifySteps[3]} />
                                    </div>

                                    {/* Generated hash preview */}
                                    {generatedHash && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="mt-4 bg-black/40 rounded p-3 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">SHA-256 Hash</p>
                                            <p className="text-xs font-mono text-green-400 break-all">{generatedHash}</p>
                                        </motion.div>
                                    )}

                                    {/* Result Banner */}
                                    <AnimatePresence>
                                        {verifyResult && (
                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`mt-4 rounded-lg p-4 text-center font-black uppercase tracking-widest text-lg ${
                                                    verifyResult === 'success' ? 'bg-green-900/50 border border-green-500 text-green-400' :
                                                    verifyResult === 'pending' ? 'bg-yellow-900/30 border border-yellow-500 text-yellow-400' :
                                                    'bg-red-950 border border-red-600 text-red-400'
                                                }`}>
                                                {verifyResult === 'success' && '✅ Verified On-Chain!'}
                                                {verifyResult === 'fail' && '❌ Verification Failed'}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Certificate List */}
                {certificates.length === 0 && !showForm ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 text-gray-500">
                        <p className="text-5xl mb-4">🏆</p>
                        <p className="text-lg">No certificates yet. Upload your first one!</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase text-gray-500 tracking-widest mb-2">Your Certificates</h2>
                        {certificates.map((cert, i) => (
                            <motion.div key={cert.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ x: 4 }}
                                className={`bg-gray-900/80 backdrop-blur-md border rounded-xl p-5 hover:transition-all ${
                                    cert.is_verified
                                        ? 'border-green-500/30 hover:border-green-400/50'
                                        : 'border-white/10 hover:border-amber-500/30'
                                }`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-4">
                                        {/* Status icon */}
                                        <motion.div
                                            animate={cert.is_verified ? { scale: [1, 1.05, 1] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`h-12 w-12 rounded-lg flex items-center justify-center text-2xl border ${
                                                cert.is_verified
                                                    ? 'bg-green-900/30 border-green-500/40'
                                                    : 'bg-gray-800/50 border-gray-600/40'
                                            }`}>
                                            {cert.is_verified ? '✅' : '📄'}
                                        </motion.div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                                            <p className="text-xs text-gray-400">
                                                {cert.issuer && `${cert.issuer} · `}
                                                {cert.uploaded_at && new Date(cert.uploaded_at).toLocaleDateString()}
                                            </p>
                                            {cert.sha256_hash && (
                                                <p className="text-xs font-mono text-gray-600 mt-1">
                                                    SHA-256: {cert.sha256_hash.substring(0, 20)}...
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right side: badge + link */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {cert.is_verified ? (
                                            <>
                                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-900/50 text-green-400 border border-green-500/40">
                                                    ✅ VERIFIED ON-CHAIN
                                                </span>
                                                {cert.blockchain_tx && (
                                                    <a href={`https://mumbai.polygonscan.com/tx/${cert.blockchain_tx}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="text-xs text-amber-400 hover:text-amber-300 underline transition">
                                                        🔗 View on Polygonscan
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-900/40 text-red-500 border border-red-500/30">
                                                ❌ VERIFICATION FAILED
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ── Inline Certificate Verifier */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="mt-10 bg-gray-900/70 backdrop-blur-md border border-amber-600/20 rounded-xl p-6">
                    <h2 className="text-sm font-bold uppercase text-amber-400 tracking-widest mb-1">🔍 Verify a Certificate</h2>
                    <p className="text-xs text-gray-500 mb-4">Enter a Certificate ID to check if it's verified on the blockchain</p>
                    <form onSubmit={handleVerifyCheck} className="flex gap-3">
                        <input type="text" value={verifyInput} onChange={e => setVerifyInput(e.target.value)}
                            placeholder="Certificate ID (e.g. 1)"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white font-mono text-sm placeholder-gray-600 focus:border-amber-500 focus:outline-none transition" />
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            type="submit" disabled={verifyChecking}
                            className="bg-amber-700 hover:bg-amber-600 text-white px-5 py-2 text-xs font-bold uppercase tracking-widest rounded transition disabled:opacity-50">
                            {verifyChecking ? '...' : 'Verify'}
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {verifyCheckResult && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`mt-4 rounded-lg border p-4 ${
                                    verifyCheckResult.error ? 'bg-red-950 border-red-600/40 text-red-400' :
                                    verifyCheckResult.is_verified ? 'bg-green-950 border-green-600/40' : 'bg-red-950 border-red-600/40'
                                }`}>
                                {verifyCheckResult.error ? (
                                    <p className="font-bold">❌ Certificate not found or server error.</p>
                                ) : (
                                    <div className="space-y-2">
                                        <div className={`text-lg font-black uppercase ${verifyCheckResult.is_verified ? 'text-green-400' : 'text-red-400'}`}>
                                            {verifyCheckResult.is_verified ? '✅ VERIFIED — Hash is on-chain' : '❌ VERIFICATION FAILED'}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            <span className="text-gray-500">Title: </span>{verifyCheckResult.title}
                                        </div>
                                        <div className="text-xs font-mono text-gray-500 break-all">
                                            <span className="text-gray-600">SHA-256: </span>{verifyCheckResult.sha256_hash}
                                        </div>
                                        {verifyCheckResult.is_verified && verifyCheckResult.on_chain?.exists && (
                                            <div className="text-xs text-green-300">
                                                Registered on-chain at: {new Date(verifyCheckResult.on_chain.timestamp * 1000).toLocaleString()}
                                            </div>
                                        )}
                                        {verifyCheckResult.blockchain_tx && (
                                            <a href={verifyCheckResult.polygonscan_url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs text-amber-400 hover:text-amber-300 underline block mt-1">
                                                🔗 View transaction on Polygonscan →
                                            </a>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
};

export default Certificates;
