import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Plus, 
    Search, 
    Filter, 
    Download,
    Bell,
    Settings as SettingsIcon,
    LogOut,
    ChevronDown,
    GraduationCap,
    Users,
    Activity,
    DollarSign,
    Briefcase,
    Calendar,
    BookOpen,
    FileText,
    TrendingUp,
    ShieldCheck,
    Database,
    LayoutDashboard,
    Clock,
    Menu,
    X,
    UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

// Import New Modules
import DashboardOverview from '../components/Admin/Modules/DashboardOverview';
import StudentManagement from '../components/Admin/Modules/StudentManagement';
import TeacherManagement from '../components/Admin/Modules/TeacherManagement';
import StaffManagement from '../components/Admin/Modules/StaffManagement';
import AcademicManagement from '../components/Admin/Modules/AcademicManagement';
import AttendanceManagement from '../components/Admin/Modules/AttendanceManagement';
import FinanceManagement from '../components/Admin/Modules/FinanceManagement';
import ExamManagement from '../components/Admin/Modules/ExamManagement';
import ResourceManagement from '../components/Admin/Modules/ResourceManagement';
import CommunicationManagement from '../components/Admin/Modules/CommunicationManagement';
import ReportsAnalytics from '../components/Admin/Modules/ReportsAnalytics';
import SystemSecurity from '../components/Admin/Modules/SystemSecurity';
import ParentManagement from '../components/Admin/Modules/ParentManagement';

// Modals & Forms
import Modal from '../components/common/Modal';
import AddStudentForm from '../components/Admin/Forms/AddStudentForm';
import AddTeacherForm from '../components/Admin/Forms/AddTeacherForm';

const AdminPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth || {});
    
    // UI States
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    // Modal States
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [showAddTeacher, setShowAddTeacher] = useState(false);
    const [showAddExam, setShowAddExam] = useState(false);

    // Sync active tab with location path
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setActiveTab('dashboard');
        else if (path.includes('student')) setActiveTab('students');
        else if (path.includes('teacher')) setActiveTab('teachers');
        else if (path.includes('staff')) setActiveTab('staff');
        else if (path.includes('parent')) setActiveTab('parents');
        else if (path.includes('classes') || path.includes('subjects') || path.includes('timetable') || path.includes('sections')) setActiveTab('academic');
        else if (path.includes('attendance')) setActiveTab('attendance');
        else if (path.includes('fees')) setActiveTab('finance');
        else if (path.includes('exam') || path.includes('result')) setActiveTab('exams');
        else if (path.includes('library') || path.includes('transport')) setActiveTab('resources');
        else if (path.includes('notices') || path.includes('events') || path.includes('chat')) setActiveTab('communication');
        else if (path.includes('analytics')) setActiveTab('reports');
        else if (path.includes('security') || path.includes('backup')) setActiveTab('system');
        else if (path.includes('settings')) setActiveTab('settings');
    }, [location]);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview setShowAddStudent={setShowAddStudent} setShowAddTeacher={setShowAddTeacher} setShowAddExam={setShowAddExam} />;
            case 'students': return <StudentManagement setShowAddStudent={setShowAddStudent} />;
            case 'teachers': return <TeacherManagement setShowAddTeacher={setShowAddTeacher} />;
            case 'staff': return <StaffManagement />;
            case 'parents': return <ParentManagement />;
            case 'academic': return <AcademicManagement />;
            case 'attendance': return <AttendanceManagement />;
            case 'finance': return <FinanceManagement />;
            case 'exams': return <ExamManagement />;
            case 'resources': return <ResourceManagement />;
            case 'communication': return <CommunicationManagement />;
            case 'reports': return <ReportsAnalytics />;
            case 'system': return <SystemSecurity />;
            case 'settings': navigate('/settings'); return null;
            default: return <DashboardOverview setShowAddStudent={setShowAddStudent} setShowAddTeacher={setShowAddTeacher} />;
        }
    };

    return (
        <div className="min-h-screen bg-bg-base font-sans relative overflow-x-hidden">
            {/* Background Gradient Decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-[1700px] mx-auto p-4 md:p-8 space-y-8 pb-24 relative z-10">
                {/* Global Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 hover:rotate-6 transition-transform duration-500">
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">Admin <span className="text-primary">Console</span></h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">{activeTab} node</span>
                                <div className="w-1 h-1 bg-border-base rounded-full"></div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Live Cluster
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 bg-card-base/50 p-2 rounded-2xl border border-border-base shadow-xl">
                            <div className="px-4 py-2 bg-bg-base rounded-xl border border-border-base text-[10px] font-black uppercase tracking-widest text-text-dim">
                                <Calendar className="w-3.5 h-3.5 inline mr-2 text-primary" /> Jan 22, 2024
                            </div>
                            <div className="px-4 py-2 bg-bg-base rounded-xl border border-border-base text-[10px] font-black uppercase tracking-widest text-text-dim">
                                <Clock className="w-3.5 h-3.5 inline mr-2 text-primary" /> 07:42 PM
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-card-base p-2 rounded-3xl border border-border-base shadow-2xl relative cursor-pointer group" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                             <div className="w-10 h-10 rounded-2xl overflow-hidden border border-border-base shadow-inner group-hover:border-primary/50 transition-colors">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff&bold=true`} alt="Admin" className="w-full h-full object-cover" />
                            </div>
                            <div className="pr-2 hidden sm:block">
                                <p className="text-[11px] font-black text-text-main uppercase tracking-tighter">{user?.name || 'Vanshu Verma'}</p>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] opacity-70">Super Administrator</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-text-dim transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                            
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-60 bg-card-base border border-border-base rounded-[2.5rem] shadow-3xl z-50 p-3 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-border-base/50 mb-2">
                                            <p className="text-[9px] font-black text-text-dim uppercase tracking-[.3em] mb-1">System Access</p>
                                            <p className="text-xs font-black text-text-main uppercase tracking-tight">{user?.email || 'admin@schoolpro.com'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                                <SettingsIcon className="w-4 h-4" /> Security Settings
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    dispatch(logout());
                                                    navigate('/login');
                                                }}
                                                className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                             >
                                                <LogOut className="w-4 h-4" /> Terminate Session
                                             </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Module Fast-Switcher (Desktop Only) */}
                <div className="hidden xl:flex items-center gap-1.5 p-2 bg-card-base/40 backdrop-blur-3xl border border-border-base rounded-[2.5rem] overflow-x-auto thin-scrollbar no-scrollbar scroll-smooth">
                    {[
                        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                        { id: 'students', label: 'Students', icon: GraduationCap },
                        { id: 'teachers', label: 'Teachers', icon: UserCheck },
                        { id: 'parents', label: 'Parents', icon: Users },
                        { id: 'staff', label: 'Staff', icon: Briefcase },
                        { id: 'academic', label: 'Academic', icon: BookOpen },
                        { id: 'attendance', label: 'Attendance', icon: Activity },
                        { id: 'finance', label: 'Treasury', icon: DollarSign },
                        { id: 'exams', label: 'Exams', icon: FileText },
                        { id: 'resources', label: 'Inventory', icon: Database },
                        { id: 'communication', label: 'Broadcast', icon: Bell },
                        { id: 'reports', label: 'Analytics', icon: TrendingUp },
                        { id: 'system', label: 'Security', icon: ShieldCheck },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap group ${
                                activeTab === tab.id 
                                ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105' 
                                : 'text-text-dim hover:text-text-main hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : 'text-primary'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sub-Header / Utility Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-bg-base/50 p-4 rounded-[2rem] border border-border-base/30">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">Global Node Search</span>
                        <div className="h-8 w-[1px] bg-border-base mx-2" />
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim group-focus-within:text-primary transition-colors" />
                            <input type="text" placeholder="Jump to student or teacher..." className="bg-transparent border-none focus:outline-none text-[10px] font-bold text-text-main pl-10 pr-4 py-1 w-64 uppercase tracking-widest" />
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button className="p-3 bg-card-base border border-border-base rounded-xl text-text-dim hover:text-primary transition-all"><Bell className="w-4 h-4" /></button>
                        <button className="p-3 bg-card-base border border-border-base rounded-xl text-text-dim hover:text-primary transition-all"><SettingsIcon className="w-4 h-4" /></button>
                     </div>
                </div>

                {/* Main Dynamic Viewport */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-[600px]"
                >
                    {renderContent()}
                </motion.div>
            </div>

            {/* Global Modals */}
            <Modal isOpen={showAddStudent} onClose={() => setShowAddStudent(false)} title="New Student Registration">
                <AddStudentForm onClose={() => setShowAddStudent(false)} />
            </Modal>

            <Modal isOpen={showAddTeacher} onClose={() => setShowAddTeacher(false)} title="Faculty Appointment">
                <AddTeacherForm onClose={() => setShowAddTeacher(false)} />
            </Modal>
        </div>
    );
};

export default AdminPanel;
