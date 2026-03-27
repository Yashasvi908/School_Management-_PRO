import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X, Film, BookOpen, Clock, Tag, Calendar, Users, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LectureUpload = () => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        class: '',
        description: '',
        scheduledDate: '',
    });
    const [files, setFiles] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);

    const sections = ['Section A', 'Section B', 'Section C', 'Section D'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const toggleSection = (section) => {
        if (selectedSections.includes(section)) {
            setSelectedSections(selectedSections.filter(s => s !== section));
        } else {
            setSelectedSections([...selectedSections, section]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In a real app, upload files first to S3/Cloudinary and get URLs
            // Here we mock the file URL but save the metadata to MongoDB
            const payload = {
                title: formData.title,
                subject: formData.subject,
                class: formData.class,
                description: formData.description,
                videoUrl: files.length > 0 ? `https://storage.school.edu/${files[0].name}` : 'https://example.com/placeholder-video.mp4',
                notesUrl: files.length > 1 ? `https://storage.school.edu/${files[1].name}` : '',
                scheduledDate: formData.scheduledDate
            };

            const response = await fetch('http://localhost:8000/api/school/lectures', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setFormData({ title: '', subject: '', class: '', description: '', scheduledDate: '' });
                    setFiles([]);
                    setTags([]);
                    setSelectedSections([]);
                    setScheduleEnabled(false);
                }, 3000);
            } else {
                setLoading(false);
                alert('Failed to upload lecture');
            }
        } catch (error) {
            console.error("Error uploading lecture:", error);
            setLoading(false);
            alert('Error connecting to server');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                <span className="bg-indigo-600 text-white p-2 rounded-lg"><Upload className="w-6 h-6" /></span>
                                Advanced Content Upload
                            </h2>
                            <p className="text-slate-500 mt-2 text-lg">Create comprehensive learning modules with multi-file support and scheduling.</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wide">Live Preview</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">Auto-Save On</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Lecture Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">Lecture Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Quantum Mechanics: Wave Function"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-lg font-medium"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">Description & Notes</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="Provide a detailed overview, key takeaways, and instructions for students..."
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none bg-white"
                                        ></textarea>
                                        <div className="flex justify-end mt-1 text-xs text-slate-400">
                                            {formData.description.length} characters
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Multi-File Upload Area */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Resources & Attachments</h3>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-all">
                                        <Upload className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <p className="text-slate-700 font-semibold text-lg">Drop files here or click to upload</p>
                                    <p className="text-slate-500 text-sm mt-2">Support for Video, PDF, PPT, DOCX</p>
                                </div>

                                {/* File List */}
                                <AnimatePresence>
                                    {files.length > 0 && (
                                        <div className="mt-6 space-y-3">
                                            {files.map((file, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    key={index}
                                                    className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
                                                >
                                                    <div className={`p-2 rounded-lg ${file.type.includes('video') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {file.type.includes('video') ? <Film className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Sidebar Options */}
                        <div className="space-y-6">
                            {/* Metadata Card */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Metadata</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 bg-white text-sm"
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">Class/Grade</label>
                                        <select
                                            name="class"
                                            value={formData.class}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 bg-white text-sm"
                                            required
                                        >
                                            <option value="">Select Class</option>
                                            {[8, 9, 10, 11, 12].map(num => <option key={num} value={`Class ${num}`}>Class {num}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Target Sections</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {sections.map((section) => (
                                                <button
                                                    key={section}
                                                    type="button"
                                                    onClick={() => toggleSection(section)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${selectedSections.includes(section)
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {section}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Card */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Tags
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, idx) => (
                                            <span key={idx} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add tag and press Enter"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagInput}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Scheduling Card */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Scheduling
                                    </h3>
                                    <div
                                        onClick={() => setScheduleEnabled(!scheduleEnabled)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${scheduleEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${scheduleEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {scheduleEnabled && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <input
                                                type="datetime-local"
                                                name="scheduledDate"
                                                value={formData.scheduledDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 text-sm text-slate-600"
                                            />
                                            <p className="text-xs text-slate-400 mt-2">Content will be automatically published at this time.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {!scheduleEnabled && <p className="text-xs text-slate-400">Content will be published immediately upon submission.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Save Draft
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publishing...
                                </span>
                            ) : (
                                scheduleEnabled ? 'Schedule Publish' : 'Publish Now'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Success Toast */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: -50 }}
                        animate={{ opacity: 1, y: 0, x: -50 }}
                        exit={{ opacity: 0, y: 50, x: -50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 backdrop-blur-md bg-opacity-95"
                    >
                        <div className="bg-white/20 p-2 rounded-full">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Published Successfully!</h4>
                            <p className="text-white/80 text-sm">Your lecture content is now live for students.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LectureUpload;
