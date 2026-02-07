"use client";
import React from "react";

interface VitalsDisplayProps {
  patientName: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp?: string;
  notes?: string;
}

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

export const VitalsDisplay: React.FC<VitalsDisplayProps> = ({
  patientName,
  heartRate,
  bloodPressureSystolic,
  bloodPressureDiastolic,
  temperature,
  oxygenSaturation,
  respiratoryRate,
  timestamp,
  notes,
}) => {
  const hr = heartRate ?? 0;
  const bpSys = bloodPressureSystolic ?? 0;
  const bpDia = bloodPressureDiastolic ?? 0;
  const temp = temperature ?? 0;
  const o2 = oxygenSaturation ?? 0;
  const rr = respiratoryRate ?? 0;

  const hrStatus = getHeartRateStatus(hr);
  const o2Status = getO2Status(o2);
  const tempStatus = getTempStatus(temp);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">Vital Signs</h3>
          <p className="text-emerald-100 text-xs">{patientName || "Loading..."}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-emerald-100 bg-white/10 px-2 py-1 rounded-full">
            {timestamp}
          </span>
        )}
      </div>

      {/* Vitals Grid */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <VitalItem
          label="Heart Rate"
          value={`${hr}`}
          unit="bpm"
          statusLabel={hrStatus.label}
          statusColor={hrStatus.color}
        />
        <VitalItem
          label="Blood Pressure"
          value={`${bpSys}/${bpDia}`}
          unit="mmHg"
          statusLabel={bpSys > 140 ? "High" : "Normal"}
          statusColor={bpSys > 140 ? "text-red-600" : "text-green-600"}
        />
        <VitalItem
          label="SpO₂"
          value={`${o2}`}
          unit="%"
          statusLabel={o2Status.label}
          statusColor={o2Status.color}
        />
        <VitalItem
          label="Temperature"
          value={`${temp}`}
          unit="°C"
          statusLabel={tempStatus.label}
          statusColor={tempStatus.color}
        />
        <VitalItem
          label="Resp. Rate"
          value={`${rr}`}
          unit="/min"
          statusLabel={rr > 20 ? "Elevated" : "Normal"}
          statusColor={rr > 20 ? "text-yellow-600" : "text-green-600"}
        />
      </div>

      {notes && (
        <div className="px-4 pb-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Note:</span> {notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const VitalItem = ({
  label,
  value,
  unit,
  statusLabel,
  statusColor,
}: {
  label: string;
  value: string;
  unit: string;
  statusLabel: string;
  statusColor: string;
}) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-center">
    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
      {value}
      <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
    </p>
    <p className={`text-[10px] font-medium ${statusColor} mt-0.5`}>
      {statusLabel}
    </p>
  </div>
);

export default VitalsDisplay;
