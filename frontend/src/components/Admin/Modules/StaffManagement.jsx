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
    Clock,
    Edit2,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../../../api/axios';

const StaffManagement = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const roles = ['Accountant', 'Librarian', 'Receptionist', 'Transport Manager', 'Security'];
    
    const [view, setView] = useState('list');
    const [staffList, setStaffList] = useState([]);
    const [deployData, setDeployData] = useState({ name: '', email: '', role: 'Accountant', contact: '', salary: '' });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/staff');
                if (res.data.success) {
                    setStaffList(res.data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch staff', err);
            } finally {
                setLoading(false);
            }
        };
        if (token && view === 'list') fetchStaff();
    }, [token, view]);

    const handleDeploy = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (deployData._id) {
                const res = await api.put(`/admin/staff/${deployData._id}`, deployData);
                if (res.data.success) {
                    alert('Staff details updated successfully');
                    setView('list');
                }
            } else {
                const res = await api.post('/admin/staff', deployData);
                if (res.data.success) {
                    alert(`Deployed Successfully!\n\nLOGIN CREDENTIALS:\nID (Email or Name): ${res.data.data.email}\nPassword: ${res.data.data.password}`);
                    setView('list');
                }
            }
            setDeployData({ name: '', email: '', role: 'Accountant', contact: '', salary: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        try {
            await api.delete(`/admin/staff/${id}`);
            setStaffList(staffList.filter(s => s._id !== id));
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleEdit = (staff) => {
        setDeployData({
            _id: staff._id,
            name: staff.user?.name || '',
            email: staff.user?.email || '',
            role: staff.role || 'Accountant',
            contact: staff.contact || '',
            salary: staff.salary || ''
        });
        setView('deploy');
    };

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
                    <button onClick={() => { setView('list'); setDeployData({ name: '', email: '', role: 'Accountant', contact: '', salary: '' }); }} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 ${view === 'list' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95' : 'bg-bg-base/50 text-text-dim border border-border-base hover:bg-bg-base'}`}>
                        Registry
                    </button>
                    <button onClick={() => setView('deploy')} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 ${view === 'deploy' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95' : 'bg-bg-base/50 text-text-dim border border-border-base hover:bg-bg-base'}`}>
                        <Plus className="w-4 h-4" /> Deploy New Faculty
                    </button>
                </div>
            </div>

            {view === 'list' ? (
                <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Staff', val: staffList.length, color: 'text-indigo-500' },
                    { label: 'On-Site Now', val: staffList.filter(s => s.status === 'active').length, color: 'text-emerald-500' },
                    { label: 'On Leave', val: staffList.filter(s => s.status === 'inactive').length, color: 'text-rose-500' },
                    { label: 'Monthly Payroll', val: `₹${(staffList.reduce((acc, curr) => acc + (curr.salary || 0), 0) / 100000).toFixed(1)}L`, color: 'text-amber-500' },
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
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">ID</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Staff Member</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Assigned Role</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map((s, i) => (
                            <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-5 text-[11px] font-black text-indigo-500 uppercase tracking-widest">{s.employeeId}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-xs">{s.user?.name?.[0] || '?'}</div>
                                        <span className="text-sm font-bold text-text-main">{s.user?.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full">{s.role}</span>
                                </td>
                                <td className="px-6 py-5 text-xs font-bold text-text-dim uppercase md:lowercase tracking-tighter">{s.contact || 'N/A'}</td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex gap-4 justify-end items-center">
                                        <Edit2 className="w-4 h-4 text-emerald-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleEdit(s)} />
                                        <Trash2 className="w-4 h-4 text-rose-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleDelete(s._id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                </>
            ) : (
                <div className="glass-card p-10 rounded-[3rem] border-border-base bg-indigo-500/5 animate-in fade-in duration-500 max-w-4xl mx-auto mt-8">
                    <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-8">Faculty <span className="text-indigo-500">Deployment</span></h4>
                    <form onSubmit={handleDeploy} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Staff Member Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="E.g., John Doe" 
                                value={deployData.name}
                                onChange={(e) => setDeployData({...deployData, name: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-indigo-500/50" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Staff Email (Optional)</label>
                            <input 
                                type="email" 
                                placeholder="john.doe@school.edu" 
                                value={deployData.email}
                                onChange={(e) => setDeployData({...deployData, email: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-indigo-500/50" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Assign Role</label>
                            <select 
                                required
                                value={deployData.role}
                                onChange={(e) => setDeployData({...deployData, role: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-indigo-500/50 appearance-none" 
                            >
                                {roles.map(r => <option key={r} value={r} className="bg-bg-base">{r}</option>)}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Contact Number</label>
                            <input 
                                type="text" 
                                required
                                placeholder="+91 XXXXX XXXXX" 
                                value={deployData.contact}
                                onChange={(e) => setDeployData({...deployData, contact: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-indigo-500/50" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Monthly Payroll / Salary</label>
                            <input 
                                type="text" 
                                required
                                placeholder="₹50,000" 
                                value={deployData.salary}
                                onChange={(e) => setDeployData({...deployData, salary: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-indigo-500/50" 
                            />
                        </div>
                        <div className="flex justify-end mt-4 md:col-span-2">
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="px-12 py-4 bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {deployData._id ? 'Update Staff Member' : 'Confirm Deployment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </motion.div>
    );
};

export default StaffManagement;
