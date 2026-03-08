"use client";
import React, { useState } from "react";
import { useTambo } from "@tambo-ai/react";
import { useNavigation } from "@/lib/navigation-context";

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
  if (hr < 60) return { label: "Low", color: "text-yellow-600", ring: "ring-yellow-300" };
  if (hr > 100) return { label: "High", color: "text-red-600", ring: "ring-red-300" };
  return { label: "Normal", color: "text-green-600", ring: "ring-green-300" };
};

const getO2Status = (o2: number) => {
  if (o2 < 90) return { label: "Critical", color: "text-red-600", ring: "ring-red-300" };
  if (o2 < 95) return { label: "Low", color: "text-yellow-600", ring: "ring-yellow-300" };
  return { label: "Normal", color: "text-green-600", ring: "ring-green-300" };
};

const getTempStatus = (temp: number) => {
  if (temp > 38.5) return { label: "Fever", color: "text-red-600", ring: "ring-red-300" };
  if (temp > 37.5) return { label: "Elevated", color: "text-yellow-600", ring: "ring-yellow-300" };
  if (temp < 36) return { label: "Low", color: "text-blue-600", ring: "ring-blue-300" };
  return { label: "Normal", color: "text-green-600", ring: "ring-green-300" };
};

const getBPStatus = (sys: number) => {
  if (sys > 180) return { label: "Crisis", color: "text-red-600", ring: "ring-red-300" };
  if (sys > 140) return { label: "High", color: "text-orange-600", ring: "ring-orange-300" };
  if (sys < 90) return { label: "Low", color: "text-yellow-600", ring: "ring-yellow-300" };
  return { label: "Normal", color: "text-green-600", ring: "ring-green-300" };
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
  const { sendThreadMessage } = useTambo();
  const { navigateTo } = useNavigation();
  const [alertClicked, setAlertClicked] = useState<string | null>(null);

  const hr = heartRate ?? 0;
  const bpSys = bloodPressureSystolic ?? 0;
  const bpDia = bloodPressureDiastolic ?? 0;
  const temp = temperature ?? 0;
  const o2 = oxygenSaturation ?? 0;
  const rr = respiratoryRate ?? 0;

  const hrStatus = getHeartRateStatus(hr);
  const o2Status = getO2Status(o2);
  const tempStatus = getTempStatus(temp);
  const bpStatus = getBPStatus(bpSys);

  const rrStatus =
    rr > 25
      ? { label: "High", color: "text-red-600", ring: "ring-red-300" }
      : rr > 20
        ? { label: "Elevated", color: "text-yellow-600", ring: "ring-yellow-300" }
        : { label: "Normal", color: "text-green-600", ring: "ring-green-300" };

  const abnormalVitals = [
    hrStatus.label !== "Normal" && `Heart Rate ${hr} bpm (${hrStatus.label})`,
    bpStatus.label !== "Normal" && `BP ${bpSys}/${bpDia} mmHg (${bpStatus.label})`,
    o2Status.label !== "Normal" && `SpO₂ ${o2}% (${o2Status.label})`,
    tempStatus.label !== "Normal" && `Temperature ${temp}°C (${tempStatus.label})`,
    rrStatus.label !== "Normal" && `Resp Rate ${rr}/min (${rrStatus.label})`,
  ].filter(Boolean) as string[];

  const handleGoToRecords = () => {
    navigateTo("records");
    sendThreadMessage(`I went to patient records. Show me ${patientName}'s full medical history.`);
  };

  const handleAskAboutVital = (vitalName: string, value: string, status: string) => {
    if (alertClicked === vitalName) return;
    setAlertClicked(vitalName);
    sendThreadMessage(`${patientName}'s ${vitalName} is ${value} which is ${status}. What are the clinical implications and recommended actions?`);
    setTimeout(() => setAlertClicked(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md transition-all hover:shadow-lg">
      {/* Header — click navigates to Records */}
      <button
        type="button"
        onClick={handleGoToRecords}
        className="w-full text-left bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 hover:from-emerald-700 hover:to-teal-700 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1">
              💓 Vital Signs
              <span className="text-white/60 text-[10px] ml-1 group-hover:text-white/90 transition-colors">
                → view patient record
              </span>
            </h3>
            <p className="text-emerald-100 text-xs mt-0.5">{patientName || "Loading..."}</p>
          </div>
          {timestamp && (
            <span className="text-xs text-emerald-100 bg-white/10 px-2 py-1 rounded-full">
              {timestamp}
            </span>
          )}
        </div>
      </button>

      {/* Alert banner for abnormal vitals */}
      {abnormalVitals.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 px-4 py-2 flex items-start gap-2">
          <span className="text-red-500 text-sm shrink-0">🚨</span>
          <div className="flex-1">
            <p className="text-[11px] text-red-700 dark:text-red-400 font-semibold">
              {abnormalVitals.length} abnormal vital{abnormalVitals.length > 1 ? "s" : ""} detected
            </p>
            <p className="text-[10px] text-red-600 dark:text-red-300 mt-0.5">
              {abnormalVitals.join(" • ")}
            </p>
          </div>
          <button
            onClick={() => sendThreadMessage(`${patientName} has ${abnormalVitals.length} abnormal vitals: ${abnormalVitals.join(", ")}. What immediate actions are recommended?`)}
            className="shrink-0 text-[10px] bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded font-medium transition-colors"
          >
            Assess
          </button>
        </div>
      )}

      {/* Vitals Grid — each item is clickable */}
      <div className="p-4 grid grid-cols-3 gap-2">
        <VitalItem
          label="Heart Rate"
          value={`${hr}`}
          unit="bpm"
          statusLabel={hrStatus.label}
          statusColor={hrStatus.color}
          ring={hrStatus.ring}
          onClick={() => handleAskAboutVital("heart rate", `${hr} bpm`, hrStatus.label)}
          isAbnormal={hrStatus.label !== "Normal"}
        />
        <VitalItem
          label="Blood Pressure"
          value={`${bpSys}/${bpDia}`}
          unit="mmHg"
          statusLabel={bpStatus.label}
          statusColor={bpStatus.color}
          ring={bpStatus.ring}
          onClick={() => handleAskAboutVital("blood pressure", `${bpSys}/${bpDia} mmHg`, bpStatus.label)}
          isAbnormal={bpStatus.label !== "Normal"}
        />
        <VitalItem
          label="SpO₂"
          value={`${o2}`}
          unit="%"
          statusLabel={o2Status.label}
          statusColor={o2Status.color}
          ring={o2Status.ring}
          onClick={() => handleAskAboutVital("oxygen saturation", `${o2}%`, o2Status.label)}
          isAbnormal={o2Status.label !== "Normal"}
        />
        <VitalItem
          label="Temperature"
          value={`${temp}`}
          unit="°C"
          statusLabel={tempStatus.label}
          statusColor={tempStatus.color}
          ring={tempStatus.ring}
          onClick={() => handleAskAboutVital("temperature", `${temp}°C`, tempStatus.label)}
          isAbnormal={tempStatus.label !== "Normal"}
        />
        <VitalItem
          label="Resp. Rate"
          value={`${rr}`}
          unit="/min"
          statusLabel={rrStatus.label}
          statusColor={rrStatus.color}
          ring={rrStatus.ring}
          onClick={() => handleAskAboutVital("respiratory rate", `${rr}/min`, rrStatus.label)}
          isAbnormal={rrStatus.label !== "Normal"}
        />
        {/* Update button tile */}
        <button
          onClick={() => sendThreadMessage(`Update vitals for ${patientName}. Please provide the new measurements.`)}
          className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2.5 text-center border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex flex-col items-center justify-center gap-1"
        >
          <span className="text-emerald-600 text-lg">+</span>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium leading-tight">Update Vitals</p>
        </button>
      </div>

      {notes && (
        <div className="px-4 pb-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-semibold">📝 Note:</span> {notes}
            </p>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => sendThreadMessage(`Order a full workup for ${patientName} based on their current vitals.`)}
          className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400 transition-colors border border-teal-200 dark:border-teal-800"
        >
          🩺 Order Workup
        </button>
        <button
          onClick={() => sendThreadMessage(`Create a vitals trend report for ${patientName} over the past 24 hours.`)}
          className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-600"
        >
          📊 Trend Report
        </button>
      </div>
    </div>
  );
};

const VitalItem = ({
  label,
  value,
  unit,
  statusLabel,
  statusColor,
  ring,
  onClick,
  isAbnormal,
}: {
  label: string;
  value: string;
  unit: string;
  statusLabel: string;
  statusColor: string;
  ring: string;
  onClick: () => void;
  isAbnormal: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title="Click to ask AI about this vital"
    className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-center hover:ring-2 ${ring} transition-all cursor-pointer ${
      isAbnormal ? "border border-red-200 dark:border-red-800" : ""
    }`}
  >
    <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">
      {value}
      <span className="text-[9px] font-normal text-gray-400 ml-0.5">{unit}</span>
    </p>
    <p className={`text-[9px] font-semibold ${statusColor} mt-0.5`}>
      {isAbnormal && "⚠ "}{statusLabel}
    </p>
  </button>
);

export default VitalsDisplay;
