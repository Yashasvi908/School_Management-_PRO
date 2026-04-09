import React, { useState } from 'react';
import { 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    Download, 
    FileText, 
    Calendar, 
    Users, 
    DollarSign,
    ArrowUpRight,
    Search,
    ChevronDown
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const ReportsAnalytics = () => {
    const reportTypes = [
        { title: 'Student Performance', desc: 'Grade-wise result trends', icon: TrendingUp, color: 'text-indigo-500' },
        { title: 'Financial Audit', desc: 'Revenue vs Expense reports', icon: DollarSign, color: 'text-emerald-500' },
        { title: 'Attendance Heatmap', desc: 'Daily/Monthly presence logs', icon: Calendar, color: 'text-amber-500' },
        { title: 'Faculty Load', desc: 'Teaching hours and subjects', icon: Users, color: 'text-purple-500' },
    ];

    const academicGrowth = [
        { grade: 'G1', score: 85, color: '#6366f1' },
        { grade: 'G2', score: 78, color: '#8b5cf6' },
        { grade: 'G3', score: 92, color: '#f59e0b' },
        { grade: 'G4', score: 88, color: '#10b981' },
        { grade: 'G5', score: 95, color: '#f43f5e' },
        { grade: 'G6', score: 82, color: '#6366f1' },
        { grade: 'G7', score: 75, color: '#8b5cf6' },
        { grade: 'G8', score: 89, color: '#f59e0b' },
        { grade: 'G9', score: 91, color: '#10b981' },
        { grade: 'G10', score: 97, color: '#f43f5e' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-primary" /> Strategic Intelligence
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Data-Driven Decision Making & Exportable Audits</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-3 bg-bg-base border border-border-base text-text-dim text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                        Custom Query <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportTypes.map((report, i) => (
                    <motion.div 
                        key={i} 
                        whileHover={{ y: -5 }}
                        className="p-8 bg-bg-base/30 border border-border-base rounded-[2.5rem] hover:border-primary/30 transition-all cursor-pointer group"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-bg-base flex items-center justify-center ${report.color} mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                            <report.icon className="w-7 h-7" />
                        </div>
                        <h4 className="text-md font-black text-text-main uppercase tracking-tight">{report.title}</h4>
                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-2 opacity-70">{report.desc}</p>
                        <div className="mt-8 pt-6 border-t border-border-base/50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                            <span>Generate</span>
                            <Download className="w-4 h-4" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-10 rounded-[3rem] border-border-base">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tighter">Academic Growth Index</h4>
                        <select className="bg-bg-base border border-border-base px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">
                            <option>Academic Session 2023-24</option>
                            <option>Academic Session 2022-23</option>
                        </select>
                    </div>
                    <div className="h-64 px-4 bg-bg-base/20 rounded-[2rem] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={academicGrowth}>
                                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                    {academicGrowth.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-6 px-10 text-[9px] font-black text-text-dim uppercase tracking-widest">
                        <span>Min Gr.</span>
                        <span>Med Gr.</span>
                        <span>Max Gr.</span>
                    </div>
                </div>

                <div className="lg:col-span-4 glass-card p-10 rounded-[3rem] border-border-base">
                    <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-8">Recent Downloads</h4>
                    <div className="space-y-4">
                        {[
                            { name: 'Jan_Fee_Report.xlsx', date: '2h ago', size: '2.4MB' },
                            { name: 'Grade_10_Result.pdf', date: '5h ago', size: '1.2MB' },
                            { name: 'Staff_Attendance.csv', date: '1d ago', size: '0.8MB' },
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] rounded-2xl border border-transparent hover:border-border-base transition-all group">
                                <div className="w-10 h-10 bg-bg-base rounded-xl flex items-center justify-center text-text-dim group-hover:text-primary transition-colors"><FileText className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-black text-text-main tracking-tight">{doc.name}</p>
                                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{doc.date} • {doc.size}</p>
                                </div>
                                <Download className="w-4 h-4 text-text-dim/50 cursor-pointer" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all">Clear History</button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsAnalytics;
