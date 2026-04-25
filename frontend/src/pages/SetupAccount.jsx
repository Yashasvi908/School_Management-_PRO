import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowRight, CheckCircle, GraduationCap } from 'lucide-react';
import api from '../api/axios';

const SetupAccount = () => {
    const navigate = useNavigate();
    const [schoolId, setSchoolId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSetup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        if (password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await api.post('/auth/setup-account', {
                schoolId,
                password,
                role
            });

            setStatus({ type: 'success', message: response.data.message });

            // Redirect after success
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Setup failed. Please check your ID.'
            });
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student' },
        { id: 'teacher', label: 'Teacher' },
        { id: 'parent', label: 'Parent' },
        { id: 'admin', label: 'Admin' },
        { id: 'accountant', label: 'Finance' },
        { id: 'librarian', label: 'Library' }
    ];

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Premium Animated Background Elements */}
            <motion.div
                animate={{ x: [0, 80, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -60, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[500px] relative z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tighter uppercase">Activate Account</h1>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Initialize Institutional Access Node</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-3xl overflow-hidden relative group">
                    <AnimatePresence mode="wait">
                        {status.message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 text-center border ${
                                    status.type === 'error' 
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                }`}
                            >
                                {status.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSetup} className="space-y-6">
                        {/* Role Selection Grid */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 opacity-60">Select Designation</label>
                            <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                                {roles.map((r) => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRole(r.id)}
                                        className={`py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                            role === r.id 
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={role === 'parent' ? "ENTER PARENT ID (PRN...)" : "ENTER SYSTEM ID (e.g. STU...)"}
                                    value={schoolId}
                                    onChange={(e) => setSchoolId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all uppercase"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="CREATE ACCESS KEY"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="CONFIRM ACCESS KEY"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>SYNCHRONIZING...</span>
                                </div>
                            ) : <>INITIALIZE ACCESS <ArrowRight className="w-4 h-4" /></>}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button onClick={() => navigate('/login')} className="text-[10px] font-black text-gray-500 hover:text-indigo-400 uppercase tracking-widest transition-all">
                            Back to Identity Portal
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SetupAccount;
