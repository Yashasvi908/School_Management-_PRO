import React, { useState, useEffect } from 'react';
import {
    User,
    MapPin,
    Phone,
    Mail,
    BookOpen,
    Award,
    Clock,
    Download,
    Trophy,
    TrendingUp,
    Calendar,
    FileText,
    Bell,
    Contact,
    ChevronRight,
    Search,
    DownloadCloud,
    ExternalLink,
    CheckCircle2,
    ClipboardList,
    AlertCircle,
    Printer,
    Camera,
    Users,
    CreditCard,
    DollarSign,
    History,
    Bus,
    Navigation,
    Settings,
    MessageSquare,
    Library as LibraryIcon,
    Ticket,
    Archive,
    Inbox,
    Heart,
    Fingerprint,
    Layers,
    Target,
    Star,
    Video,
    Monitor
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';


const StudentPanel = ({ tab: propTab }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryTab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(propTab || queryTab || 'overview');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentTab = propTab || queryTab || 'overview';
        setActiveTab(currentTab);
    }, [propTab, queryTab]);

    const handleTabChange = (t) => {
        if (t === 'settings') {
            navigate('/settings');
        } else if (propTab) {
            // If we are on a specific route like /timetable, navigate back to dashboard with the tab
            navigate(`/student-dashboard?tab=${t}`);
        } else {
            setSearchParams({ tab: t });
        }
    };

    useEffect(() => {
        // --- MOCK MODE: Set static student data ---
        setStudent({
            _id: 'mock-student-id',
            name: 'Vanshu Verma',
            class: '10th A',
            rollNo: 'STU001',
            email: 'vansh.verma@school.edu',
            phone: '+91 98765 43210',
            address: '45, Scholars Lane, Green Valley, Delhi',
            dob: '12th June 2008',
            parentName: 'Mr. Rajesh Verma',
            parentContact: '+91 98765 00000',
            avatar: null
        });
        setLoading(false);
    }, []);

    const attendanceData = [
        { month: 'Jan', perc: 85 },
        { month: 'Feb', perc: 92 },
        { month: 'Mar', perc: 88 },
        { month: 'Apr', perc: 95 },
        { month: 'May', perc: 90 },
    ];

    const timetable = [
        { day: 'Monday', subjects: ['Math', 'English', 'Science', 'Computer'], rooms: ['L201', 'A105', 'Lab 2', 'A302'], teachers: ['Dr. Khanna', 'Ms. Smith', 'Mr. Gupta', 'Dr. Roy'] },
        { day: 'Tuesday', subjects: ['Science', 'Hindi', 'Math', 'History'], rooms: ['Lab 1', 'H101', 'L201', 'H102'], teachers: ['Prof. Sharma', 'Mrs. Devi', 'Dr. Khanna', 'Mr. Singh'] },
        { day: 'Wednesday', subjects: ['English', 'EVS', 'Physics', 'Chemistry'], rooms: ['A105', 'B202', 'P101', 'C101'], teachers: ['Ms. Smith', 'Mr. Verma', 'Prof. Sharma', 'Dr. Anita'] },
    ];

    const libraryData = [
        { title: 'The Great Gatsby', issueDate: '10/03/25', returnDate: '25/03/25', fine: '₹0' },
        { title: 'Advanced Calculus', issueDate: '01/03/25', returnDate: '15/03/25', fine: '₹50' },
    ];

    const messages = [
        { from: 'Dr. Khanna', sub: 'Math Assignment Doubt', date: '2h ago', body: 'Please refer to Chapter 4 for your query.' },
        { from: 'Admin Office', sub: 'Fee Receipt Generated', date: '1d ago', body: 'Your Term 1 receipt is ready for download.' },
    ];

    const liveClasses = [
        { id: 1, subject: 'Physics - Quantum Mechanics', teacher: 'Dr. R.K. Sharma', time: '10:00 AM - 11:30 AM', status: 'Live Now', platform: 'Zoom', attendees: 42, link: '#' },
        { id: 2, subject: 'Calculus Advanced', teacher: 'Mrs. S. Gupta', time: '01:00 PM - 02:30 PM', status: 'Scheduled', platform: 'Google Meet', attendees: 0, link: '#' },
        { id: 3, subject: 'Organic Chemistry', teacher: 'Mr. A. Singh', time: '04:00 PM - 05:30 PM', status: 'Upcoming', platform: 'Zoom', attendees: 0, link: '#' },
    ];

    if (loading) return <div className="text-center py-10 text-primary animate-pulse">Initializing Student Portal...</div>;
    if (!student) return <div className="text-center py-10">No student profile found.</div>;

    const DashboardOverview = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Row 1: Profile Summary & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 rounded-[2.5rem] lg:col-span-2 relative overflow-hidden group border-border-base bg-gradient-to-br from-primary/10 to-transparent"
                >
                    <div className="relative z-10 flex items-center gap-8">
                        <div className="w-24 h-24 rounded-3xl bg-card-base border border-border-base p-1 shadow-2xl overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4F46E5&color=fff&size=100&bold=true`} alt="" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-text-main tracking-tighter mb-1">Welcome, {student.name.split(' ')[0]}!</h2>
                            <p className="text-text-dim font-bold text-lg tracking-tight">{student.class} • Roll: {student.rollNo}</p>
                            <div className="flex gap-3 mt-4">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">Active Student</span>
                                <span className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">98% Progress</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {[
                    { label: 'Attendance', val: '92%', icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Avg Grade', val: 'A+', icon: Award, color: 'text-primary' },
                    { label: 'Pending Fees', val: '₹15k', icon: DollarSign, color: 'text-rose-500' },
                    { label: 'Next Exam', val: '25 Mar', icon: Calendar, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass-card p-8 rounded-[2.5rem] border-border-base flex flex-col items-center justify-center text-center group"
                    >
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-text-main tracking-tighter">{stat.val}</p>
                    </motion.div>
                ))}
            </div>

            {/* Row 2: Today's Classes & Latest Notices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-border-base">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-text-main tracking-tighter uppercase flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" /> Today's Schedule
                        </h3>
                        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline" onClick={() => handleTabChange('timetable')}>View Full</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: '09:00 AM', subject: 'Mathematics', teacher: 'Dr. Khanna', room: 'L201', active: true },
                            { time: '10:30 AM', subject: 'English Lit.', teacher: 'Ms. Smith', room: 'A105', active: false },
                            { time: '12:00 PM', subject: 'Computer Sci', teacher: 'Mr. Gupta', room: 'Lab 2', active: false },
                        ].map((item, idx) => (
                            <div key={idx} className={`p-4 rounded-xl md:rounded-2xl flex items-center justify-between border ${item.active ? 'bg-primary/5 border-primary/20' : 'bg-bg-base/30 border-border-base'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`px-2.5 py-1.5 md:px-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest ${item.active ? 'bg-primary text-white' : 'bg-bg-base text-text-dim border border-border-base'}`}>{item.time}</div>
                                    <div>
                                        <h4 className="text-sm md:text-base font-bold text-text-main tracking-tight">{item.subject}</h4>
                                        <p className="text-[9px] md:text-[10px] font-bold text-text-dim uppercase tracking-wider">{item.teacher} • Room {item.room}</p>
                                    </div>
                                </div>
                                {item.active && <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-border-base">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-text-main tracking-tighter uppercase flex items-center gap-3">
                            <Bell className="w-5 h-5 text-secondary" /> Latest Notices
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Spring Fest 2025 Registration', date: '14/03/25', tag: 'Event', color: 'text-amber-500 bg-amber-500/10' },
                            { title: 'Revised Exam Timetable Released', date: '12/03/25', tag: 'Exams', color: 'text-rose-500 bg-rose-500/10' },
                            { title: 'Inter-School Sports Meet', date: '10/03/25', tag: 'Sports', color: 'text-emerald-500 bg-emerald-500/10' },
                        ].map((item, idx) => (
                            <div key={idx} className="group p-4 rounded-xl md:rounded-2xl bg-bg-base/30 border border-border-base hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm md:text-base font-bold text-text-main group-hover:text-primary transition-colors">{item.title}</h4>
                                    <span className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.tag}</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-bold text-text-dim/60 uppercase">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Upcoming Exams */}
            <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-border-base relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10 relative z-10">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-text-main tracking-tighter uppercase">Upcoming Examinations</h3>
                        <p className="text-text-dim font-bold text-xs md:text-sm tracking-wide mt-1">Mid-Term Assessment Series starting soon</p>
                    </div>
                    <button className="w-full md:w-auto px-8 py-3 bg-primary/10 text-primary text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all">Download Schedule</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                    {[
                        { date: '25th Mar', subject: 'Mathematics', type: 'Objective', time: '10:00 AM' },
                        { date: '27th Mar', subject: 'Physics', type: 'Theory', time: '10:00 AM' },
                        { date: '29th Mar', subject: 'Chemistry', type: 'Practical', time: '11:30 AM' },
                        { date: '01st Apr', subject: 'English Lit.', type: 'Short Essay', time: '10:00 AM' },
                    ].map((exam, idx) => (
                        <div key={idx} className="p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card-base border border-border-base hover:scale-105 transition-transform duration-500 group shadow-lg shadow-black/5">
                            <div className="text-xl md:text-2xl font-black text-primary mb-1">{exam.date}</div>
                            <h4 className="text-base md:text-lg font-extrabold text-text-main mb-3">{exam.subject}</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase">
                                    <FileText className="w-3.5 h-3.5" /> {exam.type}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase">
                                    <Clock className="w-3.5 h-3.5" /> {exam.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const MyProfile = () => {
        const [profileTab, setProfileTab] = useState('personal');
        return (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
                <div className="glass-card p-4 rounded-[2.5rem] border-border-base flex gap-2 overflow-x-auto">
                    {['personal', 'parent', 'academic', 'documents'].map(pt => (
                        <button 
                            key={pt}
                            onClick={() => setProfileTab(pt)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                profileTab === pt ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:bg-white/5'
                            }`}
                        >
                            {pt}
                        </button>
                    ))}
                </div>

                {profileTab === 'personal' && (
                    <div className="glass-card p-10 rounded-[3rem] border-border-base">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative group">
                                <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-to-tr from-primary to-secondary p-1.5 shadow-3xl">
                                    <div className="w-full h-full bg-card-base rounded-[2.2rem] flex items-center justify-center overflow-hidden">
                                        <img src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4F46E5&color=fff&size=200&bold=true`} alt="" />
                                    </div>
                                </div>
                                <button className="absolute -bottom-4 -right-4 p-4 bg-primary text-white rounded-2xl shadow-xl"><Camera className="w-6 h-6" /></button>
                            </div>
                            <div className="flex-1 space-y-6">
                                <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase">{student.name}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        { label: 'Date of Birth', val: student.dob, icon: Calendar },
                                        { label: 'Gender', val: 'Male', icon: User },
                                        { label: 'Blood Group', val: 'O+', icon: Heart },
                                        { label: 'Email Address', val: student.email, icon: Mail },
                                        { label: 'Contact Number', val: student.phone, icon: Phone },
                                        { label: 'Residential Address', val: student.address, icon: MapPin },
                                    ].map((field, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl text-primary"><field.icon className="w-5 h-5" /></div>
                                            <div>
                                                <p className="text-[9px] font-black text-text-dim uppercase tracking-widest opacity-50">{field.label}</p>
                                                <p className="font-extrabold text-text-main tracking-tight uppercase">{field.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {profileTab === 'parent' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                            { role: 'Father', name: student.parentName, occupation: 'Software Engineer', phone: student.parentContact },
                            { role: 'Mother', name: 'Mrs. Suman Verma', occupation: 'Educator', phone: '+91 91XXX XXX88' },
                        ].map((p, i) => (
                            <div key={i} className="glass-card p-10 rounded-[3rem] border-border-base relative group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                    <Users className="w-24 h-24 text-primary" />
                                </div>
                                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">{p.role}</span>
                                <h4 className="text-3xl font-black text-text-main mb-4 uppercase tracking-tighter">{p.name}</h4>
                                <div className="space-y-4">
                                    <p className="flex items-center gap-3 text-text-dim font-bold uppercase text-xs"><Archive className="w-4 h-4" /> {p.occupation}</p>
                                    <p className="flex items-center gap-3 text-primary font-black uppercase text-xs"><Phone className="w-4 h-4" /> {p.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {profileTab === 'academic' && (
                    <div className="glass-card p-10 rounded-[3rem] border-border-base">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Admission ID', val: 'ADM-2024-88A', icon: Fingerprint },
                                { label: 'Current Class', val: student.class, icon: Layers },
                                { label: 'Section', val: 'B (Academic Elite)', icon: Target },
                                { label: 'Scholarship', val: 'Merit-Based (25%)', icon: Award },
                                { label: 'Joining Date', val: '01st April 2024', icon: Calendar },
                                { label: 'Academic Status', val: 'Excellent', icon: Star },
                            ].map((f, i) => (
                                <div key={i} className="p-8 bg-white/5 rounded-[2rem] border border-white/10 hover:border-primary/30 transition-colors">
                                    <f.icon className="w-8 h-8 text-primary mb-4" />
                                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">{f.label}</p>
                                    <p className="text-lg font-black text-text-main uppercase tracking-tight">{f.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {profileTab === 'documents' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { name: 'Transfer Certificate', size: '1.2 MB' },
                            { name: 'Birth Certificate', size: '0.8 MB' },
                            { name: 'Previous Academic Record', size: '4.5 MB' },
                            { name: 'Address Proof', size: '0.5 MB' },
                        ].map((doc, i) => (
                            <div key={i} className="glass-card p-8 rounded-[2.5rem] border-border-base flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><FileText className="w-7 h-7" /></div>
                                    <div>
                                        <h4 className="font-black text-text-main uppercase tracking-tight leading-none mb-1">{doc.name}</h4>
                                        <p className="text-[10px] font-bold text-text-dim uppercase">{doc.size} • Verified</p>
                                    </div>
                                </div>
                                <button className="p-4 bg-white/5 rounded-2xl hover:text-primary transition-colors"><DownloadIcon className="w-5 h-5" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const IDCardView = () => (
        <div className="flex items-center justify-center p-4 md:p-10 animate-in zoom-in-95 duration-700 overflow-hidden">
            <div className="w-full max-w-[450px] aspect-[1.6/1] glass-card rounded-[2rem] md:rounded-[2.5rem] border-border-base p-6 md:p-8 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-gradient-to-br from-card-base via-card-base to-primary/10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                <div className="flex gap-4 md:gap-8 h-full">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl bg-bg-base border border-border-base p-1 shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4F46E5&color=fff&size=150&bold=true`} className="w-full h-full rounded-lg md:rounded-xl object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 md:mb-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tighter leading-none">School Pro</h1>
                                <p className="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1">Identity Management</p>
                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <p className="text-[8px] md:text-[10px] font-black text-text-dim uppercase tracking-widest">Student Name</p>
                                <p className="text-base md:text-xl font-black text-text-main tracking-tight uppercase leading-none truncate">{student.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 md:gap-4">
                                <div>
                                    <p className="text-[7px] md:text-[8px] font-black text-text-dim uppercase tracking-widest">Student ID</p>
                                    <p className="text-xs md:text-sm font-black text-text-main">{student.rollNo}</p>
                                </div>
                                <div>
                                    <p className="text-[7px] md:text-[8px] font-black text-text-dim uppercase tracking-widest">Class & Sec</p>
                                    <p className="text-xs md:text-sm font-black text-text-main">{student.class}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 right-8 opacity-10 md:opacity-20 transition-opacity hidden sm:block">
                    <Trophy className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                </div>
                <div className="absolute bottom-4 md:bottom-6 left-6 md:left-8">
                     <button className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                        <Printer className="w-3 md:w-3.5 h-3 md:h-3.5" /> Download Digital ID
                     </button>
                </div>
            </div>
        </div>
    );

    const TimetableView = () => (
        <div className="glass-card p-10 rounded-[3rem] border-border-base animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-8 flex items-center gap-4">
                <Clock className="w-8 h-8 text-primary" /> Weekly Class Schedule
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {timetable.map((day, dIdx) => (
                    <div key={dIdx} className="p-8 rounded-[3rem] bg-bg-base/30 border border-border-base relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                        <h4 className="text-2xl font-black text-primary tracking-tighter uppercase mb-8 border-b border-white/5 pb-4">{day.day}</h4>
                        <div className="space-y-6">
                            {day.subjects.map((sub, sIdx) => (
                                <div key={sIdx} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 before:rounded-full">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-black text-text-main text-lg tracking-tight uppercase">{sub}</span>
                                        <span className="text-[10px] font-black text-primary opacity-60 uppercase tracking-widest">RM: {day.rooms[sIdx]}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">{day.teachers[sIdx]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const SubjectsView = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <BookOpen className="w-8 h-8 text-primary" /> My Subjects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: 'Mathematics', teacher: 'Dr. RK Khanna', syllabus: 'Algebra, Calculus, Geometry', topics: 12 },
                    { name: 'Physics', teacher: 'Prof. S. Sharma', syllabus: 'Mechanics, Optics, Thermodynamics', topics: 10 },
                    { name: 'Chemistry', teacher: 'Dr. Anita Roy', syllabus: 'Organic, Inorganic, Physical', topics: 15 },
                    { name: 'English Literature', teacher: 'Ms. J. Smith', syllabus: 'Shakespeare, Poetry, Grammar', topics: 8 },
                    { name: 'Computer Science', teacher: 'Mr. Amit Gupta', syllabus: 'Python, Networking, DB', topics: 20 },
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-8 rounded-[2.5rem] border-border-base relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="text-xl font-black text-text-main mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">{item.teacher}</p>
                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-2xl bg-bg-base/50 border border-border-base">
                                <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Syllabus Overview</p>
                                <p className="text-xs font-bold text-text-main">{item.syllabus}</p>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-bold text-text-dim uppercase">{item.topics} Chapters</span>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                                    Full Syllabus <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const AssignmentsView = () => (
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4">
                    <ClipboardList className="w-8 h-8 text-primary" /> Assignments
                </h3>
                <div className="flex gap-2">
                    {['pending', 'submitted', 'graded'].map(s => (
                        <span key={s} className="px-4 py-1.5 bg-card-base border border-border-base rounded-xl text-[9px] font-black uppercase tracking-widest text-text-dim">{s}</span>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                {[
                    { title: 'Calculus Problem Set 4', subject: 'Math', deadline: 'Tomorrow, 11:59 PM', priority: 'High', status: 'pending' },
                    { title: 'Newtonian Laws Essay', subject: 'Physics', deadline: '20th Mar', priority: 'Medium', status: 'pending' },
                    { title: 'Organic Chemistry Lab Report', subject: 'Chemistry', deadline: 'Submitted', priority: 'Done', status: 'submitted' },
                ].map((item, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-[2rem] border-border-base flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-primary/[0.01] transition-all group">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.status === 'submitted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                {item.status === 'submitted' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-text-main tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{item.subject} • {item.deadline}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {item.status === 'pending' ? (
                                <button className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">Submit Now</button>
                            ) : (
                                <button className="px-6 py-3 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/20">View Feedback</button>
                            )}
                            <button className="p-3 bg-bg-base border border-border-base rounded-xl text-text-dim hover:text-text-main transition-all">
                                <DownloadIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const StudyMaterialsView = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4">
                    <DownloadCloud className="w-8 h-8 text-primary" /> Study Materials
                </h3>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                    <input type="text" placeholder="Search Materials..." className="pl-11 pr-6 py-3 bg-card-base border border-border-base rounded-2xl text-sm focus:outline-none focus:border-primary/50 w-64" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Calculus Handouts - Unit 1', type: 'PDF', size: '2.4 MB', date: '10/03/25' },
                    { title: 'Physics Lecture Slides (Optics)', type: 'PPTX', size: '15.1 MB', date: '08/03/25' },
                    { title: 'Chemistry Periodic Table Notes', type: 'PDF', size: '1.8 MB', date: '05/03/25' },
                    { title: 'English Grammar Workbook', type: 'DOCX', size: '4.5 MB', date: '01/03/25' },
                ].map((file, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-bg-base border border-border-base flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-text-main tracking-tight leading-none mb-1">{file.title}</h4>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{file.type} • {file.size}</p>
                            </div>
                        </div>
                        <button className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const NoticesView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <Bell className="w-8 h-8 text-secondary" /> Notices & Announcements
            </h3>
            <div className="space-y-6">
                {[
                    { title: 'Annual Sports Meet 2025', desc: 'The annual sports meet will be held on 25th March. Participation is mandatory for all students.', sender: 'HOD Sports', date: '14th Mar' },
                    { title: 'Library Renovation Notice', desc: 'The primary library will be closed for renovation from 15th Mar to 20th Mar. Please use the digital portal for book requests.', sender: 'Chief Librarian', date: '12th Mar' },
                    { title: 'New Canteen Rules', desc: 'From next week, only digital payments or tokens will be accepted at the school canteen.', sender: 'Admin Office', date: '10th Mar' },
                ].map((notice, idx) => (
                    <div key={idx} className="glass-card p-10 rounded-[3rem] border-border-base relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1 h-full bg-secondary"></div>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-black text-text-main tracking-tighter">{notice.title}</h4>
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">{notice.date}</span>
                        </div>
                        <p className="text-text-dim font-bold text-sm leading-relaxed mb-6">{notice.desc}</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{notice.sender}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const FeesView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-2xl font-black text-text-main uppercase tracking-tight px-2 flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" /> Fee Payments
                    </h3>
                    <div className="space-y-4">
                        {[
                            { desc: 'Tuition Fee - Term 1', date: 'Jan 2025', amount: '₹15,000', status: 'Paid' },
                            { desc: 'Library & Labs', date: 'Jan 2025', amount: '₹2,500', status: 'Paid' },
                            { desc: 'Tuition Fee - Term 2', date: 'Due: Mar 25', amount: '₹15,000', status: 'Pending' },
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 rounded-[2rem] bg-card-base border border-border-base flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl bg-bg-base border border-border-base group-hover:border-primary/30 transition-colors`}>
                                        <CreditCard className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main">{item.desc}</h4>
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-lg font-black text-text-main">{item.amount}</span>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Paid' ? 'bg-green-500/10 text-green-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-8 rounded-[3.5rem] bg-primary text-white space-y-8 flex flex-col justify-between overflow-hidden relative shadow-2xl shadow-primary/40">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                    <div>
                        <DollarSign className="w-12 h-12 mb-6" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Total Outstanding</h4>
                        <div className="text-5xl font-black tracking-tighter">₹15,000</div>
                    </div>
                    <button className="w-full py-5 bg-white text-primary rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all">Download Invoice</button>
                </div>
            </div>
        </div>
    );

    const TransportView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-4 px-2">
                <Bus className="w-8 h-8 text-primary" /> School Transport
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card rounded-[3rem] border-border-base overflow-hidden relative group">
                    <div className="absolute inset-0 bg-bg-base/50 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">Live Tracking Active</div>
                    </div>
                    {/* Simulated Live Map */}
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
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Current Location</h4>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl"><Navigation className="w-5 h-5 text-primary" /></div>
                            <div>
                                <p className="text-lg font-black text-text-main">Bus Route #42</p>
                                <p className="text-xs font-bold text-text-dim uppercase">Near Scholars Crossing</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-border-base space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold uppercase">
                                <span className="text-text-dim">Est. Arrival</span>
                                <span className="text-primary">07:45 AM</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase">
                                <span className="text-text-dim">Driver</span>
                                <span className="text-text-main">Mr. Sharma</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-secondary/20">
                        <h4 className="text-lg font-black text-secondary tracking-tight mb-2 uppercase">Emergency Contact</h4>
                        <p className="text-xs font-bold text-text-dim mb-4">In case of transport delays or issues, contact the transport manager.</p>
                        <button className="w-full py-4 bg-secondary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/30">+91 98XXX XXX91</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const ResultsView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase px-2 flex items-center gap-4">
                <Trophy className="w-8 h-8 text-primary" /> Term Assessment Results
            </h3>
            <div className="glass-card p-8 rounded-[2.5rem] border-border-base">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Overall Grade', val: 'A+', color: 'text-primary' },
                        { label: 'Total Marks', val: '452 / 500', color: 'text-text-main' },
                        { label: 'Percentage', val: '90.4%', color: 'text-emerald-500' },
                        { label: 'Class Rank', val: '#04', color: 'text-secondary' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-bg-base/30 p-6 rounded-2xl border border-border-base text-center">
                            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.val}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[
                        { sub: 'Mathematics', marks: 92, grade: 'A+' },
                        { sub: 'Physics', marks: 88, grade: 'A' },
                        { sub: 'Chemistry', marks: 95, grade: 'A+' },
                        { sub: 'English', marks: 85, grade: 'A' },
                        { sub: 'Computer Sci', marks: 92, grade: 'A+' },
                    ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-bg-base/20 rounded-2xl border border-border-base">
                            <span className="font-bold text-text-main">{r.sub}</span>
                            <div className="flex items-center gap-10">
                                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${r.marks}%` }} />
                                </div>
                                <span className="text-sm font-black text-text-main w-10">{r.marks}</span>
                                <span className="text-sm font-black text-primary w-8">{r.grade}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-10 py-5 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                    <DownloadIcon className="w-5 h-5" /> Download Full Report Card (PDF)
                </button>
            </div>
        </div>
    );

    const EventsView = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase px-2 flex items-center gap-4">
                <Ticket className="w-8 h-8 text-secondary" /> Upcoming Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Spring Fest 2025', date: '25th March', loc: 'Main Auditorium', type: 'Cultural' },
                    { title: 'Inter-School Tech Expo', date: '02nd April', loc: 'Sports Complex', type: 'Exhibition' },
                    { title: 'Career Counseling', date: '10th April', loc: 'Seminar Hall', type: 'Academic' },
                    { title: 'Annual Sports Meet', date: '15th April', loc: 'Grounds', type: 'Sports' },
                ].map((ev, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border-border-base relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Calendar className="w-16 h-16 text-secondary" />
                        </div>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block">
                            {ev.type}
                        </span>
                        <h4 className="text-xl font-black text-text-main tracking-tight mb-2 uppercase">{ev.title}</h4>
                        <div className="space-y-1 text-xs font-bold text-text-dim uppercase tracking-wide">
                            <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {ev.date}</p>
                            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {ev.loc}</p>
                        </div>
                        <button className="mt-8 text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">Register Now</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const LibraryView = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase px-2 flex items-center gap-4">
                <LibraryIcon className="w-8 h-8 text-primary" /> My Library Books
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {libraryData.map((book, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border-border-base flex items-start gap-6">
                        <div className="w-16 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-black text-text-main tracking-tight uppercase leading-none mb-4">{book.title}</h4>
                            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-text-dim uppercase">
                                <div>
                                    <p className="opacity-50">Issued</p>
                                    <p className="text-text-main">{book.issueDate}</p>
                                </div>
                                <div>
                                    <p className="opacity-50">Return By</p>
                                    <p className="text-rose-500">{book.returnDate}</p>
                                </div>
                                <div>
                                    <p className="opacity-50">Overdue Fine</p>
                                    <p className={book.fine !== '₹0' ? 'text-rose-500' : 'text-emerald-500'}>{book.fine}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const MessagesView = () => (
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase px-2 flex items-center gap-4">
                <Inbox className="w-8 h-8 text-secondary" /> Inbox
            </h3>
            <div className="space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border-border-base hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black">
                                    {m.from[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-text-main group-hover:text-secondary transition-colors uppercase tracking-tight">{m.sub}</h4>
                                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{m.from}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-text-dim uppercase">{m.date}</span>
                        </div>
                        <p className="text-xs text-text-dim font-bold leading-relaxed">{m.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const DownloadsView = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase px-2 flex items-center gap-4">
                <DownloadIcon className="w-8 h-8 text-primary" /> Downloads & Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Academic Syllabus 2024-25', size: '2.5 MB', type: 'PDF' },
                    { title: 'Examination Guidelines', size: '1.2 MB', type: 'PDF' },
                    { title: 'School Holiday Calendar', size: '0.8 MB', type: 'PDF' },
                    { title: 'Student Handbook', size: '4.5 MB', type: 'PDF' },
                ].map((d, i) => (
                    <div key={i} className="glass-card p-6 rounded-[2rem] border-border-base flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main uppercase tracking-tight">{d.title}</h4>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{d.size} • {d.type}</p>
                            </div>
                        </div>
                        <button className="p-3 bg-card-base border border-border-base rounded-xl text-text-dim hover:text-primary transition-colors">
                            <DownloadIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const LiveClassesView = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase px-2 flex items-center gap-4">
                <Monitor className="w-8 h-8 text-rose-500" /> Virtual Classroom Hub
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {liveClasses.map((cls, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border-border-base relative overflow-hidden group">
                        {cls.status === 'Live Now' && (
                            <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-rose-500/20">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Live Now
                            </div>
                        )}
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-primary border border-white/5 group-hover:scale-110 transition-transform">
                            {cls.platform === 'Zoom' ? <Video className="w-8 h-8" /> : <Monitor className="w-8 h-8" />}
                        </div>
                        <h4 className="text-xl font-black text-text-main tracking-tight uppercase mb-1 leading-none">{cls.subject}</h4>
                        <p className="text-xs font-bold text-text-dim mb-6 uppercase tracking-wide">{cls.teacher}</p>
                        
                        <div className="space-y-3 mb-8 bg-bg-base/30 p-5 rounded-2xl border border-border-base">
                            <p className="flex items-center gap-3 text-[10px] font-bold text-text-dim uppercase"><Clock className="w-3.5 h-3.5" /> {cls.time}</p>
                            <p className="flex items-center gap-3 text-[10px] font-bold text-emerald-500 uppercase"><Users className="w-3.5 h-3.5" /> {cls.attendees || 'No'} Students Connected</p>
                        </div>

                        <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                            cls.status === 'Live Now' 
                            ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95' 
                            : 'bg-white/5 text-text-dim border border-white/10 opacity-50 cursor-not-allowed'
                        }`}>
                            {cls.status === 'Live Now' ? 'Join Session' : 'Locked'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'profile': return <MyProfile />;
            case 'id-card': return <IDCardView />;
            case 'timetable': return <TimetableView />;
            case 'subjects': return <SubjectsView />;
            case 'assignments': return <AssignmentsView />;
            case 'live-classes': return <LiveClassesView />;
            case 'attendance': return (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card p-10 rounded-[3rem] border-border-base">
                            <h3 className="text-xl font-black text-text-main tracking-tighter uppercase mb-8 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-primary" /> Attendance Velocity
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={attendanceData}>
                                        <defs>
                                            <linearGradient id="colorPerc" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" hide />
                                        <Tooltip contentStyle={{backgroundColor: 'var(--card-base)', borderRadius: '16px', border: '1px solid var(--border-base)', color: 'var(--text-main)'}} />
                                        <Area type="monotone" dataKey="perc" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorPerc)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-card p-10 rounded-[3rem] border-border-base flex flex-col justify-center text-center">
                            <div className="text-6xl font-black text-primary mb-2">92%</div>
                            <p className="text-xs font-black text-text-dim uppercase tracking-[0.3em]">Cumulative Present</p>
                            <div className="flex justify-center gap-6 mt-8">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-emerald-500">124</p>
                                    <p className="text-[9px] font-bold text-text-dim uppercase">Present</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-rose-500">08</p>
                                    <p className="text-[9px] font-bold text-text-dim uppercase">Absent</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-amber-500">04</p>
                                    <p className="text-[9px] font-bold text-text-dim uppercase">Leave</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] border-border-base">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">Attendance Matrix (March)</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> <span className="text-[9px] font-black uppercase text-text-dim">P</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> <span className="text-[9px] font-black uppercase text-text-dim">A</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> <span className="text-[9px] font-black uppercase text-text-dim">L</span></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {Array.from({ length: 31 }, (_, i) => {
                                const status = i % 10 === 0 ? 'A' : i % 15 === 0 ? 'L' : 'P';
                                const color = status === 'A' ? 'bg-rose-500' : status === 'L' ? 'bg-amber-500' : 'bg-emerald-500';
                                return (
                                    <div key={i} className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group relative">
                                        <span className="text-[10px] font-black text-text-dim mb-1">{i + 1}</span>
                                        <div className={`w-2 h-2 rounded-full ${color} shadow-lg shadow-white/5 group-hover:scale-150 transition-transform`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
            case 'exams': return (
                <div className="glass-card p-10 rounded-[3rem] border-border-base flex flex-col items-center justify-center text-center">
                    <Archive className="w-20 h-20 text-primary/20 mb-6" />
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">Examination Hub</h3>
                    <p className="text-text-dim font-bold mt-2">No active examinations currently scheduled.</p>
                    <div className="mt-10 flex gap-4">
                        <button className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl">Download Admit Card</button>
                    </div>
                </div>
            );
            case 'results': return <ResultsView />;
            case 'fees': return <FeesView />;
            case 'notices': return <NoticesView />;
            case 'events': return <EventsView />;
            case 'library': return <LibraryView />;
            case 'transport': return <TransportView />;
            case 'messages': return <MessagesView />;
            case 'downloads': return <DownloadsView />;
            default: return (
                <div className="glass-card p-20 rounded-[3rem] border-border-base flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-20 h-20 text-text-dim/20 mb-6" />
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase">Section Under Development</h3>
                    <p className="text-text-dim font-bold mt-2">Working on bringing the best {activeTab} experience for you.</p>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10 max-w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-2 min-w-0 overflow-hidden">
                <div className="flex-shrink-0 flex items-center gap-4">
                     <div>
                        <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Student <span className="text-primary">Portal</span></h1>
                        <p className="text-text-dim font-bold text-[10px] md:text-sm tracking-widest mt-2 uppercase opacity-60">Academic Session 2024-25</p>
                     </div>
                     <button 
                        onClick={() => navigate('/settings')}
                        className="p-3 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary hover:border-primary/30 transition-all group"
                        title="Account Settings"
                     >
                        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                     </button>
                </div>
                
                {/* Responsive Tab Navigation */}
                <div className="relative min-w-0 max-w-full lg:max-w-[70%]">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-base/20 to-transparent z-10 pointer-events-none lg:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-base/20 to-transparent z-10 pointer-events-none lg:hidden" />
                    <div className="flex bg-card-base p-2 rounded-[2rem] border border-border-base shadow-inner overflow-x-auto thin-scrollbar gap-2 scroll-smooth">
                        {[
                            { id: 'overview', label: 'Dashboard' },
                            { id: 'profile', label: 'My Profile' },
                            { id: 'attendance', label: 'Attendance' },
                            { id: 'live-classes', label: 'Live Classes' },
                            { id: 'timetable', label: 'Timetable' },
                            { id: 'assignments', label: 'Assignments' },
                            { id: 'exams', label: 'Exams' },
                            { id: 'results', label: 'Results' },
                            { id: 'fees', label: 'Fees' },
                            { id: 'notices', label: 'Notices' },
                            { id: 'events', label: 'Events' },
                            { id: 'library', label: 'Library' },
                            { id: 'transport', label: 'Transport' },
                            { id: 'messages', label: 'Messages' },
                            { id: 'downloads', label: 'Downloads' },
                            { id: 'settings', label: 'Settings' }
                        ].map(t => (
                            <button 
                                key={t.id}
                                onClick={() => handleTabChange(t.id)}
                                className={`flex-shrink-0 px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] transition-all whitespace-nowrap ${
                                    activeTab === t.id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-transparent text-text-dim border border-transparent hover:bg-bg-base/50'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default StudentPanel;
