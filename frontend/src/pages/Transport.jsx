import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Navigation,
    Bus,
    Phone,
    User,
    Clock,
    AlertTriangle,
    CheckCircle,
    Search
} from 'lucide-react';
import GoogleMapReact from 'google-map-react';

const Marker = ({ text }) => (
    <div className="flex flex-col items-center">
        <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <Bus className="w-5 h-5" />
        </div>
        <div className="bg-white px-2 py-1 rounded shadow-md mt-1 text-xs font-bold whitespace-nowrap">
            {text}
        </div>
    </div>
);

const Transport = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [loadingBuses, setLoadingBuses] = useState(true);

    const defaultProps = {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 11
    };

    React.useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/school/transport');
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const mappedBuses = data.map((bus, i) => ({
                            id: bus._id,
                            route: `Route ${bus.routeNumber}`,
                            driver: bus.driverName,
                            phone: bus.driverPhone || '+91 9876543210',
                            status: i === 0 ? 'On Time' : i === 1 ? 'Delayed' : 'Arrived', // Mock status
                            location: {
                                lat: defaultProps.center.lat + (Math.random() - 0.5) * 0.1,
                                lng: defaultProps.center.lng + (Math.random() - 0.5) * 0.1
                            },
                            eta: `${10 + i * 5} mins`
                        }));
                        setBuses(mappedBuses);
                        setSelectedBus(mappedBuses[0]);
                    } else {
                        // Keep mock if no data in DB
                        const mockBuses = [
                            { id: '101', route: 'Route A - City Center', driver: 'Rajesh Kumar', phone: '+91 9876543210', status: 'On Time', location: { lat: 28.6139, lng: 77.2090 }, eta: '10 mins' },
                            { id: '102', route: 'Route B - North Campus', driver: 'Suresh Singh', phone: '+91 9876543211', status: 'Delayed', location: { lat: 28.7041, lng: 77.1025 }, eta: '25 mins' },
                        ];
                        setBuses(mockBuses);
                        setSelectedBus(mockBuses[0]);
                    }
                }
                setLoadingBuses(false);
            } catch (error) {
                console.error("Error fetching transport:", error);
                setLoadingBuses(false);
            }
        };
        fetchBuses();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 h-[calc(100vh-100px)] flex flex-col"
        >
            {loadingBuses ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Bus className="w-8 h-8 text-indigo-600" /> Transport Management
                            </h1>
                            <p className="text-slate-500">Live Bus Tracking & Route Management</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Emergency Contact
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                + Add New Route
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                        {/* Sidebar List */}
                        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search bus or driver..."
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {buses.map(bus => (
                                    <motion.div
                                        key={bus.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedBus(bus)}
                                        className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedBus.id === bus.id ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800">{bus.route}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bus.status === 'On Time' ? 'bg-emerald-100 text-emerald-700' :
                                                bus.status === 'Delayed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {bus.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <User className="w-4 h-4" /> {bus.driver}
                                        </div>
                                        <div className="flex justify-between items-center text-xs mt-3">
                                            <span className="flex items-center gap-1 text-slate-400"><Bus className="w-3 h-3" /> Bus #{bus.id}</span>
                                            <span className="flex items-center gap-1 font-semibold text-indigo-600"><Clock className="w-3 h-3" /> ETA: {bus.eta}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Map View */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 max-w-xs">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    {selectedBus.route}
                                </h3>
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                    <img src={`https://ui-avatars.com/api/?name=${selectedBus.driver}&background=random`} alt="Driver" className="w-6 h-6 rounded-full" />
                                    {selectedBus.driver}
                                    <a href={`tel:${selectedBus.phone}`} className="ml-auto bg-green-100 text-green-700 p-1.5 rounded-lg hover:bg-green-200 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex-1 w-full h-full bg-slate-100">
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: "" }} // Enter your Google Maps API key here
                                    defaultCenter={defaultProps.center}
                                    defaultZoom={defaultProps.zoom}
                                    center={selectedBus.location}
                                >
                                    <Marker
                                        lat={selectedBus.location.lat}
                                        lng={selectedBus.location.lng}
                                        text={selectedBus.route}
                                    />
                                </GoogleMapReact>
                            </div>

                            {/* Live Tracking Status Bar */}
                            <div className="bg-white p-4 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="font-semibold text-slate-700">Live Tracking active</span>
                                </div>
                                <div className="text-sm text-slate-500">
                                    Last update: <span className="font-mono text-slate-800">Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default Transport;
