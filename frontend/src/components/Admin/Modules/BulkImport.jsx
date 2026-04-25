import React, { useState } from 'react';
import { Upload, FileText, Download, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';

const BulkImport = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleDownloadTemplate = () => {
        window.open(`${api.defaults.baseURL}/admin/students/bulk-template`, '_blank');
    };

    const handleDownloadSpecs = async () => {
        try {
            const res = await api.get('/admin/students/bulk-specs');
            if (res.data.success) {
                // Formatting specs for a pretty alert or modal
                const specList = res.data.data.requiredFields
                    .map(f => `${f.field}: ${f.validation}`)
                    .join('\n');
                alert(`DATA SPECIFICATIONS:\n\n${specList}`);
            }
        } catch (err) {
            alert('Failed to fetch specs');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/admin/students/bulk-import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setResults(res.data.data);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Import failed');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
        } else {
            alert('Please select a valid Excel (.xlsx) file');
        }
    };

    if (results) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-card-base p-8 rounded-[3rem] border border-border-base text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">Import Cycle Complete</h3>
                    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                        <div className="p-4 bg-bg-base rounded-2xl border border-border-base">
                            <p className="text-[10px] font-black text-text-dim uppercase">Total</p>
                            <span className="text-sm font-black text-text-main">{results.total}</span>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <p className="text-[10px] font-black text-emerald-500 uppercase">Success</p>
                            <span className="text-sm font-black text-emerald-500">{results.imported}</span>
                        </div>
                        <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                            <p className="text-[10px] font-black text-rose-500 uppercase">Failed</p>
                            <span className="text-sm font-black text-rose-500">{results.failed}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                    <div className="px-8 py-5 bg-bg-base/50 border-b border-border-base flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest">Generated Credentials</h4>
                        <button className="text-[10px] font-black text-primary uppercase flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Download Log</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                        <table className="w-full text-left">
                            <tbody>
                                {results.credentials?.map((cred, i) => (
                                    <tr key={i} className="border-b border-border-base/30 last:border-0">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-text-main">{cred.name}</p>
                                            <p className="text-[10px] font-black text-text-dim uppercase">{cred.studentId}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full font-mono">{cred.password}</span>
                                        </td>
                                    </tr>
                                ))}
                                {results.errors?.map((err, i) => (
                                    <tr key={`err-${i}`} className="border-b border-rose-500/30 last:border-0 bg-rose-500/5">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-rose-500">Row {err.line} Failed</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] font-black text-rose-400 uppercase">{err.reason}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button onClick={() => setResults(null)} className="w-full py-5 bg-text-main text-bg-base text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl">Initialize New Import</button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[3rem] text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto">
                    <FileText className="w-10 h-10 text-indigo-500" />
                </div>
                <div>
                    <h4 className="text-xl font-black text-text-main uppercase tracking-tighter">Bulk Registry Port</h4>
                    <p className="text-xs font-bold text-text-dim tracking-widest opacity-60 uppercase mt-2">Upload student directory in .XLSX format</p>
                </div>
                
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-border-base text-text-main text-[9px] font-black uppercase rounded-xl hover:bg-white/10 transition-all"
                    >
                        <Download className="w-4 h-4 text-primary" /> Template.xlsx
                    </button>
                    <button 
                        onClick={handleDownloadSpecs}
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-border-base text-text-main text-[9px] font-black uppercase rounded-xl hover:bg-white/10 transition-all"
                    >
                        <AlertCircle className="w-4 h-4 text-amber-500" /> Data Specs
                    </button>
                </div>
            </div>

            <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
                className={`relative h-64 border-2 border-dashed rounded-[3rem] transition-all flex flex-col items-center justify-center gap-4 ${file ? 'border-primary bg-primary/5' : 'border-border-base hover:border-primary/50 bg-card-base'}`}
            >
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                {!file ? (
                    <>
                        <div className="w-16 h-16 bg-bg-base rounded-2xl flex items-center justify-center text-text-dim"><Upload className="w-8 h-8" /></div>
                        <p className="text-xs font-black text-text-dim uppercase tracking-widest">Drag & Drop or click to browse</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary"><FileText className="w-8 h-8" /></div>
                        <div className="text-center">
                             <p className="text-sm font-black text-text-main uppercase tracking-tight">{file.name}</p>
                             <p className="text-[10px] font-bold text-text-dim uppercase mt-1">{(file.size / 1024).toFixed(1)} KB Ready</p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-2 bg-rose-500/10 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                    </>
                )}
            </div>

            {file && (
                <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-6 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? 'Processing Registry...' : 'Execute Bulk Migration'}
                </button>
            )}
        </div>
    );
};

export default BulkImport;
