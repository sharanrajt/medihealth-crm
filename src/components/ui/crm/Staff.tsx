"use client";
import React, { useState } from "react";
import { IconSearch, IconFilter, IconPlus, IconTrash, IconEdit, IconMail, IconPhone } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrmData, type StaffMember } from "@/lib/crm-data-store";

const Staff = () => {
    const { staff: staffList, addStaffMember, updateStaffMember, deleteStaffMember } = useCrmData();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [filterRole, setFilterRole] = useState<"All" | "Doctor" | "Nurse" | "Admin" | "Pharmacist" | "Technician" | "Specialist">("All");

    const filteredStaff = staffList.filter(staff =>
        (filterRole === "All" || staff.role === filterRole) &&
        (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        addStaffMember({
            name: formData.get("name") as string,
            role: formData.get("role") as "Doctor" | "Nurse" | "Admin" | "Pharmacist" | "Technician" | "Specialist",
            department: formData.get("department") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
        });
        setShowAddModal(false);
    };

    const handleEditStaff = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedStaff) return;
        const formData = new FormData(e.currentTarget);
        updateStaffMember(selectedStaff.id, {
            name: formData.get("name") as string,
            role: formData.get("role") as "Doctor" | "Nurse" | "Admin" | "Pharmacist" | "Technician" | "Specialist",
            department: formData.get("department") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
        });
        setShowEditModal(false);
        setSelectedStaff(null);
    };

    const handleDeleteStaff = (id: string) => {
        if (confirm("Are you sure you want to remove this staff member?")) {
            deleteStaffMember(id);
        }
    };

    const handleViewDetails = (member: StaffMember) => {
        setSelectedStaff(member);
        setShowDetailsModal(true);
    };

    const handleEditClick = (member: StaffMember) => {
        setSelectedStaff(member);
        setShowEditModal(true);
    };

    return (
        <div className="h-full w-full p-6 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Directory</h1>
                    <p className="text-gray-500 mt-1">Contact and manage medical professionals and staff.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
                >
                    <IconPlus size={20} className="mr-2" /> Add Staff Member
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex items-center justify-between">
                <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-900 rounded-lg px-3 py-2 border border-transparent focus-within:border-blue-500 transition-colors">
                    <IconSearch size={20} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search staff by name, role, department..."
                        className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 w-full placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 font-medium">Filter by Role:</span>
                    <select
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as any)}
                    >
                        <option value="All">All Roles</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Admin">Admin</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="Technician">Technician</option>
                        <option value="Specialist">Specialist</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                <AnimatePresence>
                    {filteredStaff.map((staff) => (
                        <motion.div
                            key={staff.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ y: -5 }}
                            onClick={() => handleViewDetails(staff)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md cursor-pointer"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {staff.name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{staff.name}</h3>
                            <p className="text-sm text-blue-500 font-medium mb-1">{staff.role}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{staff.department}</p>

                            <div className="w-full space-y-2">
                                <a href={`mailto:${staff.email}`} className="flex items-center justify-center w-full py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                                    <IconMail size={16} className="mr-2" /> {staff.email}
                                </a>
                                <a href={`tel:${staff.phone}`} className="flex items-center justify-center w-full py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors">
                                    <IconPhone size={16} className="mr-2" /> {staff.phone}
                                </a>
                            </div>

                            <div className="mt-4 flex space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700 w-full justify-center">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(staff);
                                    }}
                                    className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <IconEdit size={18} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStaff(staff.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <IconTrash size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {filteredStaff.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    No staff found.
                </div>
            )}

            {/* Add Staff Modal */}
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
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Staff Member</h2>
                                <p className="text-gray-500 mt-1">Enter staff member information.</p>
                            </div>
                            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Dr. John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Role
                                        </label>
                                        <select
                                            name="role"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="Doctor">Doctor</option>
                                            <option value="Nurse">Nurse</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Pharmacist">Pharmacist</option>
                                            <option value="Technician">Technician</option>
                                            <option value="Specialist">Specialist</option>
                                        </select>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="john.doe@hospital.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="555-0101"
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
                                        Add Staff Member
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Staff Modal */}
            <AnimatePresence>
                {showEditModal && selectedStaff && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowEditModal(false);
                            setSelectedStaff(null);
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
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Staff Member</h2>
                                <p className="text-gray-500 mt-1">Update staff member information.</p>
                            </div>
                            <form onSubmit={handleEditStaff} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={selectedStaff.name}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Role
                                        </label>
                                        <select
                                            name="role"
                                            required
                                            defaultValue={selectedStaff.role}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="Doctor">Doctor</option>
                                            <option value="Nurse">Nurse</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Pharmacist">Pharmacist</option>
                                            <option value="Technician">Technician</option>
                                            <option value="Specialist">Specialist</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            required
                                            defaultValue={selectedStaff.department}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        defaultValue={selectedStaff.email}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        defaultValue={selectedStaff.phone}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedStaff(null);
                                        }}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Update Staff Member
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedStaff && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowDetailsModal(false);
                            setSelectedStaff(null);
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
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Member Details</h2>
                                <p className="text-gray-500 mt-1">Complete staff member information.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {selectedStaff.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStaff.name}</h3>
                                        <p className="text-blue-500 font-medium">{selectedStaff.role}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Staff ID</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedStaff.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedStaff.department}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                                    <a href={`mailto:${selectedStaff.email}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                        {selectedStaff.email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                    <a href={`tel:${selectedStaff.phone}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                        {selectedStaff.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleEditClick(selectedStaff);
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedStaff(null);
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

export default Staff;
