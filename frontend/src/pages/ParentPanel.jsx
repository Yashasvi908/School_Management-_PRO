import React, { useState, useEffect } from 'react';
import {
    User,
    Users,
    Calendar,
    AlertCircle,
    MessageCircle,
    TrendingUp,
    CreditCard,
    BookOpen,
    Clock,
    FileText,
    Bell,
    Download,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    CheckCircle2,
    Search,
    DownloadCloud,
    Zap,
    Droplets,
    Terminal,
    History,
    Bus,
    Navigation,
    Settings
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ParentPanel = ({ tab: propTab }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryTab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(propTab || queryTab || 'overview');
    const [selectedChild, setSelectedChild] = useState('Prathmesh');
    const [loading, setLoading] = useState(true);

    const children = [
        { name: 'Prathmesh', class: '10-A', rollNo: '1001', avatar: 'https://i.pravatar.cc/150?u=prathmesh' },
        { name: 'Priya', class: '8-B', rollNo: '8024', avatar: 'https://i.pravatar.cc/150?u=priya' }
    ];

    const currentChild = children.find(c => c.name === selectedChild) || children[0];

    useEffect(() => {
        const currentTab = propTab || queryTab || 'overview';
        setActiveTab(currentTab);
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [propTab, queryTab]);

    const handleTabChange = (t) => {
        if (t === 'settings') {
            navigate('/settings');
        } else if (propTab) {
            navigate(`/parent-dashboard?tab=${t}`);
        } else {
            setSearchParams({ tab: t });
        }
    };

    const DashboardOverview = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Child Performance</p>
                        <p className="text-2xl font-black text-primary mt-1">Excellent</p>
                        <p className="text-[10px] font-bold text-green-500 uppercase mt-1">+4% from last month</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Attendance %</p>
                        <p className="text-2xl font-black text-secondary mt-1">96%</p>
                        <p className="text-[10px] font-bold text-text-dim uppercase mt-1">On Track</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-2xl">
                        <Calendar className="w-6 h-6 text-secondary" />
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Pending Fees</p>
                        <p className="text-2xl font-black text-rose-500 mt-1">₹12,400</p>
                        <p className="text-[10px] font-bold text-rose-500 uppercase mt-1">Due in 5 days</p>
                    </div>
                    <div className="p-4 bg-rose-500/10 rounded-2xl">
                        <CreditCard className="w-6 h-6 text-rose-500" />
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">New Notices</p>
                        <p className="text-2xl font-black text-amber-500 mt-1">03</p>
                        <p className="text-[10px] font-bold text-text-dim uppercase mt-1">Last 24 hours</p>
                    </div>
                    <div className="p-4 bg-amber-500/10 rounded-2xl">
                        <Bell className="w-6 h-6 text-amber-500" />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Child Quick Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-border-base relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-secondary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 md:gap-8 text-center sm:text-left">
                            <div className="relative">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-3xl bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl">
                                    <div className="w-full h-full bg-card-base rounded-[1.2rem] md:rounded-2xl flex items-center justify-center overflow-hidden">
                                        <img src={currentChild.avatar} alt={currentChild.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-lg md:rounded-xl flex items-center justify-center border-2 md:border-4 border-card-base shadow-lg">
                                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tighter mb-1">{currentChild.name}</h2>
                                <p className="text-text-dim font-bold text-base md:text-lg tracking-tight">Grade {currentChild.class} • Roll No: {currentChild.rollNo}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 md:gap-3 mt-4">
                                    <button onClick={() => handleTabChange('profile')} className="px-4 py-2 bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all">View Profile</button>
                                    <button onClick={() => handleTabChange('exams')} className="px-4 py-2 bg-card-base text-text-dim text-[9px] font-black uppercase tracking-widest rounded-xl border border-border-base hover:bg-bg-base transition-all">Exam Results</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule Mini */}
                    <div className="glass-card p-8 rounded-[2.5rem] border-border-base">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-text-main tracking-tighter uppercase flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary" /> Today's Classes
                            </h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline" onClick={() => handleTabChange('timetable')}>Full Schedule</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { time: '09:00 AM', subject: 'Mathematics', teacher: 'Dr. Khanna', status: 'Ongoing' },
                                { time: '10:30 AM', subject: 'English Lit.', teacher: 'Ms. Smith', status: 'Upcoming' },
                                { time: '12:00 PM', subject: 'Science', teacher: 'Mr. Gupta', status: 'Upcoming' },
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-bg-base/30 border border-border-base flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'Ongoing' ? 'bg-primary text-white' : 'bg-bg-base text-text-dim border border-border-base'}`}>{item.time}</div>
                                        <div>
                                            <h4 className="font-bold text-text-main tracking-tight">{item.subject}</h4>
                                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">{item.teacher}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Ongoing' ? 'text-primary' : 'text-text-dim opacity-50'}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Card: Notices & Fee Alert */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 relative overflow-hidden group">
                        <AlertCircle className="w-12 h-12 text-rose-500 mb-6 group-hover:rotate-12 transition-transform" />
                        <h4 className="text-xl font-black text-text-main tracking-tight mb-2 uppercase">Fee Payment Due</h4>
                        <p className="text-[12px] font-bold text-text-dim leading-relaxed mb-6">Annual sports fee and second term tuition fee is pending. Pay before Friday.</p>
                        <button onClick={() => handleTabChange('fees')} className="w-full py-4 bg-rose-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-500/30 hover:scale-[1.02] transition-all">Pay Online Now</button>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] border-border-base">
                        <h3 className="text-lg font-black text-text-main tracking-tight uppercase mb-6">School Notices</h3>
                        <div className="space-y-6">
                            {[
                                { title: 'PTM Meeting', date: 'Mar 20', tag: 'Event' },
                                { title: 'Summer Vacations', date: 'May 15', tag: 'Notice' },
                                { title: 'Final Exams', date: 'Apr 05', tag: 'Exams' }
                            ].map((notice, idx) => (
                                <div key={idx} className="flex gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-card-base border border-border-base flex flex-col items-center justify-center group-hover:border-primary transition-colors">
                                        <span className="text-[10px] font-black text-primary">{notice.date.split(' ')[1]}</span>
                                        <span className="text-[8px] font-bold text-text-dim uppercase">{notice.date.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{notice.title}</h5>
                                        <span className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-60">{notice.tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ChildProfile = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="glass-card p-10 rounded-[3rem] border-border-base relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                    <div className="relative group mx-auto md:mx-0">
                        <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-to-tr from-primary to-secondary p-1.5 shadow-3xl">
                            <div className="w-full h-full bg-card-base rounded-[2.2rem] flex items-center justify-center overflow-hidden">
                                <img src={currentChild.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-8">
                        <div>
                            <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase mb-2">{currentChild.name}</h2>
                            <p className="text-lg font-bold text-primary tracking-wide uppercase">{currentChild.class} • Roll No: {currentChild.rollNo}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-card-base rounded-xl border border-border-base"><Calendar className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Date of Birth</p>
                                        <p className="text-sm font-black text-text-main tracking-tight">15 August 2010</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-card-base rounded-xl border border-border-base"><MapPin className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Address</p>
                                        <p className="text-sm font-black text-text-main tracking-tight">45 Scholars Lane, Delhi</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-card-base rounded-xl border border-border-base"><Users className="w-5 h-5 text-secondary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">House</p>
                                        <p className="text-sm font-black text-text-main tracking-tight">Tagore House (Red)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-card-base rounded-xl border border-border-base"><CheckCircle2 className="w-5 h-5 text-secondary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Blood Group</p>
                                        <p className="text-sm font-black text-text-main tracking-tight">B+ Positive</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const SubjectsView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {[
                { name: 'Mathematics', teacher: 'Dr. Khanna', icon: TrendingUp, color: 'text-blue-500' },
                { name: 'Physics', teacher: 'Prof. Sharma', icon: Zap, color: 'text-amber-500' },
                { name: 'Chemistry', teacher: 'Dr. Verma', icon: Droplets, color: 'text-emerald-500' },
                { name: 'English', teacher: 'Ms. Smith', icon: BookOpen, color: 'text-rose-500' },
                { name: 'Computer Sci', teacher: 'Mr. Gupta', icon: Terminal, color: 'text-indigo-500' },
            ].map((sub, idx) => (
                <div key={idx} className="glass-card p-6 rounded-[2rem] border-border-base hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-card-base border border-border-base group-hover:border-primary/30 transition-colors`}>
                            <BookOpen className={`w-6 h-6 text-primary`} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-text-main tracking-tight">{sub.name}</h4>
                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Faculty: {sub.teacher}</p>
                        </div>
                    </div>
                    <button className="w-full py-2.5 mt-2 bg-bg-base/50 text-[10px] font-black text-text-main uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">View Syllabus</button>
                </div>
            ))}
        </div>
    );

    const FeesView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tight px-2 flex items-center gap-3">
                        <History className="w-5 h-5 text-primary" /> Payment History
                    </h3>
                    <div className="space-y-4">
                         {[
                             { desc: 'First Term Tuition Fee', date: '10 Jan 2025', amount: '₹45,000', status: 'Paid', method: 'Online' },
                             { desc: 'Annual Library Fee', date: '15 Jan 2025', amount: '₹2,500', status: 'Paid', method: 'Online' },
                             { desc: 'Second Term Tuition Fee', date: 'Expected 25 Mar', amount: '₹45,000', status: 'Pending', method: '-' },
                         ].map((item, idx) => (
                             <div key={idx} className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card-base border border-border-base flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                 <div>
                                     <h5 className="font-bold text-text-main">{item.desc}</h5>
                                     <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{item.date} • {item.method}</p>
                                 </div>
                                 <div className="flex items-center justify-between sm:justify-end gap-6">
                                     <span className="text-base md:text-lg font-black text-text-main">{item.amount}</span>
                                     <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Paid' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                                            {item.status}
                                        </span>
                                        {item.status === 'Paid' && <DownloadCloud className="w-5 h-5 text-text-dim hover:text-primary cursor-pointer transition-colors" />}
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>
                 </div>

                 <div className="p-8 rounded-[3rem] bg-primary text-white space-y-8 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <CreditCard className="w-12 h-12 mb-6" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Total Due Balance</h4>
                        <div className="text-5xl font-black tracking-tighter">₹57,400</div>
                    </div>
                    <div className="space-y-4 relative z-10">
                         <div className="flex justify-between text-[11px] font-bold opacity-80 uppercase tracking-widest">
                             <span>Tuition Fee</span>
                             <span>₹45,000</span>
                         </div>
                         <div className="flex justify-between text-[11px] font-bold opacity-80 uppercase tracking-widest">
                             <span>Transport</span>
                             <span>₹12,400</span>
                         </div>
                         <div className="h-px bg-white/20 my-4"></div>
                         <button className="w-full py-4 bg-white text-primary rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all">Proceed to Checkout</button>
                    </div>
                 </div>
            </div>
        </div>
    );

    const AttendanceView = () => (
        <div className="glass-card p-10 rounded-[3rem] border-border-base animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-8 flex items-center gap-4">
                <Calendar className="w-8 h-8 text-primary" /> Attendance History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-bg-base/30 border border-border-base flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Monthly Attendance</p>
                            <p className="text-4xl font-black text-text-main mt-1">96%</p>
                        </div>
                        <div className="w-20 h-20 rounded-full border-8 border-bg-base border-t-primary flex items-center justify-center font-black text-primary">96%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Present Days</p>
                            <p className="text-2xl font-black text-emerald-600">24</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10">
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Absent Days</p>
                            <p className="text-2xl font-black text-rose-600">01</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-bg-base/30 border border-border-base">
                    <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">Recent Records</h4>
                    <div className="space-y-4">
                        {[
                            { date: '14 Mar', status: 'Present', time: '08:45 AM' },
                            { date: '13 Mar', status: 'Present', time: '08:50 AM' },
                            { date: '12 Mar', status: 'Absent', time: '-' },
                            { date: '11 Mar', status: 'Present', time: '08:42 AM' },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-card-base border border-border-base">
                                <span className="text-sm font-bold text-text-main">{row.date}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{row.time}</span>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${row.status === 'Present' ? 'bg-green-500/10 text-green-600' : 'bg-rose-500/10 text-rose-600'}`}>{row.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const TimetableView = () => (
        <div className="glass-card p-10 rounded-[3rem] border-border-base animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-8 flex items-center gap-4">
                <Clock className="w-8 h-8 text-primary" /> Class Timetable
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Monday', 'Tuesday', 'Wednesday'].map(day => (
                    <div key={day} className="p-8 rounded-[2.5rem] bg-bg-base/30 border border-border-base">
                        <h4 className="text-xl font-black text-primary tracking-tighter uppercase mb-6 border-b border-border-base pb-4">{day}</h4>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-card-base rounded-2xl border border-border-base">
                                    <div className="w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center text-[10px] font-black text-text-dim text-primary">0{idx}</div>
                                    <span className="text-sm font-bold text-text-main">Subject {idx}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const AssignmentsView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <ClipboardList className="w-8 h-8 text-primary" /> Active Assignments
            </h3>
            <div className="space-y-4">
                {[
                    { title: 'Advanced Calculus', subject: 'Math', deadline: 'Tomorrow', status: 'Pending' },
                    { title: 'Chemical Bonding', subject: 'Science', deadline: '20th Mar', status: 'Completed' },
                    { title: 'Shakespeare Essay', subject: 'English', deadline: '22nd Mar', status: 'Pending' }
                ].map((item, i) => (
                    <div key={i} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'Completed' ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'}`}>
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-text-main tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{item.subject} • Due: {item.deadline}</p>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.status === 'Completed' ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'}`}>{item.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const ExamsView = () => (
        <div className="glass-card p-10 rounded-[3rem] border-border-base flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700">
            <FileText className="w-20 h-20 text-text-dim/20 mb-6" />
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">Exams & Results</h3>
            <p className="text-text-dim font-bold mt-2">Term 1 Results will be published on March 30th, 2025.</p>
            <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
                <div className="p-6 rounded-3xl bg-card-base border border-border-base">
                    <p className="text-[9px] font-black text-text-dim uppercase mb-1">Last GPA</p>
                    <p className="text-3xl font-black text-primary">3.9</p>
                </div>
                <div className="p-6 rounded-3xl bg-card-base border border-border-base">
                    <p className="text-[9px] font-black text-text-dim uppercase mb-1">Rank</p>
                    <p className="text-3xl font-black text-secondary">04</p>
                </div>
            </div>
        </div>
    );

    const NoticesView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <Bell className="w-8 h-8 text-secondary" /> School Notices
            </h3>
            <div className="space-y-6">
                {[
                    { title: 'Parent Teacher Meeting', desc: 'A mandatory PTM is scheduled for March 20th to discuss final term preparations.', date: 'Mar 14' },
                    { title: 'Summer Uniform Distribution', desc: 'Students can collect their summer uniforms from the school store starting next week.', date: 'Mar 12' }
                ].map((n, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border-border-base relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-secondary"></div>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-black text-text-main tracking-tight group-hover:text-secondary transition-colors">{n.title}</h4>
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{n.date}</span>
                        </div>
                        <p className="text-text-dim font-bold leading-relaxed">{n.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const TransportView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <Bus className="w-8 h-8 text-primary" /> School Transport Tracking
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card rounded-[3rem] border-border-base overflow-hidden relative group">
                    <iframe 
                         title="Transport Map"
                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8392305584!2d77.0688975!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b34766285%3A0x513254058dd524f1!2sDelhi!5e0!3m2!1sen!2sin!4v1710435000000!5m2!1sen!2sin" 
                         className="w-full h-[500px] border-none grayscale contrast-125 brightness-75 invert hue-rotate-180"
                         allowFullScreen="" 
                         loading="lazy"
                    ></iframe>
                </div>
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-[2.5rem] border-border-base">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Live Bus Status</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl"><Navigation className="w-5 h-5 text-primary" /></div>
                                <div>
                                    <p className="text-lg font-black text-text-main">Route #42B</p>
                                    <p className="text-xs font-bold text-text-dim uppercase tracking-widest">Enroute to Stop 3</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-bg-base/50 border border-border-base">
                                <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-2">Estimated Arrival</p>
                                <p className="text-2xl font-black text-text-main">07:42 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Synchronizing Academic Data...</p>
            </div>
        );

        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'profile': return <ChildProfile />;
            case 'attendance': return <AttendanceView />;
            case 'subjects': return <SubjectsView />;
            case 'timetable': return <TimetableView />;
            case 'assignments': return <AssignmentsView />;
            case 'exams': return <ExamsView />;
            case 'fees': return <FeesView />;
            case 'notices': return <NoticesView />;
            case 'transport': return <TransportView />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10 max-w-full">
            {/* Header & Child Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-4 md:px-2 min-w-0 overflow-hidden">
                <div className="flex-shrink-0 flex items-center gap-4">
                     <div>
                        <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Parent <span className="text-primary">Console</span></h1>
                        <p className="text-text-dim font-bold text-[10px] md:text-sm tracking-widest mt-2 uppercase opacity-60">Academic Oversight & Monitoring</p>
                     </div>
                     <button 
                        onClick={() => navigate('/settings')}
                        className="p-3 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary hover:border-primary/30 transition-all group"
                        title="Account Settings"
                     >
                        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                     </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card-base/30 p-2 rounded-[1.5rem] border border-border-base min-w-0 max-w-full lg:max-w-[60%]">
                    <div className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em] ml-3 hidden sm:block flex-shrink-0">Switch Child:</div>
                    <div className="flex gap-1 w-full overflow-x-auto thin-scrollbar min-w-0">
                        {children.map(child => (
                            <button
                                key={child.name}
                                onClick={() => setSelectedChild(child.name)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
                                    selectedChild === child.name ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-text-dim hover:text-text-main hover:bg-bg-base/50'
                                }`}
                            >
                                <img src={child.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-white/20" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{child.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Unified Responsive Tab Navigation */}
            <div className="relative mx-2 min-w-0 max-w-full">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-base/20 to-transparent z-10 pointer-events-none lg:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-base/20 to-transparent z-10 pointer-events-none lg:hidden" />
                <div className="flex bg-card-base p-2 rounded-[2rem] border border-border-base shadow-inner overflow-x-auto thin-scrollbar gap-2 scroll-smooth">
                    {['overview', 'profile', 'attendance', 'subjects', 'timetable', 'assignments', 'exams', 'fees', 'notices', 'transport', 'settings'].map(t => (
                        <button 
                            key={t}
                            onClick={() => handleTabChange(t)}
                            className={`flex-shrink-0 px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] transition-all whitespace-nowrap ${
                                activeTab === t ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-transparent text-text-dim hover:bg-bg-base/50'
                            }`}
                        >
                            {t === 'overview' ? 'Dashboard' : t.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default ParentPanel;
