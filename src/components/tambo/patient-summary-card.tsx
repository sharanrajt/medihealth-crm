"use client";
import React from "react";

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
  Admitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Outpatient: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Discharged: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            {name ? name.charAt(0) : "?"}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{name || "Loading..."}</h3>
            <p className="text-blue-100 text-xs">
              {age ?? "—"} yrs • {gender || "—"}
            </p>
          </div>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[status] || statusColors.Admitted}`}
        >
          {status || "—"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Diagnosis" value={diagnosis} />
          <InfoField label="Department" value={department} />
          <InfoField label="Admission Date" value={admissionDate} />
          {bloodType && <InfoField label="Blood Type" value={bloodType} />}
        </div>

        {attendingDoctor && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <InfoField label="Attending Doctor" value={attendingDoctor} />
          </div>
        )}

        {allergies && allergies.length > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Allergies
            </p>
            <div className="flex flex-wrap gap-1">
              {allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default PatientSummaryCard;
