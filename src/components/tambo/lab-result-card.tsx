"use client";
import React, { useState } from "react";
import { useTambo } from "@tambo-ai/react";
import { useNavigation } from "@/lib/navigation-context";

interface LabTest {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "Normal" | "Abnormal" | "Critical";
}

interface LabResultCardProps {
  patientName: string;
  testType: string;
  date: string;
  doctor: string;
  priority: "Routine" | "High" | "Critical";
  status: "Completed" | "Pending" | "Processing";
  results: LabTest[];
  resultSummary?: string;
}

const priorityColors: Record<string, string> = {
  Routine: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse",
};

const testStatusColors: Record<string, string> = {
  Normal: "text-green-600 dark:text-green-400",
  Abnormal: "text-orange-600 dark:text-orange-400",
  Critical: "text-red-600 dark:text-red-400",
};

const testStatusBg: Record<string, string> = {
  Normal: "bg-green-50 dark:bg-green-900/10",
  Abnormal: "bg-orange-50 dark:bg-orange-900/10",
  Critical: "bg-red-50 dark:bg-red-900/10 border border-red-200",
};

const testStatusIcon: Record<string, string> = {
  Normal: "✓",
  Abnormal: "⚠",
  Critical: "🚨",
};

export const LabResultCard: React.FC<LabResultCardProps> = ({
  patientName,
  testType,
  date,
  doctor,
  priority,
  status,
  results,
  resultSummary,
}) => {
  const { sendThreadMessage } = useTambo();
  const { navigateTo } = useNavigation();
  const [showAll, setShowAll] = useState(false);

  const abnormalCount = (results ?? []).filter((r) => r.status !== "Normal").length;
  const displayResults = showAll ? (results ?? []) : (results ?? []).slice(0, 3);

  const handleGoToLab = () => {
    navigateTo("lab");
    sendThreadMessage(`I'm looking at the lab results section. Can you summarize the ${testType} results for ${patientName}?`);
  };

  const handleOrderFollowUp = () => {
    sendThreadMessage(`Order a follow-up ${testType} lab test for ${patientName}. Priority: ${abnormalCount > 0 ? "High" : "Routine"}.`);
  };

  const handleExplain = () => {
    const abnormals = (results ?? []).filter((r) => r.status !== "Normal");
    if (abnormals.length > 0) {
      const summary = abnormals.map((r) => `${r.testName}: ${r.value} ${r.unit} (ref: ${r.referenceRange})`).join(", ");
      sendThreadMessage(`Explain these abnormal lab values for ${patientName}: ${summary}. What do they mean clinically?`);
    } else {
      sendThreadMessage(`All ${testType} results for ${patientName} are normal. What does this confirm?`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md transition-all hover:shadow-lg">
      {/* Header — click navigates to Lab tab */}
      <button
        type="button"
        onClick={handleGoToLab}
        className="w-full text-left bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 hover:from-amber-700 hover:to-orange-700 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1">
              🧪 Lab Results
              <span className="text-white/60 text-[10px] ml-1 group-hover:text-white/90 transition-colors">
                → view all labs
              </span>
            </h3>
            <p className="text-amber-100 text-xs mt-0.5">{testType} · {patientName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[priority]}`}>
              {priority}
            </span>
            {abnormalCount > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                {abnormalCount} abnormal
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="p-4 space-y-3">
        {/* Meta info */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Doctor</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{doctor}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Date</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{date}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Status</p>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium inline-block ${
                status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : status === "Processing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Pending notice */}
        {status === "Pending" && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-2 flex items-center gap-2">
            <span className="text-yellow-500">⏳</span>
            <p className="text-[11px] text-yellow-700 dark:text-yellow-400">
              Results pending. Expected soon.
            </p>
            <button
              onClick={() => sendThreadMessage(`Check the status of ${patientName}'s pending ${testType} lab test.`)}
              className="ml-auto text-[10px] bg-yellow-500 text-white px-2 py-0.5 rounded font-medium hover:bg-yellow-600 transition-colors"
            >
              Check
            </button>
          </div>
        )}

        {/* Results */}
        {displayResults.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
              Test Values
            </p>
            <div className="space-y-1.5">
              {displayResults.map((test, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:opacity-80 ${testStatusBg[test.status]}`}
                  onClick={() => sendThreadMessage(`Explain the ${test.testName} value of ${test.value} ${test.unit} for ${patientName}. Normal range is ${test.referenceRange}.`)}
                  title="Click to ask AI about this value"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <span className={testStatusColors[test.status]}>{testStatusIcon[test.status]}</span>
                      {test.testName}
                    </p>
                    <p className="text-[10px] text-gray-500">Ref: {test.referenceRange}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${testStatusColors[test.status]}`}>
                      {test.value} <span className="text-xs font-normal text-gray-400">{test.unit}</span>
                    </p>
                    <p className={`text-[10px] font-medium ${testStatusColors[test.status]}`}>
                      {test.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {(results ?? []).length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[11px] text-blue-600 hover:underline mt-2 font-medium"
              >
                {showAll ? "▲ Show less" : `▼ Show ${(results ?? []).length - 3} more values`}
              </button>
            )}
          </div>
        )}

        {resultSummary && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Summary:</span> {resultSummary}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
          <button
            onClick={handleExplain}
            className="text-[11px] font-semibold py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 transition-colors border border-amber-200 dark:border-amber-800"
          >
            🤔 Explain Results
          </button>
          <button
            onClick={handleOrderFollowUp}
            className="text-[11px] font-semibold py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition-colors border border-blue-200 dark:border-blue-800"
          >
            🔁 Order Follow-up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabResultCard;
