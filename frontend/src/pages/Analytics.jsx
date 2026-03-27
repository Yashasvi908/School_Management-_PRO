import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Activity,
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    Calendar,
    School,
    BookOpen
} from 'lucide-react';
import io from 'socket.io-client';

// Socket connection (will connect to backend when ready)
// const socket = io('http://localhost:8000');

const Analytics = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [studentGrowth, setStudentGrowth] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [teacherWorkload, setTeacherWorkload] = useState([]);
    const [departmentPerformance, setDepartmentPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Data Generators for Visualization
    useEffect(() => {
        // Simulate API Fetching with timeouts to look real
        setTimeout(() => {
            // 1. Live Revenue Graph Data (Last 12 Months)
            const revenue = [
                { name: 'Apr', fees: 45000, expenses: 32000 },
                { name: 'May', fees: 52000, expenses: 28000 },
                { name: 'Jun', fees: 48000, expenses: 35000 },
                { name: 'Jul', fees: 61000, expenses: 30000 },
                { name: 'Aug', fees: 55000, expenses: 34000 },
                { name: 'Sep', fees: 67000, expenses: 31000 },
                { name: 'Oct', fees: 72000, expenses: 38000 },
                { name: 'Nov', fees: 65000, expenses: 32000 },
                { name: 'Dec', fees: 85000, expenses: 45000 },
                { name: 'Jan', fees: 78000, expenses: 36000 },
                { name: 'Feb', fees: 82000, expenses: 34000 },
                { name: 'Mar', fees: 95000, expenses: 40000 },
            ];
            setRevenueData(revenue);

            // 2. Student Growth Trend (Last 5 Years)
            const growth = [
                { year: '2022', students: 850 },
                { year: '2023', students: 920 },
                { year: '2024', students: 1050 },
                { year: '2025', students: 1200 },
                { year: '2026', students: 1350 },
            ];
            setStudentGrowth(growth);

            // 3. Attendance Comparison (This Week)
            const attendance = [
                { day: 'Mon', students: 92, teachers: 98 },
                { day: 'Tue', students: 94, teachers: 96 },
                { day: 'Wed', students: 91, teachers: 97 },
                { day: 'Thu', students: 95, teachers: 100 },
                { day: 'Fri', students: 88, teachers: 95 },
                { day: 'Sat', students: 85, teachers: 90 },
            ];
            setAttendanceData(attendance);

            // 4. Teacher Workload (Classes per Week)
            const workload = [
                { name: 'Math Dept', classes: 42, color: '#6366f1' },
                { name: 'Science Dept', classes: 38, color: '#8b5cf6' },
                { name: 'English Dept', classes: 30, color: '#ec4899' },
                { name: 'History Dept', classes: 25, color: '#14b8a6' },
                { name: 'Sports', classes: 15, color: '#f59e0b' },
            ];
            setTeacherWorkload(workload);

            // 5. Department Performance (Avg Grade)
            const deptPerf = [
                { subject: 'Math', score: 85, fullMark: 100 },
                { subject: 'Physics', score: 78, fullMark: 100 },
                { subject: 'Chemistry', score: 82, fullMark: 100 },
                { subject: 'English', score: 90, fullMark: 100 },
                { subject: 'History', score: 88, fullMark: 100 },
                { subject: 'Biology', score: 84, fullMark: 100 },
            ];
            setDepartmentPerformance(deptPerf);

            setLoading(false);
        }, 1500);

        // Socket listener example (commented out until backend is ready)
        // socket.on('update-analytics', (newData) => {
        //     setRevenueData(prev => [...prev.slice(1), newData]);
        // });

        // return () => socket.disconnect();
    }, []);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-indigo-600" />
                        School Analytics
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Real-time Insights & Performance Metrics</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Live Data
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Revenue', value: '$1.2M', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: 'Student Growth', value: '+15%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { title: 'Avg Attendance', value: '94.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Class Performance', value: 'A-', icon: School, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Live Revenue Graph */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-500" /> Revenue vs Expenses
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="fees" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFees)" name="Income" />
                                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Attendance Comparison */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Attendance Trends (This Week)
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Student %" barSize={20} />
                                <Bar dataKey="teachers" fill="#6366f1" radius={[4, 4, 0, 0]} name="Teacher %" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Student Growth Trend */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Annual Student Growth
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={studentGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} padding={{ left: 30, right: 30 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Teacher Workload (Pie Chart) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-500" /> Teacher Workload Distribution
                    </h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={teacherWorkload}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="classes"
                                >
                                    {teacherWorkload.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Department Performance (Radar/Bar Chart Hybrid) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-pink-500" /> Department Performance Ranking
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={30}>
                                    {departmentPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default Analytics;
