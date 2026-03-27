import React from 'react';
import { 
    TrendingUp, 
    GraduationCap, 
    UserCheck, 
    Briefcase, 
    Activity, 
    DollarSign, 
    Clock, 
    Bell,
    FileText,
    Calendar,
    MoreVertical,
    ShieldCheck,
    Zap,
    Users
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

const DashboardOverview = ({ setShowAddStudent, setShowAddTeacher, setShowAddExam }) => {
    const stats = [
        { title: 'Total Students', value: '1,240', change: '+5%', icon: GraduationCap, color: 'bg-indigo-500' },
        { title: 'Total Teachers', value: '84', change: '+2%', icon: UserCheck, color: 'bg-emerald-500' },
        { title: 'Total Staff', value: '42', change: '+1%', icon: Briefcase, color: 'bg-blue-500' },
        { title: 'Today Attendance', value: '942', change: '92%', icon: Activity, color: 'bg-purple-500' },
        { title: 'Fees Collected Today', value: '₹45,200', change: '+12%', icon: DollarSign, color: 'bg-amber-500' },
        { title: 'Pending Fees', value: '₹2.8L', change: '-3%', icon: Clock, color: 'bg-rose-500' },
    ];

    const feeData = [
        { name: 'Jan', amount: 4000 }, { name: 'Feb', amount: 3000 }, { name: 'Mar', amount: 5000 },
        { name: 'Apr', amount: 4500 }, { name: 'May', amount: 6000 }, { name: 'Jun', amount: 5500 },
    ];

    const attendanceData = [
        { name: 'Mon', present: 85, absent: 15 }, { name: 'Tue', present: 88, absent: 12 },
        { name: 'Wed', present: 92, absent: 8 }, { name: 'Thu', present: 90, absent: 10 },
        { name: 'Fri', present: 86, absent: 14 },
    ];

    const admissionData = [
        { name: '2020', students: 800 }, { name: '2021', students: 950 }, { name: '2022', students: 1100 },
        { name: '2023', students: 1240 }, { name: '2024', students: 1400 },
    ];

    const performanceData = [
        { name: 'Students', value: 1240, color: '#6366f1' },
        { name: 'Faculty', value: 84, color: '#10b981' },
        { name: 'Staff', value: 42, color: '#3b82f6' },
        { name: 'External', value: 15, color: '#f59e0b' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">
            {/* Top Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="relative z-10">
                            <p className="text-text-dim text-[9px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
                            <h3 className="text-2xl font-black text-text-main mt-2 tracking-tighter">{stat.value}</h3>
                            <div className={`mt-4 w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} text-white shadow-lg`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-all transform group-hover:scale-125 duration-700">
                            <stat.icon className="w-24 h-24" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Performance & Allocation Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Resource Allocation Pie Chart */}
                <motion.div variants={itemVariants} className="xl:col-span-1 glass-card p-8 rounded-[3rem] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                            <Users className="w-5 h-5 text-indigo-500" /> Resource Allocation
                        </h3>
                    </div>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={performanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '16px', border: '1px solid var(--border-base)', color: 'var(--text-main)' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* System KPI Performance Cards */}
                <motion.div variants={itemVariants} className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-8 rounded-[3rem] bg-emerald-500/5 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform shadow-xl">
                                <Zap className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Optimal</span>
                        </div>
                        <h4 className="text-xl font-black text-text-main uppercase tracking-tighter">Server Performance</h4>
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-dim">
                                <span>CPU Usage</span>
                                <span>24%</span>
                            </div>
                            <div className="w-full h-2 bg-emerald-500/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '24%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[3rem] bg-indigo-500/5 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform shadow-xl">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">Secure</span>
                        </div>
                        <h4 className="text-xl font-black text-text-main uppercase tracking-tighter">System Uptime</h4>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-4xl font-black text-text-main tracking-tighter">99.9<span className="text-lg opacity-50">%</span></div>
                            <div className="text-[10px] font-black text-text-dim uppercase tracking-widest text-right">
                                <p>Last Backup:</p>
                                <p className="text-indigo-500 mt-1">14 Min Ago</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Monthly Fee Collection Graph */}
                <motion.div variants={itemVariants} className="glass-card p-8 rounded-[3rem] lg:col-span-8 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-amber-500" /> Revenue Stream Index
                            </h3>
                            <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Financial Matrix</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={feeData}>
                                <defs>
                                    <linearGradient id="colorFee" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '24px', border: '1px solid var(--border-base)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                                    itemStyle={{ color: 'var(--text-main)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={5} fillOpacity={1} fill="url(#colorFee)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="lg:col-span-4 glass-card p-8 rounded-[3rem] shadow-2xl">
                    <h3 className="text-lg font-black text-text-main mb-6 uppercase tracking-tighter flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" /> Rapid Action Hub
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Add Student', icon: GraduationCap, color: 'hover:bg-indigo-500/10 hover:text-indigo-400', onClick: () => setShowAddStudent(true) },
                            { label: 'Add Teacher', icon: UserCheck, color: 'hover:bg-emerald-500/10 hover:text-emerald-400', onClick: () => setShowAddTeacher(true) },
                            { label: 'Send Notice', icon: Bell, color: 'hover:bg-purple-500/10 hover:text-purple-400', onClick: () => {} },
                            { label: 'Create Event', icon: Calendar, color: 'hover:bg-amber-500/10 hover:text-amber-400', onClick: () => {} },
                        ].map((action, i) => (
                            <button 
                                key={i} 
                                onClick={action.onClick}
                                className={`flex flex-col items-center justify-center gap-3 p-4 bg-bg-base/30 border border-border-base rounded-[2.5rem] transition-all duration-500 group ${action.color} hover:scale-105 active:scale-95`}
                            >
                                <div className="p-3 bg-card-base rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl">
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-center">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Graph */}
                <motion.div variants={itemVariants} className="glass-card p-10 rounded-[3rem] shadow-2xl">
                    <h3 className="text-lg font-black text-text-main mb-8 uppercase tracking-tighter flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500" /> Presence Frequency Graph
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '20px', border: '1px solid var(--border-base)' }} />
                                <Bar dataKey="present" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={25} animationDuration={1500} />
                                <Bar dataKey="absent" fill="var(--secondary)" radius={[8, 8, 0, 0]} barSize={25} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* New Admission Graph */}
                <motion.div variants={itemVariants} className="glass-card p-10 rounded-[3rem] shadow-2xl">
                    <h3 className="text-lg font-black text-text-main mb-8 uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Longitudinal Admission Growth
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={admissionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '20px', border: '1px solid var(--border-base)' }} />
                                <Line type="monotone" dataKey="students" stroke="var(--primary)" strokeWidth={5} dot={{ fill: 'var(--primary)', strokeWidth: 4, r: 6, stroke: 'rgba(99,102,241,0.2)' }} activeDot={{ r: 9, strokeWidth: 0 }} animationDuration={2500} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity Feed */}
            <motion.div variants={itemVariants} className="glass-card p-10 rounded-[4rem] shadow-2xl border border-border-base/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> Recent System Activities
                    </h3>
                    <button className="text-[10px] font-black text-primary uppercase border-b-2 border-primary/30 hover:border-primary tracking-widest transition-all">Audit System Logs</button>
                </div>
                <div className="space-y-4">
                    {[
                        { user: 'Admin', action: 'Approved admission for Aryan Verma', time: '2h ago', icon: GraduationCap, color: 'text-indigo-500 bg-indigo-500/10' },
                        { user: 'Accounts', action: 'Fee received for ID #1024', time: '4h ago', icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
                        { user: 'Security', action: 'Suspicious login attempt blocked from 192.168.1.1', time: '6h ago', icon: ShieldCheck, color: 'text-rose-500 bg-rose-500/10' },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 hover:bg-white/[0.03] rounded-[2.5rem] transition-all border border-transparent hover:border-border-base group">
                            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${activity.color} group-hover:scale-110 transition-transform shadow-lg`}>
                                <activity.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-black text-text-main tracking-tight group-hover:text-primary transition-colors">
                                    {activity.user} <span className="font-bold text-text-dim/70 ml-2 uppercase text-[10px] tracking-widest leading-none">{activity.action}</span>
                                </p>
                                <p className="text-[9px] font-black text-text-dim/40 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> {activity.time}
                                </p>
                            </div>
                            <button className="p-3 bg-bg-base/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:text-primary"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardOverview;
