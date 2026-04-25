import React, { useState } from 'react';
import { 
    Users, 
    UserCheck, 
    Plus, 
    BookOpen, 
    Clock, 
    DollarSign, 
    MoreVertical, 
    Briefcase, 
    Award, 
    Mail, 
    Phone,
    ShieldCheck,
    Search,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import { useSelector } from 'react-redux';
import api from '../../../api/axios';

const TeacherManagement = ({ setShowAddTeacher }) => {
    const [view, setView] = useState('list'); // 'list', 'hire'
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useSelector(state => state.auth);

    const [hireData, setHireData] = useState({ name: '', email: '', subjectExpertise: '', experience: '', qualifications: '' });
    const [hiring, setHiring] = useState(false);

    React.useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/teachers');
                if (res.data.success) {
                    setTeachers(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch teachers', err);
            } finally {
                setLoading(false);
            }
        };
        if (token && view === 'list') fetchTeachers();
    }, [token, view]);

    const handleHire = async (e) => {
        e.preventDefault();
        setHiring(true);
        try {
            const res = await api.post('/admin/teachers/register', hireData);
            if (res.data.success) {
                alert(`Appointment active! Teacher ID: ${res.data.data.teacherId}`);
                setHireData({ name: '', email: '', subjectExpertise: '', experience: '', qualifications: '' });
                setView('list');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Hiring cycle failed');
        } finally {
            setHiring(false);
        }
    };

    const subjectData = [
        { name: 'Math', value: 30, color: '#f59e0b' },
        { name: 'Science', value: 25, color: '#6366f1' },
        { name: 'English', value: 20, color: '#10b981' },
        { name: 'Other', value: 25, color: '#f43f5e' },
    ];

    const performanceData = [
        { name: 'Q1', score: 85 },
        { name: 'Q2', score: 92 },
        { name: 'Q3', score: 88 },
        { name: 'Q4', score: 95 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <Users className="w-6 h-6 text-secondary" /> Teaching Faculty
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">{teachers.length} Active Faculty Members</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Faculty List</button>
                    <button onClick={() => setView('hire')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'hire' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>New Appointment</button>
                </div>
            </div>

            {view === 'list' ? (
                <div className="space-y-6">
                    {/* Faculty Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-secondary/5">
                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-6 flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-secondary" /> Average Performance Scoring (Last 4 Quarters)
                            </h4>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                        <Bar dataKey="score" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5 flex flex-col items-center justify-center">
                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-4">Subject Expertise</h4>
                            <div className="h-32 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={subjectData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                                            {subjectData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-black text-text-main">{teachers.length}</span>
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                                {subjectData.map((s, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[7px] font-black text-text-dim uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div> {s.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teachers.map((teacher, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6 rounded-[2.5rem] border border-border-base relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Award className="w-20 h-20 text-secondary" />
                                </div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-xl shadow-inner">{teacher.user?.name?.[0]}</div>
                                    <div>
                                        <h4 className="text-md font-black text-text-main uppercase leading-none tracking-tight">{teacher.user?.name}</h4>
                                        <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mt-1.5">{teacher.subjects?.join(', ')} Specialist</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 relative z-10">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                        <span>Teacher ID</span>
                                        <span className="text-text-main">{teacher.employeeId}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                        <span>Qualifications</span>
                                        <span className="text-text-main truncate ml-4 text-right">{teacher.qualification}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                        <span>Experience</span>
                                        <span className="text-emerald-500">{teacher.experience}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 relative z-10">
                                    <button className="flex-1 py-3 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">View Portfolio</button>
                                    <button className="px-4 py-3 bg-card-base border border-border-base text-text-dim rounded-xl hover:text-rose-500 hover:border-rose-500/30 transition-all"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-card p-10 rounded-[3rem] border-border-base bg-secondary/5 animate-in fade-in duration-500 max-w-4xl mx-auto">
                    <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-8">Faculty <span className="text-secondary">Onboarding</span></h4>
                    <form onSubmit={handleHire} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="Dr. Jane Smith" 
                                value={hireData.name}
                                onChange={(e) => setHireData({...hireData, name: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Academic Email</label>
                            <input 
                                type="email" 
                                required
                                placeholder="jane@school.edu" 
                                value={hireData.email}
                                onChange={(e) => setHireData({...hireData, email: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Primary Subjects (Comma Separated)</label>
                            <input 
                                type="text" 
                                required
                                placeholder="Physics, Math" 
                                value={hireData.subjectExpertise}
                                onChange={(e) => setHireData({...hireData, subjectExpertise: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Total Experience</label>
                            <input 
                                type="text" 
                                required
                                placeholder="5 Years" 
                                value={hireData.experience}
                                onChange={(e) => setHireData({...hireData, experience: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" 
                            />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Academic Qualifications</label>
                            <input 
                                type="text" 
                                required
                                placeholder="PhD in Particle Physics" 
                                value={hireData.qualifications}
                                onChange={(e) => setHireData({...hireData, qualifications: e.target.value})}
                                className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" 
                            />
                        </div>
                        <div className="flex justify-end mt-4 md:col-span-2">
                            <button 
                                type="submit"
                                disabled={hiring}
                                className="px-12 py-4 bg-secondary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {hiring ? 'Processing Appointment...' : 'Issue Appointment Letter'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </motion.div>
    );
};

export default TeacherManagement;
