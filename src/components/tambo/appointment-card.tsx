"use client";
import React from "react";

interface AppointmentCardProps {
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: "Consultation" | "Follow-up" | "Surgery" | "Lab Test" | "Emergency" | "Therapy";
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "No Show";
  roomNumber?: string;
  notes?: string;
}

const typeColors: Record<string, string> = {
  Consultation: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Follow-up": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Surgery: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Lab Test": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Emergency: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Therapy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

const statusIcons: Record<string, string> = {
  Scheduled: "🕐",
  "In Progress": "🔄",
  Completed: "✅",
  Cancelled: "❌",
  "No Show": "⚠️",
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  patientName,
  doctorName,
  department,
  date,
  time,
  type,
  status,
  roomNumber,
  notes,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">Appointment</h3>
          <p className="text-cyan-100 text-xs">
            {date || "—"} at {time || "—"}
          </p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[type] || typeColors.Consultation}`}
        >
          {type}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{patientName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Doctor</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{doctorName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{department}</p>
          </div>
          {roomNumber && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Room</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{roomNumber}</p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{statusIcons[status] || "🕐"}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {status}
            </span>
          </div>
        </div>

        {notes && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Notes:</span> {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
