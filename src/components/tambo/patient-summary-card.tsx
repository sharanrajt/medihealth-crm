"use client";
import React, { useState } from "react";
import { useTambo } from "@tambo-ai/react";
import { useNavigation } from "@/lib/navigation-context";

interface PatientSummaryProps {
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  department: string;
  status: "Admitted" | "Outpatient" | "Discharged" | "Critical";
  admissionDate: string;
  bloodType?: string;
  allergies?: string[];
  attendingDoctor?: string;
}

const statusColors: Record<string, string> = {
  Admitted: "bg-blue-100 text-blue-700 border-blue-200",
  Outpatient: "bg-green-100 text-green-700 border-green-200",
  Discharged: "bg-gray-100 text-gray-700 border-gray-200",
  Critical: "bg-red-100 text-red-700 border-red-200 animate-pulse",
};

const statusDot: Record<string, string> = {
  Admitted: "bg-blue-500",
  Outpatient: "bg-green-500",
  Discharged: "bg-gray-400",
  Critical: "bg-red-500",
};

const quickActions = [
  { label: "📋 View Records", message: (name: string) => `Open the patient records for ${name}` },
  { label: "💊 Prescriptions", message: (name: string) => `Show me current prescriptions for ${name}` },
  { label: "🧪 Lab Results", message: (name: string) => `Show lab results for ${name}` },
  { label: "📅 Schedule", message: (name: string) => `Schedule a follow-up appointment for ${name}` },
];

export const PatientSummaryCard: React.FC<PatientSummaryProps> = ({
  name,
  age,
  gender,
  diagnosis,
  department,
  status,
  admissionDate,
  bloodType,
  allergies,
  attendingDoctor,
}) => {
  const { sendThreadMessage } = useTambo();
  const { navigateTo } = useNavigation();
  const [expanded, setExpanded] = useState(false);

  const missingFields: string[] = [];
  if (!bloodType) missingFields.push("blood type");
  if (!attendingDoctor) missingFields.push("attending doctor");
  if (!allergies || allergies.length === 0) missingFields.push("allergy info");

  const handleGoToRecords = () => {
    navigateTo("records");
    sendThreadMessage(`I just navigated to the patient records. Can you highlight ${name}'s record?`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md transition-all hover:shadow-lg">
      {/* Header — click navigates to Records */}
      <button
        type="button"
        onClick={handleGoToRecords}
        className="w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between hover:from-blue-700 hover:to-blue-800 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1">
              {name || "Loading..."}
              <span className="text-white/60 text-[10px] ml-1 group-hover:text-white/90 transition-colors">
                → view records
              </span>
            </h3>
            <p className="text-blue-100 text-xs">
              {age ?? "—"} yrs • {gender || "—"}
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium border flex items-center gap-1.5 ${statusColors[status] || statusColors.Admitted}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status] || "bg-blue-500"}`} />
          {status || "—"}
        </span>
      </button>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Incomplete profile alert */}
        {missingFields.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2.5 rounded-lg flex items-start gap-2">
            <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                Missing: {missingFields.join(", ")}
              </p>
              <button
                onClick={() => sendThreadMessage(`Please help me complete ${name}'s profile. I'm missing: ${missingFields.join(", ")}.`)}
                className="mt-1 text-[10px] bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 rounded transition-colors font-medium"
              >
                Fill in missing info →
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Diagnosis" value={diagnosis} />
          <InfoField label="Department" value={department} />
          <InfoField label="Admitted" value={admissionDate} />
          {bloodType
            ? <InfoField label="Blood Type" value={bloodType} />
            : <InfoFieldMissing label="Blood Type" onClick={() => sendThreadMessage(`What is ${name}'s blood type? Please update the record.`)} />
          }
        </div>

        {attendingDoctor ? (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <InfoField label="Attending Doctor" value={attendingDoctor} />
          </div>
        ) : (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => sendThreadMessage(`Please assign an attending doctor for ${name}.`)}
              className="text-[11px] text-blue-600 hover:underline"
            >
              + Assign attending doctor
            </button>
          </div>
        )}

        {allergies && allergies.length > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Allergies</p>
            <div className="flex flex-wrap gap-1">
              {allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800"
                >
                  ⚠ {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions — expand/collapse */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {expanded ? "▲ Hide actions" : "▼ Quick actions"}
          </button>
          {expanded && (
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendThreadMessage(action.message(name))}
                  className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-600 text-left"
                >
                  {action.label}
                </button>
              ))}
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

const InfoFieldMissing = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">{label}</p>
    <button
      onClick={onClick}
      className="text-[11px] text-amber-600 hover:underline mt-0.5 font-medium"
    >
      + Add {label}
    </button>
  </div>
);

export default PatientSummaryCard;
