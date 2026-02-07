"use client";
import React, { useState } from "react";
import { IconSearch, IconFilter, IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrmData, type PatientRecord } from "@/lib/crm-data-store";

const Records = () => {
    const { patients: records, addPatient, updatePatient, deletePatient } = useCrmData();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"All" | "Admitted" | "Outpatient" | "Critical" | "Discharged">("All");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);

    const filteredRecords = records.filter(record =>
        (filterStatus === "All" || record.status === filterStatus) &&
        (record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Admitted": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            case "Outpatient": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "Critical": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
            case "Discharged": return "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        addPatient({
            name: formData.get("name") as string,
            age: parseInt(formData.get("age") as string),
            gender: formData.get("gender") as "Male" | "Female" | "Other",
            diagnosis: formData.get("diagnosis") as string,
            department: formData.get("department") as string,
            status: formData.get("status") as "Admitted" | "Outpatient" | "Critical" | "Discharged",
            admissionDate: formData.get("admissionDate") as string,
        });
        setShowAddModal(false);
    };

    const handleEditPatient = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedRecord) return;
        const formData = new FormData(e.currentTarget);
        updatePatient(selectedRecord.id, {
            name: formData.get("name") as string,
            age: parseInt(formData.get("age") as string),
            gender: formData.get("gender") as "Male" | "Female" | "Other",
            diagnosis: formData.get("diagnosis") as string,
            department: formData.get("department") as string,
            status: formData.get("status") as "Admitted" | "Outpatient" | "Critical" | "Discharged",
            admissionDate: formData.get("admissionDate") as string,
        });
        setShowEditModal(false);
        setSelectedRecord(null);
    };

    const handleDeletePatient = (id: string) => {
        if (confirm("Are you sure you want to delete this patient record?")) {
            deletePatient(id);
        }
    };

    const handleViewDetails = (record: PatientRecord) => {
        setSelectedRecord(record);
        setShowDetailsModal(true);
    };

    const handleEditClick = (record: PatientRecord) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    };

    return (
        <div className="h-full w-full p-6 overflow-hidden flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Records</h1>
                    <p className="text-gray-500 mt-1">Manage patient admissions and medical history.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
                >
                    <IconPlus size={20} className="mr-2" /> Add New Patient
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex items-center justify-between">
                <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-900 rounded-lg px-3 py-2 border border-transparent focus-within:border-blue-500 transition-colors">
                    <IconSearch size={20} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, department..."
                        className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 w-full placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Filter by Status:</span>
                        <select
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Admitted">Admitted</option>
                            <option value="Outpatient">Outpatient</option>
                            <option value="Critical">Critical</option>
                            <option value="Discharged">Discharged</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age/Sex</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admitted</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {filteredRecords.map((record) => (
                                    <motion.tr
                                        key={record.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onClick={() => handleViewDetails(record)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{record.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-semibold">{record.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.age} / {record.gender.charAt(0)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.diagnosis}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.department}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.admissionDate}</td>
                                        <td className="px-6 py-4 text-sm text-right space-x-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(record);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                            >
                                                <IconEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePatient(record.id);
                                                }}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredRecords.length === 0 && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No records found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Patient Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Patient</h2>
                                <p className="text-gray-500 mt-1">Enter patient information to create a new record.</p>
                            </div>
                            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Patient Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            required
                                            min="0"
                                            max="150"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="45"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="Admitted">Admitted</option>
                                            <option value="Outpatient">Outpatient</option>
                                            <option value="Critical">Critical</option>
                                            <option value="Discharged">Discharged</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Diagnosis
                                    </label>
                                    <input
                                        type="text"
                                        name="diagnosis"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Hypertension"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Cardiology"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Admission Date
                                    </label>
                                    <input
                                        type="date"
                                        name="admissionDate"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Add Patient
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Patient Modal */}
            <AnimatePresence>
                {showEditModal && selectedRecord && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowEditModal(false);
                            setSelectedRecord(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Patient Record</h2>
                                <p className="text-gray-500 mt-1">Update patient information.</p>
                            </div>
                            <form onSubmit={handleEditPatient} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Patient Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            defaultValue={selectedRecord.name}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            required
                                            min="0"
                                            max="150"
                                            defaultValue={selectedRecord.age}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            required
                                            defaultValue={selectedRecord.gender}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            required
                                            defaultValue={selectedRecord.status}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="Admitted">Admitted</option>
                                            <option value="Outpatient">Outpatient</option>
                                            <option value="Critical">Critical</option>
                                            <option value="Discharged">Discharged</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Diagnosis
                                    </label>
                                    <input
                                        type="text"
                                        name="diagnosis"
                                        required
                                        defaultValue={selectedRecord.diagnosis}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        required
                                        defaultValue={selectedRecord.department}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Admission Date
                                    </label>
                                    <input
                                        type="date"
                                        name="admissionDate"
                                        required
                                        defaultValue={selectedRecord.admissionDate}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedRecord(null);
                                        }}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Update Patient
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedRecord && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowDetailsModal(false);
                            setSelectedRecord(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Details</h2>
                                <p className="text-gray-500 mt-1">Complete patient record information.</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRecord.status)}`}>
                                            {selectedRecord.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Age / Gender</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.age} / {selectedRecord.gender}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Diagnosis</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.diagnosis}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Admission Date</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.admissionDate}</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedRecord(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Records;
