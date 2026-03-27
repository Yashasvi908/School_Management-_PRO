import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

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
            const response = await axios.post('http://localhost:8000/api/auth/setup-account', {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-8 text-center bg-indigo-50/50">
                    <div className="inline-flex p-4 bg-white rounded-full shadow-lg mb-4 text-indigo-600">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Activate Account</h1>
                    <p className="text-slate-500 text-sm mt-1">Set up your password for the first time</p>
                </div>

                <div className="p-8 pt-4">
                    {status.message && (
                        <div className={`p-3 rounded-lg text-sm mb-4 text-center ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSetup} className="space-y-4">
                        {/* Role Selector */}
                        <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg mb-4 gap-1">
                            {['admin', 'teacher', 'student', 'parent', 'accountant', 'librarian'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-2 px-2 text-[10px] sm:text-xs font-bold rounded-md capitalize transition-all ${role === r ? 'bg-white text-indigo-600 shadow-sm outline outline-slate-200' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={role === 'parent' ? "Enter Parent ID (e.g. PAR001)" : "Enter School ID (e.g. STU001)"}
                                    value={schoolId}
                                    onChange={(e) => setSchoolId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Create New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? 'Activating...' : <>Set Password & Activate <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/login')} className="text-sm text-slate-500 hover:text-indigo-600">
                            Back to Login
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SetupAccount;
