import React, { useState } from 'react';

import { Bell, Search, Menu, MessageCircle, LogOut, User } from 'lucide-react';
import ThemeToggle from './common/ThemeToggle';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ toggleSidebar }) => {
    const { user } = useSelector((state) => state.auth || {});
    const role = user?.role || 'Administrator';

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notifications = [
        { id: 1, title: 'New Student Enrollment', time: '5 mins ago', type: 'student', active: true },
        { id: 2, title: 'Fee Payment Received', time: '1 hour ago', type: 'finance', active: false },
        { id: 3, title: 'Library Book Overdue', time: '2 hours ago', type: 'library', active: true },
    ];

    return (
        <header className="bg-card-base/40 backdrop-blur-2xl sticky top-0 z-30 border-b border-border-base px-6 py-4 flex items-center justify-between transition-colors duration-300 min-w-0 overflow-hidden">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 hover:bg-white/10 rounded-xl md:hidden text-text-dim hover:text-text-main transition-colors border border-transparent hover:border-border-base"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                {/* Premium Search Bar */}
                <div className="relative hidden md:flex items-center group w-96">
                    <Search className="w-4.5 h-4.5 absolute left-4 text-text-dim group-focus-within:text-primary transition-colors z-10" />
                    <input
                        type="text"
                        placeholder="Search students, teachers, reports..."
                        className="pl-12 pr-4 py-3 bg-bg-base/50 border border-border-base rounded-[1.25rem] text-sm text-text-main placeholder-text-dim/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.05] focus:border-primary/30 w-full transition-all duration-300 shadow-inner group-hover:border-border-base/80"
                    />
                    <div className="absolute right-3 px-1.5 py-0.5 bg-card-base border border-border-base rounded-md text-[10px] font-bold text-text-dim/60 group-focus-within:opacity-0 transition-opacity">
                        ⌘K
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-5">
                <div className="flex items-center gap-1.5 md:gap-3 px-2 py-1.5 bg-bg-base/30 rounded-2xl border border-border-base/50">
                    <ThemeToggle />
                    
                    <div className="w-[1px] h-6 bg-border-base mx-1 hidden md:block"></div>

                    <button className="relative p-2.5 hover:bg-white/10 rounded-xl text-text-dim hover:text-text-main transition-all group">
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full ring-2 ring-bg-base shadow-[0_0_8px_rgba(236,72,153,0.6)]"></span>
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className={`relative p-2.5 rounded-xl transition-all group ${isNotificationOpen ? 'bg-primary text-white' : 'text-text-dim hover:bg-white/10 hover:text-text-main'}`}
                        >
                            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-bg-base shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                        </button>

                        <AnimatePresence>
                            {isNotificationOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-80 bg-card-base border border-border-base rounded-[2rem] shadow-2xl overflow-hidden p-2 z-50"
                                >
                                    <div className="p-4 border-b border-border-base flex justify-between items-center bg-bg-base/30">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main">Notifications</h4>
                                        <button className="text-[9px] font-bold text-primary uppercase">Mark all read</button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto no-scrollbar py-2">
                                        {notifications.map((n) => (
                                            <div key={n.id} className="p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.active ? 'bg-primary/10 text-primary' : 'bg-bg-base text-text-dim'}`}>
                                                    <Bell className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">{n.title}</p>
                                                    <p className="text-[9px] font-bold text-text-dim uppercase mt-1">{n.time}</p>
                                                </div>
                                                {n.active && <div className="w-2 h-2 bg-primary rounded-full mt-2 ring-4 ring-primary/10"></div>}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-bg-base/50 text-[10px] font-black uppercase text-text-dim hover:text-primary transition-colors">See all alerts</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Admin Profile Dropdown */}
                <div 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative flex items-center gap-4 pl-2 md:pl-5 md:border-l border-border-base/50 group cursor-pointer"
                >
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-black text-text-main tracking-tight group-hover:text-primary transition-colors">{user?.name || 'Vanshu Verma'}</p>
                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.15em] opacity-70">{role}</p>
                    </div>
                    
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl p-[2px] bg-gradient-to-tr from-primary via-secondary to-primary animate-gradient-xy group-hover:rotate-6 transition-transform duration-500">
                             <div className="w-full h-full rounded-[0.85rem] bg-bg-base flex items-center justify-center overflow-hidden">
                                <img 
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Vanshu Verma')}&background=6366f1&color=fff&bold=true`} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                />
                             </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-bg-base rounded-full shadow-lg"></div>
                    </div>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-4 w-60 bg-card-base border border-border-base rounded-[2rem] shadow-2xl overflow-hidden p-2 z-50"
                            >
                                <div className="p-4 space-y-1">
                                    {[
                                        { label: 'Profile', icon: User, path: '/settings' },
                                        { label: 'Settings', icon: Search, path: '/settings' },
                                        { label: 'Logout', icon: LogOut, path: '/login', danger: true },
                                    ].map((item, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => window.location.href = item.path}
                                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.danger ? 'text-rose-500 hover:bg-rose-500/10' : 'text-text-main hover:bg-white/5'}`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
