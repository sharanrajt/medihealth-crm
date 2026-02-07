"use client";
import React, { useState } from "react";
import {
  IconAmbulance,
  IconMapPin,
  IconPhone,
  IconClock,
  IconAlertTriangle,
  IconNavigation,
  IconActivity,
  IconX,
  IconRadio,
  IconUser,
  IconTruck,
  IconPointFilled,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrmData, AmbulanceUnit } from "@/lib/crm-data-store";

const statusConfig: Record<AmbulanceUnit["status"], { color: string; bg: string; dot: string; pulse?: boolean }> = {
  "En Route": { color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30", dot: "bg-red-500", pulse: true },
  "Dispatched": { color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/30", dot: "bg-orange-500", pulse: true },
  "On Scene": { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/30", dot: "bg-amber-500" },
  "Transporting": { color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-100 dark:bg-purple-900/30", dot: "bg-purple-500", pulse: true },
  "Returning": { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30", dot: "bg-blue-500" },
  "Available": { color: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30", dot: "bg-green-500" },
};

const triageColors: Record<string, string> = {
  "Red - Immediate": "bg-red-600",
  "Yellow - Delayed": "bg-yellow-500",
  "Green - Minor": "bg-green-500",
  "Black - Deceased": "bg-gray-900",
};

const MapView = ({ ambulances, onSelect }: { ambulances: AmbulanceUnit[]; onSelect: (a: AmbulanceUnit) => void }) => (
  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700">
    {/* Grid background */}
    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:20px_20px]" />
    {/* Road lines */}
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="8,4" />
      <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="currentColor" strokeWidth="2" strokeDasharray="8,4" />
      <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,4" />
      <line x1="80%" y1="20%" x2="20%" y2="80%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,4" />
    </svg>
    {/* Hospital marker */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
      <div className="w-5 h-5 rounded-sm bg-white dark:bg-gray-700 border-2 border-red-500 flex items-center justify-center text-red-500 text-[10px] font-bold shadow">H</div>
      <span className="text-[8px] text-gray-500 mt-0.5 font-medium">MediHealth</span>
    </div>
    {/* Ambulance markers */}
    {ambulances.map((amb) => {
      const cfg = statusConfig[amb.status];
      return (
        <motion.div
          key={amb.id}
          className="absolute flex flex-col items-center cursor-pointer z-20"
          style={{ left: `${amb.coordinate.x}%`, top: `${amb.coordinate.y}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => onSelect(amb)}
        >
          <div className={`p-1.5 rounded-full shadow-lg border-2 border-white dark:border-gray-900 ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`}>
            <IconAmbulance size={14} className="text-white" />
          </div>
          <div className="bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded text-[9px] font-bold shadow mt-0.5 whitespace-nowrap border border-gray-100 dark:border-gray-700">
            {amb.id} {amb.eta && amb.eta !== "-" ? `• ${amb.eta}` : ""}
          </div>
        </motion.div>
      );
    })}
  </div>
);

const Ambulance = () => {
  const { ambulances } = useCrmData();
  const [selectedUnit, setSelectedUnit] = useState<AmbulanceUnit | null>(null);

  const activeCount = ambulances.filter((a) => a.status !== "Available").length;
  const criticalCount = ambulances.filter((a) => a.triageLevel === "Red - Immediate").length;
  const availableCount = ambulances.filter((a) => a.status === "Available").length;

  // Sort: critical/active first, available last
  const sortedAmbulances = [...ambulances].sort((a, b) => {
    const priority: Record<string, number> = { "En Route": 0, "Dispatched": 1, "On Scene": 2, "Transporting": 3, "Returning": 4, "Available": 5 };
    return (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
  });

  return (
    <div className="h-full w-full p-6 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <IconAlertTriangle className="text-red-500" size={28} />
            Emergency Dispatch
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Real-time EMS unit tracking & coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs mr-4">
            <span className="flex items-center gap-1.5 text-red-600 font-semibold">
              <IconPointFilled size={12} className="animate-pulse" /> {criticalCount} Critical
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
              <IconPointFilled size={12} /> {activeCount} Active
            </span>
            <span className="flex items-center gap-1.5 text-green-600 font-semibold">
              <IconPointFilled size={12} /> {availableCount} Available
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Unit List */}
        <div className="w-full lg:w-[380px] flex flex-col gap-3 overflow-y-auto pr-1 shrink-0">
          {sortedAmbulances.map((amb) => {
            const cfg = statusConfig[amb.status];
            return (
              <motion.div
                key={amb.id}
                onClick={() => setSelectedUnit(amb)}
                whileHover={{ x: 2 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                {/* Left accent bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${cfg.dot}`} />

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm">
                    <IconAmbulance size={16} /> {amb.id}
                  </h3>
                  <div className="flex items-center gap-2">
                    {amb.triageLevel && (
                      <span className={`w-2.5 h-2.5 rounded-full ${triageColors[amb.triageLevel] || "bg-gray-400"}`} title={amb.triageLevel} />
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                      {amb.status}
                    </span>
                  </div>
                </div>

                {amb.callType && (
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{amb.callType}</p>
                )}

                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p className="flex items-center gap-1.5">
                    <IconMapPin size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{amb.location}</span>
                  </p>
                  {amb.destination && (
                    <p className="flex items-center gap-1.5">
                      <IconNavigation size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{amb.destination}</span>
                    </p>
                  )}
                  {amb.eta && amb.eta !== "-" && (
                    <p className="flex items-center gap-1.5">
                      <IconClock size={13} className="text-gray-400 shrink-0" />
                      ETA: <span className="font-semibold text-gray-800 dark:text-white">{amb.eta}</span>
                    </p>
                  )}
                </div>

                {amb.patientInfo && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                      <IconActivity size={13} className="text-gray-400 shrink-0 mt-0.5" />
                      {amb.patientInfo}
                    </p>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[10px] text-gray-400">
                  <span>Crew: {amb.crew.paramedic}</span>
                  <span className="flex items-center gap-1"><IconRadio size={11} /> {amb.radioChannel}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Map View */}
        <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col min-h-0">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 text-sm">
              <IconMapPin size={16} /> GPS Tracking — Live
            </h3>
            <div className="flex gap-3">
              {Object.entries(statusConfig).map(([status, cfg]) => (
                <span key={status} className="flex items-center gap-1 text-[10px] text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} /> {status}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 relative p-3">
            <MapView ambulances={ambulances} onSelect={setSelectedUnit} />
          </div>
        </div>
      </div>

      {/* Unit Detail Modal */}
      <AnimatePresence>
        {selectedUnit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUnit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 flex justify-between items-center ${statusConfig[selectedUnit.status].dot} bg-opacity-10`}
                style={{ backgroundColor: `${statusConfig[selectedUnit.status].dot === "bg-red-500" ? "rgba(239,68,68,0.1)" : statusConfig[selectedUnit.status].dot === "bg-green-500" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)"}` }}
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <IconAmbulance size={24} />
                    {selectedUnit.id}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusConfig[selectedUnit.status].bg} ${statusConfig[selectedUnit.status].color}`}>
                      {selectedUnit.status}
                    </span>
                    {selectedUnit.triageLevel && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${triageColors[selectedUnit.triageLevel]}`}>
                        {selectedUnit.triageLevel}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Call Info */}
                {selectedUnit.callType && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-500 font-semibold mb-0.5">CALL TYPE</p>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedUnit.callType}</p>
                  </div>
                )}

                {/* Patient Info */}
                {selectedUnit.patientInfo && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-0.5">PATIENT INFO</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUnit.patientInfo}</p>
                  </div>
                )}

                {/* Location & Destination */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-0.5 flex items-center gap-1"><IconMapPin size={12} /> LOCATION</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUnit.location}</p>
                  </div>
                  {selectedUnit.destination && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-0.5 flex items-center gap-1"><IconNavigation size={12} /> DESTINATION</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUnit.destination}</p>
                    </div>
                  )}
                </div>

                {/* Crew */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 flex items-center gap-1"><IconUser size={12} /> CREW</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400">Driver</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{selectedUnit.crew.driver}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Paramedic</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{selectedUnit.crew.paramedic}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">EMT</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{selectedUnit.crew.emt}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 flex items-center gap-1"><IconTruck size={12} /> Vehicle</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedUnit.vehicle}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 flex items-center gap-1"><IconRadio size={12} /> Radio</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedUnit.radioChannel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  {selectedUnit.dispatchTime && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                      <p className="text-gray-400">Dispatched</p>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mt-0.5">{selectedUnit.dispatchTime}</p>
                    </div>
                  )}
                  {selectedUnit.eta && selectedUnit.eta !== "-" && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                      <p className="text-gray-400">ETA</p>
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mt-0.5">{selectedUnit.eta}</p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <p className="text-gray-400">Mileage</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mt-0.5">{selectedUnit.mileage.toLocaleString()} mi</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUnit(null)}
                  className="w-full px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
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

export default Ambulance;
