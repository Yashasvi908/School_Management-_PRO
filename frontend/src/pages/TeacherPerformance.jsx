import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import {
    TrendingUp,
    Users,
    BookOpen,
    CheckCircle,
    AlertCircle,
    Clock,
    Search,
    Filter,
    MoreVertical,
    FileText,
    Star
} from 'lucide-react';

const TeacherPerformance = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [teachersData, setTeachersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // Fetch from API Gateway -> School Service
                const response = await fetch('http://localhost:8000/api/school/teachers/performance');
                if (!response.ok) {
                    throw new Error('Failed to fetch teacher data');
                }
                const data = await response.json();
                setTeachersData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching teachers:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) return <div className="text-center py-10">Loading performance data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    // Filter Logic
    const filteredTeachers = teachersData.filter(teacher =>
        (filterDepartment === 'All' || teacher.department === filterDepartment) &&
        (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Aggregate Data for Charts
    const departmentPerformance = [
        { name: 'Science', completed: 78, pending: 22 },
        { name: 'Arts', completed: 90, pending: 10 },
        { name: 'Humanities', completed: 65, pending: 35 },
        { name: 'Commerce', completed: 82, pending: 18 },
    ];

    const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-indigo-600" />
                        Teacher Performance Analytics
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Track syllabus completion, assignment grading, and overall efficiency.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                        <FileText className="w-5 h-5" /> Detailed Report
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Mark Review
                    </button>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Avg. Syllabus Completion', value: '78%', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: 'Total Assignments Checked', value: '1,245', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Pending Tasks', value: '45', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { title: 'Overall Staff Rating', value: '4.7/5', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Teachers List Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" /> Staff Performance
                        </h2>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search teacher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                                />
                            </div>
                            <select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none cursor-pointer"
                            >
                                <option value="All">All Depts</option>
                                <option value="Science">Science</option>
                                <option value="Arts">Arts</option>
                                <option value="Commerce">Commerce</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredTeachers.map((teacher, index) => (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex items-start gap-4 flex-1">
                                        <img src={teacher.avatar} alt={teacher.name} className="w-14 h-14 rounded-full border-2 border-slate-100" />
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{teacher.name}</h3>
                                            <p className="text-slate-500 text-sm">{teacher.subject} • {teacher.department}</p>
                                            <div className="flex items-center gap-1 mt-1 text-amber-500 text-sm font-bold">
                                                <Star className="w-4 h-4 fill-current" /> {teacher.rating}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {/* Syllabus Progress */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-slate-600">Syllabus Completion</span>
                                                <span className={`font-bold ${teacher.syllabusBox < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>{teacher.syllabusBox}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${teacher.syllabusBox < 70 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${teacher.syllabusBox}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 text-right">{teacher.pendingWork}% Course Pending</p>
                                        </div>

                                        {/* Tasks Stats */}
                                        <div className="flex gap-4 text-sm">
                                            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                                                <span className="text-slate-500">Checked</span>
                                                <span className="font-bold text-indigo-600">{teacher.assignmentsChecked}</span>
                                            </div>
                                            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                                                <span className="text-slate-500">Pending</span>
                                                <span className="font-bold text-rose-600">{teacher.assignmentsPending}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        <button className="mt-auto px-4 py-2 border border-indigo-200 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Charts & Analysis */}
                <div className="space-y-6">
                    {/* Department Performance Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-6">Department Efficiency</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentPerformance} layout="vertical" margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="completed" name="Completed (%)" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                    <Bar dataKey="pending" name="Pending (%)" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Completed</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-200 rounded-full"></div> Pending</div>
                        </div>
                    </div>

                    {/* Pending Work Analysis */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Urgent Attention Needed</h3>
                        <div className="space-y-4">
                            {teachersData.filter(t => t.pendingWork > 25).map(teacher => (
                                <div key={teacher.id} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-rose-700 text-sm truncate">{teacher.name}</p>
                                        <p className="text-xs text-rose-600/80">{teacher.pendingWork}% Syllabus Pending</p>
                                    </div>
                                    <button className="px-3 py-1 bg-white text-rose-600 text-xs font-bold rounded-lg shadow-sm border border-rose-100 hover:bg-rose-100">
                                        Nudge
                                    </button>
                                </div>
                            ))}
                            {teachersData.filter(t => t.pendingWork > 25).length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                                    <p>All teachers are on track!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TeacherPerformance;
