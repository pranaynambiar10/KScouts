import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

/**
 * CertVerify — Public certificate file verification page
 * Allows anyone to upload a PDF to check its authenticity against the blockchain.
 * Route: /verify (no login required)
 */
const CertVerify = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/certificates/verify-certificate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setResult({ verified: false, message: "Server error during verification." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 font-sans text-gray-100 flex items-center justify-center px-4"
            style={{ backgroundImage: "linear-gradient(rgba(234,179,8,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }}>

            <div className="w-full max-w-lg">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
                            className="text-6xl mb-4">🔐</motion.div>
                        <h1 className="text-4xl font-serif font-bold text-yellow-500 uppercase">Verify Certificate</h1>
                        <motion.div className="mx-auto mt-3 h-1 w-20 bg-yellow-600" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
                        <p className="mt-4 text-neutral-400 text-sm">
                            Upload a certificate document to verify its authenticity on the blockchain registry.
                        </p>
                    </div>

                    {/* Form */}
                    <motion.form onSubmit={handleVerify}
                        className="bg-neutral-900 border border-yellow-600/20 rounded-xl p-8 space-y-5">
                        <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-yellow-500/50 transition bg-neutral-900/50">
                            <input
                                type="file"
                                id="cert-upload"
                                accept=".pdf,.jpg,.png"
                                className="hidden"
                                onChange={e => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <label htmlFor="cert-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
                                <span className={`text-4xl ${file ? 'text-yellow-500' : 'text-neutral-500'}`}>📄</span>
                                {file ? (
                                    <span className="text-sm font-bold text-yellow-400">{file.name}</span>
                                ) : (
                                    <span className="text-sm font-bold text-neutral-400">Click to upload document</span>
                                )}
                            </label>
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit" disabled={!file || loading}
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-black py-3 font-black uppercase tracking-widest transition disabled:opacity-50 rounded">
                            {loading ? '⏳ Verifying on Blockchain...' : '🔍 Check Blockchain'}
                        </motion.button>
                    </motion.form>

                    {/* Result */}
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 border rounded-xl p-8 text-center shadow-xl ${
                                result.verified 
                                    ? 'bg-green-950/40 border-green-500 shadow-green-900/20' 
                                    : 'bg-red-950/40 border-red-500 shadow-red-900/20'
                            }`}>
                            
                            <div className="text-6xl mb-4">
                                {result.verified ? '✅' : '✖'}
                            </div>
                            <h2 className={`text-2xl font-black uppercase tracking-wide mb-2 ${
                                result.verified ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {result.verified ? 'Verified on blockchain' : 'Certificate not recognized'}
                            </h2>
                            <p className="text-neutral-400 text-sm">
                                {result.message}
                            </p>
                            
                        </motion.div>
                    )}

                    {/* Footer note */}
                    <p className="text-center text-xs text-neutral-600 mt-8">
                        Powered by KScouts Smart Contracts
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default CertVerify;

