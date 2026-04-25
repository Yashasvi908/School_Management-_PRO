import React from 'react';
import { User, Camera, Mail, Phone, Book, Users, MapPin } from 'lucide-react';

import { useSelector } from 'react-redux';
import api from '../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2 } from 'lucide-react';

const AddStudentForm = ({ onClose }) => {
    const [formData, setFormData] = React.useState({
        name: '', email: '', phone: '', class: '10-A', parentName: '', rollNumber: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [credentials, setCredentials] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/admin/students/register', {
                ...formData,
                rollNumber: formData.rollNumber || '01'
            });
            if (res.data.success) {
                setCredentials(res.data.data);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (credentials) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">Registration Successful</h3>
                <div className="bg-bg-base/50 p-6 rounded-[2rem] border border-border-base space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Student ID Cluster</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl font-black text-primary">{credentials.studentId}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Temporal Access Key</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl font-black text-text-main font-mono">{credentials.password}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="w-full py-5 bg-text-main text-bg-base text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all">Acknowledge & Close</button>
            </motion.div>
        );
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="student@school.com" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Phone Number</label>
                    <div className="relative group">
                        <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} type="tel" placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Class & Section</label>
                    <div className="relative group">
                        <Users className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none">
                            <option>10-A</option>
                            <option>10-B</option>
                            <option>9-A</option>
                            <option>9-B</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Roll Number</label>
                    <input value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} type="text" placeholder="01" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                </div>
            </div>

            <div className="pt-4 border-t border-border-base/50">
                <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    {loading ? 'Processing Node...' : 'Register Student'}
                </button>
            </div>
        </form>
    );
};

export default AddStudentForm;
