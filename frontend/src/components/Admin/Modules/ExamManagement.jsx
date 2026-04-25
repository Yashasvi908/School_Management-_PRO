import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    FileText, 
    ClipboardList, 
    CheckCircle, 
    Plus, 
    Upload, 
    MoreVertical, 
    Calendar, 
    BookOpen, 
    TrendingUp,
    Download,
    Clock,
    X,
    ArrowRight,
    Search,
    ChevronDown,
    Save,
    User,
    Award,
    Edit,
    Trash2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import axios from '../../../api/axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExamManagement = () => {
    const [view, setView] = useState('schedule');
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingExamId, setEditingExamId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const fileInputRef = useRef(null);
    
    // Mark Entry State
    const [markEntryStep, setMarkEntryStep] = useState(1); 
    const [selectedClassId, setSelectedClassId] = useState('');
    const [classList, setClassList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [examMarks, setExamMarks] = useState({}); 
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [subjectList, setSubjectList] = useState([]);

    // Form state for new exam
    const [newExam, setNewExam] = useState({
        name: '',
        type: 'unit',
        class: '',
        academicYear: '2024-25',
        subjects: [] 
    });

    useEffect(() => {
        const init = async () => {
            await fetchClasses();
            await fetchExams();
        };
        init();
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            fetchAnalytics(selectedExamId);
        }
    }, [selectedExamId]);

    useEffect(() => {
        if (selectedClassId) {
            fetchSubjectsForClass(selectedClassId);
        }
    }, [selectedClassId]);

    const fetchExams = async () => {
        try {
            const res = await axios.get('/admin/exams');
            setExams(res.data.data);
            if (res.data.data.length > 0 && !selectedExamId) {
                setSelectedExamId(res.data.data[0]._id);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load exams');
        }
    };

    const refreshMetadata = async () => {
        setLoading(true);
        await Promise.all([fetchExams(), fetchClasses()]);
        setLoading(false);
        toast.info('Registry Nodes Refreshed');
    };

    const fetchClasses = async () => {
        try {
            const res = await axios.get('/admin/academic/classes');
            console.log('[ExamManagement] Classes Synced:', res.data.data);
            setClassList(res.data.data || []);
        } catch (error) {
            console.error("Class fetch error:", error);
        }
    };

    const fetchSubjectsForClass = async (classId) => {
        if (!classId) return;
        try {
            const res = await axios.get(`/admin/academic/subjects?classId=${classId}`);
            // Robust extraction: backend returns { success, data: { subjects: [] } } OR legacy { success, data: [] }
            const subjects = res.data.data?.subjects || (Array.isArray(res.data.data) ? res.data.data : []);
            setSubjectList(subjects);
        } catch (error) {
            console.error("Subject fetch error:", error);
            setSubjectList([]);
            toast.error('Subject node link failed');
        }
    };

    const fetchAnalytics = async (id) => {
        try {
            const res = await axios.get(`/admin/exams/analytics/${id}`);
            setAnalytics(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            if (editingExamId) {
                await axios.put(`/admin/exams/${editingExamId}`, newExam);
                toast.success('Exam Updated Successfully');
            } else {
                await axios.post('/admin/exams', newExam);
                toast.success('Examination Scheduled!');
            }
            setShowCreateModal(false);
            setEditingExamId(null);
            setNewExam({ name: '', type: 'unit', class: '', academicYear: '2024-25', subjects: [] });
            fetchExams();
        } catch (error) {
            toast.error(editingExamId ? 'Update failed' : 'Scheduling failed');
        }
    };

    const handleDeleteExam = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam and all its marks?')) return;
        try {
            await axios.delete(`/admin/exams/${id}`);
            toast.success('Exam deleted');
            fetchExams();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const openEditModal = (exam) => {
        setNewExam({
            name: exam.name,
            type: exam.type,
            class: exam.class,
            academicYear: exam.academicYear,
            subjects: exam.subjects || []
        });
        setEditingExamId(exam._id);
        setShowCreateModal(true);
        setActiveMenuId(null);
        if (exam.class) {
             const clsObj = classList.find(c => c.name === exam.class);
             if (clsObj) fetchSubjectsForClass(clsObj._id);
        }
    };

    const fetchExistingMarks = async (examId, subjectId) => {
        try {
            const res = await axios.get(`/admin/exams/marks-subject?examId=${examId}&subjectId=${subjectId}`);
            if (res.data.success) {
                setExamMarks(res.data.data);
            }
        } catch (error) {
            console.error('Failed to sync marks from DB', error);
        }
    };

    const startManualEntry = async () => {
        if (!selectedExamId || !selectedClassId || !selectedSubjectId) {
            toast.warning('⚠️ Selection Required: Select Exam, Class AND Subject Node first');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`/admin/students?classId=${selectedClassId}&limit=100`);
            const students = res.data.data.students || res.data.data;
            setStudentList(students || []);
            setMarkEntryStep(2);
            await fetchExistingMarks(selectedExamId, selectedSubjectId);
            setLoading(false);
            if (!students || students.length === 0) {
                toast.info('Zero Student Nodes found in this registry');
            } else {
                toast.success(`Matrix Initialized for ${students.length} Student Nodes`);
            }
        } catch (error) {
            toast.error('Failed to load students');
            setLoading(false);
        }
    };

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!selectedExamId || !selectedSubjectId) {
            toast.warning('⚠️ Select Target Wave and Subject Node first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('examId', selectedExamId);
        formData.append('subjectId', selectedSubjectId);

        try {
            setLoading(true);
            const res = await axios.post('/admin/exams/bulk-upload', formData);
            toast.success(res.data.message);
            fetchAnalytics(selectedExamId);
            // Auto-transition to matrix view to show injected data
            await startManualEntry();
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload Failed');
            setLoading(false);
        }
    };

    const generatePDFReports = async () => {
        if (!selectedExamId || !selectedClassId) {
            toast.warning('Select Exam and Class for reporting');
            return;
        }
        try {
            toast.info('Synthesizing Report Cards...');
            const res = await axios.get(`/admin/exams/reports-bulk?examId=${selectedExamId}&classId=${selectedClassId}`);
            const data = res.data.data;
            const currentExam = exams.find(e => e._id === selectedExamId);
            const totalRequiredSubjects = currentExam?.subjects?.length || 0;

            if (!data || data.length === 0) {
                toast.error('No result data found for this class/exam');
                return;
            }

            const doc = new jsPDF();
            const examName = currentExam?.name || 'EXAMINATION';

            data.forEach((item, index) => {
                const marksEnteredCount = item.marks.length;
                if (marksEnteredCount < totalRequiredSubjects) return;

                if (index > 0) doc.addPage();
                
                doc.setFillColor(51, 51, 51);
                doc.rect(0, 0, 210, 40, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(22);
                doc.text(examName, 105, 25, { align: 'center' });
                
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(14);
                doc.text(`Student: ${item.student.name}`, 20, 55);
                doc.text(`ID: ${item.student.id}`, 20, 65);
                doc.text(`Roll No: ${item.student.roll}`, 150, 65);
                
                doc.autoTable({
                    startY: 80,
                    head: [['Subject', 'Obtained Marks', 'Max Marks', 'Status']],
                    body: item.marks.map(m => [
                        m.subject, 
                        m.obtained, 
                        m.max,
                        m.obtained >= 33 ? 'PASS' : 'FAIL'
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [244, 63, 94] }
                });

                const totalObtained = item.marks.reduce((s, m) => s + m.obtained, 0);
                const totalMax = item.marks.reduce((s, m) => s + m.max, 0);
                const percentage = totalMax > 0 ? (totalObtained / totalMax * 100).toFixed(1) : 0;

                doc.setFontSize(16);
                doc.text(`Aggregate: ${percentage}%`, 150, doc.lastAutoTable.finalY + 20);
                doc.setFontSize(10);
                doc.text('CERTIFIED REPORT CARD', 105, doc.lastAutoTable.finalY + 40, { align: 'center' });
            });

            doc.save(`${examName}_Report_Cards.pdf`);
            toast.success('Generated Master Registry');
        } catch (error) {
            toast.error('Synthesis Failed');
        }
    };

    const downloadExcelTemplate = () => {
        if (!studentList.length) {
            toast.warning('Initialize Manual Matrix first to get the student list');
            return;
        }
        
        const header = "Student ID,Name,Marks Obtained (Max 100)\n";
        const rows = studentList.map(s => `${s.studentId},${s.user?.name || s.name},0`).join("\n");
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `Marks_Template_${selectedClassId}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.info('Template Sync Initialized');
    };

    const handleMarkChange = (studentId, value) => {
        setExamMarks(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const submitMarks = async () => {
        try {
            const marksArray = studentList.map(student => ({
                studentId: student._id,
                subjectId: selectedSubjectId,
                marksObtained: Number(examMarks[student._id] || 0),
                maxMarks: 100
            }));

            await axios.post('/admin/exams/marks', {
                examId: selectedExamId,
                marks: marksArray
            });

            toast.success('All Student Nodes Synchronized Successfully');
            setMarkEntryStep(1);
            fetchAnalytics(selectedExamId);
        } catch (error) {
            toast.error('Sync Failed');
        }
    };

    const defaultAnalytics = {
        gradeDistribution: [
            { grade: 'A+', students: 0, color: '#10b981' },
            { grade: 'A', students: 0, color: '#34d399' },
            { grade: 'B+', students: 0, color: '#6366f1' },
            { grade: 'B', students: 0, color: '#8b5cf6' },
            { grade: 'C', students: 0, color: '#f59e0b' },
            { grade: 'D/F', students: 0, color: '#f43f5e' },
        ],
        schoolAvgScore: '0%',
        passPercentage: '0%',
    };

    const currentAnalytics = analytics || defaultAnalytics;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            {/* Hidden Input for Excel */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleExcelUpload}
            />

            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-8 rounded-[2.5rem] border border-border-base shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <FileText className="w-8 h-8 text-rose-500" /> Examination <span className="text-rose-500 text-glow">Engine</span>
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <p className="text-text-dim text-[11px] font-bold uppercase tracking-[0.3em]">Master Assessment Registry</p>
                    </div>
                </div>
                <div className="flex bg-bg-base/50 p-2 rounded-[1.5rem] border border-white/5 backdrop-blur-xl relative z-10 shadow-inner">
                    <button onClick={() => setView('schedule')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${view === 'schedule' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30' : 'text-text-dim hover:text-white'}`}>Exam Calendar</button>
                    <button onClick={() => setView('marks')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${view === 'marks' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30' : 'text-text-dim hover:text-white'}`}>Mark Entry</button>
                    <button onClick={() => setView('reports')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${view === 'reports' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30' : 'text-text-dim hover:text-white'}`}>Report Cards</button>
                </div>
            </div>

            {/* Global Stats Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 glass-card p-10 rounded-[3rem] border border-white/5 bg-[#050510]/80 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-rose-500/10 rounded-[1.5rem] border border-rose-500/20 shadow-inner">
                                <TrendingUp className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tighter">Performance Spectrum</h4>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-1">Live Grade distribution Index</p>
                            </div>
                        </div>
                        <div className="relative">
                            <select 
                                className="bg-[#0a0a20] border border-white/10 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-rose-500 transition-all cursor-pointer appearance-none shadow-inner min-w-[200px]"
                                onChange={(e) => setSelectedExamId(e.target.value)}
                                value={selectedExamId || ''}
                            >
                                <option value="" className="bg-[#0a0a20]">Select Wave</option>
                                {exams.map(e => <option key={e._id} value={e._id} className="bg-[#0a0a20] font-bold">{e.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                    {/* Analytics graph would be here */}
                </div>
            </div>

            {/* Dynamic View Modules */}
            <AnimatePresence mode="wait">
                {view === 'schedule' && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-8">
                        <div className="flex justify-between items-center bg-card-base px-10 py-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Examination Waves</h4>
                                <p className="text-[11px] font-bold text-text-dim uppercase mt-3 tracking-widest">Master scheduling system for academic years</p>
                            </div>
                            <button 
                                onClick={() => { setEditingExamId(null); setNewExam({ name: '', type: 'unit', class: '', academicYear: '2024-25', subjects: [] }); setShowCreateModal(true); }}
                                className="px-10 py-5 bg-rose-500 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
                            >
                                <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Schedule New
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {exams.map((exam, i) => (
                                <div key={i} className="glass-card p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group bg-gradient-to-br from-[#0a0a20] to-[#050510] shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:border-rose-500/30 transition-all duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all duration-700">
                                        <Calendar className="w-32 h-32 text-rose-500 -mr-10 -mt-10 rotate-12" />
                                    </div>
                                    <div className="mb-10 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <span className="px-4 py-1.5 bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-rose-500/20 shadow-inner">GRADE {exam.class}</span>
                                            <div className="relative">
                                                <button onClick={() => setActiveMenuId(activeMenuId === exam._id ? null : exam._id)} className={`p-3 bg-white/5 text-text-dim hover:text-white rounded-2xl transition-all border ${activeMenuId === exam._id ? 'border-rose-500' : 'border-white/5'} shadow-xl`}><MoreVertical size={18} /></button>
                                                <AnimatePresence>
                                                    {activeMenuId === exam._id && (
                                                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="absolute right-0 mt-3 w-48 bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                                            <button onClick={() => openEditModal(exam)} className="w-full px-6 py-4 flex items-center gap-4 text-[11px] font-black text-text-dim hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest border-b border-white/5"><Edit size={14} className="text-rose-500" /> Edit Node</button>
                                                            <button onClick={() => handleDeleteExam(exam._id)} className="w-full px-6 py-4 flex items-center gap-4 text-[11px] font-black text-rose-500 hover:text-white hover:bg-rose-500 transition-all uppercase tracking-widest"><Trash2 size={14} /> Purge Node</button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter mt-8 leading-tight group-hover:text-rose-500 transition-colors">{exam.name}</h4>
                                        <p className="text-[11px] font-bold text-text-dim uppercase mt-3 tracking-[0.15em] flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${exam.type === 'unit' ? 'bg-indigo-500' : exam.type === 'mid' ? 'bg-amber-500' : 'bg-emerald-500'}`} /> {exam.type.toUpperCase()} ASSESSMENT NODES</p>
                                    </div>
                                    <div className="space-y-6 mb-12 border-t border-white/10 pt-10 relative z-10">
                                        <div className="flex items-center gap-5 text-[12px] font-black text-white uppercase tracking-widest leading-none"><div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner"><Clock size={16} className="text-rose-500" /></div> YEAR: {exam.academicYear}</div>
                                        <div className="flex items-center gap-5 text-[12px] font-black text-white uppercase tracking-widest leading-none"><div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner"><BookOpen size={16} className="text-rose-500" /></div> Nodes: {exam.subjects?.length || '0'} CURRICULUM</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {view === 'marks' && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-10">
                        {markEntryStep === 1 ? (
                             <div className="glass-card p-24 rounded-[5rem] border-white/5 bg-[#050510]/60 text-center border-dashed border-2 relative group overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15)_0%,transparent_60%)] group-hover:opacity-150 transition-all duration-700" />
                                <div className="relative z-10 w-full max-w-4xl mx-auto">
                                    <div className="w-40 h-40 bg-rose-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-12 border border-rose-500/20 shadow-inner outline-none">
                                        <Award className="w-16 h-16 text-rose-500" />
                                    </div>
                                    <div className="flex justify-between items-center mb-12">
                                        <h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Grade <span className="text-rose-500 text-glow">Insertion Matrix</span></h4>
                                        <button onClick={refreshMetadata} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-rose-500/50 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><RefreshCw size={14} /> Sync Nodes</button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                        <div className="space-y-4 text-left">
                                            <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] pl-4">Target Wave</label>
                                            <div className="relative">
                                                <select className="w-full bg-[#0a0a1a] border border-white/10 px-8 py-5 rounded-2xl text-white font-black uppercase tracking-widest outline-none focus:border-rose-500 transition-all shadow-inner appearance-none pr-12" value={selectedExamId || ''} onChange={(e) => {
                                                        const val = e.target.value;
                                                        setSelectedExamId(val);
                                                        const exam = exams.find(ex => ex._id === val);
                                                        if (exam) {
                                                            console.log('[ExamManagement] Matching Exam Class:', exam.class);
                                                            const clsObj = classList.find(c => 
                                                                c.name.trim().toLowerCase() === (exam.class || '').trim().toLowerCase()
                                                            );
                                                            if (clsObj) {
                                                                console.log('[ExamManagement] Auto-matched Class ID:', clsObj._id);
                                                                setSelectedClassId(clsObj._id);
                                                            } else {
                                                                console.warn('[ExamManagement] No direct class match found. Please select Registry Class manually.');
                                                            }
                                                        }
                                                    }}>
                                                    <option value="" className="bg-[#0a0a1a]">Select Wave</option>
                                                    {exams.map(e => <option key={e._id} value={e._id} className="bg-[#0a0a1a]">{e.name}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 w-5 h-5 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 text-left">
                                            <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] pl-4">Registry Class</label>
                                            <div className="relative">
                                                <select className="w-full bg-[#0a0a1a] border border-white/10 px-8 py-5 rounded-2xl text-white font-black uppercase tracking-widest outline-none focus:border-rose-500 transition-all shadow-inner appearance-none pr-12" value={selectedClassId} onChange={(e) => {
                                                        setSelectedClassId(e.target.value);
                                                        fetchSubjectsForClass(e.target.value);
                                                    }}>
                                                    <option value="" className="bg-[#0a0a1a]">Select Class</option>
                                                    {classList.map(c => <option key={c._id} value={c._id} className="bg-[#0a0a1a]">{c.name}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 w-5 h-5 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 text-left">
                                            <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] pl-4">Subject Node</label>
                                            <div className="relative">
                                                <select className="w-full bg-[#0a0a1a] border border-white/10 px-8 py-5 rounded-2xl text-white font-black uppercase tracking-widest outline-none focus:border-rose-500 transition-all shadow-inner appearance-none pr-12" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
                                                    <option value="" className="bg-[#0a0a1a]">Select Subject</option>
                                                    {subjectList.map(s => <option key={s._id} value={s._id} className="bg-[#0a0a1a]">{s.name}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 w-5 h-5 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-8">
                                        <button onClick={startManualEntry} className="px-16 py-7 bg-white/5 border border-white/10 text-white text-[14px] font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-white/10 transition-all flex items-center gap-4 group/btn"><ClipboardList size={22} className="group-hover/btn:text-rose-500" /> Manual Matrix</button>
                                        <div className="flex flex-col gap-4">
                                            <button onClick={() => fileInputRef.current.click()} className="px-16 py-7 bg-rose-500 text-white text-[14px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-[0_25px_60px_rgba(244,63,94,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-4"><Upload size={20} /> Inject Excel</button>
                                            <button onClick={downloadExcelTemplate} className="text-[10px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-widest transition-all">Download Ready Template</button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center bg-card-base p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <button onClick={() => setMarkEntryStep(1)} className="p-4 bg-white/5 hover:bg-rose-500 rounded-2xl transition-all border border-white/5 text-text-dim hover:text-white"><ArrowRight className="rotate-180" size={20} /></button>
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Intelligence Matrix</h4>
                                            <p className="text-[11px] font-bold text-text-dim uppercase mt-2 tracking-widest">{subjectList.find(s=>s._id===selectedSubjectId)?.name} • Full Revision Node</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button onClick={submitMarks} className="px-10 py-5 bg-emerald-500 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"><Save size={20} /> Synchronize All Nodes</button>
                                        <button onClick={() => fileInputRef.current.click()} className="px-8 py-5 bg-rose-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_40px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"><Upload size={18} /> Quick Inject</button>
                                    </div>
                                </div>

                                <div className="glass-card rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl bg-[#050510]/80">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 border-b border-white/5">
                                            <tr>
                                                <th className="px-10 py-6 text-[11px] font-black text-white/40 uppercase tracking-widest">Student Node</th>
                                                <th className="px-10 py-6 text-[11px] font-black text-white/40 uppercase tracking-widest">System ID</th>
                                                <th className="px-10 py-6 text-[11px] font-black text-white/40 uppercase tracking-widest text-center">Marks Obtained (Max 100)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="3" className="px-10 py-32 text-center">
                                                        <RefreshCw className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-6" />
                                                        <p className="text-[12px] font-black text-white/20 uppercase tracking-widest">Fetching Registration Nodes...</p>
                                                    </td>
                                                </tr>
                                            ) : studentList.length > 0 ? studentList.map(student => (
                                                <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">{(student.user?.name || student.name || 'S').charAt(0)}</div>
                                                            <div>
                                                                <p className="text-[14px] font-black text-white uppercase tracking-tighter leading-none">{student.user?.name || student.name}</p>
                                                                <p className="text-[10px] font-bold text-text-dim uppercase mt-2 tracking-widest">Roll: {student.rollNumber}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8"><span className="text-[12px] font-black text-text-dim font-mono">{student.studentId}</span></td>
                                                    <td className="px-10 py-8 text-center">
                                                        <input type="number" min="0" max="100" placeholder="00" className="w-24 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-center text-xl font-black text-rose-500 focus:border-rose-500 focus:ring-8 focus:ring-rose-500/10 outline-none transition-all shadow-inner" value={examMarks[student._id] || ''} onChange={(e) => handleMarkChange(student._id, e.target.value)} />
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="px-10 py-32 text-center">
                                                        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-6 opacity-20" />
                                                        <p className="text-[12px] font-black text-white/20 uppercase tracking-widest">No Student Nodes Registered in this Class</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {view === 'reports' && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="glass-card p-24 rounded-[5rem] border border-white/5 bg-emerald-500/[0.03] text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/[0.04] rounded-full -mt-[350px] blur-3xl group-hover:bg-emerald-500/[0.06] transition-all duration-700" />
                        <div className="relative z-10 text-center">
                            <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_20px_40px_rgba(16,185,129,0.2)]"><TrendingUp className="w-12 h-12 text-emerald-500 animate-pulse" /></div>
                            <h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-8">Quantum <span className="text-emerald-500 text-glow">Analytics</span> Vault</h4>
                            <p className="text-xl font-bold text-text-dim tracking-[0.2em] opacity-60 uppercase max-w-3xl mx-auto leading-relaxed">Mass-generate certified student performance records with cryptographically secure PDF generation.</p>
                            
                            <div className="flex flex-wrap justify-center gap-8 mt-20">
                                <button onClick={generatePDFReports} className="px-16 py-7 bg-emerald-600 text-white text-[13px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-[0_25px_60px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-5 duration-300"><Download size={20} /> Generate Bulk Certs</button>
                                <div className="relative group/select">
                                    <select className="px-12 py-7 bg-[#0a0a1a] border border-white/20 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] text-white appearance-none cursor-pointer pr-20 focus:border-emerald-500 outline-none transition-all focus:ring-[15px] focus:ring-emerald-500/10 shadow-2xl min-w-[300px]" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}><option value="" className="bg-[#0a0a1a]">Target Registry Registry</option>{classList.map(c => <option key={c._id} value={c._id} className="bg-[#0a0a1a]">{c.name}</option>)}</select>
                                    <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6 pointer-events-none group-hover/select:scale-125 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Schedule/Edit Modal */}
            {showCreateModal && createPortal(
                <div className="fixed inset-0 z-[100001] bg-[#050510]/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-2xl bg-[#0a0a1a] border border-white/10 rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.9)] overflow-hidden">
                        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/5 shadow-2xl">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-rose-500/20 rounded-[2rem] border border-rose-500/20 shadow-inner"><Calendar className="w-10 h-10 text-rose-500" /></div>
                                <div>
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{editingExamId ? 'Modify Wave' : 'Initialize Wave'}</h3>
                                    <p className="text-[13px] font-bold text-text-dim uppercase tracking-[0.4em] mt-4 flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> {editingExamId ? 'System Update Mode' : 'Create New Assessment Node'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="p-6 bg-white/5 hover:bg-rose-500 hover:text-white rounded-[2rem] transition-all duration-500 border border-white/5 shadow-2xl group outline-none"><X size={28} className="group-hover:rotate-180 transition-transform duration-700" /></button>
                        </div>
                        <form onSubmit={handleCreateExam} className="p-16 space-y-12">
                            <div className="space-y-10 overflow-y-auto max-h-[60vh] custom-scrollbar">
                                <div className="group"><label className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] block mb-5 pl-3 group-focus-within:text-rose-500 transition-colors">Examination Title Node</label><input type="text" placeholder="EX: FINAL TERM CORE 2024" className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-10 py-6 text-[16px] font-black text-white focus:border-rose-500 focus:ring-[20px] focus:ring-rose-500/10 outline-none transition-all uppercase shadow-inner" value={newExam.name} onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} required /></div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="group"><label className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] block mb-5 pl-3 group-focus-within:text-rose-500 transition-colors">Exam Metadata Type</label><div className="relative"><select className="w-full bg-[#0a0a1a] border border-white/10 rounded-[2rem] px-10 py-6 text-[16px] font-black text-white focus:border-rose-500 focus:ring-[20px] focus:ring-rose-500/10 outline-none transition-all uppercase appearance-none cursor-pointer shadow-inner pr-16" value={newExam.type} onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}><option value="unit" className="bg-[#0a0a1a]">UNIT PT NODE</option><option value="mid" className="bg-[#0a0a1a]">MID TERM SYNC</option><option value="final" className="bg-[#0a0a1a]">FINAL MASTER</option></select><ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-rose-500 w-6 h-6 pointer-events-none" /></div></div>
                                    <div className="group"><label className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] block mb-5 pl-3 group-focus-within:text-rose-500 transition-colors">Target Registry Grade</label><div className="relative"><select className="w-full bg-[#0a0a1a] border border-white/10 rounded-[2rem] px-10 py-6 text-[16px] font-black text-white focus:border-rose-500 focus:ring-[20px] focus:ring-rose-500/10 outline-none transition-all uppercase shadow-inner appearance-none pr-16" value={newExam.class} onChange={(e) => { const val = e.target.value; setNewExam({ ...newExam, class: val }); const clsObj = classList.find(c => c.name === val); if (clsObj) fetchSubjectsForClass(clsObj._id); }} required><option value="" className="bg-[#0a0a1a]">Select Class</option>{classList.map(c => <option key={c._id} value={c.name} className="bg-[#0a0a1a]">{c.name}</option>)}</select><ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-rose-500 w-6 h-6 pointer-events-none" /></div></div>
                                </div>
                                <div className="group"><label className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] block mb-5 pl-3 group-focus-within:text-rose-500 transition-colors">Curriculum Nodes (Subjects)</label><div className="grid grid-cols-2 gap-4 bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-inner">{subjectList.map(subject => (<label key={subject._id} className="flex items-center gap-4 cursor-pointer group/item"><input type="checkbox" className="w-5 h-5 accent-rose-500 bg-white/10 border-white/10 rounded" checked={newExam.subjects.some(s => s.subject === subject._id)} onChange={(e) => { const subs = e.target.checked ? [...newExam.subjects, { subject: subject._id }] : newExam.subjects.filter(s => s.subject !== subject._id); setNewExam({ ...newExam, subjects: subs }); }} /><span className="text-[12px] font-black text-text-dim group-hover/item:text-white transition-colors uppercase">{subject.name}</span></label>))}<p className="col-span-2 text-center py-4 text-[10px] font-bold text-text-dim italic uppercase tracking-widest">Selected Class Node: {newExam.class || 'NULL'}</p></div></div>
                                <button type="submit" className="w-full py-8 bg-rose-500 text-white text-[16px] font-black uppercase tracking-[0.5em] rounded-[2.5rem] shadow-[0_30px_70px_rgba(244,63,94,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-300 mt-10 border border-white/10 flex items-center justify-center gap-5"> {editingExamId ? 'Update Master Node' : 'Trigger Master Cycle'} <ArrowRight size={24} /></button>
                            </div>
                        </form>
                    </motion.div>
                </div>, 
                document.body
            )}
        </motion.div>
    );
};

export default ExamManagement;
