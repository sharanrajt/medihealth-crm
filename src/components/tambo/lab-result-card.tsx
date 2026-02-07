"use client";
import React from "react";

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
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const testStatusColors: Record<string, string> = {
  Normal: "text-green-600 dark:text-green-400",
  Abnormal: "text-orange-600 dark:text-orange-400",
  Critical: "text-red-600 dark:text-red-400",
};

const testStatusBg: Record<string, string> = {
  Normal: "bg-green-50 dark:bg-green-900/10",
  Abnormal: "bg-orange-50 dark:bg-orange-900/10",
  Critical: "bg-red-50 dark:bg-red-900/10",
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">Lab Results</h3>
            <p className="text-amber-100 text-xs">{testType}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[priority]}`}
            >
              {priority}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
            <p className="font-medium text-gray-900 dark:text-white text-xs">{patientName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Doctor</p>
            <p className="font-medium text-gray-900 dark:text-white text-xs">{doctor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-medium text-gray-900 dark:text-white text-xs">{date}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              status === "Completed"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : status === "Processing"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Results Table */}
        {(results ?? []).length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Test Results
            </p>
            <div className="space-y-1.5">
              {(results ?? []).map((test, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-2.5 flex items-center justify-between ${testStatusBg[test.status]}`}
                >
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {test.testName}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Ref: {test.referenceRange}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${testStatusColors[test.status]}`}>
                      {test.value} <span className="text-xs font-normal">{test.unit}</span>
                    </p>
                    <p className={`text-[10px] font-medium ${testStatusColors[test.status]}`}>
                      {test.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resultSummary && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Summary:</span> {resultSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabResultCard;
