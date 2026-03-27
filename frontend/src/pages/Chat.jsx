import React, { useState } from 'react';
import { 
    Search, 
    MoreVertical, 
    Phone, 
    Video, 
    Send, 
    Paperclip, 
    Mic,
    CheckCheck,
    Smile,
    User,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [message, setMessage] = useState('');

    const contacts = [
        { 
            id: 0,
            name: 'Class 10-A Group', 
            msg: 'Ma\'am homework is posted on portal...', 
            time: '10:30 AM', 
            status: 'online', 
            group: true,
            unread: 3,
            avatar: null
        },
        { 
            id: 1,
            name: 'Mrs. Sharma', 
            msg: 'Please meet me tomorrow in office', 
            time: '09:15 AM', 
            status: 'offline', 
            group: false,
            unread: 0,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        },
        { 
            id: 2,
            name: 'Principal Office', 
            msg: 'Fees reminder: Last date is 25th March', 
            time: 'Yesterday', 
            status: 'online', 
            group: false,
            unread: 0,
            avatar: null
        },
        { 
            id: 3,
            name: 'Admin Desk', 
            msg: 'New notification regarding holidays', 
            time: 'Monday', 
            status: 'offline', 
            group: false,
            unread: 1,
            avatar: null
        },
    ];

    const messages = [
        { id: 1, text: "Hello everyone! Don't forget to submit the math assignment by tomorrow.", time: "10:30 AM", sender: "teacher", type: "received" },
        { id: 2, text: "Sure ma'am! Is it Chapter 5 or the whole unit?", time: "10:32 AM", sender: "you", type: "sent" },
        { id: 3, text: "Just Chapter 5 for now. We will cover the unit test later.", time: "10:35 AM", sender: "teacher", type: "received" },
        { id: 4, text: "Okay, thanks for clarifying!", time: "10:36 AM", sender: "you", type: "sent" },
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden animate-in fade-in duration-700">
            {/* Contacts Sidebar */}
            <div className="w-96 flex flex-col gap-4">
                <div className="glass-card p-4 rounded-3xl flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl font-black text-text-main tracking-tighter">Messages</h2>
                        <button className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-11 pr-4 py-3 bg-bg-base/50 border border-border-base rounded-2xl text-sm text-text-main placeholder-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="glass-card flex-1 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 thin-scrollbar">
                        {contacts.map((contact, idx) => (
                            <motion.button
                                key={contact.id}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(contact.id)}
                                className={`w-full p-4 flex gap-4 rounded-3xl transition-all duration-300 relative group overflow-hidden ${
                                    activeTab === contact.id 
                                    ? 'bg-primary/10 border border-primary/20 shadow-lg' 
                                    : 'hover:bg-bg-base/40 border border-transparent'
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center text-xl font-black ${
                                        contact.group ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-bg-base/80 text-text-dim border border-border-base'
                                    }`}>
                                        {contact.avatar ? (
                                            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                        ) : (
                                            contact.group ? <Users className="w-7 h-7" /> : <User className="w-7 h-7" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-card-base ${
                                        contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold truncate transition-colors ${
                                            activeTab === contact.id ? 'text-text-main' : 'text-text-main/80'
                                        }`}>{contact.name}</h4>
                                        <span className="text-[10px] font-bold text-text-dim/60 uppercase">{contact.time}</span>
                                    </div>
                                    <p className="text-xs text-text-dim truncate leading-snug">{contact.msg}</p>
                                </div>
                                {contact.unread > 0 && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                                        {contact.unread}
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-card rounded-[2.5rem] flex flex-col overflow-hidden relative border-border-base">
                {/* Chat Header */}
                <div className="p-5 px-8 flex justify-between items-center border-b border-border-base bg-card-base/50 backdrop-blur-md sticky top-0 z-20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-xl transition-transform group-hover:scale-105 duration-500">
                                <div className="w-full h-full bg-card-base rounded-[0.9rem] flex items-center justify-center text-lg font-black text-primary">
                                    {contacts[activeTab].avatar ? (
                                        <img src={contacts[activeTab].avatar} alt="" className="w-full h-full object-cover rounded-[0.9rem]" />
                                    ) : (
                                        contacts[activeTab].name.substring(0, 2).toUpperCase()
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card-base rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text-main tracking-tighter leading-none mb-1 transition-colors">{contacts[activeTab].name}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${contacts[activeTab].status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider transition-colors">
                                    {contacts[activeTab].status === 'online' ? 'Active Now' : 'Last seen 2h ago'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {[Video, Phone, Search, MoreVertical].map((Icon, idx) => (
                            <button key={idx} className="p-3 hover:bg-primary/10 rounded-2xl text-text-dim hover:text-primary transition-all group">
                                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages Display */}
                <div className="flex-1 p-8 space-y-8 overflow-y-auto thin-scrollbar bg-bg-base/30 transition-colors">
                    <div className="flex justify-center my-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-card-base px-6 py-2 rounded-2xl border border-border-base text-text-dim shadow-sm transition-colors">Today</span>
                    </div>

                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={msg.id}
                                className={`flex gap-4 ${msg.type === 'sent' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className="flex-shrink-0 mt-auto mb-1">
                                    <div className="w-8 h-8 rounded-xl bg-bg-base border border-border-base flex items-center justify-center text-[10px] font-black text-text-dim transition-colors">
                                        {msg.sender === 'teacher' ? 'TR' : 'V'}
                                    </div>
                                </div>
                                <div className={`max-w-[65%] group relative ${msg.type === 'sent' ? 'items-end' : ''}`}>
                                    <div className={`p-4 rounded-3xl shadow-xl transition-all duration-300 ${
                                        msg.type === 'sent' 
                                        ? 'bg-gradient-to-tr from-primary to-secondary text-white rounded-tr-none' 
                                        : 'bg-card-base border border-border-base text-text-main rounded-tl-none hover:bg-bg-base/60'
                                    }`}>
                                        <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-2 px-1 ${msg.type === 'sent' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-[10px] font-bold text-text-dim/60 uppercase">{msg.time}</span>
                                        {msg.type === 'sent' && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-card-base/80 backdrop-blur-xl border-t border-border-base transition-colors relative z-20">
                    <div className="flex items-center gap-4 bg-bg-base/50 p-2 pl-4 rounded-[2rem] border border-border-base shadow-inner transition-colors focus-within:ring-2 focus-within:ring-primary/20">
                        <button className="p-2 text-text-dim hover:text-primary transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-text-dim hover:text-primary transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-transparent border-none py-3 text-sm focus:ring-0 outline-none text-text-main placeholder-text-dim/50" 
                        />
                        <button className="p-2 text-text-dim hover:text-primary transition-colors">
                            <Mic className="w-5 h-5" />
                        </button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3.5 bg-primary text-white rounded-[1.4rem] hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all flex items-center justify-center"
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
