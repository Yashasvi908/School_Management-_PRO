import React from 'react';
import { User, Camera, Mail, Phone, Book, Users, MapPin } from 'lucide-react';

const AddStudentForm = ({ onSubmit }) => {
    return (
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            {/* Profile Photo Upload Placeholder */}
            <div className="flex flex-col items-center gap-4 mb-2">
                <div className="w-32 h-32 rounded-3xl bg-bg-base border border-border-base border-dashed flex flex-col items-center justify-center group cursor-pointer hover:border-primary/50 transition-all">
                    <Camera className="w-8 h-8 text-text-dim group-hover:text-primary transition-colors mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-main">Upload Photo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="email" placeholder="student@school.com" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Class & Section</label>
                    <div className="relative group">
                        <Users className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <select className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                            <option>Class 10 - A</option>
                            <option>Class 10 - B</option>
                            <option>Class 9 - A</option>
                            <option>Class 9 - B</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim ml-1">Parent Information (Guardian Name)</label>
                    <div className="relative group">
                        <Book className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="e.g. Sunil Sharma" className="w-full pl-12 pr-4 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border-base/50">
                <button type="submit" className="w-full py-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all">Register Student</button>
            </div>
        </form>
    );
};

export default AddStudentForm;
