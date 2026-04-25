import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Download, 
    TrendingUp, 
    Clock,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../api/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const ParentResults = ({ selectedChildName }) => {
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChildrenResults();
    }, []);

    const fetchChildrenResults = async () => {
        try {
            const res = await axios.get('/parent/children-results');
            setAllResults(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Filter results for the currently selected child in the parent dashboard
    const filteredResults = allResults.filter(r => r.studentName === selectedChildName);

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
        doc.text(`PARENTAL ACADEMIC OVERSIGHT - ${result.studentName.toUpperCase()}`, 105, 50, { align: 'center' });
        
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
        
        doc.save(`${result.studentName}_${result.examName}_Result.pdf`);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredResults.length > 0 ? filteredResults.map((res, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={i} 
                        className="glass-card p-10 rounded-[3.5rem] border border-white/5 bg-[#0a0a20]/40 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{res.examName}</h4>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mt-3">{res.studentName} Assessment Node</p>
                            </div>
                            <div className={`p-4 rounded-2xl border transition-all ${res.isComplete ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 relative z-10">
                            {res.marks.map((m, idx) => (
                                <div key={idx} className="flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{m.subject}</span>
                                    <span className="text-xl font-black text-primary tracking-tighter">{m.obtained}<span className="text-[10px] text-text-dim ml-1">/ {m.max}</span></span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => downloadReportCard(res)}
                            disabled={!res.isComplete}
                            className={`w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all ${res.isComplete ? 'bg-primary text-white shadow-xl hover:scale-[1.03]' : 'bg-white/5 text-text-dim cursor-not-allowed border border-white/10'}`}
                        >
                            <Download size={18} /> {res.isComplete ? 'Download PDF Report' : 'In Progress'}
                        </button>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-32 text-center bg-card-base rounded-[4rem] border border-white/5">
                        <Award className="w-16 h-16 text-white/5 mx-auto mb-6" />
                        <h4 className="text-xl font-black text-white/20 uppercase tracking-[0.3em]">No Published Results for {selectedChildName}</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentResults;
