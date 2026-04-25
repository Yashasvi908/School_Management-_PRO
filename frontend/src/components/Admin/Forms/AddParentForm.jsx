import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Link } from 'lucide-react';

import api from '../../../api/axios';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const AddParentForm = ({ onClose }) => {
    const [formData, setFormData] = React.useState({
        name: '', email: '', phone: '', occupation: '', address: '', studentLink: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [credentials, setCredentials] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/admin/parents/register', formData);
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
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">Guardian Account Created</h3>
                <div className="bg-bg-base/50 p-6 rounded-[2rem] border border-border-base space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Parent Identity Cluster</p>
                        <span className="text-xl font-black text-amber-500">{credentials.parentId}</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Access Key</p>
                        <span className="text-xl font-black text-text-main font-mono">{credentials.password}</span>
                    </div>
                </div>
                <button onClick={onClose} className="w-full py-5 bg-text-main text-bg-base text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all">Complete Registration</button>
            </motion.div>
        );
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Parent Name</label>
                    <div className="relative group">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Sunil Sharma" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="parent@school.com" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Occupation</label>
                    <div className="relative group">
                        <Briefcase className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} type="text" placeholder="e.g. Software Engineer" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Address</label>
                    <div className="relative group">
                        <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} type="text" placeholder="e.g. 123, Street Name, City" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Link to Student (Roll No/ID)</label>
                    <div className="relative group">
                        <Link className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input value={formData.studentLink} onChange={(e) => setFormData({...formData, studentLink: e.target.value})} type="text" placeholder="e.g. STU-2024-001" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none" required />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border-base/50">
                <button type="submit" disabled={loading} className="w-full py-5 bg-amber-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    {loading ? 'Generating Node...' : 'Create parent Account'}
                </button>
            </div>
        </form>
    );
};

export default AddParentForm;
