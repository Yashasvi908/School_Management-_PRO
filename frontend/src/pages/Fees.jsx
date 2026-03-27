import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Download,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    FileText,
    TrendingUp,
    Bell,
    Smartphone,
    Mail
} from 'lucide-react';

const Fees = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Mock Data
    const feeStructure = {
        totalFee: 50000,
        paidAmount: 35000,
        pendingAmount: 15000,
        currency: '₹',
        dueDate: '2026-03-10',
        lateFeePerDay: 50
    };

    const [installments, setInstallments] = useState([]);
    const [loadingFees, setLoadingFees] = useState(true);

    // Mock Fallback Data (if backend is empty)
    const mockInstallments = [
        { id: 1, title: 'Term 1 Fee', amount: 15000, dueDate: '2025-06-10', status: 'Paid', paidDate: '2025-06-05', lateFee: 0 },
        { id: 2, title: 'Term 2 Fee', amount: 15000, dueDate: '2025-09-10', status: 'Paid', paidDate: '2025-09-12', lateFee: 100 },
        { id: 3, title: 'Term 3 Fee', amount: 5000, dueDate: '2025-12-10', status: 'Paid', paidDate: '2025-12-08', lateFee: 0 },
        { id: 4, title: 'Term 4 Fee', amount: 15000, dueDate: '2026-03-10', status: 'Pending', paidDate: null, lateFee: 0 },
    ];

    React.useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/school/fees');
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const mappedFees = data.map((fee, index) => ({
                            id: fee._id,
                            title: `Fee Schedule #${index + 1}`, // Generate title since model lacks it
                            amount: fee.amount,
                            dueDate: new Date(fee.dueDate).toISOString().split('T')[0],
                            status: fee.status,
                            paidDate: fee.paymentDate ? new Date(fee.paymentDate).toISOString().split('T')[0] : null,
                            lateFee: 0 // Mock for now
                        }));
                        setInstallments(mappedFees);
                    } else {
                        setInstallments(mockInstallments);
                    }
                } else {
                    setInstallments(mockInstallments);
                }
                setLoadingFees(false);
            } catch (error) {
                console.error("Error fetching fees:", error);
                setInstallments(mockInstallments);
                setLoadingFees(false);
            }
        };
        fetchFees();
    }, []);

    // Auto Late Fee Calculation Logic
    const calculateTotalWithLateFee = (installment) => {
        if (installment.status === 'Paid') return installment.amount + installment.lateFee;

        const today = new Date();
        const due = new Date(installment.dueDate);
        if (today > due) {
            const diffTime = Math.abs(today - due);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return installment.amount + (diffDays * feeStructure.lateFeePerDay);
        }
        return installment.amount;
    };

    const handleDownloadReceipt = (id) => {
        alert(`Downloading receipt for installment #${id}... (PDF Generation Simulation)`);
    };

    const handlePayment = (installment) => {
        setSelectedInstallment(installment);
        setShowPaymentModal(true);
    };

    const processPayment = async () => {
        // Simulate Payment Gateway Integration (Wait a bit)
        alert(`Processing payment of ${feeStructure.currency}${calculateTotalWithLateFee(selectedInstallment)} via ${paymentMethod}...`);

        try {
            // Update status in backend
            const response = await fetch(`http://localhost:8000/api/school/fees/${selectedInstallment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Paid',
                    paymentDate: new Date(),
                    paymentMethod: paymentMethod
                })
            });

            if (response.ok) {
                // Update local state
                setInstallments(prev => prev.map(item =>
                    item.id === selectedInstallment.id
                        ? { ...item, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] }
                        : item
                ));

                setTimeout(() => {
                    setShowPaymentModal(false);
                    alert('Payment Successful! Receipt sent to email and SMS.');
                }, 1000);
            } else {
                alert('Payment verification failed. Please try again.');
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert('Error processing payment.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-indigo-600" />
                        Smart Fee Management
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Academic Sesssion 2025-26 • Class 10-A</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                        <FileText className="w-5 h-5" /> History
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Pay Full Fees
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Reminders */}
                <div className="space-y-8 lg:col-span-1">
                    {/* Fee Summary Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                        <h3 className="font-bold text-slate-800 mb-6 text-xl relative z-10">Fee Statistics</h3>

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 font-medium">Total Fees</span>
                                <span className="font-bold text-2xl text-slate-800">{feeStructure.currency}{feeStructure.totalFee.toLocaleString()}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-emerald-600">Paid Amount</span>
                                    <span className="text-emerald-700">{feeStructure.currency}{feeStructure.paidAmount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(feeStructure.paidAmount / feeStructure.totalFee) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="bg-emerald-500 h-full rounded-full"
                                    ></motion.div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-rose-600">Pending Due</span>
                                    <span className="text-rose-700">{feeStructure.currency}{feeStructure.pendingAmount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(feeStructure.pendingAmount / feeStructure.totalFee) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                        className="bg-rose-500 h-full rounded-full"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-sm text-slate-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <p>Next Due Date: <span className="font-bold text-amber-800">10 Mar 2026</span>. Late fees apply after due date.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Auto-Reminders Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Bell className="w-6 h-6" /> Smart Reminders
                            </h3>
                            <p className="text-indigo-100 mb-6">Get automated alerts for upcoming fee dues via SMS and Email.</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-md">
                                    <Smartphone className="w-5 h-5 text-indigo-200" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">SMS Alerts</p>
                                        <p className="text-xs text-indigo-200">Enabled for +91 98XXXXXX90</p>
                                    </div>
                                    <div className="w-8 h-4 bg-green-400/30 rounded-full relative"><div className="w-4 h-4 bg-green-400 rounded-full absolute right-0"></div></div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-md">
                                    <Mail className="w-5 h-5 text-indigo-200" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Email Notifications</p>
                                        <p className="text-xs text-indigo-200">Enabled for parent@gmail.com</p>
                                    </div>
                                    <div className="w-8 h-4 bg-green-400/30 rounded-full relative"><div className="w-4 h-4 bg-green-400 rounded-full absolute right-0"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Installments */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                        <Clock className="w-6 h-6 text-indigo-600" /> Installment Schedule
                    </h3>

                    <div className="space-y-4">
                        {installments.map((item, index) => {
                            const isOverdue = new Date(item.dueDate) < new Date() && item.status === 'Pending';
                            const totalAmount = calculateTotalWithLateFee(item);

                            return (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={item.id}
                                    className={`bg-white p-6 rounded-2xl border transition-all ${item.status === 'Paid' ? 'border-emerald-100 shadow-sm' :
                                        isOverdue ? 'border-rose-200 shadow-md ring-1 ring-rose-100' : 'border-slate-100 shadow-sm'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl flex-shrink-0 ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                                isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {item.status === 'Paid' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{item.title}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Due: {item.dueDate}</span>
                                                    {item.status === 'Paid' && <span className="text-emerald-600 font-medium">Paid on {item.paidDate}</span>}
                                                </div>
                                                {isOverdue && (
                                                    <p className="text-xs text-rose-600 font-bold mt-2 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" /> Overdue! Late fees applied.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-slate-800">{feeStructure.currency}{totalAmount.toLocaleString()}</p>
                                                {item.lateFee > 0 && <p className="text-xs text-rose-500">(Includes {feeStructure.currency}{item.lateFee} Late Fee)</p>}
                                                {isOverdue && item.lateFee === 0 && <p className="text-xs text-rose-500">(Late fee varies daily)</p>}
                                            </div>

                                            {item.status === 'Pending' ? (
                                                <button
                                                    onClick={() => handlePayment(item)}
                                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 w-full md:w-auto"
                                                >
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDownloadReceipt(item.id)}
                                                    className="px-5 py-2.5 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                                                >
                                                    <Download className="w-4 h-4" /> Download Receipt
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && selectedInstallment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto thin-scrollbar relative"
                        >
                            <div className="bg-indigo-600 p-6 text-white text-center relative">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="absolute right-4 top-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                                <h2 className="text-2xl font-bold">Secure Payment</h2>
                                <p className="text-indigo-100 mt-1">Complete your transaction securely</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                    <span className="text-slate-500">Pay For</span>
                                    <span className="font-bold text-slate-800">{selectedInstallment.title}</span>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-700">Select Payment Method</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Card', 'UPI', 'NetBanking', 'Wallet'].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method.toLowerCase())}
                                                className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all ${paymentMethod === method.toLowerCase()
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                                    }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-xl space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="text-slate-800">{feeStructure.currency}{selectedInstallment.amount}</span>
                                    </div>
                                    {calculateTotalWithLateFee(selectedInstallment) > selectedInstallment.amount && (
                                        <div className="flex justify-between text-sm text-rose-600 font-medium">
                                            <span>Late Fee</span>
                                            <span>+{feeStructure.currency}{calculateTotalWithLateFee(selectedInstallment) - selectedInstallment.amount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200">
                                        <span className="text-slate-800">Total Payable</span>
                                        <span className="text-indigo-600">{feeStructure.currency}{calculateTotalWithLateFee(selectedInstallment)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={processPayment}
                                    className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Pay {feeStructure.currency}{calculateTotalWithLateFee(selectedInstallment)} Now
                                </button>

                                {/* Scan & Pay Section */}
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    <div className="text-center mb-4">
                                        <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Or Scan & Pay Instantly</p>
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 inline-block">
                                            {/* Placeholder for User's QR Code */}
                                            <img
                                                src="/assets/payment-qr.png"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=school@upi&pn=SchoolFees";
                                                }}
                                                alt="Payment QR Code"
                                                className="w-48 h-48 object-contain rounded-lg"
                                            />
                                            <p className="text-xs text-slate-400 mt-2 font-mono">Scan with any UPI App</p>
                                        </div>
                                    </div>

                                    {/* Payment Provider Logos */}
                                    <div className="flex justify-center items-center gap-6 opacity-80 grayscale hover:grayscale-0 transition-all">
                                        {/* Google Pay Logo */}
                                        <div className="h-8 flex items-center" title="Google Pay">
                                            <svg viewBox="0 0 24 24" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23.41 12.03c0-.85-.09-1.63-.22-2.39H12v4.4h6.5c-.32 1.63-1.2 2.94-2.47 3.82v3.1h3.9c2.29-2.07 3.48-5.18 3.48-8.93z" fill="#4285F4" />
                                                <path d="M12 23.5c3.22 0 5.89-1.07 7.86-2.9l-3.9-3.1c-1.03.71-2.4 1.15-3.96 1.15-3.14 0-5.78-2.15-6.72-4.96H1.28v3.13C3.25 20.73 7.33 23.5 12 23.5z" fill="#34A853" />
                                                <path d="M5.28 13.69c-.24-.71-.38-1.46-.38-2.25s.14-1.54.38-2.25V6.06H1.28C.46 7.6 0 9.25 0 12c0 2.75.46 4.4 1.28 5.94l4-3.25z" fill="#FBBC05" />
                                                <path d="M12 5.94c1.68 0 3.25.6 4.49 1.76l3.3-3.3C17.89 2.5 15.22 1.25 12 1.25 7.33 1.25 3.25 4.02 1.28 7.94l4 3.12c.94-2.81 3.58-4.96 6.72-4.96z" fill="#EA4335" />
                                            </svg>
                                        </div>

                                        {/* Paytm Logo Placeholder (Text for simplicity or SVG part) */}
                                        <div className="h-6 flex items-center font-bold text-slate-700 italic text-xl tracking-tighter" title="Paytm">
                                            <span className="text-[#002E6E]">Pay</span><span className="text-[#00B9F1]">tm</span>
                                        </div>

                                        {/* BHIM UPI Logo */}
                                        <div className="h-8 flex items-center" title="BHIM UPI">
                                            <svg viewBox="0 0 64 32" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="64" height="32" rx="4" fill="white" />
                                                <path d="M8 8h48v3h-48z" fill="#FF9933" />
                                                <path d="M8 21h48v3h-48z" fill="#138808" />
                                                <text x="10" y="20" fontSize="10" fontWeight="bold" fill="#000080" fontFamily="sans-serif">BHIM UPI</text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1 mt-6">
                                    <CheckCircle className="w-3 h-3" /> 256-bit SSL Secured Transaction
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Fees;
