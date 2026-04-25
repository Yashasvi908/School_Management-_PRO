import React, { useState } from 'react';
import { 
    GraduationCap, 
    Plus, 
    Search, 
    MoreVertical,
    User,
    Edit3,
    IdCard,
    ShieldOff,
    Trash2,
    X,
    CheckCircle2,
    Download,
    Mail,
    Phone,
    MapPin,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import AddStudent from './AddStudent';
import BulkImport from './BulkImport';
import api from '../../../api/axios';
import { useSelector } from 'react-redux';

const StudentManagement = ({ setShowAddStudent }) => {
    const [view, setView] = useState('list'); // 'list', 'admission', 'bulk'

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-primary" /> Student Management
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Institutional Identity Network</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Directory</button>
                    <button onClick={() => setView('admission')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'admission' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Registration</button>
                    <button onClick={() => setView('bulk')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'bulk' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Bulk Migration</button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    {view === 'list' && <StudentListPlaceholder setView={setView} />}
                    {view === 'admission' && <AddStudent />}
                    {view === 'bulk' && <BulkImport />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

// Directory logic with Action Modals
const StudentListPlaceholder = ({ setView }) => {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState(null);
    const { token } = useSelector(state => state.auth);

    // Modal States
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    const fetchStudents = async () => {
        try {
            const [res, analyticsRes] = await Promise.all([
                api.get('/admin/students?limit=1000'),
                api.get('/admin/analytics/overview')
            ]);
            if (res.data.success) {
                setStudents(res.data.data.students || res.data.data);
            }
            if (analyticsRes.data.success) setStats(analyticsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    React.useEffect(() => {
        if (token) fetchStudents();
    }, [token]);

    const handleViewProfile = async (id) => {
        setIsProfileOpen(true);
        setActiveActionMenu(null);
        try {
            const res = await api.get(`/admin/students/${id}/profile`);
            if (res.data.success) setProfileData(res.data.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const res = await api.patch(`/admin/students/${id}/status`, { status: newStatus });
            if (res.data.success) {
                setStudents(students.map(s => s._id === id ? { ...s, status: newStatus } : s));
            }
        } catch (err) {
            alert('Failed to toggle status');
        }
        setActiveActionMenu(null);
    };

    const handleDelete = async () => {
        if (deleteConfirm !== 'DELETE') return alert('Type DELETE to confirm');
        try {
            const res = await api.post(`/admin/students/${selectedStudent._id}/delete`, { confirmation: 'DELETE' });
            if (res.data.success) {
                setStudents(students.filter(s => s._id !== selectedStudent._id));
                setIsDeleteOpen(false);
                setSelectedStudent(null);
            }
        } catch (err) {
            alert('Deletion cycle failed');
        }
    };

    const handleDownloadID = async (id) => {
        try {
            const res = await api.get(`/admin/students/${id}/id-card`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ID_Card_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('ID Generation failed');
        }
        setActiveActionMenu(null);
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Debounced Search Handler
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const res = await api.get(`/admin/students/probe?q=${searchQuery}`);
                    if (res.data.success) {
                        setStudents(res.data.data);
                    }
                } catch (err) {
                    console.error('Search failed', err);
                } finally {
                    setIsSearching(false);
                }
            } else if (searchQuery.length === 0) {
                fetchStudents();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const admissionTrend = stats?.studentEnrollmentTrend?.map(item => ({
        month: new Date(2024, item._id - 1).toLocaleString('default', { month: 'short' }),
        new: item.count
    })) || [
        { month: 'Jan', new: 0 }
    ];

    const genderData = [
        { name: 'Male', value: 64, color: '#6366f1' },
        { name: 'Female', value: 36, color: '#f43f5e' },
    ];

    return (
        <div className="space-y-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-primary/5">
                    <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-6">Enrollment Strategy Cluster</h4>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={admissionTrend}>
                                <defs>
                                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                <Area type="monotone" dataKey="new" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5 flex flex-col items-center justify-center">
                    <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-4">Diversity Node</h4>
                    <div className="h-32 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={genderData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-black text-text-main">{students.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative group">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim transition-colors ${isSearching ? 'animate-pulse text-primary' : 'group-focus-within:text-primary'}`} />
                    <input 
                        type="text" 
                        placeholder="Probe Student Identity Network..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" 
                    />
                    {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                           <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                <table className="w-full text-left">
                    <thead className="bg-bg-base/50 border-b border-border-base">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Student Node</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Academic Sector</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Guardian / Link</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-dim">Network Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, i) => (
                            <tr key={student._id || i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-lg uppercase">
                                            {student.user?.name?.[0] || 'S'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-main">{student.user?.name}</p>
                                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{student.studentId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-text-main uppercase">{student.classId?.name || 'Class ' + (student.class || 'N/A')}</td>
                                <td className="px-6 py-5">
                                    <p className="text-xs font-bold text-text-main">{student.parentName || 'N/A'}</p>
                                    <p className="text-[10px] font-bold text-text-dim uppercase">{student.user?.email}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${student.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right relative">
                                    <button 
                                        onClick={() => setActiveActionMenu(activeActionMenu === student._id ? null : student._id)}
                                        className="p-2.5 bg-bg-base border border-border-base rounded-xl text-text-dim hover:text-primary transition-all"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {activeActionMenu === student._id && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-2 w-56 bg-card-base border border-border-base rounded-2xl shadow-3xl z-[100] p-2 overflow-hidden"
                                            >
                                                <button onClick={() => handleViewProfile(student._id)} className="w-full flex items-center gap-3 p-2.5 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                                    <User className="w-4 h-4" /> View Profile
                                                </button>
                                                <button onClick={() => { setSelectedStudent(student); /* setEditOpen(true) */ }} className="w-full flex items-center gap-3 p-2.5 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all">
                                                    <Edit3 className="w-4 h-4" /> Edit Record
                                                </button>
                                                <button onClick={() => handleDownloadID(student._id)} className="w-full flex items-center gap-3 p-2.5 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-amber-500 hover:bg-amber-500/5 rounded-xl transition-all">
                                                    <IdCard className="w-4 h-4" /> System ID Card
                                                </button>
                                                <div className="h-[1px] bg-border-base my-2 mx-2"></div>
                                                <button onClick={() => handleToggleStatus(student._id, student.status)} className={`w-full flex items-center gap-3 p-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${student.status === 'active' ? 'text-amber-500 hover:bg-amber-500/5' : 'text-emerald-500 hover:bg-emerald-500/5'}`}>
                                                    <ShieldOff className="w-4 h-4" /> {student.status === 'active' ? 'Suspend Node' : 'Activate Node'}
                                                </button>
                                                <button onClick={() => { setSelectedStudent(student); setIsDeleteOpen(true); setActiveActionMenu(null); }} className="w-full flex items-center gap-3 p-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" /> Terminal Delete
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {isProfileOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
                         <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card-base w-full max-w-2xl rounded-[3rem] border border-border-base overflow-hidden relative shadow-3xl"
                         >
                            <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 p-3 bg-bg-base/50 text-text-dim hover:text-rose-500 rounded-2xl transition-all z-10"><X className="w-5 h-5" /></button>
                            
                            {!profileData ? (
                                <div className="p-32 flex flex-col items-center justify-center gap-4">
                                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Syncing Profile Data...</p>
                                </div>
                            ) : (
                                <div className="p-0">
                                    {/* Header Banner */}
                                    <div className="h-40 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                                         <div className="absolute -bottom-12 left-10 p-2 bg-card-base rounded-[2.5rem] border border-border-base ring-8 ring-bg-base">
                                              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-4xl font-black text-primary shadow-inner">
                                                  {profileData.student.user?.name?.[0]}
                                              </div>
                                         </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-10 pt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase">{profileData.student.user?.name}</h2>
                                                <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Student Identity Node • {profileData.student.studentId}</p>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-text-dim p-3 bg-bg-base/50 rounded-2xl border border-border-base/50">
                                                    <Mail className="w-4 h-4" /> <span className="text-[10px] font-bold">{profileData.student.user?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-text-dim p-3 bg-bg-base/50 rounded-2xl border border-border-base/50">
                                                    <MapPin className="w-4 h-4" /> <span className="text-[10px] font-bold">{profileData.student.address || 'No Address Logged'}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                                    <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Attendance</p>
                                                    <p className="text-xl font-black text-emerald-500">{profileData.metrics?.attendancePercent}%</p>
                                                </div>
                                                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                                    <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Fee Status</p>
                                                    <p className="text-xl font-black text-primary">{profileData.metrics?.feeStatus}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-bg-base/30 rounded-[2.5rem] p-8 border border-border-base">
                                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-6 flex items-center gap-2"><IdCard className="w-4 h-4 text-primary" /> Academic Ledger</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Academic Sector', val: 'Class ' + (profileData.student.class || 'N/A') },
                                                    { label: 'Primary Link', val: profileData.student.parentName },
                                                    { label: 'Admission Date', val: new Date(profileData.student.admissionDate).toLocaleDateString() },
                                                    { label: 'Blood Group', val: profileData.student.bloodGroup || 'Not Logged' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center pb-3 border-b border-border-base/30 last:border-0 last:pb-0">
                                                        <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">{item.label}</span>
                                                        <span className="text-[10px] font-black text-text-main uppercase">{item.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-full mt-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20">Sync To Ledger</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {isDeleteOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                         <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card-base w-full max-w-md rounded-[3rem] border border-rose-500/20 p-10 text-center shadow-3xl"
                         >
                            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-2">Terminal Deletion</h3>
                            <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-8 px-4 opacity-60">This will permanently revoke all access and wipe this identity node from the cluster.</p>
                            
                            <div className="space-y-4 mb-8">
                                <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">type "DELETE" to confirm</label>
                                <input 
                                    type="text" 
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                    placeholder="DELETE" 
                                    className="w-full px-6 py-4 bg-bg-base border border-border-base rounded-2xl text-center text-sm font-black text-rose-500 tracking-widest focus:outline-none focus:border-rose-500/50" 
                                />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => { setIsDeleteOpen(false); setDeleteConfirm(''); }} className="flex-1 py-4 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-2xl">Abort Cycle</button>
                                <button onClick={handleDelete} className="flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/30">Execute Wipe</button>
                            </div>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentManagement;
