"use client";
import React, { useState } from "react";
import {
    IconUsers,
    IconStethoscope,
    IconBuildingHospital,
    IconClipboardList,
    IconTrendingUp,
    IconClock,
    IconCalendarEvent,
    IconAlertCircle,
    IconActivity,
    IconBed,
    IconX
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const StatCard = ({ title, value, icon, color, trend, onClick }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between cursor-pointer"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
                <IconTrendingUp size={16} className="mr-1" /> {trend}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </motion.div>
);

const ActivityItem = ({ title, time, type, onClick }: any) => (
    <div 
        onClick={onClick}
        className="flex items-start pb-4 mb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
    >
        <div className={`mt-1 p-2 rounded-full mr-4 shrink-0 ${type === 'alert' ? 'bg-red-100 text-red-600' :
            type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
            }`}>
            {type === 'alert' ? <IconAlertCircle size={16} /> :
                type === 'success' ? <IconClipboardList size={16} /> : <IconClock size={16} />}
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
            <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedStat, setSelectedStat] = useState<string | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

    const handleGenerateReport = () => {
        setShowReportModal(true);
        // Simulate report generation
        setTimeout(() => {
            alert("Report generated successfully!");
            setShowReportModal(false);
        }, 2000);
    };

    const handleStatClick = (statName: string) => {
        setSelectedStat(statName);
        alert(`Viewing detailed analytics for: ${statName}`);
    };

    const handleActivityClick = (activity: string) => {
        setSelectedActivity(activity);
        alert(`Activity details: ${activity}`);
    };
    return (
        <div className="h-full w-full p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hospital Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Chief Administrator.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleGenerateReport}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Generate Report
                    </button>
                    <button 
                        onClick={() => setShowSettingsModal(true)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Settings
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Patients"
                    value="1,245"
                    icon={<IconUsers size={24} />}
                    color="bg-blue-500"
                    trend="+12%"
                    onClick={() => handleStatClick("Total Patients")}
                />
                <StatCard
                    title="Doctors on Duty"
                    value="48"
                    icon={<IconStethoscope size={24} />}
                    color="bg-emerald-500"
                    trend="+5%"
                    onClick={() => handleStatClick("Doctors on Duty")}
                />
                <StatCard
                    title="Occupied Beds"
                    value="89%"
                    icon={<IconBed size={24} />}
                    color="bg-purple-500"
                    trend="+8%"
                    onClick={() => handleStatClick("Occupied Beds")}
                />
                <StatCard
                    title="Avg. Wait Time"
                    value="14m"
                    icon={<IconClock size={24} />}
                    color="bg-amber-500"
                    trend="-2%"
                    onClick={() => handleStatClick("Avg. Wait Time")}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                        <button 
                            onClick={() => alert("Viewing all activities...")}
                            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <ActivityItem
                        title="New patient admission: John Doe (ER)"
                        time="2 minutes ago"
                        type="info"
                        onClick={() => handleActivityClick("New patient admission: John Doe (ER)")}
                    />
                    <ActivityItem
                        title="Dr. House updated patient record #4421"
                        time="15 minutes ago"
                        type="success"
                        onClick={() => handleActivityClick("Dr. House updated patient record #4421")}
                    />
                    <ActivityItem
                        title="Emergency Alert: Low supply of O- Blood"
                        time="1 hour ago"
                        type="alert"
                        onClick={() => handleActivityClick("Emergency Alert: Low supply of O- Blood")}
                    />
                    <ActivityItem
                        title="Billing processed: $12,500 (Insurance Claim)"
                        time="2 hours ago"
                        type="success"
                        onClick={() => handleActivityClick("Billing processed: $12,500 (Insurance Claim)")}
                    />
                    <ActivityItem
                        title="Maintenance scheduled for MRI Room 3"
                        time="4 hours ago"
                        type="info"
                        onClick={() => handleActivityClick("Maintenance scheduled for MRI Room 3")}
                    />
                </div>

                {/* Upcoming Events */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Department Schedule</h2>
                        <IconCalendarEvent className="text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                            <p className="text-xs font-bold text-blue-500 mb-1">TODAY, 2:00 PM</p>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Shift Change / Handoff</h4>
                            <p className="text-xs text-gray-500 mt-1">Main Nursing Station</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500">
                            <p className="text-xs font-bold text-purple-500 mb-1">TOMORROW, 10:00 AM</p>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Cardiology Seminar</h4>
                            <p className="text-xs text-gray-500 mt-1">Auditorium</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                            <p className="text-xs font-bold text-green-500 mb-1">FRI, 9:00 AM</p>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Safety Inspection</h4>
                            <p className="text-xs text-gray-500 mt-1">ICU & Emergency Wing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Generation Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowReportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IconClipboardList className="text-blue-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generating Report</h3>
                                <p className="text-gray-500 mb-6">Please wait while we compile your hospital analytics...</p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettingsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowSettingsModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Settings</h3>
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Refresh Interval
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option>30 seconds</option>
                                        <option>1 minute</option>
                                        <option>5 minutes</option>
                                        <option>Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" defaultChecked className="rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Show notifications</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" defaultChecked className="rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Auto-refresh data</span>
                                    </label>
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            alert("Settings saved!");
                                            setShowSettingsModal(false);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setShowSettingsModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
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

export default Dashboard;
