import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Link } from 'lucide-react';

const AddParentForm = ({ onSubmit }) => {
    return (
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Parent Name</label>
                    <div className="relative group">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="e.g. Sunil Sharma" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="email" placeholder="parent@school.com" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Phone Number</label>
                    <div className="relative group">
                        <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="tel" placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Occupation</label>
                    <div className="relative group">
                        <Briefcase className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="e.g. Software Engineer" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Address</label>
                    <div className="relative group">
                        <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="e.g. 123, Street Name, City" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Link to Student (Roll No/ID)</label>
                    <div className="relative group">
                        <Link className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="e.g. STU-2024-001" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border-base/50">
                <button type="submit" className="w-full py-5 bg-amber-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all">Create parent Account</button>
            </div>
        </form>
    );
};

export default AddParentForm;
