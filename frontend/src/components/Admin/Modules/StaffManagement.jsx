import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Briefcase, 
    Plus, 
    DollarSign, 
    Calendar, 
    MoreVertical, 
    Search,
    ShieldCheck,
    Truck,
    BookMarked,
    UserCircle,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const StaffManagement = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const roles = ['Accountant', 'Librarian', 'Receptionist', 'Transport Manager', 'Security'];
    
    const staff = [
        { name: 'Mr. Gupta', role: 'Accountant', contact: '+91 94250 11221', salary: '₹45,000', status: 'Active' },
        { name: 'Mrs. Dsouza', role: 'Librarian', contact: '+91 94250 11222', salary: '₹35,000', status: 'Active' },
        { name: 'Vikram Singh', role: 'Transport Manager', contact: '+91 94250 11223', salary: '₹30,000', status: 'On Route' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card-base p-8 rounded-[3rem] border border-border-base shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Clock className="w-32 h-32 text-indigo-500" />
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-indigo-500" /> HR Command Center
                        </h3>
                        <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Personnel & Registry Monitoring</p>
                    </div>
                    
                    <div className="bg-bg-base/50 border border-border-base px-6 py-3 rounded-2xl flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[14px] font-black text-indigo-500 tracking-tighter font-mono uppercase">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-[7px] font-bold text-text-dim uppercase tracking-widest">
                                {currentTime.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button className="px-6 py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Deploy New Faculty
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Staff', val: '42', color: 'text-indigo-500' },
                    { label: 'On-Site Now', val: '38', color: 'text-emerald-500' },
                    { label: 'On Leave', val: '04', color: 'text-rose-500' },
                    { label: 'Monthly Payroll', val: '₹4.8L', color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base/50 bg-bg-base/30">
                        <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h4 className={`text-xl font-black ${stat.color} tracking-tighter uppercase`}>{stat.val}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((role, idx) => (
                    <div key={idx} className="p-6 bg-bg-base/30 border border-border-base rounded-[2rem] hover:border-indigo-500/30 transition-all group cursor-pointer">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                            {role === 'Accountant' ? <DollarSign className="w-6 h-6" /> : 
                             role === 'Librarian' ? <BookMarked className="w-6 h-6" /> :
                             role === 'Transport Manager' ? <Truck className="w-6 h-6" /> :
                             <UserCircle className="w-6 h-6" />}
                        </div>
                        <h4 className="text-sm font-black text-text-main uppercase tracking-tight">{role}s</h4>
                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-1">Manage {role.toLowerCase()} faculty</p>
                    </div>
                ))}
            </div>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50 mt-8">
                <table className="w-full text-left">
                    <thead className="bg-bg-base/50 border-b border-border-base">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Staff Member</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Assigned Role</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((s, i) => (
                            <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-xs">{s.name[0]}</div>
                                        <span className="text-sm font-bold text-text-main">{s.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full">{s.role}</span>
                                </td>
                                <td className="px-6 py-5 text-xs font-bold text-text-dim uppercase md:lowercase tracking-tighter">{s.contact}</td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right"><MoreVertical className="w-4 h-4 text-text-dim cursor-pointer" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default StaffManagement;
