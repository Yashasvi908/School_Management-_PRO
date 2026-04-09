import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronLeft, ShieldAlert, Cpu, Search, Activity, Zap, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [override, setOverride] = useState(false);

    return (
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4 md:p-10 text-center relative overflow-hidden font-sans">
            {/* Background Hyper-Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-8 md:p-16 rounded-[4rem] border border-white/10 max-w-4xl w-full relative z-10 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Critical Alert Bar */}
                <div className="absolute top-0 left-0 w-full overflow-hidden h-1">
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="w-1/3 h-full bg-gradient-to-r from-transparent via-rose-500 to-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left: Error Status */}
                    <div className="lg:col-span-7 text-left space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full mb-6">
                                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Critical: Route Integrity Failure</span>
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black text-text-main tracking-tighter leading-none mb-2">404</h1>
                            <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter">Node <span className="text-rose-500">De-Synchronized</span></h2>
                            <p className="text-[11px] font-bold text-text-dim uppercase tracking-[0.3em] mt-4 leading-relaxed max-w-md">
                                Protocol mismatch detected. The requested data stream is unreachable within the current educational cluster parameters.
                            </p>
                        </div>

                        {/* Interactive Scan Progress */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">Active System Scan</span>
                                <span className="text-[9px] font-black text-primary animate-pulse uppercase tracking-widest">98% Recovered</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    transition={{ duration: 3, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-primary to-rose-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="px-8 py-5 bg-bg-base/50 border border-border-base rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-text-main transition-all flex items-center gap-3 backdrop-blur-xl group"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Revert Stream
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="px-10 py-5 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 border border-white/10 group"
                            >
                                <Home className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Emergency Hub
                            </button>
                        </div>
                    </div>

                    {/* Right: Technical Diagnostics */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Auth Layer', val: 'SECURE', color: 'text-emerald-500', icon: ShieldAlert },
                                { label: 'Database', val: 'ALIVE', color: 'text-primary', icon: Cpu },
                                { label: 'Storage', val: 'FULL', color: 'text-amber-500', icon: Search },
                                { label: 'Cluster', val: 'SYNCING', color: 'text-rose-500', icon: Activity },
                            ].map((s, i) => (
                                <div key={i} className="bg-black/20 border border-white/5 rounded-[2rem] p-5 hover:bg-black/30 transition-all group">
                                    <s.icon className={`w-5 h-5 ${s.color} mb-3 opacity-50 group-hover:opacity-100 transition-opacity`} />
                                    <p className="text-[7px] font-black text-text-dim uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className={`text-[10px] font-black uppercase ${s.color} tracking-tighter`}>{s.val}</p>
                                </div>
                            ))}

                            {/* Cluster Topology Visualization */}
                            <div className="bg-black/20 border border-white/5 rounded-[2.5rem] p-6 text-left relative overflow-hidden group col-span-2">
                                <h5 className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                                    <Database className="w-3 h-3" /> Topology :: Cluster_84
                                </h5>
                                <div className="flex justify-between items-center px-4 py-2 relative">
                                    <div className="absolute inset-0 flex items-center px-10 pointer-events-none opacity-20">
                                        <div className="w-full h-px bg-gradient-to-r from-emerald-500 via-rose-500 to-emerald-500" />
                                    </div>
                                    
                                    {[
                                        { id: 'AUTH', status: 'online', color: 'bg-emerald-500' },
                                        { id: 'GATE', status: 'online', color: 'bg-emerald-500' },
                                        { id: 'ROUTE', status: 'error', color: 'bg-rose-500 animate-pulse' },
                                        { id: 'HUB', status: 'online', color: 'bg-emerald-500' },
                                    ].map((node, i) => (
                                        <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-8 h-8 rounded-xl ${node.color} flex items-center justify-center shadow-lg shadow-${node.status === 'online' ? 'emerald' : 'rose'}-500/20 border border-white/10`}>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                            <span className="text-[6px] font-black uppercase text-text-dim opacity-50">{node.id}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Deep Trace Terminal (Mini) */}
                        <div className="bg-black/60 border border-white/5 rounded-[2.5rem] p-6 text-left font-mono relative overflow-hidden h-40 flex flex-col group">
                            <div className="flex gap-1.5 mb-4 border-b border-white/5 pb-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/30" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                                <span className="text-[8px] font-black text-text-dim uppercase ml-2 opacity-50">Log :: STACK_TRACE</span>
                            </div>
                            <div className="space-y-2 overflow-hidden">
                                {override && (
                                    <p className="text-[8px] text-amber-500 font-black uppercase leading-none animate-pulse">
                                        {'>>>'} MANUAL_OVERRIDE_ENGAGED_BY_ADMIN
                                    </p>
                                )}
                                <p className="text-[8px] text-emerald-500 font-bold uppercase leading-none">
                                    {'>'} ROUTE_RECOVERY_ENGAGED
                                </p>
                                <p className="text-[8px] text-text-dim font-bold uppercase leading-none">
                                    {'>'} SCANNING: {location.pathname}
                                </p>
                                <p className="text-[8px] text-rose-500 font-bold uppercase leading-none">
                                    {'>'} ERROR: NODE_404_MISMATCH
                                </p>
                                <p className="text-[8px] text-primary font-bold uppercase leading-none">
                                    {'>'} TRACING SOURCE_CLUSTER_{override ? '8G_EXPANDED' : '7G'}
                                </p>
                            </div>
                        </div>

                        {/* Manual Override Action */}
                        <button 
                            onClick={() => setOverride(!override)}
                            className={`w-full p-6 rounded-[2.5rem] border transition-all flex items-center justify-between group ${
                                override 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                                : 'bg-white/5 border-white/10 text-text-dim hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${override ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Manual Override</p>
                                    <p className="text-[8px] font-bold opacity-50 uppercase tracking-tighter">Force cluster re-sync</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${override ? 'bg-amber-500' : 'bg-white/10'}`}>
                                <motion.div 
                                    animate={{ x: override ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-6 opacity-30">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-dim">
                        <Cpu className="w-4 h-4" /> Node: CL-842
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-dim">
                        <Activity className="w-4 h-4" /> Heartbeat: <span className="text-emerald-500">Normal</span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" /> Connection Warning
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
