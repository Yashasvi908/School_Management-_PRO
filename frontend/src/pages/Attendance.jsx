import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    QrCode,
    Camera,
    Smartphone,
    User,
    Scan
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';

const Attendance = () => {
    const { user } = useSelector((state) => state.auth || {});
    const role = user?.role || 'student';
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'qr', 'face'
    const [currentTime, setCurrentTime] = useState(new Date());
    const videoRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setScanStatus] = useState('idle');
    const [recentLogs, setRecentLogs] = useState([
        { time: '08:00 AM', text: 'System started', type: 'system' },
        { time: '08:15 AM', text: 'Rahul Kumar marked Present (QR)', type: 'success' },
        { time: '08:30 AM', text: 'Anita Singh marked Present (Face)', type: 'success' },
    ]);

    const [students, setStudents] = useState([]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);

    useEffect(() => {
        // Security: If role changes or is unauthorized for marking, force to calendar mode
        const authorized = ['teacher', 'admin', 'superadmin'].includes(role);
        if (!authorized && viewMode !== 'calendar') {
            setViewMode('calendar');
        }
    }, [role, viewMode]);

    useEffect(() => {
        // Fetch students and attendance logs on mount
        const fetchData = async () => {
            try {
                const [studentsRes, attendanceRes] = await Promise.all([
                    fetch('http://localhost:8000/api/school/students'),
                    fetch('http://localhost:8000/api/school/attendance')
                ]);

                if (studentsRes.ok) {
                    const studentsData = await studentsRes.json();
                    setStudents(studentsData);
                }

                if (attendanceRes.ok) {
                    const logsData = await attendanceRes.json();
                    // Format logs for display
                    const formattedLogs = logsData.map(log => ({
                        time: new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        text: `${log.studentId?.name || 'Unknown Student'} marked ${log.status}`,
                        type: log.status === 'Present' ? 'success' : 'late'
                    })).reverse().slice(0, 10); // Show recent 10

                    if (formattedLogs.length > 0) {
                        setRecentLogs(formattedLogs);
                    }
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
        };
        fetchData();

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const startCamera = async () => {
        setIsScanning(true);
        setScanStatus('scanning');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Simulate Face Recognition & API Call
            setTimeout(async () => {
                if (students.length === 0) {
                    alert('No students found to mark attendance for!');
                    stopCamera();
                    return;
                }

                // Pick a random student to simulate a match
                const randomStudent = students[Math.floor(Math.random() * students.length)];

                try {
                    const response = await fetch('http://localhost:8000/api/school/attendance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: randomStudent._id,
                            date: new Date(),
                            status: 'Present'
                        })
                    });

                    if (response.ok) {
                        setScanStatus('success');
                        const newLog = {
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            text: `Face Verified: ${randomStudent.name}`,
                            type: 'success'
                        };
                        setRecentLogs(prev => [newLog, ...prev].slice(0, 10));
                        // alert(`✅ Face Recognized: Attendance Marked for ${randomStudent.name}`);
                    } else {
                        setScanStatus('failed');
                        alert('Failed to mark attendance');
                    }
                } catch (error) {
                    console.error("Error marking attendance:", error);
                    setScanStatus('failed');
                }

                stopCamera();
            }, 3000);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setScanStatus('failed');
        }
    };

    const stopCamera = () => {
        setIsScanning(false);
        setScanStatus('idle');
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Mock Calendar Data
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getStatus = (day) => {
        if ([5, 12, 19, 26].includes(day)) return 'holiday';
        if (day === 8 || day === 22) return 'absent';
        if (day === 14) return 'late';
        return 'present';
    };

    const renderCalendarDay = (day) => {
        const status = getStatus(day);
        let bgColor = 'bg-slate-50 hover:bg-slate-100';
        let icon = null;
        let textColor = 'text-slate-500';

        switch (status) {
            case 'present':
                bgColor = 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100';
                textColor = 'text-emerald-700';
                icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
                break;
            case 'absent':
                bgColor = 'bg-rose-50 border border-rose-100 hover:bg-rose-100';
                textColor = 'text-rose-700';
                icon = <XCircle className="w-4 h-4 text-rose-500" />;
                break;
            case 'late':
                bgColor = 'bg-amber-50 border border-amber-100 hover:bg-amber-100';
                textColor = 'text-amber-700';
                icon = <Clock className="w-4 h-4 text-amber-500" />;
                break;
            case 'holiday':
                textColor = 'text-slate-400';
                break;
        }

        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm ${bgColor}`}
            >
                <span className={`font-bold text-lg ${textColor}`}>{day}</span>
                {icon}
            </motion.div>
        );
    };

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
                        <CalendarIcon className="w-8 h-8 text-indigo-600" />
                        Smart Attendance
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        <span className="mx-2">•</span>
                        <span className="font-mono text-indigo-600 font-bold">{currentTime.toLocaleTimeString()}</span>
                    </p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <CalendarIcon className="w-4 h-4" /> History
                    </button>
                    {(role === 'teacher' || role === 'admin' || role === 'superadmin') && (
                        <>
                            <button
                                onClick={() => { setViewMode('qr'); stopCamera(); }}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'qr' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <QrCode className="w-4 h-4" /> QR Code
                            </button>
                            <button
                                onClick={() => { setViewMode('face'); stopCamera(); }}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'face' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Scan className="w-4 h-4" /> Face Rec
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {viewMode === 'calendar' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-slate-800">Monthly Record</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"><ChevronLeft /></button>
                                    <span className="font-bold text-lg text-slate-700">February 2026</span>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"><ChevronRight /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-4 mb-4">
                                {weekDays.map(d => (
                                    <div key={d} className="text-center font-semibold text-slate-400 text-sm">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-4">
                                {days.map(day => <React.Fragment key={day}>{renderCalendarDay(day)}</React.Fragment>)}
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'qr' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div className="bg-indigo-50 p-8 rounded-3xl border-4 border-indigo-100 relative">
                                <div className="absolute inset-0 border-2 border-dashed border-indigo-300 rounded-2xl m-2 animate-pulse"></div>
                                <QRCodeSVG value="https://school-app.com/attendance/verify/student_123_token_xyz" size={250} level="H" includeMargin={true} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Scan to Mark Attendance</h3>
                                <p className="text-slate-500 max-w-md mx-auto">Show this QR code to the classroom scanner or teacher's device to instantly mark your attendance.</p>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full font-medium text-sm">
                                <Smartphone className="w-4 h-4" /> Regenerates in 00:45
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'face' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                        >
                            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 group">
                                {isScanning ? (
                                    <>
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-64 h-64 border-4 border-indigo-500/50 rounded-full relative animate-pulse">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 right-0 text-center">
                                            <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                                {scanStatus === 'success' ? 'Face Verified!' : 'Align face within frame'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                            <Camera className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <p>Camera is off</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center">
                                {!isScanning ? (
                                    <button
                                        onClick={startCamera}
                                        className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                    >
                                        <Scan className="w-5 h-5" /> Start Face Recognition
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopCamera}
                                        className="px-8 py-4 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                    >
                                        <XCircle className="w-5 h-5" /> Stop Scanning
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Attendance Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                                    <span className="font-medium text-slate-700">Present</span>
                                </div>
                                <span className="font-bold text-xl text-emerald-700">85%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><XCircle className="w-5 h-5 text-rose-600" /></div>
                                    <span className="font-medium text-slate-700">Absent</span>
                                </div>
                                <span className="font-bold text-xl text-rose-700">10%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><Clock className="w-5 h-5 text-amber-600" /></div>
                                    <span className="font-medium text-slate-700">Late</span>
                                </div>
                                <span className="font-bold text-xl text-amber-700">5%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Live Activity</h3>
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                            {recentLogs.map((log, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm">
                                    <span className="text-slate-400 font-mono text-xs whitespace-nowrap mt-0.5">{log.time}</span>
                                    <span className={`font-medium ${log.type === 'success' ? 'text-emerald-700' : 'text-slate-600'}`}>
                                        {log.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                        <h3 className="font-bold mb-2 flex items-center gap-2 relative z-10"><AlertTriangle className="w-5 h-5" /> Auto-Alert System</h3>
                        <p className="text-indigo-100 text-sm mb-4 relative z-10">Parents are automatically notified via SMS/App if a student is marked absent without prior leave.</p>
                        <div className="flex items-center gap-2 text-xs bg-white/20 p-2 rounded-lg backdrop-blur-md relative z-10 w-fit">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> System Active
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Attendance;
