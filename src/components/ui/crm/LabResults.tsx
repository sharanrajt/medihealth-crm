"use client";
import React, { useState } from "react";
import {
    IconTestPipe,
    IconSearch,
    IconFilter,
    IconFileAnalytics,
    IconMicroscope,
    IconDna,
    IconActivity,
    IconDownload,
    IconEye,
    IconX
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrmData, type LabResult } from "@/lib/crm-data-store";

const LabResults = () => {
    const { labResults } = useCrmData();
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewTestModal, setShowNewTestModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("All");

    const filteredResults = labResults.filter(result =>
        (filterStatus === "All" || result.status === filterStatus) &&
        (result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleNewTestOrder = (e: React.FormEvent) => {
        e.preventDefault();
        alert("New test order submitted successfully!");
        setShowNewTestModal(false);
    };

    const handleDownload = (result: LabResult) => {
        alert(`Downloading report for ${result.id}...`);
    };

    const handleViewDetails = (result: LabResult) => {
        setSelectedResult(result);
    };

    return (
        <div className="h-full w-full p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <IconMicroscope className="text-blue-500" size={32} />
                        Lab Results & Diagnostics
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and view patient test results</p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowNewTestModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <IconTestPipe size={20} />
                        New Test Order
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by patient, test type, or ID..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200"
                >
                    <option value="All">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredResults.map((result, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={result.id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${result.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                        result.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    <IconDna size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{result.testType}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${result.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                result.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400'
                                            }`}>
                                            {result.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Patient: <span className="font-medium text-gray-700 dark:text-gray-300">{result.patientName}</span> •
                                        ID: {result.id}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <IconActivity size={14} /> Result: {result.resultSummary}
                                        </span>
                                        <span>Ordered by: {result.doctor}</span>
                                        <span>Date: {result.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:self-center self-end">
                                <button 
                                    onClick={() => handleViewDetails(result)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                                    title="View Details"
                                >
                                    <IconEye size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDownload(result)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                                    title="Download Report"
                                >
                                    <IconDownload size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* New Test Order Modal */}
            <AnimatePresence>
                {showNewTestModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNewTestModal(false)}
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
                                    <IconTestPipe className="text-blue-500" size={24} />
                                    New Test Order
                                </h3>
                                <button
                                    onClick={() => setShowNewTestModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleNewTestOrder} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter patient name"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Test Type
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option>Complete Blood Count (CBC)</option>
                                        <option>Lipid Panel</option>
                                        <option>MRI - Brain</option>
                                        <option>Urinalysis</option>
                                        <option>Liver Function Test</option>
                                        <option>X-Ray</option>
                                        <option>CT Scan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option>Routine</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Ordering Doctor
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter doctor name"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Submit Order
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewTestModal(false)}
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

            {/* View Details Modal */}
            <AnimatePresence>
                {selectedResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedResult(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lab Result Details</h3>
                                <button
                                    onClick={() => setSelectedResult(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Test ID</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.id}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Patient</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.patientName}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Test Type</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.testType}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.status}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.priority}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Result Summary</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.resultSummary}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ordered By</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.doctor}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedResult.date}</p>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            handleDownload(selectedResult);
                                            setSelectedResult(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <IconDownload size={18} />
                                        Download Report
                                    </button>
                                    <button
                                        onClick={() => setSelectedResult(null)}
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
        </div>
    );
};

export default LabResults;
