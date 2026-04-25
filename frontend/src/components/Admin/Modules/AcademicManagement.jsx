import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    Plus, 
    Trash2, 
    Edit3, 
    Layers, 
    Users, 
    BookMarked,
    LayoutDashboard,
    ArrowRight,
    GraduationCap,
    Clock,
    CheckCircle2,
    X,
    MoreVertical,
    Shapes,
    Search,
    ChevronDown,
    Calendar,
    AlertCircle
} from 'lucide-react';
import api from '../../../api/axios';
import Modal from '../../common/Modal';

const AcademicManagement = () => {
    const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'subjects', 'timetable'
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [showAddClass, setShowAddClass] = useState(false);
    const [newClassData, setNewClassData] = useState({
        gradeNumber: '',
        name: '',
        sections: [{ name: '', capacity: 40 }]
    });

    const initialSubjects = [
        { name: 'Mathematics', code: 'MATH-101', class: 'Grade 10', teacher: 'Dr. Rajesh Kumar' },
        { name: 'Physics', code: 'PHYS-101', class: 'Grade 10', teacher: 'Mr. Arvind Singh' },
        { name: 'English Literature', code: 'ENG-101', class: 'Grade 9', teacher: 'Mrs. Sunita Verma' },
    ];

    const [subjectList, setSubjectList] = useState([]);
    const [groupedSubjects, setGroupedSubjects] = useState({ CORE: [], ELECTIVE: [], LAB: [] });
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [isEditingSubject, setIsEditingSubject] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [newSubject, setNewSubject] = useState({ name: '', code: '', type: 'CORE', creditHours: 4, assignedClasses: [], assignedTeachers: [] });

    // Timetable Selection State
    const [genSelection, setGenSelection] = useState({ classId: '', sectionName: '' });
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [activeDay, setActiveDay] = useState('Monday');
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showWeeklyBoard, setShowWeeklyBoard] = useState(false);
    const [weeklyData, setWeeklyData] = useState({});
    const [manualSlot, setManualSlot] = useState({ subjectId: '', teacherId: '', startTime: '08:00', endTime: '09:00', roomNumber: 'ROOM-101' });

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            if (isEditingSubject) {
                const res = await api.put(`/admin/academic/subjects/${editingSubjectId}`, newSubject);
                if (res.data.success) {
                    alert('Subject Configuration Updated!');
                    setIsEditingSubject(false);
                    setEditingSubjectId(null);
                }
            } else {
                const res = await api.post('/admin/academic/subjects', newSubject);
                if (res.data.success) alert('Subject Node Successfully Deployed!');
            }
            
            fetchSubjects();
            setShowAddSubject(false);
            setNewSubject({ name: '', code: '', type: 'CORE', creditHours: 4, assignedClasses: [], assignedTeachers: [] });
        } catch (err) {
            console.error('Subject Logic Error:', err);
            alert(err.response?.data?.message || 'Sync Failed');
        }
    };

    const handleEditClick = (sub) => {
        setNewSubject({
            name: sub.name,
            code: sub.code,
            type: sub.type,
            creditHours: sub.creditHours || 4,
            assignedClasses: sub.assignedClasses?.map(c => c._id) || [],
            assignedTeachers: sub.assignedTeachers?.map(t => t._id) || []
        });
        setEditingSubjectId(sub._id);
        setIsEditingSubject(true);
        setShowAddSubject(true);
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm('Remove this subject from active curriculum?')) return;
        try {
            await api.delete(`/admin/academic/subjects/${id}`);
            fetchSubjects();
        } catch (err) {
            alert('Delete failed');
        }
    };
    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/academic/classes', newClassData);
            if (res.data.success) {
                alert('Academic Node Successfully Synchronized!');
                setShowAddClass(false);
                fetchClasses();
                setNewClassData({ gradeNumber: '', name: '', sections: [{ name: '', capacity: 40 }] });
            }
        } catch (err) {
            console.error('Add Class Error:', err);
            alert(err.response?.data?.message || 'Academic Sync Failed: Check connectivity or missing fields');
        }
    };

    const fetchClasses = async () => {
        setLoadingClasses(true);
        try {
            const res = await api.get('/admin/academic/classes');
            if (res.data.success) {
                setClasses(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch classes', err);
        } finally {
            setLoadingClasses(false);
        }
    };
    const fetchSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const res = await api.get('/admin/academic/subjects');
            if (res.data.success) {
                setSubjectList(res.data.data.subjects);
                setGroupedSubjects(res.data.data.grouped);
            }
        } catch (err) {
            console.error('Failed to fetch subjects', err);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const fetchTimetable = async () => {
        if (!genSelection.classId || !genSelection.sectionName) return;
        try {
            // Fetch Current Day
            const res = await api.get(`/admin/academic/timetable/${genSelection.classId}/${genSelection.sectionName}?day=${activeDay}`);
            if (res.data.success) setCurrentSchedule(res.data.data);
            else setCurrentSchedule(null);

            // Fetch Full Week
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const weekly = {};
            await Promise.all(days.map(async (d) => {
                const r = await api.get(`/admin/academic/timetable/${genSelection.classId}/${genSelection.sectionName}?day=${d}`);
                if (r.data.success) weekly[d] = r.data.data.slots;
            }));
            setWeeklyData(weekly);
        } catch (err) {
            setCurrentSchedule(null);
        }
    };

    useEffect(() => {
        if (activeTab === 'timetable') {
            fetchClasses();
            fetchTeachers();
            fetchSubjects();
            fetchTimetable();
        }
    }, [genSelection.classId, genSelection.sectionName, activeDay, activeTab]);

    const handleGenerateTimetable = async () => {
        if (!genSelection.classId || !genSelection.sectionName) {
            return alert('Please select a Grade and Section from the dropdown first!');
        }
        
        try {
            const res = await api.post('/admin/academic/timetable/generate', genSelection);
            if (res.data.success) {
                alert('Optimized Schedule Generated Successfully!');
                fetchTimetable();
            } else {
                alert('Generation Logic Error: ' + res.data.message);
            }
        } catch (err) {
            console.error('Generation Error:', err);
            alert('Timetable Engine Sync Failed: ' + (err.response?.data?.message || 'Check Server Connectivity'));
        }
    };

    const handleAddManualSlot = async (e) => {
        e.preventDefault();
        if (!genSelection.classId || !genSelection.sectionName) return alert('Please select Grade & Section first!');
        if (!manualSlot.subjectId) return alert('Please select a Subject!');

        try {
            const res = await api.post('/admin/academic/timetable/slot', {
                ...genSelection,
                day: activeDay,
                slot: manualSlot
            });
            if (res.data.success) {
                alert('Slot Synchronized Successfully!');
                setShowSlotModal(false);
                fetchTimetable();
            } else {
                alert('Sync failed: ' + res.data.message);
            }
        } catch (err) {
            console.error('Slot Sync Error:', err);
            alert('Curriculum Sync Failed: ' + (err.response?.data?.message || 'Check Server Connectivity'));
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/admin/teachers');
            if (res.data.success) {
                setTeachers(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch teachers', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'classes') {
            fetchClasses();
            fetchTeachers();
        }
        if (activeTab === 'subjects') {
            fetchSubjects();
            fetchTeachers();
            fetchClasses(); // Re-fetch classes to have options in the form
        }
    }, [activeTab]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" /> Academic Organization
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Manage Class Structures & Curriculum</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('classes')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'classes' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Classes & Sections</button>
                    <button onClick={() => setActiveTab('subjects')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'subjects' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Subject Pool</button>
                    <button onClick={() => setActiveTab('timetable')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'timetable' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Timetable Engine</button>
                </div>
            </div>

            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingClasses ? (
                        <div className="col-span-full py-20 text-center text-text-dim text-xs font-black uppercase tracking-[0.3em] animate-pulse">Loading Registry...</div>
                    ) : classes.map((cls, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border border-border-base group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-inner">{cls.gradeNumber}</div>
                                <button className="p-2 hover:bg-bg-base rounded-xl transition-colors"><MoreVertical className="w-4 h-4 text-text-dim" /></button>
                            </div>
                            <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-4">{cls.name} Registry</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {cls.sections.map(sec => (
                                    <span key={sec._id} className="px-3 py-1 bg-bg-base/50 border border-border-base rounded-lg text-[10px] font-black text-primary uppercase">
                                        {sec.name} ({sec.enrolled || 0})
                                    </span>
                                ))}
                                <button 
                                    onClick={async () => {
                                        const secName = prompt('Enter New Section Name (e.g. B):');
                                        if (secName) {
                                            try {
                                                await api.post(`/admin/academic/classes/${cls._id}/sections`, { name: secName });
                                                fetchClasses();
                                                alert(`Section ${secName.toUpperCase()} Initialized!`);
                                            } catch (err) {
                                                alert(err.response?.data?.message || 'Failed to add section');
                                            }
                                        }
                                    }}
                                    className="px-3 py-1 border border-dashed border-border-base rounded-lg text-[10px] font-black text-text-dim uppercase hover:border-primary/50 hover:text-primary transition-all"
                                >+ Add</button>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-border-base/50">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim">
                                    <span>Class Teacher</span>
                                    <div className="flex items-center gap-2">
                                        <select 
                                            value={cls.classTeacher?._id || ''}
                                            onChange={async (e) => {
                                                if (e.target.value) {
                                                    try {
                                                        await api.patch(`/admin/academic/classes/${cls._id}/assign-teacher`, { teacherId: e.target.value });
                                                        fetchClasses();
                                                        alert('Class Teacher Appointed!');
                                                    } catch (err) {
                                                        alert('Appointment failed');
                                                    }
                                                }
                                            }}
                                            className="bg-transparent text-primary font-black uppercase tracking-tighter cursor-pointer focus:outline-none border-b border-primary/20 hover:border-primary/50 transition-all"
                                        >
                                            <option value="" className="bg-bg-base">{cls.classTeacher?.name || 'ASSIGN FACULTY'}</option>
                                            {teachers.map(t => (
                                                <option key={t._id} value={t._id} className="bg-bg-base">{t.user?.name} ({t.employeeId})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim">
                                    <span>Curriculum</span>
                                    <span className="text-text-main">{cls.subjects?.length || 0} Subjects</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {cls.subjects?.slice(0, 3).map((sub, idx) => (
                                        <span key={idx} className="text-[8px] font-black border border-border-base bg-white/5 px-2 py-0.5 rounded-md text-text-dim uppercase">{sub.name}</span>
                                    ))}
                                    {cls.subjects?.length > 3 && <span className="text-[8px] font-black text-primary uppercase">+{cls.subjects.length - 3} More</span>}
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim pt-2 border-t border-border-base/30">
                                    <span>Registry Count</span>
                                    <span className="text-text-main">{cls.registryCount} Students</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <button 
                        onClick={() => setShowAddClass(true)}
                        className="h-full min-h-[250px] border-2 border-dashed border-border-base rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-text-dim hover:border-primary/50 hover:text-primary transition-all group"
                    >
                         <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
                         <span className="text-xs font-black uppercase tracking-widest">Setup New Grade / Class</span>
                    </button>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div className="space-y-6">
                    {!showAddSubject ? (
                        <>
                            <div className="flex justify-end gap-2">
                                <div className="relative group max-w-xs w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                                    <input type="text" placeholder="Search subjects..." className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-xs font-bold text-text-main" />
                                </div>
                                <button onClick={() => setShowAddSubject(true)} className="px-6 py-3 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">+ Add Subject</button>
                            </div>
                            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                                <table className="w-full text-left">
                                    <thead className="bg-bg-base/50 border-b border-border-base">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Subject Name</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Code / Type</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Credits</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Assignments</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingSubjects ? (
                                            <tr><td colSpan="5" className="py-20 text-center text-xs font-black uppercase tracking-[0.3em] animate-pulse text-primary">Syncing Subject Pool...</td></tr>
                                        ) : subjectList.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-24 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/30">
                                                            <BookMarked className="w-10 h-10" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-black uppercase tracking-widest text-text-main">Subject Pool is Empty</p>
                                                            <p className="text-[9px] font-bold uppercase text-text-dim tracking-tight">No active curriculum has been registered for this cluster.</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => setShowAddSubject(true)}
                                                            className="mt-4 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                                        >
                                                            Deploy First Subject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : subjectList.map((sub, i) => (
                                            <tr key={sub._id || i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm"><Shapes className="w-5 h-5" /></div>
                                                        <span className="text-sm font-bold text-text-main uppercase tracking-tight">{sub.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-bold text-text-main uppercase">{sub.code}</span>
                                                        <span className={`text-[8px] font-black uppercase tracking-wider ${sub.type === 'LAB' ? 'text-blue-500' : sub.type === 'CORE' ? 'text-indigo-500' : 'text-amber-500'}`}>{sub.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-xs font-bold text-text-dim uppercase tracking-widest">{sub.creditHours} HRS</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex flex-wrap gap-1">
                                                            {sub.assignedClasses?.length > 0 ? sub.assignedClasses.map(c => (
                                                                <span key={c._id} className="text-[9px] font-black bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md uppercase">{c.name}</span>
                                                            )) : <span className="text-[9px] font-bold text-text-dim uppercase tracking-tighter">No Class Attached</span>}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <Users className="w-3 h-3 text-text-dim" />
                                                            <span className="text-[10px] font-bold text-text-main uppercase tracking-tight">
                                                                {sub.assignedTeachers?.[0]?.user?.name || 'Unassigned'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEditClick(sub)}
                                                            className="p-2 bg-primary/10 text-primary rounded-lg shadow-sm font-black hover:scale-110 transition-transform"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteSubject(sub._id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shadow-sm font-black hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="glass-card p-10 rounded-[3rem] border-border-base bg-primary/5 animate-in fade-in duration-500 max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter">
                                    {isEditingSubject ? 'Edit' : 'New'} <span className="text-primary">Subject</span>
                                </h4>
                                <button 
                                    onClick={() => {
                                        setShowAddSubject(false);
                                        setIsEditingSubject(false);
                                        setNewSubject({ name: '', code: '', type: 'CORE', creditHours: 4, assignedClasses: [], assignedTeachers: [] });
                                    }} 
                                    className="px-4 py-2 bg-bg-base border border-border-base rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-rose-500 transition-colors"
                                >Cancel</button>
                            </div>
                            <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Subject Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="E.g., Quantum Physics" 
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                                        className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Subject Code</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="PHYS-301" 
                                        value={newSubject.code}
                                        onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                                        className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Curriculum Type</label>
                                    <select 
                                        required
                                        value={newSubject.type}
                                        onChange={(e) => setNewSubject({...newSubject, type: e.target.value})}
                                        className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 appearance-none" 
                                    >
                                        <option value="CORE" className="bg-bg-base">CORE (Mandatory)</option>
                                        <option value="ELECTIVE" className="bg-bg-base">ELECTIVE (Optional)</option>
                                        <option value="LAB" className="bg-bg-base">LAB (Practical)</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Assign to Classes</label>
                                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-4 bg-bg-base/50 border border-border-base rounded-2xl">
                                        {classes.map(cls => (
                                            <label key={cls._id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20">
                                                <input 
                                                    type="checkbox" 
                                                    checked={newSubject.assignedClasses.includes(cls._id)}
                                                    onChange={(e) => {
                                                        const val = e.target.checked ? [...newSubject.assignedClasses, cls._id] : newSubject.assignedClasses.filter(id => id !== cls._id);
                                                        setNewSubject({...newSubject, assignedClasses: val});
                                                    }}
                                                    className="w-4 h-4 rounded border-border-base text-primary focus:ring-primary/20 bg-bg-base"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-text-main uppercase tracking-tighter">Grade {cls.gradeNumber} — {cls.name}</span>
                                                    <span className="text-[8px] font-bold text-text-dim uppercase">Sections: {cls.sections?.map(s => s.name).join(', ') || 'N/A'}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Assign Subject Teacher</label>
                                    <div className="relative group">
                                        <select 
                                            value={newSubject.assignedTeachers[0] || ''}
                                            onChange={(e) => setNewSubject({...newSubject, assignedTeachers: e.target.value ? [e.target.value] : []})}
                                            className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 appearance-none" 
                                        >
                                            <option value="">Select Faculty Member</option>
                                            {teachers.map(t => (
                                                <option key={t._id} value={t._id} className="bg-bg-base">{t.user?.name} ({t.employeeId})</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim"><ChevronDown className="w-4 h-4" /></div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 md:col-span-2">
                                    <button 
                                        type="submit"
                                        className="px-12 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-center"
                                    >
                                        Deploy Subject to Curriculum
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'timetable' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Active Classes', val: classes.length.toString(), sub: `Across ${new Set(classes.map(c => c.gradeNumber)).size} Grades` },
                            { label: 'Total Subjects', val: subjectList.length.toString(), sub: 'Curriculum Sync' },
                            { label: 'Avg Faculty Load', val: '18h', sub: 'Per Week', color: 'text-emerald-500' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base/50 bg-primary/5">
                                <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className={`text-xl font-black ${stat.color || 'text-primary'} tracking-tighter uppercase`}>{stat.val}</h4>
                                <p className="text-[8px] font-bold text-text-dim/50 uppercase mt-1">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-8 rounded-[3rem] border-border-base bg-bg-base/30">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                                <Clock className="w-4 h-4 text-primary" /> Daily Schedule Snapshot
                            </h4>
                            
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <select 
                                    value={genSelection.classId}
                                    onChange={(e) => {
                                        const cls = classes.find(c => c._id === e.target.value);
                                        setGenSelection({ ...genSelection, classId: e.target.value, sectionName: cls?.sections[0]?.name || '' });
                                    }}
                                    className="px-4 py-3 bg-bg-base border border-border-base rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main focus:border-primary focus:outline-none"
                                >
                                    <option value="">Select Grade</option>
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>Grade {cls.gradeNumber} — {cls.name}</option>
                                    ))}
                                </select>

                                <select 
                                    value={genSelection.sectionName}
                                    onChange={(e) => setGenSelection({ ...genSelection, sectionName: e.target.value })}
                                    className="px-4 py-3 bg-bg-base border border-border-base rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main focus:border-primary focus:outline-none"
                                >
                                    <option value="">Section</option>
                                    {classes.find(c => c._id === genSelection.classId)?.sections.map(sec => (
                                        <option key={sec._id} value={sec.name}>Section {sec.name}</option>
                                    ))}
                                </select>

                                <div className="flex gap-1 bg-bg-base border border-border-base p-1 rounded-xl">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                        <button 
                                            key={day} 
                                            onClick={() => setActiveDay(day)}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${day === activeDay ? 'bg-primary text-white' : 'text-text-dim hover:text-primary'}`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[150px]">
                            {genSelection.classId && genSelection.sectionName ? (
                                currentSchedule ? (
                                    <table className="w-full text-left">
                                        <thead className="border-b border-border-base">
                                            <tr>
                                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Period Type</th>
                                                {currentSchedule.slots.map((slot, idx) => (
                                                    <th key={idx} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">
                                                        {slot.startTime} - {slot.endTime}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-border-base/30">
                                                <td className="px-6 py-5 text-[10px] font-black text-primary uppercase">Subject Node</td>
                                                {currentSchedule.slots.map((slot, idx) => (
                                                    <td key={idx} className="px-6 py-5">
                                                        <motion.div 
                                                            onClick={() => {
                                                                setManualSlot({
                                                                    subjectId: slot.subjectId?._id || '',
                                                                    teacherId: slot.teacherId?._id || '',
                                                                    startTime: slot.startTime,
                                                                    endTime: slot.endTime,
                                                                    roomNumber: slot.roomNumber || 'ROOM-101'
                                                                });
                                                                setShowSlotModal(true);
                                                            }}
                                                            initial={{ scale: 0.9, opacity: 0 }} 
                                                            animate={{ scale: 1, opacity: 1 }} 
                                                            className={`p-4 rounded-2xl border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all ${idx % 2 === 0 ? 'bg-primary/5 border-primary/20' : 'bg-indigo-500/5 border-indigo-500/20'}`}
                                                        >
                                                            <p className="text-[10px] font-black text-text-main uppercase tracking-tight">{slot.subjectId?.name || 'BREAK'}</p>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <p className="text-[8px] font-bold text-text-dim uppercase">{slot.roomNumber}</p>
                                                                <p className="text-[8px] font-black text-primary/70 uppercase tracking-tighter">{slot.teacherId?.user?.name?.split(' ')[0]}</p>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="border-b border-border-base">
                                            <tr>
                                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Period Type</th>
                                                {['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:30 - 12:30'].map((time, idx) => (
                                                    <th key={idx} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">{time}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-border-base/30">
                                                <td className="px-6 py-5 text-[10px] font-black text-primary uppercase">Manual Entry</td>
                                                {['08:00', '09:00', '10:00', '11:30'].map((time, idx) => (
                                                    <td key={idx} className="px-6 py-5">
                                                        <button 
                                                            onClick={() => {
                                                                setManualSlot({ ...manualSlot, startTime: time, endTime: (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0') + ':00' });
                                                                setShowSlotModal(true);
                                                            }}
                                                            className="w-full border-2 border-dashed border-border-base/50 rounded-2xl py-6 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                                        >
                                                            <Plus className="w-4 h-4 mx-auto text-text-dim group-hover:text-primary transition-colors" />
                                                            <p className="text-[7px] font-black uppercase tracking-widest mt-1 text-text-dim">Add Slot</p>
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                )
                            ) : (
                                <div className="py-20 text-center border-2 border-dashed border-border-base/50 rounded-[2rem] bg-white/[0.02]">
                                    <div className="flex flex-col items-center gap-4 opacity-40 animate-pulse">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                            <BookOpen className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-black uppercase tracking-[0.2em] text-text-main">Awaiting System Input</p>
                                            <p className="text-[10px] font-bold uppercase text-text-dim">Please select a <span className="text-primary italic font-black">Grade & Section</span> from the dropdown above to engage the engine</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showSlotModal && createPortal(
                            <div className="fixed inset-0 z-[100001] bg-[#050510]/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
                                <motion.div 
                                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    className="w-full max-w-xl bg-[#0a0a1a] border border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden"
                                >
                                    <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5 shadow-2xl">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-primary/20 rounded-[1.5rem] border border-primary/20 shadow-inner">
                                                <Clock className="w-7 h-7 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Modify Node</h3>
                                                <p className="text-[12px] font-bold text-text-dim uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live Curriculum Sync • {activeDay}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowSlotModal(false)} className="p-5 bg-white/5 hover:bg-rose-500 hover:text-white rounded-[1.5rem] transition-all duration-300 border border-white/5 shadow-xl group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform" />
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddManualSlot(); }} className="p-12 space-y-10">
                                        <div className="space-y-8">
                                            <div className="group">
                                                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4 pl-2 group-focus-within:text-primary transition-colors">Target Subject Node</label>
                                                <div className="relative">
                                                     <select 
                                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-[14px] font-black text-white focus:border-primary focus:ring-8 focus:ring-primary/10 outline-none transition-all uppercase appearance-none cursor-pointer shadow-inner pr-12"
                                                        value={manualSlot.subjectId}
                                                        onChange={(e) => setManualSlot({ ...manualSlot, subjectId: e.target.value })}
                                                     >
                                                        <option value="">Select Curriculum Node</option>
                                                        {subjectList.map(s => <option key={s._id} value={s._id} className="bg-[#0a0a1a]">{s.name} ({s.code})</option>)}
                                                     </select>
                                                     <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none w-5 h-5" />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4 pl-2 group-focus-within:text-primary transition-colors">Assigned Instructor</label>
                                                <div className="relative">
                                                     <select 
                                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-[14px] font-black text-white focus:border-primary focus:ring-8 focus:ring-primary/10 outline-none transition-all uppercase appearance-none cursor-pointer shadow-inner pr-12"
                                                        value={manualSlot.teacherId}
                                                        onChange={(e) => setManualSlot({ ...manualSlot, teacherId: e.target.value })}
                                                     >
                                                        <option value="">Select Instructor</option>
                                                        {teachers.map(t => <option key={t._id} value={t._id} className="bg-[#0a0a1a]">{t.user?.name} ({t.employeeId})</option>)}
                                                     </select>
                                                     <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none w-5 h-5" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="group">
                                                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4 pl-2 group-focus-within:text-primary transition-colors">Room / Lab</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="ROOM-101"
                                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-[14px] font-black text-white focus:border-primary focus:ring-8 focus:ring-primary/10 outline-none transition-all uppercase shadow-inner"
                                                        value={manualSlot.roomNumber}
                                                        onChange={(e) => setManualSlot({ ...manualSlot, roomNumber: e.target.value.toUpperCase() })}
                                                    />
                                                </div>
                                                <div className="group opacity-40">
                                                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4 pl-2">Active Day</label>
                                                    <div className="w-full bg-primary/10 border border-primary/20 rounded-[1.5rem] px-8 py-5 text-[14px] font-black text-primary uppercase text-center shadow-inner tracking-widest">{activeDay}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="group">
                                                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4 pl-2 group-focus-within:text-primary transition-colors">Node Start</label>
                                                    <input 
                                                        type="time" 
                                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-[14px] font-black text-white focus:border-primary focus:ring-8 focus:ring-primary/10 outline-none transition-all cursor-pointer shadow-inner"
                                                        value={manualSlot.startTime}
                                                        onChange={(e) => setManualSlot({ ...manualSlot, startTime: e.target.value })}
                                                    />
                                                </div>
                                                <div className="group">
                                                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4 pl-2 group-focus-within:text-primary transition-colors">Node End</label>
                                                    <input 
                                                        type="time" 
                                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-[14px] font-black text-white focus:border-primary focus:ring-8 focus:ring-primary/10 outline-none transition-all cursor-pointer shadow-inner"
                                                        value={manualSlot.endTime}
                                                        onChange={(e) => setManualSlot({ ...manualSlot, endTime: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full py-7 bg-primary text-white text-[14px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6 border border-white/10 flex items-center justify-center gap-3">
                                                Synchronize Master Node <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>,
                            document.body
                        )}
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                             <button 
                                onClick={handleGenerateTimetable}
                                className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                             >
                                Generate Optimized Schedule
                             </button>

                             <button 
                                onClick={() => {
                                    if (!genSelection.classId) return alert('Select Grade First');
                                    setShowWeeklyBoard(true);
                                }}
                                className="px-10 py-4 bg-bg-base border border-border-base text-text-main text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3"
                             >
                                <Calendar className="w-4 h-4 text-primary" /> View Full Weekly Board
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {showWeeklyBoard && createPortal(
                <div className="fixed top-0 left-0 w-screen h-screen z-[99999] bg-[#050510] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,100,255,0.05)_0%,transparent_50%)] pointer-events-none" />
                    
                    {/* Floating Premium Close Button */}
                    <button 
                        onClick={() => setShowWeeklyBoard(false)} 
                        className="fixed top-10 right-10 z-[100000] group"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-rose-500/30 rounded-full blur-2xl group-hover:bg-rose-500/50 transition-all duration-500 animate-pulse" />
                            <div className="relative p-5 bg-rose-500 text-white rounded-full shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:bg-rose-600 hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center backdrop-blur-md border border-white/20">
                                <X size={32} className="group-hover:rotate-180 transition-transform duration-500" />
                            </div>
                        </div>
                    </button>

                    <div className="sticky top-0 z-20 px-12 py-10 border-b border-white/5 flex justify-between items-center bg-[#050510]/80 backdrop-blur-2xl shadow-2xl">
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Calendar className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Academic <span className="text-primary">Master Board</span></h2>
                                    <p className="text-[12px] font-bold text-text-dim uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Curriculum Registry • {classes.find(c => c._id === genSelection.classId)?.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8 bg-bg-base scrollbar-hide">
                        <div className="grid grid-cols-7 gap-px bg-border-base/20 border border-border-base rounded-[3rem] overflow-hidden shadow-2xl min-w-[1200px]">
                            <div className="sticky left-0 z-10 bg-card-base p-6 text-center border-b border-r border-border-base">
                                <span className="text-[10px] font-black text-text-dim uppercase">Time / Day</span>
                            </div>
                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map(day => (
                                <div key={day} className="bg-primary/5 p-8 text-center border-b border-border-base">
                                    <span className="text-[12px] font-black text-primary uppercase tracking-widest">{day}</span>
                                </div>
                            ))}

                            {['08:00', '09:00', '10:00', '11:30'].map((time, tIdx) => (
                                <React.Fragment key={time}>
                                    <div className="sticky left-0 z-10 bg-card-base p-10 flex items-center justify-center border-r border-border-base">
                                        <div className="text-center">
                                            <p className="text-[14px] font-black text-text-main">{time}</p>
                                            <p className="text-[9px] font-bold text-text-dim uppercase mt-1">1H NODE</p>
                                        </div>
                                    </div>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                                        const slot = weeklyData[day]?.find(s => s.startTime === time);
                                        return (
                                            <div 
                                                key={day} 
                                                onClick={() => {
                                                    setActiveDay(day);
                                                    setManualSlot({
                                                        subjectId: slot?.subjectId?._id || '',
                                                        teacherId: slot?.teacherId?._id || '',
                                                        startTime: time,
                                                        endTime: (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0') + ':00',
                                                        roomNumber: slot?.roomNumber || 'ROOM-101'
                                                    });
                                                    setShowSlotModal(true);
                                                }}
                                                className="bg-white/[0.01] p-8 hover:bg-white/[0.04] cursor-pointer transition-all border-r border-white/5 min-h-[180px] group/slot relative overflow-hidden"
                                            >
                                                {slot ? (
                                                    <div className="h-full flex flex-col justify-between relative z-10">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${tIdx % 2 === 0 ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'}`}>
                                                                    {slot.subjectId?.type || 'CORE'}
                                                                </span>
                                                                <span className="text-[10px] font-black text-white/20 group-hover/slot:text-primary transition-colors">#{tIdx + 1}</span>
                                                            </div>
                                                            <p className="text-[16px] font-black text-white uppercase tracking-tight leading-tight group-hover/slot:text-primary transition-colors">{slot.subjectId?.name}</p>
                                                        </div>
                                                        <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-primary/20">
                                                                    {slot.teacherId?.user?.name?.charAt(0)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black text-white uppercase leading-none">{slot.teacherId?.user?.name?.split(' ')[0]}</span>
                                                                    <span className="text-[8px] font-bold text-text-dim uppercase mt-1 tracking-widest">{slot.roomNumber}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center group-hover/slot:border-primary/40 group-hover/slot:bg-primary/5 transition-all duration-500 group-hover/slot:scale-95">
                                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/slot:border-primary/50 group-hover/slot:bg-primary/20 transition-all">
                                                            <Plus className="w-6 h-6 text-white/20 group-hover/slot:text-primary group-hover/slot:rotate-90 transition-all duration-500" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-4 group-hover/slot:text-primary transition-colors">Assign</span>
                                                    </div>
                                                )}
                                                
                                                {/* Hover Glow Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/slot:opacity-100 transition-opacity duration-500" />
                                                
                                                <div className="absolute bottom-6 right-6 translate-y-12 group-hover/slot:translate-y-0 opacity-0 group-hover/slot:opacity-100 transition-all duration-500">
                                                    <div className="p-3 bg-white text-black rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.3)] flex items-center justify-center">
                                                        <Edit3 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>, 
            document.body)}

            {/* Add Class Modal */}
            <Modal isOpen={showAddClass} onClose={() => setShowAddClass(false)} title="Initialize New Grade">
                <form onSubmit={handleAddClass} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest pl-1">Grade Number</label>
                            <input 
                                type="number" 
                                required
                                value={newClassData.gradeNumber}
                                onChange={(e) => setNewClassData({...newClassData, gradeNumber: e.target.value})}
                                placeholder="e.g. 10"
                                className="w-full bg-bg-base border border-border-base rounded-2xl p-4 text-sm font-bold text-text-main focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest pl-1">Registry Name</label>
                            <input 
                                type="text"
                                required
                                value={newClassData.name}
                                onChange={(e) => setNewClassData({...newClassData, name: e.target.value})}
                                placeholder="e.g. Grade 10 Registry"
                                className="w-full bg-bg-base border border-border-base rounded-2xl p-4 text-sm font-bold text-text-main focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest pl-1">Initial Sections</label>
                            <button 
                                type="button" 
                                onClick={() => setNewClassData({...newClassData, sections: [...newClassData.sections, { name: '', capacity: 40 }]})}
                                className="text-[10px] font-black text-primary uppercase"
                            >+ Add Section</button>
                        </div>
                        <div className="space-y-3">
                            {newClassData.sections.map((sec, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Section Name (e.g. A)"
                                        value={sec.name}
                                        onChange={(e) => {
                                            const updated = [...newClassData.sections];
                                            updated[idx].name = e.target.value;
                                            setNewClassData({...newClassData, sections: updated});
                                        }}
                                        className="flex-1 bg-bg-base border border-border-base rounded-xl p-3 text-sm font-bold tracking-widest uppercase"
                                    />
                                    <input 
                                        type="number"
                                        required
                                        placeholder="Capacity"
                                        value={sec.capacity}
                                        onChange={(e) => {
                                            const updated = [...newClassData.sections];
                                            updated[idx].capacity = e.target.value;
                                            setNewClassData({...newClassData, sections: updated});
                                        }}
                                        className="w-24 bg-bg-base border border-border-base rounded-xl p-3 text-sm font-bold"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Confirm Academic Node
                    </button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default AcademicManagement;
