import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    BookOpen,
    CheckSquare,
    Plus,
    Clock,
    Search,
    Filter,
    MoreVertical,
    Upload,
    FileText,
    X,
    Video,
    LayoutDashboard,
    User,
    ClipboardList,
    MessageCircle,
    Settings,
    TrendingUp,
    Download,
    GraduationCap,
    Home,
    UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const TeacherPanel = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth || {});
    const [activeTab, setActiveTab] = useState('overview');
    const [activeClass, setActiveClass] = useState('10-A');

    const teacherStats = [
        { title: 'My Students', value: '124', icon: Users, color: 'bg-indigo-500' },
        { title: 'Pending Marks', value: '12', icon: FileText, color: 'bg-rose-500' },
        { title: "Today's Classes", value: '4', icon: Clock, color: 'bg-amber-500' },
        { title: 'Attendance', value: '98%', icon: TrendingUp, color: 'bg-emerald-500' },
    ];

    const DashboardOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teacherStats.map((stat, index) => (
                    <div key={index} className="glass-card p-6 rounded-[2.5rem] border border-border-base relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
                            <h3 className="text-3xl font-black text-text-main mt-2 tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700`}>
                            <stat.icon className={`w-16 h-16 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-border-base lg:col-span-2">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-emerald-500" /> Performance Analytics
                    </h3>
                    <div className="h-[300px] w-full bg-bg-base/30 rounded-3xl border border-border-base flex items-end justify-between px-8 py-6 gap-2">
                        {[45, 60, 85, 40, 95, 70, 55, 90, 65, 80].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="w-full bg-primary/20 rounded-t-xl relative group-hover:bg-primary/40 transition-all duration-500" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}%</div>
                                </div>
                                <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">T{i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-border-base">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary" /> Today's Schedule
                    </h3>
                    <div className="space-y-4">
                        {[
                            { time: '09:00 AM', subject: 'Mathematics', class: '10-A', room: 'B-201' },
                            { time: '11:30 AM', subject: 'Physics', class: '9-B', room: 'Lab-1' },
                            { time: '02:00 PM', subject: 'Calculus', class: '11-C', room: 'A-104' },
                        ].map((cls, i) => (
                            <div key={i} className="p-4 md:p-5 rounded-2xl bg-bg-base/50 border border-border-base flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-primary/30 transition-colors text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="px-4 py-2 bg-primary/10 rounded-xl text-primary text-xs font-black min-w-[100px]">{cls.time}</div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-text-main truncate">{cls.subject}</h4>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{cls.class} • {cls.room}</p>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">Enter</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-border-base">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-secondary" /> Recent Notices
                    </h3>
                    <div className="space-y-4">
                        {[
                            { title: 'Mid-term results meeting', date: 'Just now', priority: 'High' },
                            { title: 'New curriculum update', date: '2 hours ago', priority: 'Normal' },
                            { title: 'Sports meet rescheduled', date: 'Yesterday', priority: 'Low' },
                        ].map((notice, i) => (
                            <div key={i} className="p-4 md:p-5 rounded-2xl bg-card-base border border-border-base flex items-center justify-between group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notice.priority === 'High' ? 'bg-rose-500' : notice.priority === 'Normal' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-text-main truncate">{notice.title}</h4>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{notice.date}</p>
                                    </div>
                                </div>
                                <MoreVertical className="w-4 h-4 text-text-dim cursor-pointer flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const [students, setStudents] = useState([
        { id: '01', name: 'Rohan Kumar', gender: 'M', attendance: '92%', lastLogin: '2026-03-14', status: 'present' },
        { id: '02', name: 'Priya Sharma', gender: 'F', attendance: '95%', lastLogin: '2026-03-14', status: 'absent' },
        { id: '03', name: 'Arjun Singh', gender: 'M', attendance: '88%', lastLogin: '2026-03-14', status: 'present' },
    ]);

    const StudentRosterView = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" /> Class Roster: {activeClass}
                </h3>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input type="text" placeholder="Search by name/roll..." className="w-full pl-11 pr-4 py-3 bg-card-base border border-border-base rounded-2xl text-sm focus:outline-none focus:border-primary/50" />
                    </div>
                    <button className="p-3 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-border-base overflow-hidden">
                <div className="overflow-x-auto thin-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-base/50 border-b border-border-base">
                                <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Roll No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Student Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Gender</th>
                                <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Attendance %</th>
                                <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Last Login</th>
                                <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base/50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-primary">#{student.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{student.name[0]}</div>
                                            <span className="font-bold text-text-main text-sm">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-text-dim">{student.gender}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-bg-base rounded-full h-1.5 w-16 overflow-hidden">
                                                <div className="bg-primary h-full" style={{ width: student.attendance }}></div>
                                            </div>
                                            <span className="text-xs font-black text-text-main">{student.attendance}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-text-dim">{student.lastLogin}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <button className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><User className="w-4 h-4" /></button>
                                            <button className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"><CheckSquare className="w-4 h-4" /></button>
                                            <button className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all"><Upload className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const AttendanceWorkflowView = () => (
        <div className="space-y-6 animate-in zoom-in-95 duration-700">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4">
                        <CheckSquare className="w-8 h-8 text-emerald-500" /> Daily Attendance Marking
                    </h3>
                    <p className="text-text-dim font-bold text-xs uppercase tracking-widest mt-1">Class {activeClass} • Today, {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">Save Attendance</button>
                    <button className="p-3 bg-card-base border border-border-base rounded-xl text-text-dim hover:text-primary transition-all"><Search className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-border-base overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-bg-base/50 border-b border-border-base">
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Student Name</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-center">Present</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-center">Absent</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-center">Late</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-center">Excused</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base/50">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-white/[0.01]">
                                <td className="px-8 py-6">
                                    <span className="font-bold text-text-main">{student.name}</span>
                                </td>
                                {['present', 'absent', 'late', 'excused'].map((status) => (
                                    <td key={status} className="px-8 py-6 text-center">
                                        <button 
                                            onClick={() => {
                                                const updated = students.map(s => s.id === student.id ? {...s, status} : s);
                                                setStudents(updated);
                                            }}
                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all ${
                                                student.status === status
                                                ? status === 'present' ? 'bg-emerald-500 text-white' : status === 'absent' ? 'bg-rose-500 text-white' : status === 'late' ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white'
                                                : 'bg-bg-base/50 border border-border-base text-text-dim hover:border-primary/30'
                                            }`}
                                        >
                                            {student.status === status ? <CheckSquare className="w-5 h-5" /> : status[0].toUpperCase()}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <button className="glass-card p-6 rounded-3xl border border-border-base flex items-center gap-4 hover:border-emerald-500/30 transition-all text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Download className="w-6 h-6" /></div>
                    <div>
                        <div className="text-[10px] font-black text-text-dim uppercase tracking-widest">Export All</div>
                        <div className="text-sm font-black text-text-main tracking-tighter">Excel Report</div>
                    </div>
                </button>
                <button className="glass-card p-6 rounded-3xl border border-border-base flex items-center gap-4 hover:border-rose-500/30 transition-all text-left">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500"><FileText className="w-6 h-6" /></div>
                    <div>
                        <div className="text-[10px] font-black text-text-dim uppercase tracking-widest">Export Term</div>
                        <div className="text-sm font-black text-text-main tracking-tighter">PDF Summary</div>
                    </div>
                </button>
            </div>
        </div>
    );

    const StudyMaterialView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4">
                    <Upload className="w-8 h-8 text-primary" /> Lectures & Study Material
                </h3>
                <button className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/30 hover:scale-105 transition-all">New Upload</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-card-base/30">
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tight mb-6 flex items-center gap-2 rotate-0">
                            <Plus className="w-5 h-5 text-primary" /> Upload New Resource
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Title</label>
                                <input type="text" placeholder="e.g. Algebra Chapter 5" className="w-full px-4 py-3 bg-bg-base border border-border-base rounded-2xl text-sm focus:outline-none focus:border-primary/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Subject</label>
                                    <select className="w-full px-4 py-3 bg-bg-base border border-border-base rounded-2xl text-sm focus:outline-none text-text-dim font-bold appearance-none">
                                        <option>Mathematics</option>
                                        <option>Physics</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Class</label>
                                    <select className="w-full px-4 py-3 bg-bg-base border border-border-base rounded-2xl text-sm focus:outline-none text-text-dim font-bold appearance-none">
                                        <option>10-A</option>
                                        <option>9-B</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Attachment</label>
                                <div className="border-2 border-dashed border-border-base rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition-all cursor-pointer group bg-bg-base/30">
                                    <Upload className="w-8 h-8 text-text-dim group-hover:text-primary group-hover:scale-110 transition-all" />
                                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Click to upload doc/pdf/vid</p>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-102 transition-all mt-4">Publish Material</button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h4 className="text-sm font-black text-text-dim uppercase tracking-[0.2em]">Recently Published</h4>
                        <Search className="w-4 h-4 text-text-dim cursor-pointer" />
                    </div>
                    {[
                        { title: 'Algebra Chapter 5', subject: 'Math', date: '15-Mar-2026', class: '5-A', type: 'PDF' },
                        { title: 'Photosynthesis Notes', subject: 'Biology', date: '15-Mar-2026', class: '7-B', type: 'PPTX' },
                    ].map((item, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-[2rem] border border-border-base flex items-center justify-between group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div className="min-w-0">
                                    <h5 className="font-black text-text-main tracking-tight truncate">{item.title}</h5>
                                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{item.subject} • {item.class} • {item.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-bg-base border border-border-base rounded-xl text-text-dim hover:text-primary hover:border-primary/30 transition-all"><Download className="w-4 h-4" /></button>
                                <button className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const AssignmentsView = () => (
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <ClipboardList className="w-8 h-8 text-primary" /> Assignments & Grading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: 'Calculus Set 4', submissions: 24, total: 30, deadline: '20 Mar', subject: 'Math' },
                    { title: 'Newtonian Laws Essay', submissions: 15, total: 30, deadline: '22 Mar', subject: 'Physics' },
                    { title: 'Organic Chemistry Lab', submissions: 30, total: 30, deadline: 'Closed', subject: 'Chemistry' },
                ].map((item, i) => (
                    <motion.div whileHover={{ y: -5 }} key={i} className="glass-card p-8 rounded-[3rem] border border-border-base relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black text-text-main mb-1 truncate">{item.title}</h4>
                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-6">{item.subject} • Due: {item.deadline}</p>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-text-dim">Submissions</span>
                                    <span className="text-primary">{item.submissions}/{item.total}</span>
                                </div>
                                <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${(item.submissions/item.total)*100}%` }}></div>
                                </div>
                            </div>
                            
                            <button className="w-full mt-8 py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Review All</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const ExamsMarksView = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4">
                    <FileText className="w-8 h-8 text-rose-500" /> Exams & Marks Entry
                </h3>
                <div className="flex gap-2">
                    <select className="px-4 py-2 bg-card-base border border-border-base rounded-xl text-xs font-bold text-text-dim focus:outline-none">
                        <option>Quarterly Exam</option>
                        <option>Half Yearly</option>
                    </select>
                    <button className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Save All</button>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-border-base overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-bg-base/50 border-b border-border-base">
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Student Name</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Subject</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-center">Marks (Max 100)</th>
                            <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-center">Grade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base/50">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-white/[0.01]">
                                <td className="px-8 py-6 font-bold text-text-main">{student.name}</td>
                                <td className="px-8 py-6 font-bold text-text-dim">Mathematics</td>
                                <td className="px-8 py-6 text-center">
                                    <input type="number" defaultValue="85" className="w-20 px-3 py-2 bg-bg-base border border-border-base rounded-xl text-center font-black text-primary focus:outline-none focus:border-primary" />
                                </td>
                                <td className="px-8 py-6 text-center font-black text-emerald-500">A</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const TimetableView = () => (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <Calendar className="w-8 h-8 text-primary" /> Weekly Teaching Schedule
            </h3>
            <div className="glass-card p-6 md:p-8 rounded-[3rem] border border-border-base overflow-x-auto">
                <div className="min-w-[800px] grid grid-cols-6 gap-4">
                    <div className="col-span-1" />
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-text-dim uppercase tracking-widest pb-4">{day}</div>
                    ))}
                    {['08:00', '10:00', '12:00', '02:00'].map(time => (
                        <React.Fragment key={time}>
                            <div className="text-right pr-4 text-[10px] font-black text-text-dim uppercase tracking-widest flex items-center justify-end">{time}</div>
                            {[1, 2, 3, 4, 5].map(day => (
                                <div key={day} className={`p-4 rounded-2xl border ${day === 1 && time === '08:00' ? 'bg-primary/10 border-primary/20' : 'bg-bg-base/30 border-border-base'} min-h-[100px] flex flex-col justify-center`}>
                                    {day === 1 && time === '08:00' ? (
                                        <>
                                            <div className="text-primary font-black text-[9px] uppercase tracking-widest">Math</div>
                                            <div className="text-text-main font-bold text-[10px]">10-A • B201</div>
                                        </>
                                    ) : (
                                        <div className="text-text-dim/20 font-black text-[10px] uppercase text-center">-</div>
                                    )}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );

    const CommunicationView = () => (
        <div className="space-y-6 animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <MessageCircle className="w-8 h-8 text-secondary" /> Communication Hub
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {[
                        { from: 'Admin', msg: 'Please submit the monthly attendance reports by tomorrow.', time: '10:00 AM', priority: 'High' },
                        { from: 'Principal', msg: 'Staff meeting at 4 PM in the conference hall.', time: '02:30 PM', priority: 'Normal' },
                    ].map((msg, i) => (
                        <div key={i} className="glass-card p-6 rounded-3xl border border-border-base flex gap-6 hover:border-secondary/20 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black">{msg.from[0]}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-black text-text-main italic">@{msg.from}</h5>
                                    <span className="text-[10px] font-bold text-text-dim uppercase">{msg.time}</span>
                                </div>
                                <p className="text-sm font-bold text-text-dim leading-relaxed">{msg.msg}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1 glass-card p-8 rounded-[3rem] border border-border-base bg-secondary/5 self-start">
                    <h4 className="text-lg font-black text-text-main uppercase tracking-tight mb-6">Quick Broadcast</h4>
                    <textarea placeholder="Type your message to students/parents..." className="w-full h-32 bg-bg-base/50 border border-border-base rounded-2xl p-4 text-sm focus:outline-none focus:border-secondary/50 mb-4 resize-none"></textarea>
                    <button className="w-full py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/20">Send Broadcast</button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'classes': return <StudentRosterView />;
            case 'attendance': return <AttendanceWorkflowView />;
            case 'study-material': return <StudyMaterialView />;
            case 'assignments': return <AssignmentsView />;
            case 'exams': return <ExamsMarksView />;
            case 'timetable': return <TimetableView />;
            case 'communication': return <CommunicationView />;
            default: return (
                <div className="glass-card p-20 rounded-[3rem] border-border-base flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary/30 mb-8 border-2 border-dashed border-primary/20">
                        <Plus className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase">{activeTab.replace('-', ' ')}</h3>
                    <p className="text-text-dim font-bold mt-2 text-lg">We are finalizing the {activeTab.replace('-', ' ')} logic for you.</p>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10 max-w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-2 min-w-0 overflow-hidden">
                <div className="flex-shrink-0">
                     <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Teacher <span className="text-secondary">Insight</span></h1>
                     <p className="text-text-dim font-bold text-[10px] md:text-sm tracking-widest mt-2 uppercase opacity-60">Empowering Educators & Navigating Success</p>
                </div>
                <div className="flex flex-wrap gap-4 min-w-0 flex-shrink-0">
                    <button 
                        onClick={() => setActiveTab('attendance')}
                        className="flex-1 lg:flex-none px-6 py-4 bg-secondary text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-secondary/40 hover:scale-105 transition-all whitespace-nowrap"
                    >
                        Mark Attendance
                    </button>
                    <button 
                        onClick={() => setActiveTab('study-material')}
                        className="p-4 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-secondary transition-colors flex-shrink-0"
                    >
                        <Upload className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative mx-2 min-w-0 max-w-full">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-base to-transparent z-10 lg:hidden pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-base to-transparent z-10 lg:hidden pointer-events-none" />
                <div className="flex bg-card-base p-2 rounded-[2.5rem] border border-border-base shadow-inner overflow-x-auto thin-scrollbar gap-2 scroll-smooth">
                {[
                    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'profile', label: 'My Profile', icon: User },
                    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
                    { id: 'classes', label: 'My Classes & Students', icon: BookOpen },
                    { id: 'exams', label: 'Exams & Marks', icon: FileText },
                    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
                    { id: 'study-material', label: 'Study Material / Notes', icon: Upload },
                    { id: 'communication', label: 'Communication', icon: MessageCircle },
                    { id: 'timetable', label: 'Timetable', icon: Calendar },
                    { id: 'settings', label: 'Settings', icon: Settings },
                    { id: 'live-classes', label: 'Live Sessions', icon: Video }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'settings') {
                                navigate('/settings');
                            } else {
                                setActiveTab(tab.id);
                            }
                        }}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.8rem] transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-secondary text-white shadow-2xl shadow-secondary/30' 
                            : 'text-text-dim hover:bg-bg-base hover:text-text-main'
                        }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-text-dim'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TeacherPanel;
