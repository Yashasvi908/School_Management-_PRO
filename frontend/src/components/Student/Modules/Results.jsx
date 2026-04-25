import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Download, 
    CheckCircle, 
    AlertCircle, 
    FileText, 
    TrendingUp, 
    BookOpen,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../api/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyResults();
    }, []);

    const fetchMyResults = async () => {
        try {
            const res = await axios.get('/student/my-results');
            setResults(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const downloadReportCard = (result) => {
        if (!result.isComplete) {
            toast.warning('Evaluation in progress. Certified Report Card will be available once all subjects are synced.');
            return;
        }

        const doc = new jsPDF();
        doc.setFillColor(30, 30, 30);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text(result.examName.toUpperCase(), 105, 25, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`CERTIFIED PERFORMANCE RECORD`, 105, 50, { align: 'center' });
        
        doc.autoTable({
            startY: 65,
            head: [['Subject Registry', 'Obtained', 'Maximum', 'Status']],
            body: result.marks.map(m => [
                m.subject,
                m.obtained,
                m.max,
                m.obtained >= 33 ? 'QUALIFIED' : 'RE-EVALUATION'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }
        });

        const totalObtained = result.marks.reduce((s, m) => s + m.obtained, 0);
        const totalMax = result.marks.reduce((s, m) => s + m.max, 0);
        const percentage = ((totalObtained / totalMax) * 100).toFixed(1);

        doc.setFontSize(16);
        doc.text(`Aggregate Score: ${percentage}%`, 150, doc.lastAutoTable.finalY + 20);
        
        doc.save(`${result.examName}_Result.pdf`);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="bg-card-base p-8 rounded-[2.5rem] border border-border-base relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <Award className="w-8 h-8 text-indigo-500" /> My <span className="text-indigo-500 text-glow">Performance</span> Vault
                    </h3>
                    <p className="text-text-dim text-[11px] font-bold uppercase tracking-[0.3em] mt-2">Verified Academic Achievements</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.length > 0 ? results.map((res, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className="glass-card p-10 rounded-[3.5rem] border border-white/5 bg-[#0a0a20]/60 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-indigo-500 transition-colors">{res.examName}</h4>
                                <div className="flex items-center gap-3 mt-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${res.isComplete ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                        {res.isComplete ? 'Evaluation Certified' : 'Sync In-Progress'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                <TrendingUp className="w-6 h-6 text-indigo-500" />
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 relative z-10">
                            {res.marks.map((m, idx) => (
                                <div key={idx} className="flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border border-white/5 transition-all hover:bg-white/[0.05]">
                                    <div>
                                        <p className="text-[12px] font-black text-white uppercase tracking-widest leading-none">{m.subject}</p>
                                        <div className="w-32 h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${m.obtained}%` }} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-indigo-400 tracking-tighter">{m.obtained}<span className="text-[10px] text-text-dim ml-1">/ {m.max}</span></p>
                                    </div>
                                </div>
                            ))}
                            {res.marks.length === 0 && <p className="text-center py-6 text-[11px] font-bold text-text-dim uppercase italic">Zero Subject Nodes Registered</p>}
                        </div>

                        <button 
                            onClick={() => downloadReportCard(res)}
                            disabled={!res.isComplete}
                            className={`w-full py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all ${res.isComplete ? 'bg-indigo-600 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-[1.03]' : 'bg-white/5 text-text-dim cursor-not-allowed border border-white/10'}`}
                        >
                            <Download size={18} /> {res.isComplete ? 'Decrypt Report Card' : 'Evaluation Pending'}
                        </button>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-40 text-center bg-card-base rounded-[4rem] border border-white/5 shadow-2xl">
                        <Award className="w-20 h-20 text-white/5 mx-auto mb-8" />
                        <h4 className="text-2xl font-black text-white/20 uppercase tracking-[0.3em] italic">No Assessment Streams Found</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentResults;
