import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Video,
    Calendar,
    Clock,
    Users,
    Link,
    PlayCircle,
    CheckCircle,
    MoreVertical,
    Plus,
    Monitor
} from 'lucide-react';

const LiveClasses = () => {
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past'

    const upcomingClasses = [
        { id: 1, subject: 'Physics - Moving Charges', teacher: 'Dr. R.K. Sharma', time: '10:00 AM - 11:00 AM', date: 'Today', platform: 'Zoom', attendees: 45, status: 'Live Now', link: 'https://zoom.us/j/123456789' },
        { id: 2, subject: 'Mathematics - Calculus', teacher: 'Mrs. S. Gupta', time: '12:00 PM - 01:00 PM', date: 'Today', platform: 'Google Meet', attendees: 0, status: 'Scheduled', link: 'https://meet.google.com/abc-defg-hij' },
        { id: 3, subject: 'Chemistry - Bonding', teacher: 'Mr. A. Singh', time: '02:00 PM - 03:00 PM', date: 'Tomorrow', platform: 'Zoom', attendees: 0, status: 'Scheduled', link: '#' },
    ];

    const pastClasses = [
        { id: 101, subject: 'English - Literature', teacher: 'Ms. P. Das', time: '09:00 AM - 10:00 AM', date: 'Yesterday', attendees: 52, recording: 'https://zoom.us/rec/play/xyz', attendance: 'Auto-Marked' },
        { id: 102, subject: 'Biology - Genetics', teacher: 'Dr. K. Verma', time: '11:00 AM - 12:00 PM', date: 'Yesterday', attendees: 48, recording: 'https://drive.google.com/file/d/abc', attendance: 'Auto-Marked' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <Video className="w-8 h-8 text-indigo-600" />
                        Live Classroom
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Virtual Classes & Recordings Management</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Schedule New Class
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-4 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'upcoming' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Upcoming Classes
                    {activeTab === 'upcoming' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-4 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'past' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Past Recordings
                    {activeTab === 'past' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
                </button>
            </div>

            {/* Upcoming Classes List */}
            {activeTab === 'upcoming' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingClasses.map((cls) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            {cls.status === 'Live Now' && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full"></div> LIVE
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 text-indigo-600">
                                    {cls.platform === 'Zoom' ? <Video className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{cls.subject}</h3>
                                <p className="text-slate-500 text-sm mt-1">{cls.teacher}</p>
                            </div>

                            <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" /> {cls.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> {cls.time}
                                </div>
                                {cls.status === 'Live Now' && (
                                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                        <Users className="w-4 h-4" /> {cls.attendees} Students Joined
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {cls.status === 'Live Now' ? (
                                    <a href={cls.link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg text-center font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                        Join Now
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-lg text-center font-bold text-sm cursor-not-allowed">
                                        Join Class
                                    </button>
                                )}
                                <button className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors" title="Copy Link">
                                    <Link className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Past Classes / Recordings */}
            {activeTab === 'past' && (
                <div className="space-y-4">
                    {pastClasses.map((cls) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-100 transition-colors"
                        >
                            <div className="p-4 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                <PlayCircle className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-bold text-slate-800">{cls.subject}</h3>
                                <p className="text-slate-500 text-sm">{cls.teacher} • {cls.date}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Clock className="w-4 h-4 text-slate-400" /> {cls.time}
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <CheckCircle className="w-4 h-4" /> {cls.attendance}
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <a href={cls.recording} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-sm whitespace-nowrap">
                                    View Recording
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default LiveClasses;
