import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Users,
    Clock,
    AlertCircle,
    CheckCircle,
    Search,
    LayoutDashboard,
    Plus,
    History,
    Settings,
    Library as LibraryIcon,
    ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LibrarianPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { title: 'Total Books', value: '12,500', icon: LibraryIcon, color: 'bg-indigo-500' },
        { title: 'Issued Today', value: '45', icon: ArrowRightLeft, color: 'bg-emerald-500' },
        { title: 'Overdue Books', value: '28', icon: AlertCircle, color: 'bg-rose-500' },
        { title: 'New Stock', value: '120', icon: Plus, color: 'bg-amber-500' },
    ];

    const recentTransactions = [
        { id: 1, student: 'Alice Johnson', book: 'Physics Vol. 1', date: '2024-02-18', status: 'Issued', statusColor: 'text-emerald-500 bg-emerald-500/10' },
        { id: 2, student: 'Bob Smith', book: 'Classic Literature', date: '2024-02-17', status: 'Returned', statusColor: 'text-primary bg-primary/10' },
        { id: 3, student: 'Charlie Brown', book: 'Chemistry Basics', date: '2024-02-15', status: 'Overdue', statusColor: 'text-rose-500 bg-rose-500/10' },
        { id: 4, student: 'Diana Prince', book: 'World History', date: '2024-02-18', status: 'Issued', statusColor: 'text-emerald-500 bg-emerald-500/10' },
    ];

    const DashboardOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card p-6 rounded-[2.5rem] border border-border-base relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
                            <h3 className="text-3xl font-black text-text-main mt-2 tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700`}>
                            <stat.icon className={`w-16 h-16 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card p-0 rounded-[3rem] border border-border-base lg:col-span-2 overflow-hidden">
                    <div className="p-8 border-b border-border-base flex justify-between items-center">
                        <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">Issue / Return Log</h3>
                        <div className="relative w-48 md:w-64">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                            <input
                                type="text"
                                placeholder="Search history..."
                                className="w-full pl-10 pr-4 py-2 bg-bg-base/50 border border-border-base rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-card-base/50 text-[10px] font-black text-text-dim uppercase tracking-widest border-b border-border-base">
                                    <th className="px-8 py-4">Borrower</th>
                                    <th className="px-8 py-4">Resource</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-base">
                                {recentTransactions.map((item) => (
                                    <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-8 py-5 text-sm font-bold text-text-main">{item.student}</td>
                                        <td className="px-8 py-5 text-sm text-text-dim font-medium">{item.book}</td>
                                        <td className="px-8 py-5 text-xs text-text-dim font-bold">{item.date}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-[3rem] border border-border-base relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <LibraryIcon className="w-24 h-24 text-primary" />
                        </div>
                        <h3 className="text-lg font-black text-text-main uppercase tracking-tighter mb-4">Stock Vitality</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-black text-primary tracking-tighter">98%</div>
                            <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest leading-tight">Available<br/>Resources</div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-dim">
                                <span>Categories</span>
                                <span>24 Active</span>
                            </div>
                            <div className="h-1.5 w-full bg-border-base rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-4/5 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[3rem] border border-border-base">
                        <h3 className="text-lg font-black text-text-main uppercase tracking-tighter mb-6">Operations</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Register Book', icon: Plus, color: 'text-primary' },
                                { label: 'Issue Log', icon: ArrowRightLeft, color: 'text-emerald-500' },
                                { label: 'Audit Assets', icon: History, color: 'text-amber-500' }
                            ].map((op, i) => (
                                <button key={i} className="w-full p-4 rounded-2xl bg-bg-base/50 border border-border-base flex items-center justify-between group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl bg-card-base ${op.color}`}>
                                            <op.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{op.label}</span>
                                    </div>
                                    <Clock className="w-3.5 h-3.5 text-text-dim group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            default: return (
                <div className="glass-card p-20 rounded-[3rem] border-border-base flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                    <BookOpen className="w-20 h-20 text-text-dim/20 mb-6" />
                    <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase">{activeTab.replace('-', ' ')}</h3>
                    <p className="text-text-dim font-bold mt-2 text-lg">Library catalog and transaction system expansion in progress.</p>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10 max-w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-2 min-w-0 overflow-hidden">
                <div className="flex-shrink-0">
                     <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Librarian <span className="text-primary">Vault</span></h1>
                     <p className="text-text-dim font-bold text-[10px] md:text-sm tracking-widest mt-2 uppercase opacity-60">Curating Knowledge & Asset Integrity</p>
                </div>
                <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                    <button className="flex-1 sm:flex-none px-6 py-4 bg-primary text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-105 transition-all whitespace-nowrap">Procure New Media</button>
                    <button 
                        onClick={() => navigate('/settings')}
                        className="p-4 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-primary transition-colors flex-shrink-0"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Responsive Tab Navigation */}
            <div className="relative mx-2 min-w-0 max-w-full">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-base/20 to-transparent z-10 pointer-events-none lg:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-base/20 to-transparent z-10 pointer-events-none lg:hidden" />
                <div className="flex bg-card-base p-2 rounded-[2rem] border border-border-base shadow-inner overflow-x-auto thin-scrollbar gap-2 scroll-smooth">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'books', label: 'Inventory', icon: BookOpen },
                        { id: 'issue-return', label: 'Traffic', icon: ArrowRightLeft },
                        { id: 'records', label: 'Logs', icon: History },
                        { id: 'reports', label: 'Analytics', icon: AlertCircle }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-5 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-[1.8rem] transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-primary text-white shadow-2xl shadow-primary/30' 
                                : 'text-text-dim hover:bg-bg-base hover:text-text-main'
                            }`}
                        >
                            <tab.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeTab === tab.id ? 'text-white' : 'text-text-dim'}`} />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default LibrarianPanel;
