"use client";
import React, { useState } from "react";
import { useTambo } from "@tambo-ai/react";
import { useNavigation } from "@/lib/navigation-context";

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
  const { sendThreadMessage } = useTambo();
  const { navigateTo } = useNavigation();
  const [expandedMed, setExpandedMed] = useState<number | null>(null);

  const noInstructions = (medications ?? []).filter((m) => !m.instructions);

  const handleGoToRecords = () => {
    navigateTo("records");
    sendThreadMessage(`I navigated to patient records. Show me ${patientName}'s full prescription history.`);
  };

  const handleMedClick = (med: Medication, index: number) => {
    setExpandedMed(expandedMed === index ? null : index);
    sendThreadMessage(
      `Tell me about ${med.name} ${med.dosage}. What are the side effects, interactions, and important patient instructions?`,
    );
  };

  const handleRefill = (med: Medication) => {
    sendThreadMessage(
      `Process a refill for ${med.name} ${med.dosage} (${med.frequency}) for patient ${patientName}. Current prescription by Dr. ${doctorName}.`,
    );
  };

  const handleAddMedication = () => {
    sendThreadMessage(
      `Add a new medication to ${patientName}'s prescription. Current diagnosis: ${diagnosis}. Prescribed by Dr. ${doctorName}.`,
    );
  };

  const handleCheckInteractions = () => {
    const medList = (medications ?? []).map((m) => `${m.name} ${m.dosage}`).join(", ");
    sendThreadMessage(
      `Check for drug interactions between these medications for ${patientName}: ${medList}`,
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md transition-all hover:shadow-lg">
      {/* Header — click navigates to Records */}
      <button
        type="button"
        onClick={handleGoToRecords}
        className="w-full text-left bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 hover:from-purple-700 hover:to-indigo-700 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1">
              💊 Prescription
              <span className="text-white/60 text-[10px] ml-1 group-hover:text-white/90 transition-colors">
                → view patient record
              </span>
            </h3>
            <p className="text-purple-100 text-xs mt-0.5">{patientName}</p>
          </div>
          <span className="text-[11px] text-purple-100 bg-white/10 px-2 py-1 rounded-full">
            {date}
          </span>
        </div>
      </button>

      {/* Missing instructions alert */}
      {noInstructions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
          <span className="text-amber-500 text-sm shrink-0">⚠️</span>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium flex-1">
            {noInstructions.length} medication{noInstructions.length > 1 ? "s" : ""} missing patient instructions
          </p>
          <button
            onClick={() =>
              sendThreadMessage(
                `Add patient instructions for: ${noInstructions.map((m) => m.name).join(", ")} in ${patientName}'s prescription.`,
              )
            }
            className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded font-medium hover:bg-amber-600 transition-colors shrink-0"
          >
            Add
          </button>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Doctor & Diagnosis */}
        <div className="flex justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Prescriber</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Dr. {doctorName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Diagnosis</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{diagnosis}</p>
          </div>
        </div>

        {/* Medications — each is clickable */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
            Medications ({(medications ?? []).length})
            <span className="normal-case font-normal ml-1">(click to ask AI)</span>
          </p>
          <div className="space-y-2">
            {(medications ?? []).map((med, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 dark:border-gray-600 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => handleMedClick(med, i)}
                  className={`w-full text-left bg-gray-50 dark:bg-gray-700/50 p-3 border-l-4 border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${
                    expandedMed === i ? "bg-purple-50 dark:bg-purple-900/20" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {med.name}
                    </p>
                    <span className="text-xs text-purple-600 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full border border-purple-100">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {med.frequency} • {med.duration}
                  </p>
                  {med.instructions && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 italic">
                      📌 {med.instructions}
                    </p>
                  )}
                  {!med.instructions && (
                    <p className="text-[10px] text-amber-500 mt-1 font-medium">
                      ⚠ No patient instructions set
                    </p>
                  )}
                </button>
                {/* Refill action */}
                <div className="bg-white dark:bg-gray-800 px-3 py-1.5 flex justify-end">
                  <button
                    onClick={() => handleRefill(med)}
                    className="text-[10px] text-purple-600 hover:underline font-medium"
                  >
                    🔄 Request refill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2.5">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">📝 Doctor's Note:</span> {notes}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleAddMedication}
            className="text-[11px] font-semibold py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 transition-colors border border-purple-200 dark:border-purple-800"
          >
            ➕ Add Medication
          </button>
          <button
            onClick={handleCheckInteractions}
            className="text-[11px] font-semibold py-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 transition-colors border border-orange-200 dark:border-orange-800"
          >
            ⚡ Check Interactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
