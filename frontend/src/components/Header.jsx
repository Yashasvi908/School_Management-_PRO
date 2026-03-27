import React from 'react';
import { Bell, Search, Menu, MessageCircle, LogOut, User } from 'lucide-react';
import ThemeToggle from './common/ThemeToggle';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Header = ({ toggleSidebar }) => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role || 'Administrator';

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

                    <button className="relative p-2.5 hover:bg-white/10 rounded-xl text-text-dim hover:text-text-main transition-all group">
                        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-bg-base shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                    </button>
                </div>

                {/* Admin Profile Dropdown - Simplified for Layout but visually premium */}
                <div className="flex items-center gap-4 pl-2 md:pl-5 md:border-l border-border-base/50 group cursor-pointer">
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
                </div>
            </div>
        </header>
    );
};

export default Header;
