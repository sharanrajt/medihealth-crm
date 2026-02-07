"use client";
import React, { useState } from "react";
import {
    IconAmbulance,
    IconMapPin,
    IconPhone,
    IconClock,
    IconAlertTriangle,
    IconCheck,
    IconNavigation,
    IconActivity,
    IconX
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const activeAmbulances = [
    {
        id: "AMB-01",
        status: "En Route",
        location: "4th Avenue & Main St",
        eta: "5 mins",
        patientStatus: "Critical (Cardiac Arrest)",
        driver: "Mike Ross",
        medic: "Rachel Zane",
        coordinate: { x: 30, y: 40 }
    },
    {
        id: "AMB-02",
        status: "On Scene",
        location: "123 Elm Street",
        eta: "-",
        patientStatus: "Stable (Fracture)",
        driver: "Harvey Specter",
        medic: "Donna Paulsen",
        coordinate: { x: 60, y: 20 }
    },
    {
        id: "AMB-03",
        status: "Returning",
        location: "Highway 101",
        eta: "12 mins",
        patientStatus: "Transport Complete",
        driver: "Louis Litt",
        medic: "Katrina Bennett",
        coordinate: { x: 80, y: 70 }
    },
    {
        id: "AMB-04",
        status: "Dispatched",
        location: "789 Oak Road",
        eta: "8 mins",
        patientStatus: "Unconscious",
        driver: "Jessica Pearson",
        medic: "Jeff Malone",
        coordinate: { x: 20, y: 80 }
    }
];

const MapPlaceholder = () => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-2xl relative overflow-hidden border border-gray-300 dark:border-gray-700">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Mock Map Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-1 bg-gray-400/30 rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-1 bg-gray-400/30 -rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-1 bg-gray-400/30 rotate-90"></div>

        {/* Ambulance Markers */}
        {activeAmbulances.map((amb) => (
            <motion.div
                key={amb.id}
                className="absolute flex flex-col items-center"
                initial={{ x: `${amb.coordinate.x}%`, y: `${amb.coordinate.y}%`, scale: 0 }}
                animate={{ x: `${amb.coordinate.x}%`, y: `${amb.coordinate.y}%`, scale: 1 }}
                transition={{ type: "spring" }}
            >
                <div className={`p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-900 ${amb.status === 'En Route' || amb.status === 'Dispatched' ? 'bg-red-500 animate-pulse' :
                        amb.status === 'On Scene' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                    <IconAmbulance size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-900 px-2 py-1 rounded text-[10px] font-bold shadow mt-1 whitespace-nowrap border border-gray-100 dark:border-gray-700">
                    {amb.id} • {amb.eta}
                </div>
            </motion.div>
        ))}
    </div>
);

const Ambulance = () => {
    const [ambulances, setAmbulances] = useState(activeAmbulances);
    const [selectedAmbulance, setSelectedAmbulance] = useState<typeof activeAmbulances[0] | null>(null);
    const [showDispatchModal, setShowDispatchModal] = useState(false);

    const handleNavigate = (ambulance: typeof activeAmbulances[0]) => {
        alert(`Opening navigation for ${ambulance.id} to ${ambulance.location}`);
    };

    const handleDispatchNew = () => {
        setShowDispatchModal(true);
    };

    const handleSubmitDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        alert("New ambulance unit dispatched successfully!");
        setShowDispatchModal(false);
    };

    return (
        <div className="h-full w-full p-6 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <IconAlertTriangle className="text-red-500" size={32} />
                        Emergency Dispatch
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time ambulance tracking and dispatch</p>
                </div>
                <button 
                    onClick={handleDispatchNew}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all"
                >
                    <IconPhone size={20} />
                    Dispatch New Unit
                </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* Active Units List */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                    {ambulances.map((amb) => (
                        <div 
                            key={amb.id} 
                            onClick={() => setSelectedAmbulance(amb)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-blue-500 transition-colors cursor-pointer"
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full ${amb.status === 'En Route' || amb.status === 'Dispatched' ? 'bg-red-500' :
                                    amb.status === 'On Scene' ? 'bg-amber-500' : 'bg-blue-500'
                                }`}></div>

                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <IconAmbulance size={18} /> {amb.id}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${amb.status === 'En Route' || amb.status === 'Dispatched' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                        amb.status === 'On Scene' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                    {amb.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p className="flex items-center gap-2">
                                    <IconMapPin size={16} className="text-gray-400" />
                                    {amb.location}
                                </p>
                                <p className="flex items-center gap-2">
                                    <IconClock size={16} className="text-gray-400" />
                                    ETA: <span className="font-semibold text-gray-900 dark:text-white">{amb.eta}</span>
                                </p>
                                <p className="flex items-center gap-2 text-xs">
                                    <IconActivity size={16} className="text-gray-400" />
                                    {amb.patientStatus}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div className="text-xs text-gray-400">
                                    Crew: {amb.driver} & {amb.medic}
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigate(amb);
                                    }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-blue-500 transition-colors"
                                >
                                    <IconNavigation size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map View */}
                <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <IconMapPin size={18} /> GPS Tracking
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-red-500"></div> Critical</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-amber-500"></div> On Scene</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Returning</span>
                        </div>
                    </div>
                    <div className="flex-1 relative p-4">
                        <MapPlaceholder />
                    </div>
                </div>
            </div>

            {/* Ambulance Details Modal */}
            <AnimatePresence>
                {selectedAmbulance && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedAmbulance(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <IconAmbulance size={24} />
                                    {selectedAmbulance.id} Details
                                </h3>
                                <button
                                    onClick={() => setSelectedAmbulance(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedAmbulance.status}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Location</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedAmbulance.location}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Patient Status</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedAmbulance.patientStatus}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Driver</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedAmbulance.driver}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Medic</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedAmbulance.medic}</p>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            handleNavigate(selectedAmbulance);
                                            setSelectedAmbulance(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <IconNavigation size={18} />
                                        Navigate
                                    </button>
                                    <button
                                        onClick={() => setSelectedAmbulance(null)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dispatch Modal */}
            <AnimatePresence>
                {showDispatchModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDispatchModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <IconAlertTriangle className="text-red-500" size={24} />
                                    Dispatch New Unit
                                </h3>
                                <button
                                    onClick={() => setShowDispatchModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitDispatch} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Emergency Location
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter address or coordinates"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priority Level
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Patient Condition
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Describe patient condition..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold"
                                    >
                                        Dispatch Unit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDispatchModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Ambulance;
