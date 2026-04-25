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

import api from '../../../api/axios';
import { useSelector } from 'react-redux';

const AttendanceManagement = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceType, setAttendanceType] = useState('student'); 
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [classList, setClassList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { token } = useSelector(state => state.auth);

    React.useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [statsRes, classRes, subjectRes] = await Promise.all([
                    api.get('/attendance/stats'),
                    api.get('/admin/academic/classes'),
                    api.get('/admin/academic/subjects')
                ]);
                if (statsRes.data.success) setStatsData(statsRes.data.data);
                if (classRes.data.success) setClassList(classRes.data.data);
                if (subjectRes.data.success) setSubjectList(subjectRes.data.data);
            } catch (err) { console.error(err); }
        };
        if (token) fetchMetadata();
    }, [token]);

    const fetchDaily = async () => {
        if (attendanceType === 'student' && (!selectedClass || selectedClass === 'All')) return;
        setLoading(true);
        try {
            let url = '/attendance/daily';
            let params = { date: selectedDate };

            if (attendanceType === 'student') {
                params.class = selectedClass;
                if (selectedSection) params.section = selectedSection;
                if (selectedSubject) params.subjectId = selectedSubject;
            } else if (attendanceType === 'teacher') {
                url = '/attendance/teachers/load';
            } else {
                params.type = 'staff';
            }

            const res = await api.get(url, { params });
            if (res.data.success) {
                const rawData = attendanceType === 'teacher' ? res.data.data.teachers : res.data.data;
                const initialized = (rawData || []).map(item => ({
                    ...item,
                    _id: item._id || item.teacherId || item.staffId,
                    status: item.status || 'Present'
                }));
                setAttendanceData(initialized);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    React.useEffect(() => {
        if (attendanceType === 'teacher' || attendanceType === 'staff') {
            fetchDaily();
        } else if (attendanceType === 'student' && selectedClass) {
            fetchDaily();
        }
    }, [attendanceType, selectedClass, selectedSection, selectedSubject, selectedDate]);

    const handleMarkLocalStatus = (id, status) => {
        setAttendanceData(prev => prev.map(item => 
            item._id === id ? { ...item, status: status } : item
        ));
    };

    const handleShiftChange = (id, shift) => {
        setAttendanceData(prev => prev.map(item => 
            item._id === id ? { ...item, shift: shift } : item
        ));
    };

    const calculateOvertime = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const [h1, m1] = checkIn.split(':').map(Number);
        const [h2, m2] = checkOut.split(':').map(Number);
        const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
        const standardMinutes = 8 * 60;
        return totalMinutes > standardMinutes ? ((totalMinutes - standardMinutes) / 60).toFixed(1) : 0;
    };

    const handleTimeChange = (id, field, value) => {
        setAttendanceData(prev => prev.map(item => {
            if (item._id === id) {
                const updated = { ...item, [field]: value };
                if (attendanceType === 'staff') {
                   updated.overtime = calculateOvertime(updated.checkIn, updated.checkOut);
                }
                return updated;
            }
            return item;
        }));
    };

    const handleRemarkChange = (id, text) => {
        setAttendanceData(prev => prev.map(item => 
            item._id === id ? { ...item, remark: text } : item
        ));
    };

    const markAllPresent = () => {
        setAttendanceData(prev => prev.map(item => ({ ...item, status: 'Present' })));
    };

    const submitAttendance = async () => {
        setSubmitLoading(true);
        try {
            const endpoint = attendanceType === 'teacher' ? '/attendance/teachers/mark' : '/attendance/mark';
            const res = await api.post(endpoint, {
                date: selectedDate,
                type: attendanceType,
                records: attendanceData.map(item => ({
                    studentId: item._id,
                    teacherId: item._id, // Backwards compat for dedicated teacher model
                    status: item.status === 'Present' ? 'P' : item.status === 'Absent' ? 'A' : (item.status === 'Late' ? 'L' : (item.status === 'Half-Day' ? 'HD' : 'WFH')),
                    remark: item.remark,
                    checkIn: item.checkIn,
                    checkOut: item.checkOut,
                    shift: item.shift,
                    overtime: item.overtime,
                    subjectId: selectedSubject
                })),
                classId: selectedClass !== 'All' ? selectedClass : undefined
            });
            if (res.data.success) {
                alert(res.data.message || 'Attendance Submitted Successfully!');
                if (res.data.data?.substituteAlerts > 0) {
                    alert(`Alert: ${res.data.data.substituteAlerts} periods need substitutes!`);
                }
                fetchDaily();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit attendance');
        }
        setSubmitLoading(false);
    };

    React.useEffect(() => {
        if (token && activeTab === 'class-view') fetchDaily();
    }, [token, activeTab, selectedClass, selectedDate, attendanceType]);

    const stats = [
        { label: 'Present Today', val: statsData?.stats?.find(s => s._id === 'Present')?.count || 0, trend: '+2.1%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Absent Today', val: statsData?.stats?.find(s => s._id === 'Absent')?.count || 0, trend: '-0.5%', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Students', val: statsData?.totalStudents || 0, trend: '+1.2%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Critical Alerts', val: '0', trend: 'Watchlist', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const filteredStudents = useMemo(() => {
        return attendanceData.filter(s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [attendanceData, searchQuery]);

    const attendanceSummary = useMemo(() => {
        const counts = { P: 0, A: 0, L: 0, LE: 0, total: 0 };
        attendanceData.forEach(item => {
            const status = item.status?.toString().toLowerCase();
            if (status === 'present' || status === 'p') counts.P++;
            else if (status === 'absent' || status === 'a') counts.A++;
            else if (status === 'late' || status === 'l') counts.L++;
            else if (status === 'leave' || status === 'le') counts.LE++;
            counts.total++;
        });
        return counts;
    }, [attendanceData]);

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
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Student Attendance', val: '92%', count: '460/500', color: 'from-blue-500 to-indigo-600', icon: Users },
                    { label: 'Teacher Presence', val: '96%', count: '24/25', color: 'from-emerald-500 to-teal-600', icon: Activity },
                    { label: 'Staff Attendance', val: '88%', count: '14/16', color: 'from-amber-500 to-orange-600', icon: Clock }
                ].map((s, i) => (
                    <div key={i} className={`p-8 rounded-[3rem] bg-gradient-to-br ${s.color} text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all`}>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">{s.label}</p>
                            <h3 className="text-4xl font-black mb-1">{s.val}</h3>
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{s.count} On Campus</p>
                        </div>
                        <s.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Visual Analytics */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-white/5 shadow-xl">
                        <div className="flex justify-between items-center mb-10">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-indigo-500" /> Attendance Precision Stream
                            </h4>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[8px] font-black rounded-lg uppercase">Daily Trend</span>
                            </div>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ATTENDANCE_TRENDS}>
                                    <defs>
                                        <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(15,15,20,0.9)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorWave)" strokeLinecap="round" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                                <Layers className="w-5 h-5 text-purple-500" /> Academic Registry Pulse
                            </h4>
                        </div>
                        <div className="space-y-6">
                            {CLASS_PERFORMANCE.map((c, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-text-main">Grade {c.class}</span>
                                        <span className={c.percentage < 80 ? 'text-rose-500' : 'text-text-dim'}>{c.percentage}% {c.percentage < 80 && '⚠️'}</span>
                                    </div>
                                    <div className="h-3 bg-bg-base rounded-full overflow-hidden border border-border-base/50">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${c.percentage}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className={`h-full rounded-full ${c.percentage < 80 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-rose-500/5">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4" /> Critical Watchlist
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Students below 75%', count: 12, color: 'rose' },
                                { label: 'Teachers absent today', count: 1, color: 'amber' },
                                { label: '3+ Consecutive Absents', count: 5, color: 'rose' },
                            ].map((alert, i) => (
                                <div key={i} className={`p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer`}>
                                    <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{alert.label}</span>
                                    <span className={`px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg shadow-lg shadow-rose-500/30`}>{alert.count}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 bg-white/5 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim hover:bg-white/10 transition-all">View All Alerts</button>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] border border-border-base">
                        <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-8">Recent Activity</h4>
                        <div className="space-y-6">
                            {TEACHER_ACTIVITY.slice(0, 3).map((act, i) => (
                                <div key={i} className="flex items-center gap-4 relative">
                                    <div className="w-10 h-10 rounded-xl bg-bg-base border border-border-base flex items-center justify-center text-xs font-black">{act.name[0]}</div>
                                    <div className="flex-1">
                                        <h5 className="text-[11px] font-bold text-text-main">{act.name}</h5>
                                        <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">{act.status} • {act.class}</p>
                                    </div>
                                    <span className="text-[8px] font-black text-text-dim uppercase">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const LeaveManagementView = () => {
        const [leaveRequests, setLeaveRequests] = useState([]);
        const [showApplyModal, setShowApplyModal] = useState(false);

        const fetchLeaves = async () => {
            try {
                const res = await api.get('/leave/requests');
                if (res.data.success) setLeaveRequests(res.data.data);
            } catch (err) { console.error(err); }
        };

        React.useEffect(() => { fetchLeaves(); }, []);

        const handleStatusUpdate = async (id, status) => {
            try {
                const res = await api.put(`/leave/status/${id}`, { status, adminRemark: 'Processed by Admin' });
                if (res.data.success) fetchLeaves();
            } catch (err) { alert('Action Failed'); }
        };

        return (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">Leave Registry</h3>
                        <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-1 opacity-60">Staff & Faculty Absence Management</p>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                        <Plus className="w-4 h-4" /> Apply For Leave
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Casual Leave (CL)', val: '8/12', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                        { label: 'Sick Leave (SL)', val: '6/10', color: 'text-rose-500', bg: 'bg-rose-500/10' },
                        { label: 'Earned Leave (EL)', val: '15/20', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                    ].map((l, i) => (
                        <div key={i} className={`p-8 rounded-[2.5rem] border border-border-base ${l.bg} flex flex-col items-center text-center`}>
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-4">{l.label}</span>
                            <span className={`text-4xl font-black ${l.color}`}>{l.val}</span>
                            <span className="text-[8px] font-bold text-text-dim uppercase mt-2">Remaining Balance</span>
                        </div>
                    ))}
                </div>

                <div className="glass-card rounded-[3.5rem] overflow-hidden border border-border-base">
                    <table className="w-full text-left">
                        <thead className="bg-bg-base/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Applicant</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Leave Type</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Duration</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.length > 0 ? leaveRequests.map((req, i) => (
                                <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6 font-bold text-text-main text-sm">{req.applicant?.name}</td>
                                    <td className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-widest">{req.leaveType}</td>
                                    <td className="px-8 py-6 text-xs text-text-dim">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-text-main">{req.totalDays} Days</span>
                                            <span className="text-[9px] uppercase tracking-tighter opacity-60">
                                                {new Date(req.fromDate).toLocaleDateString()} - {new Date(req.toDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                                            req.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {req.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle size={14}/></button>
                                                    <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><XCircle size={14}/></button>
                                                </>
                                            )}
                                            <button className="p-2 bg-white/5 border border-border-base rounded-lg text-text-dim"><MoreVertical size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-text-dim text-xs font-bold uppercase tracking-widest italic opacity-40">No leave requests found in registry</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const ClassView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            {/* Type Selector */}
            <div className="flex gap-4 p-2 bg-white/5 rounded-[2rem] border border-white/10 max-w-2xl">
                {[
                    { id: 'student', label: 'Students', icon: Users },
                    { id: 'teacher', label: 'Teachers', icon: Users },
                    { id: 'staff', label: 'Staff', icon: Activity }
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => { setAttendanceType(type.id); setAttendanceData([]); }}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            attendanceType === type.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-dim hover:bg-white/5'
                        }`}
                    >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                    <div className="bg-bg-base/30 border border-border-base px-6 py-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Academic Year</span>
                        <span className="text-xs font-black text-primary uppercase">2024-25</span>
                    </div>

                    {attendanceType === 'student' && (
                        <>
                            <div className="relative group min-w-[160px]">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                                <select 
                                    value={selectedClass}
                                    onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); }}
                                    className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim appearance-none focus:border-primary/50 transition-all cursor-pointer"
                                >
                                    <option value="">Select Class</option>
                                    {classList.map(cls => (
                                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative group min-w-[150px]">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
                                <select 
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    className="w-full pl-10 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim appearance-none focus:border-primary/50 transition-all cursor-pointer"
                                    disabled={!selectedClass}
                                >
                                    <option value="">Select Section</option>
                                    {classList.find(c => c._id === selectedClass)?.sections?.map((sec, i) => (
                                        <option key={i} value={sec.name}>{sec.name}</option>
                                    )) || (selectedClass && <option value="A">Section A</option>)}
                                </select>
                            </div>

                            <div className="relative group min-w-[160px]">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                                <select 
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim appearance-none focus:border-primary/50 transition-all cursor-pointer"
                                >
                                    <option value="">Full Day (All Subjects)</option>
                                    {subjectList.map(sub => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="relative group">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim focus:outline-none focus:border-primary/50" 
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {attendanceType !== 'student' && (
                        <>
                            <button 
                                onClick={markAllPresent}
                                className="flex items-center gap-3 px-8 py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Mark All Present
                            </button>
                            <button 
                                onClick={submitAttendance}
                                disabled={submitLoading || attendanceData.length === 0}
                                className={`flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-95 transition-all ${submitLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                            >
                                {submitLoading ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Attendance Summary Dashboard for Selected Filters */}
            {attendanceData.length > 0 && attendanceType === 'student' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[
                        { label: 'Total Strength', val: attendanceSummary.total, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
                        { label: 'Present', val: attendanceSummary.P, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                        { label: 'Absent', val: attendanceSummary.A, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                        { label: 'Late Arrival', val: attendanceSummary.L, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                        { label: 'On Leave', val: attendanceSummary.LE, icon: FileText, color: 'text-secondary', bg: 'bg-secondary/5' },
                    ].map((card, i) => (
                        <div key={i} className={`p-6 rounded-[2rem] border border-border-base ${card.bg} flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 delay-100`}>
                            <card.icon className={`w-6 h-6 ${card.color} mb-2`} />
                            <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">{card.label}</p>
                            <p className="text-2xl font-black text-text-main">{card.val}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="glass-card rounded-[3rem] overflow-hidden border border-border-base">
                <table className="w-full text-left">
                    <thead className="bg-bg-base/50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">#</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Photo</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Name</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">{attendanceType === 'student' ? 'Roll No' : 'Emp ID'}</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim text-center">P</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim text-center">A</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim text-center">L</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim text-center">{attendanceType === 'student' ? 'LE' : 'HD'}</th>
                            {attendanceType !== 'student' && (
                                <>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Shift</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Check-In</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Check-Out</th>
                                    {attendanceType === 'staff' && (
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Overtime</th>
                                    )}
                                </>
                            )}
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? filteredStudents.map((s, index) => (
                            <tr key={s._id} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5 text-xs font-black text-text-dim">{index + 1}</td>
                                <td className="px-8 py-5">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                        <Users className="w-5 h-5 text-primary/40" />
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-text-main">{s.name}</td>
                                <td className="px-8 py-5 text-xs font-black text-text-dim uppercase tracking-widest">{s.studentId}</td>
                                
                                {['Present', 'Absent', 'Late', attendanceType === 'student' ? 'Leave' : 'Half-Day'].map(st => (
                                    <td key={st} className="px-4 py-5 text-center">
                                        <button 
                                            onClick={() => attendanceType !== 'student' && handleMarkLocalStatus(s._id, st)}
                                            className={`w-6 h-6 rounded-full border-2 transition-all mx-auto flex items-center justify-center ${
                                                s.status === st || (st === 'Half-Day' && s.status === 'half-day')
                                                ? (st === 'Present' ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30' : 
                                                   st === 'Absent' ? 'bg-rose-500 border-rose-500 shadow-lg shadow-rose-500/30' :
                                                   st === 'Late' ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/30' :
                                                   st === 'Leave' ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/30' :
                                                   'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30')
                                                : 'border-border-base hover:border-text-dim'
                                            } ${attendanceType === 'student' ? 'cursor-default' : 'cursor-pointer'}`}
                                        >
                                            {(s.status === st || (st === 'Half-Day' && s.status === 'half-day')) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </button>
                                    </td>
                                ))}

                                {attendanceType !== 'student' && (
                                    <>
                                        <td className="px-8 py-5">
                                            <select 
                                                value={s.shift || 'Morning'}
                                                onChange={(e) => handleShiftChange(s._id, e.target.value)}
                                                className="bg-bg-base/50 border border-border-base px-3 py-2 rounded-xl text-[10px] font-bold text-text-main focus:outline-none"
                                            >
                                                <option value="Morning">Morning</option>
                                                <option value="Evening">Evening</option>
                                                <option value="Night">Night</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-5">
                                            <input 
                                                type="time" 
                                                value={s.checkIn || ''}
                                                onChange={(e) => handleTimeChange(s._id, 'checkIn', e.target.value)}
                                                className="bg-bg-base/50 border border-border-base px-3 py-2 rounded-xl text-[10px] font-bold text-text-main focus:outline-none focus:border-primary/50"
                                            />
                                        </td>
                                        <td className="px-8 py-5">
                                            <input 
                                                type="time" 
                                                value={s.checkOut || ''}
                                                onChange={(e) => handleTimeChange(s._id, 'checkOut', e.target.value)}
                                                className="bg-bg-base/50 border border-border-base px-3 py-2 rounded-xl text-[10px] font-bold text-text-main focus:outline-none focus:border-primary/50"
                                            />
                                        </td>
                                        {attendanceType === 'staff' && (
                                            <td className="px-8 py-5">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${s.overtime > 0 ? 'bg-amber-500/10 text-amber-500' : 'text-text-dim'}`}>
                                                    {s.overtime > 0 ? `+${s.overtime} hrs` : '-'}
                                                </span>
                                            </td>
                                        )}
                                    </>
                                )}

                                <td className="px-8 py-5">
                                    <input 
                                        type="text" 
                                        value={s.remark || ''}
                                        placeholder="Add remark..."
                                        onChange={(e) => handleRemarkChange(s._id, e.target.value)}
                                        className="bg-transparent border-b border-border-base py-1 text-xs text-text-main focus:outline-none focus:border-primary transition-all w-full max-w-[150px]"
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={attendanceType === 'student' ? 9 : 13} className="px-8 py-20 text-center">
                                    {loading ? (
                                        <Activity className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                                    ) : (
                                        <Search className="w-12 h-12 text-text-dim/20 mx-auto mb-4" />
                                    )}
                                    <p className="text-sm font-bold text-text-dim uppercase tracking-widest">
                                        {loading ? 'Fetching Records...' : 'Select filters to view registry'}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

    const ReportsView = () => {
        const [reportFilters, setReportFilters] = useState({
            studentId: '',
            classId: '',
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
        });
        const [reportData, setReportData] = useState(null);
        const [reportLoading, setReportLoading] = useState(false);

        const fetchReport = async () => {
            setReportLoading(true);
            try {
                const endpoint = attendanceType === 'student' ? '/attendance/students/report' : '/attendance/teachers/report';
                const params = {
                    [attendanceType === 'student' ? 'studentId' : 'teacherId']: reportFilters.studentId,
                    classId: reportFilters.classId,
                    month: new Date(reportFilters.startDate).getMonth() + 1,
                    year: new Date(reportFilters.startDate).getFullYear(),
                    type: attendanceType === 'student' ? 'student' : undefined,
                    fromDate: reportFilters.startDate,
                    toDate: reportFilters.endDate
                };
                const res = await api.get(endpoint, { params });
                if (res.data.success) setReportData(res.data.data);
            } catch (err) { console.error(err); }
            setReportLoading(false);
        };

        const handleExport = (format) => {
            const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/attendance/students/export?format=${format}&classId=${selectedClass}&month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`;
            window.open(url, '_blank');
        };

        return (
            <div className="space-y-10 animate-in fade-in duration-500">
                <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Student ID / Name</label>
                            <input 
                                type="text" placeholder="Search..."
                                value={reportFilters.studentId}
                                onChange={(e) => setReportFilters({...reportFilters, studentId: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-xs font-bold text-text-main focus:outline-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Class</label>
                            <select 
                                value={reportFilters.classId}
                                onChange={(e) => setReportFilters({...reportFilters, classId: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-[10px] font-black uppercase text-text-dim"
                            >
                                <option value="">Select Class</option>
                                {classList.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Date Range</label>
                            <div className="flex items-center gap-2">
                                <input type="date" value={reportFilters.startDate} onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})} className="flex-1 px-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-[9px] font-black uppercase text-text-dim" />
                                <span className="text-text-dim font-black">-</span>
                                <input type="date" value={reportFilters.endDate} onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})} className="flex-1 px-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-[9px] font-black uppercase text-text-dim" />
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                            <button onClick={fetchReport} className="flex-1 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all">
                                {reportLoading ? 'Generating...' : 'Generate Report'}
                            </button>
                            {attendanceType === 'student' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleExport('excel')} className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"><FileText size={18}/></button>
                                    <button onClick={() => handleExport('pdf')} className="p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><FileText size={18}/></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {reportData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                            {[
                                { label: 'Total Days', val: reportData.summary?.total || reportData.total || 0, color: 'text-text-main', bg: 'bg-bg-base' },
                                { label: 'Present', val: reportData.summary?.present || reportData.present || 0, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                { label: 'Absent', val: reportData.summary?.absent || reportData.absent || 0, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                                { label: 'Late', val: reportData.summary?.late || reportData.late || 0, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                { label: 'Leave/HD', val: reportData.summary?.leave || reportData.summary?.halfDay || 0, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                { label: 'Ratio %', val: (reportData.summary?.percentage || reportData.percentage || 0) + '%', color: 'text-primary', bg: 'bg-primary/10' },
                            ].map((s, i) => (
                                <div key={i} className={`p-6 rounded-[2rem] border border-border-base ${s.bg} flex flex-col items-center justify-center text-center`}>
                                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-2">{s.label}</span>
                                    <span className={`text-xl font-black ${s.color}`}>{s.val}</span>
                                </div>
                            ))}
                        </div>

                        {reportData.salaryImpact && (
                            <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-emerald-500/5 grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest">Deduction Days</h4>
                                    <p className="text-2xl font-black text-rose-500">{reportData.salaryImpact.deductDays} Days</p>
                                </div>
                                <div className="space-y-2 border-l border-border-base pl-10">
                                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest">Total Deduction</h4>
                                    <p className="text-2xl font-black text-rose-500">₹{reportData.salaryImpact.totalDeduction}</p>
                                </div>
                                <div className="space-y-2 border-l border-border-base pl-10">
                                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest">Net Salary</h4>
                                    <p className="text-2xl font-black text-emerald-500">₹{reportData.salaryImpact.netSalary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const SettingsView = () => (
        <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl">
            <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">System Intelligence Config</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-white/5 space-y-8">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Threshold & Rules</h4>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Mandatory Attendance (%)</label>
                            <input type="number" defaultValue="75" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Morning Cut-off Time</label>
                            <input type="time" defaultValue="08:30" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-white/5 space-y-8">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Auto-Notification Triggers</h4>
                    <div className="space-y-4">
                        {[
                            { label: 'SMS on 1st Day Absence', key: 'sms1' },
                            { label: '3-Day Consecutive Email', key: 'email3' },
                            { label: 'Auto-Warning Letter (<75%)', key: 'letter' },
                            { label: 'Admin Critical Alert (<65%)', key: 'admin' },
                        ].map(rule => (
                            <div key={rule.key} className="flex items-center justify-between p-4 bg-bg-base/30 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{rule.label}</span>
                                <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-border-base">
                <div className="flex justify-between items-center mb-10">
                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Academic Calendar Holidays</h4>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all"><Plus size={14}/> Add Holiday</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'Easter Monday', date: 'April 01', type: 'Seasonal' },
                        { name: 'Ramadan End', date: 'April 10', type: 'Restricted' },
                        { name: 'National Day', date: 'April 14', type: 'National' }
                    ].map((h, i) => (
                        <div key={i} className="p-6 bg-white/[0.02] border border-border-base rounded-[2rem] group hover:border-primary/50 transition-all">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-black text-text-main">{h.name}</span>
                                <span className="text-[8px] font-black uppercase bg-bg-base px-2 py-1 rounded text-text-dim">{h.type}</span>
                             </div>
                             <div className="flex items-center gap-2 text-primary">
                                <Calendar size={12}/>
                                <span className="text-[10px] font-black uppercase tracking-widest">{h.date}</span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 lg:p-12 min-h-screen bg-bg-base">
            <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: Activity },
                    { id: 'class-view', label: 'Class Registry', icon: Layers },
                    { id: 'leave-mgmt', label: 'Leave Management', icon: FileText },
                    { id: 'reports', label: 'Reports', icon: TrendingUp },
                    { id: 'alerts', label: 'Watchlist', icon: AlertTriangle },
                    { id: 'settings', label: 'Settings', icon: SettingsIcon }
                ].map(tab => (
                    <TabButton key={tab.id} {...tab} />
                ))}
            </div>

            <div className="px-2">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'class-view' && <ClassView />}
                {activeTab === 'leave-mgmt' && <LeaveManagementView />}
                {activeTab === 'reports' && <ReportsView />}
                {activeTab === 'alerts' && <AlertsView />}
                {activeTab === 'settings' && <SettingsView />}
            </div>
        </div>
    );
};

export default AttendanceManagement;
