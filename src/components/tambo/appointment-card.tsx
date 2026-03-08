"use client";
import React, { useState } from "react";
import { useTambo } from "@tambo-ai/react";
import { useNavigation } from "@/lib/navigation-context";

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
  Consultation: "bg-blue-100 text-blue-700 border-blue-200",
  "Follow-up": "bg-teal-100 text-teal-700 border-teal-200",
  Surgery: "bg-red-100 text-red-700 border-red-200",
  "Lab Test": "bg-purple-100 text-purple-700 border-purple-200",
  Emergency: "bg-orange-100 text-orange-700 border-orange-200 animate-pulse",
  Therapy: "bg-green-100 text-green-700 border-green-200",
};

const typeGradient: Record<string, string> = {
  Consultation: "from-cyan-600 to-blue-600",
  "Follow-up": "from-teal-600 to-cyan-600",
  Surgery: "from-red-600 to-rose-600",
  "Lab Test": "from-purple-600 to-violet-600",
  Emergency: "from-orange-600 to-red-600",
  Therapy: "from-green-600 to-teal-600",
};

const statusConfig: Record<string, { icon: string; bg: string; text: string }> = {
  Scheduled: { icon: "🕐", bg: "bg-blue-50 border-blue-100", text: "text-blue-700" },
  "In Progress": { icon: "🔄", bg: "bg-yellow-50 border-yellow-100", text: "text-yellow-700" },
  Completed: { icon: "✅", bg: "bg-green-50 border-green-100", text: "text-green-700" },
  Cancelled: { icon: "❌", bg: "bg-gray-50 border-gray-100", text: "text-gray-600" },
  "No Show": { icon: "⚠️", bg: "bg-orange-50 border-orange-100", text: "text-orange-700" },
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
  const { sendThreadMessage } = useTambo();
  const { navigateTo } = useNavigation();
  const [showActions, setShowActions] = useState(false);

  const sc = statusConfig[status] || statusConfig.Scheduled;
  const gradient = typeGradient[type] || typeGradient.Consultation;

  const handleGoToCalendar = () => {
    navigateTo("calendar");
    sendThreadMessage(`I navigated to the calendar. Show me ${patientName}'s appointment on ${date} at ${time}.`);
  };

  const handleReschedule = () => {
    sendThreadMessage(`Reschedule the ${type} appointment for ${patientName} with Dr. ${doctorName}. Current time: ${date} at ${time}.`);
  };

  const handleCancel = () => {
    sendThreadMessage(`Cancel the ${type} appointment for ${patientName} with Dr. ${doctorName} on ${date} at ${time}.`);
  };

  const handlePrep = () => {
    sendThreadMessage(`What should ${patientName} know to prepare for their ${type} appointment with Dr. ${doctorName}?`);
  };

  const handleAddNotes = () => {
    sendThreadMessage(`Add clinical notes for ${patientName}'s ${type} with Dr. ${doctorName} on ${date}.`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md transition-all hover:shadow-lg">
      {/* Header — click navigates to Calendar */}
      <button
        type="button"
        onClick={handleGoToCalendar}
        className={`w-full text-left bg-gradient-to-r ${gradient} px-4 py-3 hover:opacity-90 transition-opacity group`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1">
              📅 Appointment
              <span className="text-white/60 text-[10px] ml-1 group-hover:text-white/90 transition-colors">
                → view in calendar
              </span>
            </h3>
            <p className="text-white/80 text-xs mt-0.5">
              {date} at {time}
            </p>
          </div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${typeColors[type] || typeColors.Consultation}`}>
            {type}
          </span>
        </div>
      </button>

      <div className="p-4 space-y-3">
        {/* Status banner */}
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${sc.bg}`}>
          <span className="text-base">{sc.icon}</span>
          <span className={`text-xs font-semibold ${sc.text}`}>{status}</span>
          {status === "No Show" && (
            <button
              onClick={() => sendThreadMessage(`Follow up with ${patientName} who missed their ${type} appointment with Dr. ${doctorName} on ${date}.`)}
              className="ml-auto text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded font-medium hover:bg-orange-600 transition-colors"
            >
              Follow-up
            </button>
          )}
          {status === "In Progress" && (
            <span className="ml-auto text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold animate-pulse">
              LIVE
            </span>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Patient" value={patientName} />
          <InfoField label="Doctor" value={`Dr. ${doctorName}`} />
          <InfoField label="Department" value={department} />
          {roomNumber
            ? <InfoField label="Room" value={roomNumber} />
            : (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Room</p>
                <button
                  onClick={() => sendThreadMessage(`Assign a room for ${patientName}'s ${type} appointment with Dr. ${doctorName}.`)}
                  className="text-[11px] text-blue-600 hover:underline mt-0.5 font-medium"
                >
                  + Assign room
                </button>
              </div>
            )
          }
        </div>

        {notes && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">📝 Notes:</span> {notes}
            </p>
          </div>
        )}

        {/* Expandable actions */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {showActions ? "▲ Hide actions" : "▼ Manage appointment"}
          </button>
          {showActions && (
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <button
                onClick={handleReschedule}
                className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 text-left"
              >
                🗓 Reschedule
              </button>
              <button
                onClick={handleCancel}
                className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200 text-left"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handlePrep}
                className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200 text-left"
              >
                📋 Patient prep
              </button>
              <button
                onClick={handleAddNotes}
                className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 text-left"
              >
                ✏️ Add notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value || "—"}</p>
  </div>
);

export default AppointmentCard;
