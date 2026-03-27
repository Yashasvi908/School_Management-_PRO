import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { GraduationCap, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login({ identifier, password, role }))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                console.error('Login failed:', err);
            });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Premium Animated Background Elements */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"
            />
            <motion.div
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Logo Section */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
                    <div className="relative mb-4 group">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform group-hover:rotate-6 transition-transform duration-500">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    </div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tighter">
                        School Pro
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 font-medium tracking-wide">ENTER YOUR CREDENTIALS TO LOGIN</p>
                </motion.div>

                {/* Login Card with Glassmorphism */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl overflow-hidden relative group">
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700"></div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {/* Role Selection Dropdown */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Role</label>
                            <div className="relative group/select">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/select:text-indigo-500 transition-colors" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium text-white appearance-none cursor-pointer hover:bg-white/[0.05]"
                                >
                                    <option value="student" className="bg-[#121212] text-white">Student</option>
                                    <option value="teacher" className="bg-[#121212] text-white">Teacher</option>
                                    <option value="parent" className="bg-[#121212] text-white">Parent</option>
                                    <option value="admin" className="bg-[#121212] text-white">Admin</option>
                                    <option value="accountant" className="bg-[#121212] text-white">Accountant</option>
                                    <option value="librarian" className="bg-[#121212] text-white">Librarian</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ArrowRight className="w-5 h-5 rotate-90" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Input Fields */}
                        <div className="space-y-4">
                            <motion.div variants={itemVariants} className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Username or School ID"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-gray-600 hover:bg-white/[0.05]"
                                    required
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-gray-600 hover:bg-white/[0.05]"
                                    required
                                />
                            </motion.div>
                        </div>

                        {/* Actions */}
                        <motion.div variants={itemVariants} className="flex justify-between items-center text-xs px-1">
                            <button 
                                type="button" 
                                onClick={() => navigate('/setup-account')} 
                                className="text-gray-400 hover:text-indigo-400 font-semibold transition-colors"
                            >
                                Activate Account
                            </button>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">Forgot Password?</a>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-3 group/btn"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Sign into Dashboard</span>
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
