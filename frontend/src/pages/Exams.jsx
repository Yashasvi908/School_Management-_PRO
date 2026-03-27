import React from 'react';
import { Award, Download, TrendingUp } from 'lucide-react';

const Exams = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Exam Results</h1>
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Report Card
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { subject: 'Mathematics', score: 95, grade: 'A+', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { subject: 'Physics', score: 88, grade: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { subject: 'Chemistry', score: 76, grade: 'B+', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { subject: 'English', score: 92, grade: 'A+', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { subject: 'Computer Sci', score: 98, grade: 'O', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:translate-y-1 transition-transform">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} opacity-20 rounded-bl-full -mr-6 -mt-6`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-700 text-lg">{item.subject}</h3>
                            <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center font-bold ${item.color}`}>
                                {item.grade}
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-slate-800 mb-2">{item.score}<span className="text-sm font-medium text-slate-400 ml-1">/100</span></h2>

                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${item.bg.replace('bg-', 'bg-opacity-100 bg-')}`} style={{ width: `${item.score}%` }}></div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>Excellent! Top 5% in class</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exams;
