import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    FileText,
    AlertCircle,
    LayoutDashboard,
    Wallet,
    History,
    Settings,
    Receipt,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const AccountantPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { title: 'Total Revenue', value: '₹12.4L', change: '+12%', icon: Wallet, color: 'bg-emerald-500' },
        { title: 'Pending Fees', value: '₹45K', change: '-5%', icon: AlertCircle, color: 'bg-amber-500' },
        { title: 'Expenses', value: '₹8.5L', change: '+8%', icon: CreditCard, color: 'bg-rose-500' },
        { title: 'Invoices', value: '1,250', change: '+15%', icon: FileText, color: 'bg-indigo-500' },
    ];

    const feeCollectionData = [
        { name: 'Jan', collected: 120000, pending: 20000 },
        { name: 'Feb', collected: 135000, pending: 15000 },
        { name: 'Mar', collected: 140000, pending: 18000 },
        { name: 'Apr', collected: 110000, pending: 35000 },
        { name: 'May', collected: 155000, pending: 12000 },
        { name: 'Jun', collected: 160000, pending: 10000 },
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
                <div className="glass-card p-8 rounded-[3rem] border border-border-base lg:col-span-2">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-primary" /> Collection Trends
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={feeCollectionData}>
                                <defs>
                                    <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '16px', border: '1px solid var(--border-base)', color: 'var(--text-main)' }} />
                                <Area type="monotone" dataKey="collected" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorColl)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[3rem] border border-border-base">
                    <h3 className="text-lg font-black text-text-main uppercase tracking-tighter mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Collect Fee', icon: Receipt, color: 'text-emerald-500' },
                            { label: 'Generate Receipt', icon: FileText, color: 'text-indigo-500' },
                            { label: 'Add Expense', icon: CreditCard, color: 'text-rose-500' },
                            { label: 'View Reports', icon: PieChartIcon, color: 'text-amber-500' }
                        ].map((action, i) => (
                            <button key={i} className="w-full p-4 rounded-2xl bg-bg-base/50 border border-border-base flex items-center gap-4 group hover:border-primary/30 transition-all text-left">
                                <div className={`p-3 rounded-xl bg-card-base ${action.color}`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-text-main group-hover:text-primary transition-colors">{action.label}</span>
                            </button>
                        ))}
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
                    <DollarSign className="w-20 h-20 text-text-dim/20 mb-6" />
                    <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase">{activeTab.replace('-', ' ')}</h3>
                    <p className="text-text-dim font-bold mt-2 text-lg">Financial records and management module under development.</p>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10 max-w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-2 min-w-0 overflow-hidden">
                <div className="flex-shrink-0">
                     <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">Accountant <span className="text-primary">Ledger</span></h1>
                     <p className="text-text-dim font-bold text-[10px] md:text-sm tracking-widest mt-2 uppercase opacity-60">Financial Integrity & Fiscal Management</p>
                </div>
                <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                    <button className="flex-1 sm:flex-none px-6 py-4 bg-primary text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-105 transition-all whitespace-nowrap">Export Monthly Report</button>
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
                        { id: 'structure', label: 'Fee Structure', icon: Wallet },
                        { id: 'collect', label: 'Collect Fees', icon: Receipt },
                        { id: 'records', label: 'Fee Records', icon: History },
                        { id: 'reports', label: 'Financial Reports', icon: FileText }
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AccountantPanel;
