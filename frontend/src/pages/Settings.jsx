import React, { useState } from 'react';
import {
    MapPin,
    Users,
    CreditCard,
    ClipboardList,
    FileCheck,
    Briefcase,
    DollarSign,
    ShieldCheck,
    Activity,
    Smartphone,
    Database,
    Cloud,
    Server,
    Link,
    Mail,
    Phone,
    Monitor,
    Shield,
    History,
    FileText,
    TrendingUp,
    Zap,
    Download,
    Eye,
    EyeOff,
    CheckCircle2,
    Camera,
    Bell,
    Globe,
    Lock,
    User,
    Plus,
    MoreVertical,
    Layers,
    Video,
    BookOpen,
    LayoutDashboard,
    LogOut,
    AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = React.useRef(null);
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}') || {};
    const userRole = storedUser.role || 'student';

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const roleConfigs = {
        admin: [
            { id: 'general', icon: Globe, label: 'General' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'security', icon: History, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'academic', icon: BookOpen, label: 'Academic' },
            { id: 'finance', icon: DollarSign, label: 'Finance & Fee' },
            { id: 'system', icon: Shield, label: 'System' },
            { id: 'integration', icon: Link, label: 'Integrations' },
        ],
        superadmin: [
            { id: 'general', icon: Globe, label: 'General' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'security', icon: History, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'academic', icon: BookOpen, label: 'Academic' },
            { id: 'finance', icon: DollarSign, label: 'Finance & Fee' },
            { id: 'system', icon: Shield, label: 'System' },
            { id: 'integration', icon: Link, label: 'Integrations' },
        ],
        teacher: [
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: Lock, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'teaching', icon: BookOpen, label: 'Teaching' },
        ],
        student: [
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: Lock, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'preferences', icon: Globe, label: 'Preferences' },
        ],
        parent: [
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'child-linking', icon: Users, label: 'Child Linking' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'security', icon: Lock, label: 'Security' },
        ],
        accountant: [
            { id: 'finance', icon: DollarSign, label: 'Finance' },
            { id: 'invoice', icon: FileText, label: 'Invoice' },
            { id: 'reports', icon: TrendingUp, label: 'Reports' },
            { id: 'security', icon: Lock, label: 'Security' },
        ],
        librarian: [
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: Lock, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
        ]
    };

    const tabs = roleConfigs[userRole] || roleConfigs['student'];
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="mb-8">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-1 flex items-center gap-3">
                {Icon && <Icon className="w-6 h-6 text-primary" />} {title}
            </h3>
            <p className="text-text-dim font-bold text-sm tracking-wide">{description}</p>
        </div>
    );

    const AdminGeneralSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Globe} title="General School Settings" description="Update your school's core identity and localization" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">School Name</label>
                    <input type="text" defaultValue="Green Valley International" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Academic Year</label>
                    <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 appearance-none transition-all">
                        <option>2024-25</option>
                        <option>2025-26</option>
                    </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">School Address</label>
                    <textarea defaultValue="45, Scholars Lane, Green Valley, Delhi" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 min-h-[100px] transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Time Zone</label>
                    <input type="text" defaultValue="(GMT+05:30) IST" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Default Language</label>
                    <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 appearance-none transition-all">
                        <option>English</option>
                        <option>Hindi</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end">
                <button className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Save Changes</button>
            </div>
        </div>
    );

    const AdminUserManagement = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Users} title="User & Role Management" description="Control system access and permission levels" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-bg-base/30 border border-border-base hover:border-primary/20 transition-all group flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><ShieldCheck className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-sm font-black text-text-main">Role Permissions</h4>
                            <p className="text-[10px] font-bold text-text-dim uppercase">Configure access per role</p>
                        </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-text-dim" />
                </div>
                <div className="p-6 rounded-[2rem] bg-bg-base/30 border border-border-base hover:border-primary/20 transition-all group flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><Users className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-sm font-black text-text-main">User Logs</h4>
                            <p className="text-[10px] font-bold text-text-dim uppercase">Track recent logins</p>
                        </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-text-dim" />
                </div>
            </div>
            <div className="bg-bg-base/30 rounded-[2.5rem] border border-border-base overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-base bg-bg-base/50">
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">User</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Role</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Dr. Sharma', role: 'Teacher', status: 'Active' },
                            { name: 'Mr. Gupta', role: 'Accountant', status: 'Active' },
                            { name: 'Sameer Khan', role: 'Student', status: 'Disabled' },
                        ].map((u, i) => (
                            <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-text-main">{u.name}</td>
                                <td className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase">{u.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{u.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right"><MoreVertical className="w-4 h-4 text-text-dim cursor-pointer" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const AdminSecuritySettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Shield} title="System Security" description="Configure global security protocols and access controls" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleRow label="Two-Factor Authentication" description="Mandatory 2FA for all staff accounts" status={true} />
                <ToggleRow label="Session Timeout" description="Auto logout after 30 mins of inactivity" status={true} />
                <ToggleRow label="IP Whitelisting" description="Restrict admin access to school network" status={false} />
                <ToggleRow label="Strong Password Policy" description="Require symbols and numbers" status={true} />
            </div>
            <div className="p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10">
                <h4 className="text-sm font-black text-rose-500 uppercase mb-4">Danger Zone</h4>
                <button className="px-6 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Reset All User Passwords</button>
            </div>
        </div>
    );

    const AdminAcademicSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={BookOpen} title="Academic Configuration" description="Manage classes, sections, and grading systems" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Classes', 'Sections', 'Subjects', 'Exams', 'Grading'].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-[2rem] bg-card-base border border-border-base hover:border-primary/40 transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-black text-text-main uppercase">{item} Setup</h4>
                        <p className="text-[10px] font-bold text-text-dim uppercase mt-1">Manage {item.toLowerCase()} meta-data</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const AdminFinanceSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={DollarSign} title="Finance & Fee Settings" description="Configure fee structures and payment gateways" />
            <div className="space-y-4">
                 <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-600"><CreditCard className="w-6 h-6" /></div>
                         <div>
                             <h4 className="text-sm font-black text-text-main uppercase">Payment Gateway</h4>
                             <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Razorpay / Stripe Integrated</p>
                         </div>
                     </div>
                     <button className="text-[10px] font-black text-emerald-600 uppercase border-b border-emerald-600">Configure</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-6 rounded-3xl bg-bg-base/30 border border-border-base">
                         <h5 className="text-[10px] font-black text-text-dim uppercase mb-4 tracking-widest">Currency Settings</h5>
                         <select className="w-full bg-transparent border-none text-sm font-bold text-text-main focus:outline-none">
                             <option>INR (₹)</option>
                             <option>USD ($)</option>
                         </select>
                     </div>
                     <div className="p-6 rounded-3xl bg-bg-base/30 border border-border-base">
                         <h5 className="text-[10px] font-black text-text-dim uppercase mb-4 tracking-widest">Invoice Format</h5>
                         <select className="w-full bg-transparent border-none text-sm font-bold text-text-main focus:outline-none">
                             <option>Standard Professional</option>
                             <option>Modern Minimal</option>
                         </select>
                     </div>
                 </div>
            </div>
        </div>
    );

    const AdminSystemSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={ShieldCheck} title="System & Maintenance" description="Backup data and manage API configurations" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center text-center">
                     <Database className="w-12 h-12 text-indigo-500 mb-4" />
                     <h4 className="text-sm font-black text-text-main uppercase mb-2">Full System Backup</h4>
                     <p className="text-[10px] font-bold text-text-dim uppercase mb-6">Last backup: 12 hours ago</p>
                     <button className="w-full py-3 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20">Download Backup</button>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex flex-col items-center text-center">
                     <Zap className="w-12 h-12 text-amber-500 mb-4" />
                     <h4 className="text-sm font-black text-text-main uppercase mb-2">Maintenance Mode</h4>
                     <p className="text-[10px] font-bold text-text-dim uppercase mb-6">System is currently LIVE</p>
                     <button className="w-full py-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/20">Enable Maintenance</button>
                 </div>
            </div>
        </div>
    );

    const AdminIntegrationSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Link} title="Third-Party Integrations" description="Connect with external educational & communication tools" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'Google Classroom', status: 'Connected', icon: Globe },
                    { name: 'Email SMTP (AWS SES)', status: 'Connected', icon: Mail },
                    { name: 'SMS Gateway (Twilio)', status: 'Disconnected', icon: Phone },
                    { name: 'Zoom API', status: 'Disconnected', icon: Video },
                ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-[2rem] bg-bg-base/30 border border-border-base flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-xl ${item.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-bg-base text-text-dim'}`}>
                                 <item.icon className="w-5 h-5" />
                             </div>
                             <div>
                                 <h4 className="text-sm font-black text-text-main">{item.name}</h4>
                                 <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{item.status}</p>
                             </div>
                         </div>
                         <button className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Connected' ? 'text-rose-500' : 'text-primary'}`}>
                             {item.status === 'Connected' ? 'Disconnect' : 'Connect Now'}
                         </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const ActiveToggle = ({ label, status }) => (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${status ? 'bg-secondary' : 'bg-bg-base/50'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${status ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{status ? 'Enabled' : 'Disabled'}</span>
        </div>
    );

    const TeacherTeachingSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={BookOpen} title="Teaching Preferences" description="Configure your classroom management and grading styles" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Default Class</label>
                    <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50 appearance-none transition-all">
                        <option>Class 10-A (Mathematics)</option>
                        <option>Class 9-B (Physics)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Attendance Format</label>
                    <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50 appearance-none transition-all">
                        <option>Present/Absent/Late</option>
                        <option>Detailed Remark Based</option>
                    </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Grade Calculation Method</label>
                    <div className="p-4 rounded-2xl bg-bg-base/30 border border-border-base space-y-4">
                         {['Weighted Average', 'Strict Summation', 'Best of Exams'].map((m, i) => (
                             <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                                 <span className="text-sm font-bold text-text-main">{m}</span>
                                 <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-secondary bg-secondary' : 'border-border-base'}`} />
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const AccountantFinanceSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={DollarSign} title="Finance Configuration" description="Manage fee categories, discount rules, and payment methods" />
            <div className="space-y-4">
                 {[
                     { label: 'Fee Categories', desc: 'Tuition, Lab, Transport, Library', icon: Layers },
                     { label: 'Discount Rules', desc: 'Sibling, Scholarship, Early Bird', icon: Zap },
                     { label: 'Late Fee Rules', desc: 'Penalty per day/week', icon: AlertTriangle },
                 ].map((item, idx) => (
                     <div key={idx} className="p-6 rounded-[2rem] bg-bg-base/30 border border-border-base hover:border-emerald-500/30 transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                             <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><item.icon className="w-5 h-5" /></div>
                             <div>
                                 <h4 className="text-sm font-black text-text-main">{item.label}</h4>
                                 <p className="text-[10px] font-bold text-text-dim uppercase">{item.desc}</p>
                             </div>
                         </div>
                         <button className="px-4 py-2 bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Edit Setup</button>
                     </div>
                 ))}
            </div>
        </div>
    );

    const AccountantInvoiceSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={FileText} title="Invoice & Tax Settings" description="Customize invoice templates and tax parameters" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Tax Configuration</h4>
                    <div className="p-4 rounded-2xl bg-bg-base/30 border border-border-base space-y-3">
                         <div className="flex justify-between items-center text-xs font-bold text-text-main">
                             <span>GST (Service Tax)</span>
                             <span className="text-emerald-500">18% Enabled</span>
                         </div>
                         <div className="flex justify-between items-center text-xs font-bold text-text-main">
                             <span>Education Cess</span>
                             <span className="text-emerald-500">2% Enabled</span>
                         </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Invoice Template</h4>
                    <div className="h-[120px] rounded-2xl border-2 border-dashed border-border-base flex items-center justify-center text-text-dim text-xs font-bold bg-bg-base/10 grayscale hover:grayscale-0 transition-all cursor-pointer">
                        Preview Standard Template
                    </div>
                </div>
            </div>
        </div>
    );

    const AccountantReportSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={TrendingUp} title="Reporting Preferences" description="Configure financial report formats and export rules" />
            <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 rounded-[2rem] bg-bg-base/30 border border-border-base">
                     <div>
                         <h4 className="text-sm font-black text-text-main">Default Export Format</h4>
                         <p className="text-[10px] font-bold text-text-dim uppercase">Affects all financial downloads</p>
                     </div>
                     <div className="flex gap-2">
                         {['PDF', 'Excel', 'CSV'].map(fmt => (
                             <button key={fmt} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${fmt === 'Excel' ? 'bg-emerald-500 text-white' : 'bg-bg-base text-text-dim border border-border-base'}`}>{fmt}</button>
                         ))}
                     </div>
                 </div>
                 <ToggleRow label="Auto-Generate Monthly Reports" description="Email summary to principal on 1st of every month" status={true} />
            </div>
        </div>
    );

    const ProfileSettings = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="flex items-center gap-8 mb-10">
                <div className="relative group">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl">
                        <div className="w-full h-full bg-card-base rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-primary/40" />
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-xl shadow-lg border-4 border-card-base hover:scale-110 transition-transform active:scale-95"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-1">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Profile
                    </h3>
                    <p className="text-text-dim font-bold text-sm tracking-wide">
                        Manage your {userRole} account and contact details
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" defaultValue="+91 98765 43210" className="w-full pl-11 pr-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="email" defaultValue="vansh.verma@school.edu" className="w-full pl-11 pr-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Residential Address</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" defaultValue="45, Scholars Lane, Green Valley, Delhi" className="w-full pl-11 pr-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                </div>
                {userRole === 'teacher' && (
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Qualification / Portfolio</label>
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-secondary transition-colors" />
                            <input type="text" defaultValue="M.Sc in Applied Mathematics, 8+ Years Experience" className="w-full pl-11 pr-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50 transition-all" />
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Emergency Contact Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" defaultValue={userRole === 'parent' ? "Mr. Verma (Self)" : "Mr. Rajesh Verma"} className="w-full pl-11 pr-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Emergency Contact Phone</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input type="text" defaultValue="+91 98765 00000" className="w-full pl-11 pr-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20 flex gap-4 items-start">
               <AlertTriangle className="w-6 h-6 text-primary shrink-0 mt-1" />
               <p className="text-xs font-bold text-text-dim leading-relaxed">
                  <span className="text-primary font-black uppercase tracking-widest">Note:</span> Sensitive fields like Name, Class, and Roll Number can only be modified by the school administration.
               </p>
            </div>

            <div className="flex justify-end pt-6">
                <button className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all">Save Profile Changes</button>
            </div>
        </div>
    );



    const ToggleRow = ({ label, description, status }) => (
        <div className="flex items-center justify-between p-6 rounded-3xl bg-bg-base/30 border border-border-base hover:border-primary/20 transition-all group cursor-pointer">
            <div>
                 <h4 className="text-sm font-black text-text-main tracking-tight group-hover:text-primary transition-colors">{label}</h4>
                 <p className="text-[10px] font-bold text-text-dim uppercase mt-1">{description}</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${status ? 'bg-primary' : 'bg-bg-base'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${status ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
    );

    const NotificationSettings = () => (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Bell} title="Alert Preferences" description="Configure when and how you receive notifications" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRole === 'parent' ? (
                    <>
                        <ToggleRow label="Child Attendance Alerts" description="Get notified when child is absent" status={true} />
                        <ToggleRow label="Fee Reminders" description="Pending dues & receipt alerts" status={true} />
                        <ToggleRow label="Exam Result Alerts" description="Get notified about child's performance" status={true} />
                        <ToggleRow label="School Announcements" description="Holidays & general notices" status={true} />
                    </>
                ) : userRole === 'teacher' ? (
                    <>
                        <ToggleRow label="Assignment Alerts" description="New submissions from students" status={true} />
                        <ToggleRow label="Student Messages" description="Instant alerts for direct queries" status={true} />
                        <ToggleRow label="Exam Schedule" description="Notifications for upcoming tests" status={true} />
                        <ToggleRow label="School Announcements" description="Staff meetings & circulars" status={true} />
                    </>
                ) : (
                    <>
                        <ToggleRow label="Exam Alerts" description="Get notified about dates & results" status={true} />
                        <ToggleRow label="Assignment Alerts" description="Due dates & submission feedback" status={true} />
                        <ToggleRow label="Fee Reminders" description="Pending dues & receipt alerts" status={false} />
                        <ToggleRow label="School Announcements" description="Holidays & general notices" status={true} />
                        <ToggleRow label="Event Notifications" description="Cultural and sports events" status={true} />
                    </>
                )}
            </div>
        </div>
    );

    const PrivacySettings = () => (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-700 max-w-2xl">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-6 flex items-center gap-3 px-2">
                <Shield className="w-6 h-6 text-primary" /> Privacy & Visibility
            </h3>
            <div className="space-y-4">
                <ToggleRow label="Show profile to teachers" description="Allow academic staff to see details" status={true} />
                <ToggleRow label="Show profile to classmates" description="Visibility in the student directory" status={false} />
            </div>
        </div>
    );

    const LanguageSettings = () => (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-700 max-w-md">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase mb-6 flex items-center gap-3 px-2">
                <Globe className="w-6 h-6 text-primary" /> Application Language
            </h3>
            <div className="space-y-3">
                 {['English (US)', 'Hindi', 'Spanish', 'French'].map((lang, idx) => (
                     <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${lang === 'English (US)' ? 'border-primary bg-primary/10' : 'border-border-base bg-bg-base/30 hover:bg-bg-base'}`}>
                         <span className={`text-sm font-black ${lang === 'English (US)' ? 'text-primary' : 'text-text-main'}`}>{lang}</span>
                         {lang === 'English (US)' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                     </div>
                 ))}
            </div>
        </div>
    );

    const SecuritySettings = () => (
        <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
            <div>
                <SectionHeader icon={Lock} title="Change Password" description="Ensure your account remains secure with a strong password" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">Update Password</button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <SectionHeader icon={History} title="Recent Activity" description="Monitor your recent login sessions and active devices" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {[
                            { device: 'Windows PC • Chrome', location: 'Delhi, India', time: 'Active Currently', active: true },
                            { device: 'iPhone 13 Pro', location: 'Mumbai, India', time: '2 Days ago', active: false },
                        ].map((item, idx) => (
                            <div key={idx} className="p-5 rounded-[2rem] bg-bg-base/30 border border-border-base flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${item.active ? 'bg-primary/10 text-primary' : 'bg-bg-base text-text-dim'}`}>
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-text-main">{item.device}</h5>
                                    <p className="text-[10px] font-bold text-text-dim uppercase">{item.location} • {item.time}</p>
                                </div>
                                {item.active ? <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase rounded-lg">Active</span> : <button className="text-[8px] font-black text-rose-500 uppercase hover:underline">Revoke</button>}
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] border-border-base flex flex-col items-center justify-center text-center bg-primary/5">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <Smartphone className="w-10 h-10" />
                        </div>
                        <h4 className="text-xl font-black text-text-main mb-2 tracking-tight">Two-Factor Auth</h4>
                        <p className="text-xs font-bold text-text-dim mb-6 max-w-[250px]">Add an extra layer of security to your account today.</p>
                        <button className="px-8 py-3 bg-white border border-border-base rounded-xl text-[10px] font-black text-text-main uppercase tracking-widest hover:border-primary/50 transition-all">Enable 2FA</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const StudentPreferences = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Globe} title="Account Preferences" description="Customize your application experience" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Theme Mode</h4>
                    <div className="flex gap-4">
                         {['Light', 'Dark', 'System'].map(t => (
                             <button key={t} className={`flex-1 p-4 rounded-2xl border transition-all ${t === 'Dark' ? 'border-primary bg-primary/10 text-primary' : 'border-border-base bg-bg-base/30 text-text-dim'}`}>
                                 <span className="text-xs font-black uppercase">{t}</span>
                             </button>
                         ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Language</h4>
                    <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main appearance-none">
                        <option>English (US)</option>
                        <option>Hindi</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const ParentChildLinking = () => (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <SectionHeader icon={Users} title="Linked Children" description="Manage and view multiple student profiles linked to your account" />
            <div className="space-y-4">
                 {[
                     { name: 'Sameer Verma', class: '10-A', roll: '24' },
                     { name: 'Ananya Verma', class: '7-B', roll: '12' },
                 ].map((child, idx) => (
                     <div key={idx} className="p-6 rounded-[2.5rem] bg-bg-base/30 border border-border-base flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black">{child.name.charAt(0)}</div>
                             <div>
                                 <h4 className="text-sm font-black text-text-main">{child.name}</h4>
                                 <p className="text-[10px] font-bold text-text-dim uppercase">Class {child.class} • Roll No: {child.roll}</p>
                             </div>
                         </div>
                         <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Permissions</button>
                     </div>
                 ))}
                 <button className="w-full py-4 border-2 border-dashed border-border-base rounded-[2rem] text-text-dim text-[10px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                     <Plus className="w-4 h-4" /> Link Another Child
                 </button>
            </div>
        </div>
    );

    const renderContent = () => {
        // Multi-role combined logic
        if (userRole === 'admin' || userRole === 'superadmin') {
            switch (activeTab) {
                case 'general': return <AdminGeneralSettings />;
                case 'users': return <AdminUserManagement />;
                case 'security': return <AdminSecuritySettings />;
                case 'notifications': return <AdminNotificationSettings />;
                case 'academic': return <AdminAcademicSettings />;
                case 'finance': return <AdminFinanceSettings />;
                case 'system': return <AdminSystemSettings />;
                case 'integration': return <AdminIntegrationSettings />;
            }
        }

        switch (activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'security': return <SecuritySettings />;
            case 'notifications': return <NotificationSettings />;
            case 'teaching': return <TeacherTeachingSettings />;
            case 'preferences': return <StudentPreferences />;
            case 'child-linking': return <ParentChildLinking />;
            case 'finance': return <AccountantFinanceSettings />;
            case 'invoice': return <AccountantInvoiceSettings />;
            case 'reports': return <AccountantReportSettings />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div>
                     <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none">Account <span className="text-primary">Settings</span></h1>
                     <p className="text-text-dim font-bold text-sm tracking-widest mt-2 uppercase opacity-60">Manage your digital presence</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                >
                    <LogOut className="w-4 h-4" /> Sign Out from Account
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Internal Settings Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                                activeTab === tab.id 
                                ? 'bg-primary text-white shadow-xl shadow-primary/30 active-glow' 
                                : 'bg-card-base text-text-dim hover:bg-bg-base hover:text-text-main border border-border-base'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-text-dim group-hover:text-primary transition-colors'}`} />
                            <span className="text-sm font-black tracking-tight uppercase">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Settings Content Area */}
                <div className="lg:col-span-3 glass-card p-10 rounded-[3rem] border-border-base min-h-[600px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
