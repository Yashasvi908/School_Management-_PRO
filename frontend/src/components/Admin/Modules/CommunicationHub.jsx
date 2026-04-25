import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageSquare, 
    Search, 
    Send, 
    MoreVertical, 
    Paperclip, 
    Smile, 
    Users, 
    ShieldCheck, 
    Circle,
    ChevronLeft,
    Phone,
    Video,
    Info,
    Mic,
    CheckCheck,
    Lock,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import { useSelector } from 'react-redux';

const CommunicationHub = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); 
    const { user, token } = useSelector(state => state.auth);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const [convRes, dirRes] = await Promise.all([
                    api.get('/admin/communication/conversations'),
                    api.get('/admin/communication/directory')
                ]);
                
                let combinedContacts = [];
                if (convRes.data.success) {
                    combinedContacts = [...convRes.data.data];
                }
                
                if (dirRes.data.success) {
                    const activeIds = new Set(combinedContacts.map(c => c.user._id));
                    const directoryContacts = dirRes.data.data
                        .filter(u => !activeIds.has(u._id))
                        .map(u => ({ user: u, lastMessage: 'Start a new connection...', time: new Date() }));
                    
                    combinedContacts = [...combinedContacts, ...directoryContacts];
                }
                
                setContacts(combinedContacts);
            } catch (err) { console.error(err); }
        };
        if (token) fetchContacts();
    }, [token]);

    useEffect(() => {
        const fetchChat = async () => {
            if (!selectedContact) return;
            try {
                const res = await api.get(`/admin/communication/history/${selectedContact.user._id}`);
                if (res.data.success) setMessages(res.data.data);
            } catch (err) { console.error(err); }
        };
        fetchChat();
        const interval = setInterval(fetchChat, 3000);
        return () => clearInterval(interval);
    }, [selectedContact]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;
        try {
            const res = await api.post('/admin/communication/send', {
                receiverId: selectedContact.user._id,
                content: newMessage
            });
            if (res.data.success) {
                setMessages([...messages, res.data.data]);
                setNewMessage('');
                
                // Optimistically update the directory sidebar
                setContacts(prev => {
                    const idx = prev.findIndex(c => c.user._id === selectedContact.user._id);
                    if (idx === -1) return prev;
                    const newContacts = [...prev];
                    newContacts[idx] = { ...newContacts[idx], lastMessage: newMessage, time: new Date() };
                    // Move to top
                    const [moved] = newContacts.splice(idx, 1);
                    return [moved, ...newContacts];
                });
            }
        } catch (err) { console.error(err); }
    };

    const filteredContacts = contacts.filter(c => 
        (filter === 'all' || c.user.role === filter) &&
        c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-[calc(100vh-160px)] flex gap-0 rounded-[3.5rem] overflow-hidden border border-white/5 bg-[#080808] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
            
            {/* Left Rail: High-Density Directory */}
            <div className={`w-full lg:w-[420px] flex flex-col border-r border-white/5 bg-white/[0.01] backdrop-blur-3xl z-20 ${selectedContact ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-10 pb-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                             <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span> Secure Hub
                             </h3>
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Institutional Signal Flow</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text" 
                            placeholder="Find secure identity..." 
                            className="w-full pl-12 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-sm font-bold text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/30 transition-all shadow-inner" 
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                        {['all', 'teacher', 'parent', 'student'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shrink-0 border ${filter === f ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 no-scrollbar">
                    {filteredContacts.map((contact, i) => (
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            onClick={() => setSelectedContact(contact)}
                            className={`p-5 rounded-[2.2rem] flex items-center gap-5 cursor-pointer transition-all relative overflow-hidden group ${selectedContact?.user._id === contact.user._id ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/[0.03] border border-transparent'}`}
                        >
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-2xl transform transition-transform group-hover:scale-110 ${selectedContact?.user._id === contact.user._id ? 'bg-indigo-600 text-white' : 'bg-white/[0.03] text-indigo-500 border border-white/10'}`}>
                                    {contact.user.name[0]}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-[#080808] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                            <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex justify-between items-center mb-1.5">
                                    <h4 className="text-[13px] font-black text-white truncate uppercase tracking-tight">{contact.user.name}</h4>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{new Date(contact.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${contact.user.role === 'teacher' ? 'bg-blue-500/10 text-blue-400' : contact.user.role === 'parent' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>{contact.user.role}</span>
                                     <p className="text-[11px] font-bold text-gray-500 truncate opacity-60 lowercase">{contact.lastMessage}</p>
                                </div>
                            </div>
                            {selectedContact?.user._id === contact.user._id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Rail: Tactical Chat Chamber */}
            <div className={`flex-1 flex flex-col bg-transparent relative ${!selectedContact ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
                
                {/* Visual Glass Header */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none opacity-20"></div>

                {!selectedContact ? (
                    <div className="text-center space-y-8 max-w-sm px-10 relative z-10">
                        <div className="w-28 h-28 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative group">
                            <div className="absolute inset-0 bg-indigo-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <MessageSquare className="w-12 h-12 text-indigo-500 relative z-10" />
                        </div>
                        <div className="space-y-3">
                             <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Not Locked</h4>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] leading-loose opacity-60">Initialize a secure link from the node directory to begin high-density administrative oversight.</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            <span className="w-2 h-2 bg-indigo-500/30 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-indigo-500/30 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-indigo-500/30 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Interactive Header */}
                        <div className="px-12 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] backdrop-blur-md relative z-30">
                            <div className="flex items-center gap-5">
                                <button onClick={() => setSelectedContact(null)} className="lg:hidden p-3 hover:bg-white/5 rounded-[1.2rem] text-white transition-all border border-white/10"><ChevronLeft className="w-5 h-5" /></button>
                                <div className="relative">
                                     <div className="w-14 h-14 rounded-[1.4rem] bg-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-[0_0_30px_rgba(99,102,241,0.4)]">{selectedContact.user.name[0]}</div>
                                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#080808] rounded-full"></div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-white uppercase leading-none tracking-tight">{selectedContact.user.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3 text-indigo-500" />
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{selectedContact.user.role} • Secure Channel</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"><Phone className="w-5 h-5" /></button>
                                <button className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"><Video className="w-5 h-5" /></button>
                                <button className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"><Info className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Message Stream Chamber */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar relative z-20">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                                     <Lock className="w-12 h-12" />
                                     <p className="text-[10px] font-black uppercase tracking-[0.5em]">End-to-End Institutional Encryption</p>
                                </div>
                            )}
                            
                            {messages.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    key={i} 
                                    className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] group relative`}>
                                        <div className={`p-6 rounded-[2.5rem] shadow-2xl transition-all ${
                                            msg.sender === user.id 
                                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10' 
                                            : 'bg-white/[0.03] border border-white/5 text-gray-200 rounded-tl-none'
                                        }`}>
                                            {msg.messageType === 'file' ? (
                                                <div className="flex items-center gap-3">
                                                    <Paperclip className="w-5 h-5 opacity-70" />
                                                    <span className="text-[13px] font-bold underline underline-offset-4 decoration-white/30">Secure_Document_Attached.pdf</span>
                                                </div>
                                            ) : msg.messageType === 'image' ? (
                                                <div className="flex flex-col gap-3">
                                                    <div className="w-full h-32 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center backdrop-blur-md border border-white/20">
                                                        <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Encrypted Image Data</span>
                                                    </div>
                                                    <p className="text-[14px] font-medium leading-relaxed tracking-tight">{msg.content}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[14px] font-medium leading-relaxed tracking-tight">{msg.content}</p>
                                            )}
                                        </div>
                                        <div className={`flex items-center gap-2 mt-3 px-1 ${msg.sender === user.id ? 'flex-row-reverse' : ''}`}>
                                            <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest leading-none">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {msg.sender === user.id && <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Tactical Input Unit */}
                        <div className="px-12 pb-12 pt-4 relative z-40 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent">
                            <form onSubmit={handleSend} className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-3 flex items-center gap-3 shadow-2xl focus-within:border-indigo-500/40 transition-all backdrop-blur-3xl group">
                                <button type="button" className="w-14 h-14 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors"><Smile className="w-6 h-6" /></button>
                                <button type="button" className="w-14 h-14 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors border-r border-white/5 pr-4 group-focus-within:border-indigo-500/30"><Paperclip className="w-6 h-6" /></button>
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    type="text" 
                                    placeholder="Execute signal transfer..." 
                                    className="flex-1 bg-transparent border-none focus:outline-none text-[14px] font-bold text-white px-5 placeholder:text-gray-700" 
                                />
                                <div className="flex gap-1 pr-2">
                                     <button type="button" className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors"><Mic className="w-5 h-5" /></button>
                                     <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit" 
                                        className="w-16 h-16 bg-white text-black flex items-center justify-center rounded-[1.8rem] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-indigo-500 hover:text-white transition-all"
                                     >
                                        <Send className="w-6 h-6 ml-1" />
                                     </motion.button>
                                </div>
                            </form>
                            <div className="mt-4 text-center">
                                <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">Signal Node: 192.168.1.1 // RSA-4096 Encrypted</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default CommunicationHub;
