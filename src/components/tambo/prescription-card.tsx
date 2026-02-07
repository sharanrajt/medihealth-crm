"use client";
import React from "react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PrescriptionCardProps {
  patientName: string;
  doctorName: string;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  patientName,
  doctorName,
  date,
  medications,
  diagnosis,
  notes,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">Prescription</h3>
            <p className="text-purple-100 text-xs">Patient: {patientName}</p>
          </div>
          <span className="text-xs text-purple-100 bg-white/10 px-2 py-1 rounded-full">
            {date}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Prescribing Doctor</p>
            <p className="font-medium text-gray-900 dark:text-white">{doctorName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Diagnosis</p>
            <p className="font-medium text-gray-900 dark:text-white">{diagnosis}</p>
          </div>
        </div>

        {/* Medications */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Medications ({(medications ?? []).length})
          </p>
          <div className="space-y-2">
            {(medications ?? []).map((med, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-3 border-l-purple-500"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {med.name}
                  </p>
                  <span className="text-xs text-purple-600 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                    {med.dosage}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {med.frequency} • {med.duration}
                </p>
                {med.instructions && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    {med.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2.5">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">Doctor&apos;s Note:</span> {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;
