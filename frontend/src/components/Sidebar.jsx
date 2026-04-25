import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    GraduationCap,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    BookOpen,
    DollarSign,
    FileText,
    MessageCircle,
    CheckCircle,
    Upload,
    Bus,
    Video,
    User,
    ChevronLeft,
    ChevronDown,
    TrendingUp,
    Activity,
    Clock,
    ClipboardList,
    Download,
    Bell,
    Contact,
    Layers,
    BookMarked,
    ShieldCheck,
    BarChart3,
    PieChart,
    Briefcase,
    LayoutDashboard,
    Mail,
    UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import ThemeToggle from './common/ThemeToggle';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth || {});
    const role = user?.role || 'admin';


    const [expandedGroups, setExpandedGroups] = useState(['User Management', 'Dashboard']);

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => 
            prev.includes(groupName) 
            ? prev.filter(g => g !== groupName) 
            : [...prev, groupName]
        );
    };

    const menuGroups = [
        {
            group: 'Main',
            items: [
                { title: 'Dashboard', icon: Home, path: '/', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent', 'accountant', 'librarian'] },
            ]
        },
        {
            group: 'Management',
            icon: Users,
            items: [
                { title: 'Students', icon: GraduationCap, path: role === 'student' ? '/student-dashboard' : '/students', roles: ['superadmin', 'principal', 'admin'] },

                { title: 'Teachers', icon: UserCheck, path: '/teachers', roles: ['superadmin', 'principal', 'admin'] },
                { title: 'Staff', icon: Briefcase, path: '/staff', roles: ['superadmin', 'principal', 'admin'] },
                { title: 'Parents', icon: Users, path: '/parents', roles: ['superadmin', 'principal', 'admin'] },
            ]
        },
        {
            group: 'Academic',
            icon: BookMarked,
            items: [
                { title: 'Classes', icon: Layers, path: '/classes', roles: ['superadmin', 'principal', 'admin', 'teacher'] },
                { title: 'Sections', icon: LayoutDashboard, path: '/sections', roles: ['superadmin', 'principal', 'admin'] },
                { title: 'Subjects', icon: BookOpen, path: '/subjects', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student'] },
                { title: 'Timetable', icon: Clock, path: '/timetable', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent'] },
            ]
        },
        {
            group: 'Examination',
            icon: FileText,
            items: [
                { title: 'Exams', icon: ClipboardList, path: '/exams', roles: ['superadmin', 'principal', 'admin', 'teacher'] },
                { title: 'Results', icon: CheckCircle, path: '/results', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent'] },
            ]
        },
        {
            group: 'Operations',
            icon: Settings,
            items: [
                { title: 'Attendance', icon: Calendar, path: '/attendance', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent'] },
                { title: 'Fees', icon: DollarSign, path: '/fees', roles: ['superadmin', 'principal', 'admin', 'accountant', 'parent'] },
                { title: 'Library', icon: BookOpen, path: '/library', roles: ['superadmin', 'principal', 'admin', 'librarian', 'teacher', 'student'] },
                { title: 'Transport', icon: Bus, path: '/transport', roles: ['superadmin', 'principal', 'admin', 'parent', 'teacher', 'student'] },
            ]
        },
        {
            group: 'Communication',
            icon: MessageCircle,
            items: [
                { title: 'Notices', icon: Bell, path: '/notices', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent'] },
                { title: 'Events', icon: Calendar, path: '/events', roles: ['superadmin', 'principal', 'admin'] },
                { title: 'Chat', icon: MessageCircle, path: '/chat', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent'] },
            ]
        },
        {
            group: 'System',
            icon: ShieldCheck,
            items: [
                { title: 'Reports', icon: TrendingUp, path: '/analytics', roles: ['superadmin', 'principal', 'admin', 'accountant'] },
                { title: 'Security', icon: ShieldCheck, path: '/security', roles: ['superadmin', 'principal', 'admin'] },
                { title: 'Settings', icon: Settings, path: '/settings', roles: ['superadmin', 'principal', 'admin', 'teacher', 'student', 'parent', 'accountant', 'librarian'] },
                { title: 'Backup', icon: Download, path: '/backup', roles: ['superadmin'] },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.div
                className={`fixed left-0 top-0 md:relative h-full bg-card-base backdrop-blur-3xl border-r border-border-base shadow-3xl z-50 w-72 md:translate-x-0 transition-transform duration-500 cubic-bezier(0.25, 0.8, 0.25, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col font-sans transition-colors duration-300`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between px-6 py-8">
                    <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="w-11 h-11 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/20 z-10 relative group-hover:rotate-6 transition-transform duration-500">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-text-main tracking-tighter leading-none">School Pro</h1>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-0.5 opacity-80">Dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 px-4 space-y-4 overflow-y-auto thin-scrollbar pb-6 mt-2">
                    {menuGroups.map((group, groupIdx) => {
                        const filteredItems = group.items.filter(item => item.roles.includes(role));
                        if (filteredItems.length === 0) return null;

                        const isExpanded = expandedGroups.includes(group.group);
                        const hasActiveItem = filteredItems.some(item => isActive(item.path));

                        if (group.group === 'Main') {
                            return filteredItems.map((item, idx) => {
                                const active = isActive(item.path);
                                return (
                                    <SidebarButton 
                                        key={idx} 
                                        item={item} 
                                        active={active} 
                                        navigate={navigate} 
                                        toggleSidebar={toggleSidebar} 
                                    />
                                );
                            });
                        }

                        return (
                            <div key={groupIdx} className="space-y-1">
                                <button
                                    onClick={() => toggleGroup(group.group)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                                        hasActiveItem || isExpanded ? 'text-text-main' : 'text-text-dim hover:text-text-main'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`p-2 rounded-lg transition-colors ${
                                            hasActiveItem ? 'bg-primary/10 text-primary' : 'bg-transparent text-text-dim group-hover:text-text-main'
                                        }`}>
                                            {group.icon && <group.icon className="w-4.5 h-4.5" />}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.15em]">{group.group}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden space-y-1 ml-4 border-l border-border-base/50"
                                        >
                                            {filteredItems.map((item, idx) => {
                                                const active = isActive(item.path);
                                                return (
                                                    <SidebarButton 
                                                        key={idx} 
                                                        item={item} 
                                                        active={active} 
                                                        navigate={navigate} 
                                                        toggleSidebar={toggleSidebar}
                                                        isSubItem={true}
                                                    />
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* User Profile Section */}
                <div className="p-4 mx-4 mb-4 bg-bg-base/50 rounded-[1.5rem] border border-border-base relative overflow-hidden group transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>

                    <div className="flex items-center gap-3 relative z-10 mb-3 cursor-pointer" onClick={() => navigate('/settings')}>
                        <div className="relative">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Administrator')}&background=6366f1&color=fff&bold=true`}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border border-border-base shadow-2xl object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card-base rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-text-main tracking-tight truncate">{user?.name || 'Vanshu Verma'}</h4>
                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{role}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            dispatch(logout());
                            navigate('/login');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-card-base border border-border-base text-text-dim text-[11px] font-bold rounded-xl hover:border-primary/30 hover:bg-primary/10 hover:text-text-main transition-all duration-300 shadow-sm"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Profile</span>
                    </button>
                </div>
            </motion.div>
        </>
    );
};

const SidebarButton = ({ item, active, navigate, toggleSidebar, isSubItem = false }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 768) toggleSidebar();
            }}
            className={`relative flex items-center gap-3.5 px-4 py-3 w-full rounded-2xl transition-all duration-300 group ${isSubItem ? 'pl-6' : ''} ${active
                ? 'bg-primary/10 text-text-main shadow-inner'
                : 'text-text-dim hover:bg-bg-base/50 hover:text-text-main'
                }`}
        >
            {active && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
            )}

            <item.icon className={`transition-all duration-300 ${isSubItem ? 'w-4 h-4' : 'w-5 h-5'} ${active ? 'text-primary drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'text-text-dim group-hover:text-text-main'}`} />
            <span className={`relative z-10 font-semibold tracking-tight ${isSubItem ? 'text-[13px]' : 'text-[14px]'}`}>{item.title}</span>

            {active && (
                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            )}
        </motion.button>
    );
};

export default Sidebar;
