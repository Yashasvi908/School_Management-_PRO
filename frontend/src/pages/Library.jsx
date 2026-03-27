import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Search,
    Plus,
    Barcode,
    CheckCircle,
    XCircle,
    Clock,
    Upload,
    FileText,
    Download,
    AlertCircle,
    User
} from 'lucide-react';
import BarcodeDisplay from 'react-barcode';

const Library = () => {
    const [viewMode, setViewMode] = useState('books'); // 'books', 'digital', 'issue'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    React.useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/school/library/books');
                if (response.ok) {
                    const data = await response.json();
                    const mappedBooks = data.map(book => ({
                        id: book._id, // User friendly ID could be generated or stored
                        title: book.title,
                        author: book.author,
                        category: book.category || 'General',
                        status: book.available > 0 ? 'Available' : 'Issued',
                        copies: book.available,
                        barcode: book.isbn || 'N/A',
                        // Mock fields for now as they aren't in schema yet
                        dueDate: book.available === 0 ? '2026-03-01' : null,
                        holder: book.available === 0 ? 'Student' : null
                    }));
                    setBooks(mappedBooks);
                }
                setLoadingBooks(false);
            } catch (error) {
                console.error("Error fetching books:", error);
                setLoadingBooks(false);
            }
        };
        fetchBooks();
    }, []);

    const digitalResources = [
        { id: 1, title: 'Physics Chapter 1 - Notes', type: 'PDF', size: '2.5 MB', uploader: 'Mr. Sharma' },
        { id: 2, title: 'Math Formulas Cheat Sheet', type: 'PDF', size: '1.2 MB', uploader: 'Mrs. Verma' },
        { id: 3, title: 'History of India - Vol 1', type: 'E-Book', size: '15 MB', uploader: 'Library Admin' },
    ];

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                        Library Management
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage Books, E-resources & Issues</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setViewMode('books')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'books' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <BookOpen className="w-4 h-4" /> Books
                    </button>
                    <button
                        onClick={() => setViewMode('digital')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'digital' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText className="w-4 h-4" /> Digital Library
                    </button>
                    <button
                        onClick={() => setViewMode('issue')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'issue' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Barcode className="w-4 h-4" /> Issue/Return
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Title, Author, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-lg"
                        />
                    </div>

                    {viewMode === 'books' && (
                        <div className="space-y-4">
                            {filteredBooks.map(book => (
                                <motion.div
                                    key={book.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setSelectedBook(book)}
                                    className={`bg-white p-6 rounded-2xl border cursor-pointer hover:shadow-md transition-all ${selectedBook?.id === book.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{book.id}</span>
                                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{book.category}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">{book.title}</h3>
                                            <p className="text-slate-500 text-sm">by {book.author}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${book.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                            book.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {book.status === 'Available' ? <CheckCircle className="w-3 h-3" /> :
                                                book.status === 'Overdue' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {book.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'digital' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Upload Card */}
                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group h-48">
                                <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-100 transition-colors mb-3">
                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                                </div>
                                <h4 className="font-bold text-slate-700 group-hover:text-indigo-700">Upload New Resource</h4>
                                <p className="text-xs text-slate-400 mt-1">PDF, EPUB, DOCX (Max 50MB)</p>
                            </div>

                            {digitalResources.map(res => (
                                <motion.div
                                    key={res.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between h-48"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <FileText className="w-8 h-8 text-rose-500" />
                                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{res.type}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mt-3 line-clamp-2">{res.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">Uploaded by {res.uploader}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                                        <span className="text-xs font-bold text-slate-400">{res.size}</span>
                                        <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-bold">
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'issue' && (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center space-y-6">
                            <div className="w-full max-w-sm mx-auto bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300">
                                <Barcode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="font-bold text-slate-700">Scan Book Barcode</h3>
                                <p className="text-sm text-slate-500 mt-1">Use scanner or enter ISBN manually</p>
                                <div className="flex gap-2 mt-4">
                                    <input
                                        type="text"
                                        placeholder="Enter ISBN / Barcode..."
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                    />
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700">Scan</button>
                                </div>
                            </div>

                            <div className="text-left bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5" /> Quick Rules</h4>
                                <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
                                    <li>Max 3 books per student.</li>
                                    <li>Standard issue period is 14 days.</li>
                                    <li>Fine of ₹10/day applies after due date.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Detail View */}
                <div className="lg:col-span-1 space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedBook ? (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-100 sticky top-6"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{selectedBook.title}</h2>
                                    <button onClick={() => setSelectedBook(null)} className="p-1 hover:bg-slate-100 rounded-full"><XCircle className="w-6 h-6 text-slate-400" /></button>
                                </div>

                                <div className="flex justify-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    <BarcodeDisplay value={selectedBook.barcode} width={1.5} height={50} fontSize={14} />
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Author</span>
                                        <span className="font-semibold text-slate-800 text-right">{selectedBook.author}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Category</span>
                                        <span className="font-semibold text-slate-800">{selectedBook.category}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Inventory Status</span>
                                        <span className={`font-bold ${selectedBook.copies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {selectedBook.copies > 0 ? `${selectedBook.copies} Available` : 'Out of Stock'}
                                        </span>
                                    </div>
                                    {selectedBook.dueDate && (
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-amber-700">Due Date</span>
                                                <span className="font-bold text-amber-900">{selectedBook.dueDate}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-amber-700">Issued To</span>
                                                <span className="font-bold text-amber-900 flex items-center gap-1"><User className="w-3 h-3" /> {selectedBook.holder}</span>
                                            </div>
                                            {selectedBook.fine && (
                                                <div className="pt-2 border-t border-amber-200 mt-2 flex justify-between text-rose-600 font-bold">
                                                    <span>Fine Due</span>
                                                    <span>₹{selectedBook.fine}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex gap-3">
                                    {selectedBook.status === 'Available' ? (
                                        <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                                            Issue Book
                                        </button>
                                    ) : (
                                        <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                                            Return Book
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center text-slate-400 h-64 flex flex-col items-center justify-center"
                            >
                                <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                                <p>Select a book to view details & manage issue/returns</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Library;
