"use client";
import React, { useState, useMemo } from "react";
import {
    IconUsers,
    IconStethoscope,
    IconClipboardList,
    IconClock,
    IconAlertCircle,
    IconActivity,
    IconHeart,
    IconAmbulance,
    IconAlertTriangle,
    IconX,
    IconPackage
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrmData } from "@/lib/crm-data-store";

// ============ Helper Functions for Vitals Status ============

const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { label: "Low", color: "text-yellow-600" };
    if (hr > 100) return { label: "High", color: "text-red-600" };
    return { label: "Normal", color: "text-green-600" };
};

const getO2Status = (o2: number) => {
    if (o2 < 90) return { label: "Critical", color: "text-red-600" };
    if (o2 < 95) return { label: "Low", color: "text-yellow-600" };
    return { label: "Normal", color: "text-green-600" };
};

const getTempStatus = (temp: number) => {
    if (temp > 38.5) return { label: "Fever", color: "text-red-600" };
    if (temp > 37.5) return { label: "Elevated", color: "text-yellow-600" };
    if (temp < 36) return { label: "Low", color: "text-blue-600" };
    return { label: "Normal", color: "text-green-600" };
};

// ============ Types ============

interface ActivityItemData {
    title: string;
    time: string;
    type: "alert" | "success" | "info";
    patient?: any;
    lab?: any;
    ambulance?: any;
}

// ============ Components ============

const StatCard = ({ title, value, icon, color, subtitle, onClick }: { title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string; onClick?: () => void }) => (
    <motion.div
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between cursor-pointer"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-2.5 rounded-xl ${color} text-white shadow-md`}>
                {icon}
            </div>
        </div>
    </motion.div>
);

const ActivityItem = ({ title, time, type, onClick }: { title: string; time: string; type: "alert" | "success" | "info"; onClick?: () => void }) => (
    <div
        onClick={onClick}
        className="flex items-start pb-3 mb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
    >
        <div className={`mt-0.5 p-1.5 rounded-full mr-3 shrink-0 ${type === 'alert' ? 'bg-red-100 text-red-600' :
            type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
            }`}>
            {type === 'alert' ? <IconAlertCircle size={14} /> :
                type === 'success' ? <IconClipboardList size={14} /> : <IconClock size={14} />}
        </div>
        <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{time}</p>
        </div>
    </div>
);

const VitalMiniCard = ({ label, value, unit, status, statusColor }: { label: string; value: string | number; unit: string; status: string; statusColor: string }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {value}<span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
        </p>
        <p className={`text-[10px] font-medium ${statusColor} mt-0.5`}>{status}</p>
    </div>
);

const CriticalPatientVitals = ({ patient }: { patient: any }) => {
    const vitals = patient.vitals || {};
    const hr = vitals.heartRate || 0;
    const bpSys = vitals.bloodPressureSystolic || 0;
    const bpDia = vitals.bloodPressureDiastolic || 0;
    const temp = vitals.temperature || 0;
    const o2 = vitals.oxygenSaturation || 0;
    const rr = vitals.respiratoryRate || 0;

    const hrStatus = getHeartRateStatus(hr);
    const o2Status = getO2Status(o2);
    const tempStatus = getTempStatus(temp);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm overflow-hidden"
        >
            <div className={`px-4 py-2 flex items-center justify-between ${patient.status === 'Critical' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                <div className="flex items-center gap-2">
                    <IconHeart size={16} className="text-white animate-pulse" />
                    <span className="text-white font-semibold text-sm">{patient.name}</span>
                    <span className="text-white/80 text-xs">({patient.id})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/90 text-xs">{patient.diagnosis}</span>
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                        {patient.status}
                    </span>
                </div>
            </div>
            <div className="p-4 grid grid-cols-5 gap-2">
                <VitalMiniCard label="Heart" value={hr} unit="bpm" status={hrStatus.label} statusColor={hrStatus.color} />
                <VitalMiniCard label="BP" value={`${bpSys}/${bpDia}`} unit="mmHg" status={bpSys > 140 ? "High" : "Normal"} statusColor={bpSys > 140 ? "text-red-600" : "text-green-600"} />
                <VitalMiniCard label="SpO2" value={o2} unit="%" status={o2Status.label} statusColor={o2Status.color} />
                <VitalMiniCard label="Temp" value={temp} unit="°C" status={tempStatus.label} statusColor={tempStatus.color} />
                <VitalMiniCard label="Resp" value={rr} unit="/min" status={rr > 20 ? "Elevated" : "Normal"} statusColor={rr > 20 ? "text-yellow-600" : "text-green-600"} />
            </div>
            <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-500">
                <span>Last checked: {vitals.lastChecked || "N/A"}</span>
                <span className="text-gray-400">{patient.department}</span>
            </div>
        </motion.div>
    );
};

const InventoryAlert = ({ item }: { item: any }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${item.status === "Out of Stock" ? "bg-red-50 dark:bg-red-900/20" : "bg-amber-50 dark:bg-amber-900/20"
        }`}>
        <div className="flex items-center gap-3">
            <IconPackage size={16} className={item.status === "Out of Stock" ? "text-red-500" : "text-amber-500"} />
            <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
            </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${item.status === "Out of Stock"
            ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
            : "bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300"
            }`}>
            {item.status}
        </span>
    </div>
);

const Dashboard = () => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const { patients, staff, inventory, ambulances, labResults } = useCrmData();

    // Calculate real statistics from the data store
    const stats = useMemo(() => {
        const doctorsOnDuty = staff.filter(s => s.role === "Doctor").length;
        const nursesOnDuty = staff.filter(s => s.role === "Nurse").length;
        const criticalPatients = patients.filter(p => p.status === "Critical" || p.status === "Admitted");
        const admittedPatients = patients.filter(p => p.status === "Admitted" || p.status === "Critical");
        const activeAmbulances = ambulances.filter(a => a.status !== "Available").length;
        const availableAmbulances = ambulances.filter(a => a.status === "Available").length;
        const lowStockItems = inventory.filter(i => i.status === "Low Stock");
        const outOfStockItems = inventory.filter(i => i.status === "Out of Stock");

        return {
            totalPatients: patients.length,
            doctorsOnDuty,
            nursesOnDuty,
            criticalPatients: criticalPatients.length,
            admittedPatients: admittedPatients.length,
            activeAmbulances,
            availableAmbulances,
            totalAmbulances: ambulances.length,
            lowStockItems,
            outOfStockItems,
            pendingLabResults: labResults.filter(r => r.status === "Pending" || r.status === "Processing").length,
            criticalLabResults: labResults.filter(r => r.priority === "Critical").length,
        };
    }, [patients, staff, inventory, ambulances, labResults]);

    // Generate activity items from real data
    const activityItems = useMemo<ActivityItemData[]>(() => {
        const items: ActivityItemData[] = [];

        // Critical patients alerts
        patients.filter(p => p.status === "Critical").forEach(p => {
            items.push({
                title: `Critical Alert: ${p.name} - ${p.diagnosis}`,
                time: p.vitals?.lastChecked || "Unknown",
                type: "alert",
                patient: p,
            });
        });

        // Recent admissions
        patients.filter(p => p.status === "Admitted").forEach(p => {
            if (!items.find(i => i.patient?.id === p.id)) {
                items.push({
                    title: `New admission: ${p.name} (${p.department})`,
                    time: p.admissionDate,
                    type: "info",
                    patient: p,
                });
            }
        });

        // Critical lab results
        labResults.filter(r => r.priority === "Critical").forEach(r => {
            items.push({
                title: `Critical Lab: ${r.patientName} - ${r.testType}`,
                time: r.date,
                type: "alert",
                lab: r,
            });
        });

        // Ambulance dispatches
        ambulances.filter(a => a.status !== "Available" && a.status !== "Returning").forEach(a => {
            items.push({
                title: `Unit ${a.id} dispatched: ${a.callType}`,
                time: `ETA ${a.eta || "—"}`,
                type: "info",
                ambulance: a,
            });
        });

        // Inventory alerts
        if (stats.outOfStockItems.length > 0) {
            items.push({
                title: `CRITICAL: ${stats.outOfStockItems.length} item(s) out of stock`,
                time: "Immediate attention required",
                type: "alert",
            });
        }

        if (stats.lowStockItems.length > 0) {
            items.push({
                title: `Low stock alert: ${stats.lowStockItems.length} item(s) need reorder`,
                time: "Review and restock soon",
                type: "success",
            });
        }

        return items.slice(0, 6);
    }, [patients, labResults, ambulances, stats]);

    // Critical patients for vitals display
    const criticalPatientsList = useMemo(() => {
        return patients.filter(p => p.status === "Critical" || p.status === "Admitted");
    }, [patients]);

    // Inventory alerts
    const inventoryAlerts = useMemo(() => {
        return [...stats.outOfStockItems, ...stats.lowStockItems].slice(0, 4);
    }, [stats.outOfStockItems, stats.lowStockItems]);

    const handleGenerateReport = () => {
        setShowReportModal(true);
        setTimeout(() => {
            alert("Report generated successfully!");
            setShowReportModal(false);
        }, 2000);
    };

    const handleStatClick = (statName: string) => {
        alert(`Viewing detailed analytics for: ${statName}`);
    };

    return (
        <div className="h-full w-full p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Overview</h1>
                    <p className="text-gray-500 mt-1 text-sm">Real-time monitoring dashboard</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerateReport}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <IconClipboardList size={16} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={<IconUsers size={20} />}
                    color="bg-blue-500"
                    subtitle={`${stats.admittedPatients} admitted`}
                    onClick={() => handleStatClick("Total Patients")}
                />
                <StatCard
                    title="Staff On Duty"
                    value={`${stats.doctorsOnDuty} / ${stats.nursesOnDuty}`}
                    icon={<IconStethoscope size={20} />}
                    color="bg-emerald-500"
                    subtitle="Doctors / Nurses"
                    onClick={() => handleStatClick("Staff On Duty")}
                />
                <StatCard
                    title="Critical Patients"
                    value={stats.criticalPatients}
                    icon={<IconAlertTriangle size={20} />}
                    color={stats.criticalPatients > 0 ? "bg-red-500" : "bg-green-500"}
                    subtitle="Requires attention"
                    onClick={() => handleStatClick("Critical Patients")}
                />
                <StatCard
                    title="Active Units"
                    value={`${stats.activeAmbulances}/${stats.totalAmbulances}`}
                    icon={<IconAmbulance size={20} />}
                    color="bg-amber-500"
                    subtitle={`${stats.availableAmbulances} available`}
                    onClick={() => handleStatClick("Active Units")}
                />
            </div>

            {/* Critical Patient Vitals Section */}
            {criticalPatientsList.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <IconHeart size={20} className="text-red-500" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Critical Patient Vitals</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {criticalPatientsList.map((patient) => (
                            <CriticalPatientVitals key={patient.id} patient={patient} />
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <IconActivity size={20} className="text-blue-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                        {activityItems.length > 0 ? (
                            activityItems.map((item, index) => (
                                <ActivityItem
                                    key={index}
                                    title={item.title}
                                    time={item.time}
                                    type={item.type}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Inventory Alerts</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Manage</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-3">
                        {inventoryAlerts.length > 0 ? (
                            inventoryAlerts.map((item: any, index: number) => (
                                <InventoryAlert key={index} item={item} />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <IconPackage size={48} className="mx-auto text-gray-200 mb-3" />
                                <p className="text-gray-500">Inventory levels are healthy</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Report Modal */}
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
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generating Report</h3>
                                <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <IconX size={20} />
                                </button>
                            </div>
                            <div className="py-8 flex flex-col items-center gap-4">
                                <IconClipboardList size={48} className="text-blue-500 animate-pulse" />
                                <p className="text-gray-600 dark:text-gray-300">Compiling hospital data...</p>
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
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Settings</h3>
                                <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <IconX size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Auto-refresh Data</span>
                                    <div className="h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                                    <div className="h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
