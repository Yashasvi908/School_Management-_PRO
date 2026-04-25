import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Upload, 
    Download, 
    Search, 
    Trash2, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import api from '../../../api/axios';

const ParentManagement = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null);

    const fetchParents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/parents');
            if (res.data.success) setParents(res.data.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        setStatus({ type: 'info', message: 'Uploading...' });

        try {
            const res = await api.post('/admin/parents/import', formData);
            if (res.data.success) {
                setStatus({ type: 'success', message: res.data.message });
                fetchParents();
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Import failed' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-card-base p-8 rounded-[2rem] border border-border-base shadow-xl">
                <div>
                    <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter">Parent Registry</h2>
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-[.2em] mt-1 flex items-center gap-2">
                        <ShieldCheck size={12} className="text-emerald-500" /> Secure Family Access
                    </p>
                </div>
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase rounded-xl cursor-pointer">
                        <Upload size={14} /> {uploading ? 'Processing...' : 'Import Excel'}
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx" />
                    </label>
                </div>
            </div>

            {status && (
                <div className={`p-4 rounded-xl border text-[10px] font-black uppercase ${status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                    {status.message}
                </div>
            )}

            <div className="bg-card-base border border-border-base rounded-[2rem] overflow-hidden">
                <div className="p-6 border-b border-border-base/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input 
                            type="text" 
                            placeholder="Search parents..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-bg-base/50 border border-border-base rounded-xl text-[10px] uppercase font-bold text-text-main"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-bg-base/30 text-[9px] font-black text-text-dim uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">System ID</th>
                                <th className="px-6 py-4">Parent Name / Email</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Location / Address</th>
                                <th className="px-6 py-4">Linked Student</th>
                                <th className="px-6 py-4">Occupation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base/20">
                            {parents.map(p => (
                                <tr key={p._id} className="text-[11px] hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-primary/5 border border-primary/20 rounded-md text-[9px] font-black text-primary tracking-tighter">
                                            {p.parentId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-text-main uppercase">{p.user?.name}</span>
                                            <span className="text-[9px] text-text-dim lowercase mt-0.5">{p.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text-dim font-bold uppercase">{p.phone}</td>
                                    <td className="px-6 py-4 text-text-dim uppercase tracking-tight max-w-[150px] truncate">
                                        {p.address || 'Not Provided'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.students?.map(s => (
                                            <span key={s._id} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-[9px] font-black uppercase mr-1">{s.name}</span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-text-dim uppercase italic">{p.occupation || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParentManagement;
