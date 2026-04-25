import React, { useState } from 'react';
import { 
    DollarSign, 
    CreditCard, 
    TrendingUp, 
    BarChart3, 
    Plus, 
    FileText, 
    CheckCircle, 
    Clock, 
    ArrowUpRight, 
    Download,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';

import api from '../../../api/axios';
import { useSelector } from 'react-redux';

const FinanceManagement = () => {
    const [view, setView] = useState('fees'); 
    const [structures, setStructures] = useState([]);
    const [reports, setReports] = useState(null);
    const { token } = useSelector(state => state.auth);

    React.useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const [structRes, reportRes] = await Promise.all([
                    api.get('/admin/finance/structures'),
                    api.get('/admin/finance/reports')
                ]);
                if (structRes.data.success) setStructures(structRes.data.data);
                if (reportRes.data.success) setReports(reportRes.data.data);
            } catch (err) {
                console.error('Finance fetch error', err);
            }
        };
        if (token) fetchFinanceData();
    }, [token]);

    const collectionData = reports?.monthlyCollection?.map(item => ({
        month: new Date(2024, item._id - 1).toLocaleString('default', { month: 'short' }),
        collected: item.collected,
        target: 500000
    })) || [
        { month: 'Jan', collected: 0, target: 500000 }
    ];

    const revenueBreakdown = [
        { name: 'Tuition', value: 65, color: '#f59e0b' },
        { name: 'Transport', value: 20, color: '#6366f1' },
        { name: 'Other', value: 15, color: '#10b981' },
    ];

    const feeStructure = structures.length > 0 ? structures.map(s => ({
        type: s.name,
        amount: `₹${s.amount.toLocaleString()}`,
        frequency: s.frequency,
        category: s.targetClass || 'All'
    })) : [
        { type: 'No templates found', amount: '₹0', frequency: '-', category: '-' }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-amber-500" /> Financial Treasury
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Strategic Fee & Payment Management</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('fees')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'fees' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Fee Structures</button>
                    <button onClick={() => setView('reports')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'reports' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Revenue Reports</button>
                    <button onClick={() => setView('gateways')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'gateways' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>PG Integration</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue YTD', val: '₹48.6L', change: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Pending Collections', val: '₹12.4L', change: '-5%', icon: Clock, color: 'text-rose-500' },
                    { label: 'Today Collections', val: '₹45,200', change: '+2k', icon: CreditCard, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-card-base rounded-[2.5rem] border border-border-base flex items-center justify-between shadow-sm overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                             <stat.icon className="w-16 h-16" />
                         </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black text-text-main tracking-tighter">{stat.val}</h4>
                            <p className={`text-[9px] font-bold mt-2 flex items-center gap-1 ${stat.color}`}>
                                {stat.change} <ArrowUpRight className="w-3 h-3" /> <span className="text-text-dim/60 ml-1">vs last month</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-amber-500/5">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                         <BarChart3 className="w-4 h-4 text-amber-500" /> Collection Velocity
                    </h4>
                    <span className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase rounded-full">FY 2023-24</span>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={collectionData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                            <Bar dataKey="collected" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {view === 'fees' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em]">Active Fee Templates</h4>
                        <button className="px-6 py-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/20">+ Create Template</button>
                    </div>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50 border-b border-border-base">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Fee Description</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Frequency</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Category</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeStructure.map((fee, i) => (
                                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><FileText className="w-5 h-5" /></div>
                                                <span className="text-sm font-bold text-text-main uppercase tracking-tight">{fee.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black text-amber-500">{fee.amount}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-dim uppercase">{fee.frequency}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-main uppercase tracking-widest">{fee.category}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-amber-500/10 hover:text-amber-500 rounded-lg transition-all text-text-dim"><Plus className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'reports' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-emerald-500/5">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">Revenue Spectrum</h4>
                        <div className="h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={revenueBreakdown} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {revenueBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-text-main">100%</span>
                                <span className="text-[8px] font-black text-text-dim uppercase">Allocation</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                             {revenueBreakdown.map((s, i) => (
                                 <div key={i} className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                     <span className="text-text-dim flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div> {s.name} Fees</span>
                                     <span className="text-text-main">{s.value}%</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                    <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5 flex flex-col items-center justify-center text-center">
                        <TrendingUp className="w-12 h-12 text-indigo-500 mb-4 animate-bounce" />
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tighter">Export Financial Matrix</h4>
                        <p className="text-[10px] font-bold text-text-dim mt-2 tracking-widest opacity-60 uppercase mb-8">Generate audit-ready PDF/Excel reports for current fiscal year.</p>
                        <button className="w-full py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-500/30">Generate Full Audit</button>
                    </div>
                </div>
            )}

            {view === 'gateways' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { name: 'Razorpay Integration', status: 'Connected', desc: 'Accept UPI, Cards, Netbanking', icon: CheckCircle, color: 'text-emerald-500' },
                        { name: 'Stripe Global', status: 'Disconnected', desc: 'International Fee Collection', icon: Clock, color: 'text-rose-500' },
                     ].map((pg, i) => (
                        <div key={i} className="p-8 bg-bg-base/30 border border-border-base rounded-[2.5rem] flex items-center gap-6 group hover:border-amber-500/30 transition-all">
                            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-xl">
                                <CreditCard className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h5 className="font-black text-text-main uppercase text-sm tracking-tight">{pg.name}</h5>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-1">{pg.desc}</p>
                                <div className={`flex items-center gap-2 mt-4 text-[9px] font-black uppercase tracking-widest ${pg.color}`}>
                                    <pg.icon className="w-3 h-3" /> {pg.status}
                                </div>
                            </div>
                        </div>
                     ))}
                </div>
            )}
        </motion.div>
    );
};

export default FinanceManagement;
