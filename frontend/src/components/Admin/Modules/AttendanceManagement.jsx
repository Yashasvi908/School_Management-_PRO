import React, { useState, useMemo } from 'react';
import { 
    Calendar, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Search, 
    Plus, 
    Layers, 
    Activity, 
    Download,
    Users,
    MoreVertical,
    TrendingUp,
    AlertTriangle,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    FileText,
    CheckCircle2,
    CalendarDays,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
    Cell
} from 'recharts';

// --- MOCK DATA ---
const ATTENDANCE_TRENDS = [
    { name: 'Mon', present: 92, absent: 8 },
    { name: 'Tue', present: 94, absent: 6 },
    { name: 'Wed', present: 88, absent: 12 },
    { name: 'Thu', present: 95, absent: 5 },
    { name: 'Fri', present: 91, absent: 9 },
    { name: 'Sat', present: 85, absent: 15 },
];

const CLASS_PERFORMANCE = [
    { class: '10-A', percentage: 94, color: '#6366f1' },
    { class: '10-B', percentage: 88, color: '#8b5cf6' },
    { class: '9-A', percentage: 91, color: '#ec4899' },
    { class: '9-B', percentage: 76, color: '#f59e0b' },
    { class: '8-A', percentage: 95, color: '#10b981' },
    { class: '11-C', percentage: 82, color: '#ef4444' },
];

const STUDENT_DATA = [
    { id: 1, name: 'Aryan Verma', roll: 'STU001', class: '10-A', status: 'Present', date: '2024-03-15', attendance: 92 },
    { id: 2, name: 'Isha Patel', roll: 'STU002', class: '10-A', status: 'Absent', date: '2024-03-15', attendance: 84 },
    { id: 3, name: 'Kabir Singh', roll: 'STU003', class: '10-A', status: 'Late', date: '2024-03-15', attendance: 72 },
    { id: 4, name: 'Sneha Rao', roll: 'STU004', class: '10-A', status: 'Present', date: '2024-03-15', attendance: 98 },
    { id: 5, name: 'Sameer Khan', roll: 'STU005', class: '10-B', status: 'Absent', date: '2024-03-15', attendance: 65 },
    { id: 6, name: 'Ananya Gupta', roll: 'STU006', class: '9-A', status: 'Present', date: '2024-03-15', attendance: 91 },
    { id: 7, name: 'Rohan Mehra', roll: 'STU007', class: '9-B', status: 'Late', date: '2024-03-15', attendance: 74 },
];

const TEACHER_ACTIVITY = [
    { name: 'Dr. Rajesh Kumar', class: '10-A', status: 'Marked', time: '08:15 AM' },
    { name: 'Mrs. Sunita Verma', class: '9-B', status: 'Pending', time: '-' },
    { name: 'Mr. Arvind Singh', class: '8-C', status: 'Marked', time: '08:30 AM' },
    { name: 'Ms. Priya Das', class: '11-A', status: 'Delayed', time: '09:00 AM' },
];

const AttendanceManagement = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'class-view', 'teacher-monitor', 'reports', 'alerts', 'settings'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    const [isOverrideModalOpen, setOverrideModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Filtered data for table
    const filteredStudents = useMemo(() => {
        return STUDENT_DATA.filter(s => 
            (selectedClass === 'All' || s.class === selectedClass) &&
            (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, selectedClass]);

    const stats = [
        { label: 'Present Today', val: '942', trend: '+2.1%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Absent Today', val: '45', trend: '-0.5%', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Avg Attendance', val: '92.4%', trend: '+1.2%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Critical Alerts', val: '12', trend: 'Watchlist', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === id 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'bg-card-base text-text-dim border border-border-base hover:bg-bg-base hover:text-text-main'
            }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    // --- SUB-COMPONENTS ---

    const DashboardView = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-indigo-500" /> Monthly Attendance Trend
                        </h4>
                        <div className="bg-bg-base/50 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-text-dim">Mar 2024</div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ATTENDANCE_TRENDS}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '20px', border: '1px solid var(--border-base)' }} />
                                <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPresent)" strokeLinecap="round" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-purple-500/5">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                            <Layers className="w-4 h-4 text-purple-500" /> Class-wise Performance
                        </h4>
                        <button className="text-[9px] font-black uppercase text-primary border-b border-primary/30">View All</button>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CLASS_PERFORMANCE}>
                                <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '20px', border: '1px solid var(--border-base)' }} />
                                <Bar dataKey="percentage" radius={[10, 10, 10, 10]} barSize={30}>
                                    {CLASS_PERFORMANCE.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Teacher Preview */}
            <div className="glass-card p-8 rounded-[3rem] border border-border-base">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                        <Clock className="w-4 h-4 text-emerald-500" /> Live Teacher Marking Status
                    </h4>
                    <span className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live Update
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-base">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Teacher Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Assigned Class</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Marking Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TEACHER_ACTIVITY.map((teacher, i) => (
                                <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5 text-sm font-bold text-text-main">{teacher.name}</td>
                                    <td className="px-6 py-5 text-xs font-black text-text-link uppercase">{teacher.class}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            teacher.status === 'Marked' ? 'bg-emerald-500/10 text-emerald-500' : 
                                            teacher.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                                        }`}>
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[10px] font-bold text-text-dim">{teacher.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ClassView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search student by name or roll..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-8 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" 
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative group min-w-[150px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
                        <select 
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full pl-10 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim appearance-none"
                        >
                            <option value="All">All Classes</option>
                            <option value="10-A">10-A</option>
                            <option value="10-B">10-B</option>
                            <option value="9-A">9-A</option>
                            <option value="9-B">9-B</option>
                        </select>
                    </div>
                    <div className="relative group">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input type="date" className="pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim focus:outline-none" />
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-[3rem] overflow-hidden border border-border-base">
                <table className="w-full text-left">
                    <thead className="bg-bg-base/50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Student Profile</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Roll No</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Class</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Override</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                            <tr key={s.id} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">{s.name[0]}</div>
                                        <span className="text-sm font-bold text-text-main">{s.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-xs font-black text-text-dim uppercase tracking-widest">{s.roll}</td>
                                <td className="px-8 py-5 text-xs font-black text-text-main uppercase">{s.class}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        s.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' : 
                                        s.status === 'Absent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <button 
                                        onClick={() => { setSelectedStudent(s); setOverrideModalOpen(true); }}
                                        className="p-2.5 bg-bg-base border border-border-base rounded-xl text-text-dim hover:text-primary hover:border-primary/50 transition-all group"
                                    >
                                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <Search className="w-12 h-12 text-text-dim/20 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-text-dim uppercase tracking-widest">No matching students found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Pagination Placeholder */}
                <div className="px-8 py-6 border-t border-border-base/50 flex items-center justify-between bg-bg-base/20">
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Showing {filteredStudents.length} Students</p>
                    <div className="flex gap-2">
                         <button className="p-2 border border-border-base rounded-lg text-text-dim hover:bg-bg-base cursor-not-allowed opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                         <button className="p-2 border border-border-base rounded-lg text-text-dim hover:bg-bg-base"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );

    const AlertsView = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] flex gap-6 items-start">
                <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                    <h4 className="text-lg font-black text-text-main tracking-tighter uppercase mb-1">Attendance Threshold Alert</h4>
                    <p className="text-xs font-bold text-text-dim uppercase tracking-wide opacity-80">The following students have fallen below the mandatory 75% attendance criteria. Critical intervention required.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STUDENT_DATA.filter(s => s.attendance < 75).map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-8 rounded-[2.5rem] border border-border-base group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-black text-sm">{s.attendance}%</div>
                            <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black tracking-widest uppercase rounded">Urgent</span>
                        </div>
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-1">{s.name}</h4>
                        <p className="text-[10px] font-bold text-text-dim uppercase mb-6 tracking-wide">Roll: {s.roll} • {s.class}</p>
                        <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden mb-8">
                            <div className="h-full bg-rose-500" style={{ width: `${s.attendance}%` }}></div>
                        </div>
                        <button className="w-full py-3 bg-card-base border border-border-base text-[10px] font-black uppercase text-text-dim rounded-xl hover:border-rose-500 hover:text-rose-500 transition-all">Send Parental Alert</button>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const ReportsView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="glass-card p-10 rounded-[3rem] border border-border-base text-center">
                <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
                <h4 className="text-xl font-black text-text-main uppercase tracking-tighter">Attendance Report Engine</h4>
                <p className="text-sm font-bold text-text-dim mt-2 tracking-widest opacity-60 max-w-lg mx-auto">Generate comprehensive attendance records with advanced class and date range filtering.</p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-12 bg-bg-base/30 p-8 rounded-[2rem] border border-border-base/50">
                    <select className="px-6 py-4 bg-card-base border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Select Class</option>
                        <option>Grade 10-A</option>
                        <option>Grade 9-B</option>
                    </select>
                    <div className="flex items-center gap-3">
                        <input type="date" className="px-6 py-4 bg-card-base border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim focus:outline-none" />
                        <span className="text-text-dim font-black text-xs uppercase">to</span>
                        <input type="date" className="px-6 py-4 bg-card-base border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim focus:outline-none" />
                    </div>
                    <button className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/30">Generate Full Report</button>
                </div>

                <div className="flex justify-center gap-6 mt-12">
                     <button className="flex items-center gap-2 px-8 py-4 bg-white/[0.05] border border-border-base text-text-main text-[11px] font-black uppercase rounded-2xl hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4 text-rose-500" /> Export PDF
                     </button>
                     <button className="flex items-center gap-2 px-8 py-4 bg-white/[0.05] border border-border-base text-text-main text-[11px] font-black uppercase rounded-2xl hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4 text-emerald-500" /> Export Excel
                     </button>
                </div>
            </div>
        </div>
    );

    const SettingsView = () => (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Min Attendance Threshold (%)</label>
                    <input type="number" defaultValue="75" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Morning Cut-off Time</label>
                    <input type="time" defaultValue="08:30" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                </div>
            </div>

            <div className="space-y-6">
                <h5 className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Working Days Configuration</h5>
                <div className="flex flex-wrap gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button key={day} className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${day === 'Sun' ? 'border border-border-base text-text-dim' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/10">
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[10px] font-black text-text-dim uppercase tracking-widest">Upcoming Holidays</h5>
                    <button className="text-xs font-black text-primary px-3 py-1 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Holiday</button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Easter Monday', date: 'April 01' },
                        { name: 'National Holiday', date: 'April 14' }
                    ].map((h, i) => (
                        <div key={i} className="px-6 py-4 bg-card-base border border-border-base rounded-2xl flex justify-between items-center text-xs font-bold text-text-main">
                             <span>{h.name}</span>
                             <span className="text-text-dim uppercase">{h.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30">Save Settings</button>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
                <div>
                     <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none flex items-center gap-4">
                         <Activity className="w-10 h-10 text-emerald-500" /> Attendance <span className="text-primary">Ledger</span>
                     </h2>
                     <p className="text-text-dim font-bold text-sm tracking-widest mt-2 uppercase opacity-60">System-wide Presence Monitoring & Analytics</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                        <Upload className="w-4 h-4" /> Bulk Upload
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="glass-card p-6 rounded-[2.5rem] border border-border-base border-b-4 relative group"
                        style={{ borderBottomColor: `var(--${s.color.split('-')[1] || 'primary'})` }}
                    >
                        <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-6 transition-transform group-hover:scale-110`}>
                             <s.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{s.label}</p>
                        <h4 className={`text-2xl font-black mt-2 ${s.color}`}>{s.val}</h4>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{s.trend} Increase</p>
                    </motion.div>
                ))}
            </div>

            {/* Sub Navigation */}
            <div className="flex flex-wrap gap-4 px-2 py-2 bg-bg-base/20 rounded-[2.5rem] border border-border-base/50 overflow-x-auto no-scrollbar">
                <TabButton id="dashboard" label="Trends & Insights" icon={Activity} />
                <TabButton id="class-view" label="Class Registry" icon={Layers} />
                <TabButton id="teacher-monitor" label="Faculty Check" icon={Clock} />
                <TabButton id="reports" label="Report Engine" icon={FileText} />
                <TabButton id="alerts" label="Watchlist" icon={AlertTriangle} />
                <TabButton id="settings" label="Config" icon={SettingsIcon} />
            </div>

            {/* Main Content Area */}
            <div className="px-2">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'class-view' && <ClassView />}
                {activeTab === 'teacher-monitor' && <div className="animate-in fade-in duration-500"><TeacherActivityTable /></div>}
                {activeTab === 'reports' && <ReportsView />}
                {activeTab === 'alerts' && <AlertsView />}
                {activeTab === 'settings' && <SettingsView />}
            </div>

            {/* Override Modal */}
            <AnimatePresence>
                {isOverrideModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
                         <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card-base w-full max-w-md rounded-[3rem] border border-border-base p-10 shadow-2xl"
                         >
                            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-2">Override Status</h3>
                            <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-8">Admin manual override control</p>
                            
                            <div className="p-6 bg-bg-base rounded-[2rem] border border-border-base mb-8">
                                <p className="text-[10px] font-black text-text-dim uppercase mb-3">Target Student</p>
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-black">{selectedStudent?.name[0]}</div>
                                     <div>
                                         <h4 className="text-sm font-black text-text-main">{selectedStudent?.name}</h4>
                                         <p className="text-[10px] font-bold text-text-dim">{selectedStudent?.roll} • {selectedStudent?.class}</p>
                                     </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <button className="px-6 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Present</button>
                                <button className="px-6 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20">Absent</button>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setOverrideModalOpen(false)} className="flex-1 py-4 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-2xl">Discard</button>
                                <button onClick={() => setOverrideModalOpen(false)} className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30">Confirm Save</button>
                            </div>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Extracted Teacher Activity Table for cleaner main component
const TeacherActivityTable = () => (
    <div className="glass-card rounded-[3rem] overflow-hidden border border-border-base">
        <table className="w-full text-left">
            <thead className="bg-bg-base/50">
                <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Faculty Member</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Assigned Class</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Marking Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Registry Time</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Compliance</th>
                </tr>
            </thead>
            <tbody>
                {TEACHER_ACTIVITY.map((teacher, i) => (
                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-black uppercase text-xs">{teacher.name[0]}</div>
                            <span className="text-sm font-bold text-text-main">{teacher.name}</span>
                        </td>
                        <td className="px-8 py-5 text-xs font-black text-text-link uppercase">{teacher.class}</td>
                        <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                teacher.status === 'Marked' ? 'bg-emerald-500/10 text-emerald-500' : 
                                teacher.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                                {teacher.status}
                            </span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-text-dim">{teacher.time}</td>
                        <td className="px-8 py-5">
                             <div className={`w-3 h-3 rounded-full ${teacher.status === 'Marked' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AttendanceManagement;
