import React, { useState, useCallback, useMemo } from 'react';
import { 
    Users, 
    Upload, 
    Download, 
    CheckCircle2, 
    AlertCircle, 
    Search, 
    X, 
    Copy, 
    Eye, 
    EyeOff, 
    Plus,
    FileText,
    Activity,
    ClipboardCheck,
    ArrowRight,
    Loader2,
    Trash2,
    GraduationCap,
    User,
    Mail,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK CONSTANTS ---
const CLASSES = ['10-A', '10-B', '9-A', '9-B', '8-A', '11-C', '12-A'];

import api from '../../../api/axios';

const AddStudent = () => {
    const [entryMode, setEntryMode] = useState('manual'); // 'manual' or 'bulk'
    const [isLoading, setIsLoading] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);
    const [generatedCreds, setGeneratedCreds] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    // --- MANUAL ENTRY STATE ---
    const [manualForm, setManualForm] = useState({
        name: '',
        email: '',
        classId: '',
        sectionId: '',
        rollNumber: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Fetch classes on mount
    React.useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get('/admin/academic/classes');
                if (res.data.success) {
                    setClasses(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch classes', err);
            }
        };
        fetchClasses();
    }, []);

    // Handle class change to update sections
    const handleClassChange = (e) => {
        const cid = e.target.value;
        const cls = classes.find(c => c._id === cid);
        setSelectedClass(cls);
        setManualForm({ ...manualForm, classId: cid, sectionId: '' });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({});

        try {
            const res = await api.post('/admin/students/register', {
                fullIdentityName: manualForm.name,
                academicEmail: manualForm.email,
                classId: manualForm.classId,
                sectionId: manualForm.sectionId,
                rollRegistrationNumber: manualForm.rollNumber
            });

            if (res.data.success) {
                setGeneratedCreds({
                    id: res.data.data.credentials.studentId,
                    password: res.data.data.credentials.temporaryPassword,
                    name: manualForm.name
                });
                setShowCredentials(true);
                setManualForm({ name: '', email: '', classId: '', sectionId: '', rollNumber: '' });
                setSelectedClass(null);
            }
        } catch (err) {
            console.error('Registration failed', err);
            setFormErrors({ general: err.response?.data?.message || 'Failed to register student' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBulkFile(file);
            parseFile(file);
        }
    };

    const parseFile = (file) => {
        // Mocking file parsing
        setIsLoading(true);
        setTimeout(() => {
            const mockData = [
                { name: 'Aryan Verma', email: 'aryan@mock.com', class: '10-A', roll: '23', status: 'valid' },
                { name: 'Isha Khan', email: 'invalid-email', class: '9-B', roll: '', status: 'invalid', error: 'Invalid email & missing roll' },
                { name: 'Sameer Singh', email: 'sameer@mock.com', class: '12-C', roll: '45', status: 'valid' },
                { name: '', email: 'unknown@mock.com', class: '10-A', roll: '12', status: 'invalid', error: 'Name is required' },
            ];
            setParsedData(mockData);
            setIsLoading(false);
        }, 2000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Add toast notification here if available
    };

    // --- UI COMPONENTS ---

    const Header = () => (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
            <div>
                 <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none flex items-center gap-4">
                     <Plus className="w-10 h-10 text-primary" /> Add <span className="text-primary">Students</span>
                 </h2>
                 <p className="text-text-dim font-bold text-sm tracking-widest mt-2 uppercase opacity-60">Registration Hub & Lifecycle Management</p>
            </div>
        </div>
    );

    const ManualEntryView = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="glass-card p-10 rounded-[3rem] border border-border-base bg-indigo-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                
                <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" /> Single Student Registration
                </h3>

                <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Full Identity Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <input 
                                required
                                type="text" 
                                placeholder="e.g. Rahul Sharma" 
                                value={manualForm.name}
                                onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                                className="w-full pl-14 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Academic Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <input 
                                required
                                type="email" 
                                placeholder="rahul.s@school.edu" 
                                value={manualForm.email}
                                onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                                className="w-full pl-14 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Assign Class</label>
                        <select 
                            required
                            value={manualForm.classId}
                            onChange={handleClassChange}
                            className="w-full px-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 appearance-none transition-all cursor-pointer"
                        >
                            <option value="">Select a Class</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Select Section</label>
                        <select 
                            required
                            disabled={!selectedClass}
                            value={manualForm.sectionId}
                            onChange={(e) => setManualForm({...manualForm, sectionId: e.target.value})}
                            className="w-full px-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 appearance-none transition-all cursor-pointer disabled:opacity-30"
                        >
                            <option value="">{selectedClass ? 'Choose Section' : 'Select Class First'}</option>
                            {selectedClass?.sections.map(s => (
                                <option key={s._id} value={s._id} disabled={s.isFull}>
                                    Section {s.name} ({s.available} seats left) {s.isFull ? '[FULL]' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Roll Registration Number</label>
                        <div className="relative group">
                            <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <input 
                                required
                                type="text" 
                                placeholder="e.g. R-102" 
                                value={manualForm.rollNumber}
                                onChange={(e) => setManualForm({...manualForm, rollNumber: e.target.value})}
                                className="w-full pl-14 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6 flex flex-col items-center">
                        <div className="flex gap-4 p-6 bg-primary/5 border border-primary/10 rounded-3xl mb-10 w-full">
                            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                            <p className="text-[11px] font-bold text-text-dim uppercase tracking-wide leading-relaxed">
                                <span className="text-primary font-black">Note:</span> Passwords and System IDs are auto-generated. Credentials will be presented securely upon successful registration.
                            </p>
                        </div>
                        
                        <button 
                            disabled={isLoading}
                            className="w-full max-w-sm py-5 bg-primary text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>) : 'Register & Generate Credentials'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );

    const BulkEntryView = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Upload Area */}
            {!parsedData.length ? (
                <div 
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    className={`glass-card p-20 rounded-[4rem] border-2 border-dashed transition-all text-center flex flex-col items-center justify-center max-w-4xl mx-auto ${dragActive ? 'border-emerald-500 bg-emerald-500/5 scale-105' : 'border-border-base bg-emerald-500/5'}`}
                >
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mb-8 shadow-inner">
                        <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">Bulk Registry Import</h3>
                    <p className="text-sm font-bold text-text-dim mt-2 max-w-md mx-auto uppercase tracking-widest opacity-60">Drag and drop your student registry file or browse locally. Acceptable formats: CSV, XLSX.</p>
                    
                    <div className="flex gap-4 mt-12">
                        <button className="px-10 py-5 bg-bg-base border border-border-base text-text-dim text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
                             <Download className="w-5 h-5" /> Sample Template
                        </button>
                        <label className="px-10 py-5 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all">
                             <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv,.xlsx" />
                             <Activity className="w-5 h-5" /> Browse Registry
                        </label>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-between items-end px-2">
                        <div>
                            <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[.25em] mb-2">Import Progress</h4>
                            <div className="flex items-center gap-6">
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    {parsedData.filter(d => d.status === 'valid').length} Valid Nodes
                                </div>
                                <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    {parsedData.filter(d => d.status === 'invalid').length} Critical Errors
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                             <button onClick={() => { setParsedData([]); setBulkFile(null); }} className="px-6 py-4 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-2xl">Discard All</button>
                             <button className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30">Upload {parsedData.filter(d => d.status === 'valid').length} Students</button>
                        </div>
                    </div>

                    <div className="glass-card rounded-[3rem] overflow-hidden border border-border-base bg-bg-base/30">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-dim">Student Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-dim">Class</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-dim">Roll No</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-dim">Validation Status</th>
                                    <th className="px-8 py-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.map((row, i) => (
                                    <tr key={i} className={`border-b border-border-base/30 ${row.status === 'invalid' ? 'bg-rose-500/5' : ''}`}>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-text-main">{row.name || '---'}</p>
                                            <p className="text-[10px] font-bold text-text-dim">{row.email}</p>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-black text-text-dim uppercase">{row.class}</td>
                                        <td className="px-8 py-5 text-xs font-black text-text-dim uppercase">{row.roll || '---'}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {row.status === 'valid' ? (
                                                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span className="text-[9px] font-black text-emerald-500 uppercase">Ready</span></>
                                                ) : (
                                                    <><AlertCircle className="w-4 h-4 text-rose-500" /> <span className="text-[9px] font-black text-rose-500 uppercase">{row.error}</span></>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => setParsedData(prev => prev.filter((_, idx) => idx !== i))}
                                                className="p-2.5 bg-bg-base border border-border-base rounded-xl text-text-dim hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );

    const CredentialsModal = () => (
        <AnimatePresence>
            {showCredentials && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card-base w-full max-w-lg rounded-[4rem] border border-border-base p-12 shadow-3xl text-center relative"
                    >
                        <button onClick={() => setShowCredentials(false)} className="absolute top-8 right-8 p-3 text-text-dim hover:text-rose-500"><X className="w-6 h-6" /></button>
                        
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto mb-8">
                            <ClipboardCheck className="w-10 h-10" />
                        </div>

                        <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase mb-2">Student <span className="text-emerald-500">Registered</span></h3>
                        <p className="text-text-dim text-[10px] font-bold uppercase tracking-[0.3em] mb-12">System Access Credentials Generated</p>
                        
                        <div className="space-y-4 mb-12">
                            <div className="p-6 bg-bg-base/50 rounded-[2rem] border border-border-base flex justify-between items-center group">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">System Student ID</p>
                                    <p className="text-lg font-black text-text-main tracking-widest">{generatedCreds?.id}</p>
                                </div>
                                <button onClick={() => copyToClipboard(generatedCreds?.id)} className="p-3 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary transition-all active:scale-90"><Copy className="w-5 h-5" /></button>
                            </div>

                            <div className="p-6 bg-bg-base/50 rounded-[2rem] border border-border-base flex justify-between items-center group">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Temporary Password</p>
                                    <p className="text-lg font-black text-text-main tracking-[0.3em] mt-1">••••••••</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary transition-all"><Eye className="w-5 h-5" /></button>
                                    <button onClick={() => copyToClipboard(generatedCreds?.password)} className="p-3 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary transition-all active:scale-90"><Copy className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl mb-12 flex gap-4 items-start text-left">
                             <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                             <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-wide leading-relaxed">
                                Please copy these credentials and share them with the student. This information will not be shown again for security reasons.
                             </p>
                        </div>

                        <button 
                            onClick={() => setShowCredentials(false)}
                            className="w-full py-5 bg-text-main text-card-base text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary transition-all"
                        >
                            Finalize Registration
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
            <Header />

            <div className="px-2">
                 <ManualEntryView />
            </div>

            <CredentialsModal />

            {/* Skeleton Overlay for Global Loading */}
            {isLoading && !parsedData.length && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center backdrop-blur-md bg-white/5">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Syncing Registry Node...</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AddStudent;
