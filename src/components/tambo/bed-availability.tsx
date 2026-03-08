"use client";
import React, { useState } from "react";
import { useTambo } from "@tambo-ai/react";
import { useNavigation } from "@/lib/navigation-context";

interface Ward {
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  department: string;
}

interface BedAvailabilityProps {
  hospitalName?: string;
  totalBeds: number;
  occupiedBeds: number;
  wards: Ward[];
  lastUpdated?: string;
}

const getOccupancyColor = (rate: number) =>
  rate >= 90
    ? "text-red-600 dark:text-red-400"
    : rate >= 75
      ? "text-orange-600 dark:text-orange-400"
      : "text-green-600 dark:text-green-400";

const getBarColor = (rate: number) =>
  rate >= 90 ? "bg-red-500" : rate >= 75 ? "bg-orange-500" : "bg-green-500";

const getBarBg = (rate: number) =>
  rate >= 90 ? "bg-red-50 border-red-100" : rate >= 75 ? "bg-orange-50 border-orange-100" : "";

export const BedAvailability: React.FC<BedAvailabilityProps> = ({
  hospitalName,
  totalBeds,
  occupiedBeds,
  wards,
  lastUpdated,
}) => {
  const { sendThreadMessage } = useTambo();
  const { navigateTo } = useNavigation();
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const total = totalBeds ?? 0;
  const occupied = occupiedBeds ?? 0;
  const safeWards = wards ?? [];
  const availableBeds = total - occupied;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const criticalWards = safeWards.filter(
    (w) => w.totalBeds > 0 && Math.round((w.occupiedBeds / w.totalBeds) * 100) >= 90,
  );

  const handleGoToDashboard = () => {
    navigateTo("dashboard");
    sendThreadMessage(`I'm on the dashboard. Give me a quick summary of current bed availability and any capacity concerns.`);
  };

  const handleWardClick = (ward: Ward) => {
    setSelectedWard(selectedWard === ward.name ? null : ward.name);
    sendThreadMessage(
      `Show me details for the ${ward.name} ward in ${ward.department}. It has ${ward.occupiedBeds}/${ward.totalBeds} beds occupied.`,
    );
  };

  const handleAdmitPatient = () => {
    sendThreadMessage(
      `I need to admit a new patient. There are currently ${availableBeds} beds available. Help me find the right ward and admit them.`,
    );
  };

  const handleCapacityPlan = () => {
    sendThreadMessage(
      `Current hospital occupancy is at ${occupancyRate}%. ${criticalWards.length > 0 ? `These wards are at critical capacity: ${criticalWards.map((w) => w.name).join(", ")}.` : ""} What capacity management actions should we take?`,
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md transition-all hover:shadow-lg">
      {/* Header — click navigates to Dashboard */}
      <button
        type="button"
        onClick={handleGoToDashboard}
        className="w-full text-left bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 hover:from-rose-700 hover:to-pink-700 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1">
              🏥 Bed Availability
              <span className="text-white/60 text-[10px] ml-1 group-hover:text-white/90 transition-colors">
                → view dashboard
              </span>
            </h3>
            {hospitalName && (
              <p className="text-rose-100 text-xs mt-0.5">{hospitalName}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {lastUpdated && (
              <span className="text-[10px] text-rose-100 bg-white/10 px-2 py-0.5 rounded-full">
                {lastUpdated}
              </span>
            )}
            {occupancyRate >= 90 && (
              <span className="text-[10px] bg-red-400 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                CRITICAL
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Critical wards alert */}
      {criticalWards.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 px-4 py-2 flex items-center gap-2">
          <span className="text-red-500 text-sm shrink-0">🚨</span>
          <p className="text-[11px] text-red-700 dark:text-red-400 font-semibold flex-1">
            {criticalWards.map((w) => w.name).join(", ")} at critical capacity
          </p>
          <button
            onClick={() =>
              sendThreadMessage(
                `${criticalWards.map((w) => w.name).join(", ")} ${criticalWards.length > 1 ? "are" : "is"} at critical capacity. What options do we have to manage overflow?`,
              )
            }
            className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-medium hover:bg-red-600 transition-colors shrink-0"
          >
            Manage
          </button>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <button
            onClick={() => sendThreadMessage(`How many total beds does ${hospitalName || "the hospital"} have? Any plans to add more capacity?`)}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</p>
          </button>
          <button
            onClick={() => sendThreadMessage(`Show me a list of currently occupied beds and which patients are in them.`)}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-red-50 transition-colors"
          >
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{occupied}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Occupied</p>
          </button>
          <button
            onClick={handleAdmitPatient}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-green-50 transition-colors"
          >
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{availableBeds}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Available</p>
          </button>
        </div>

        {/* Occupancy bar */}
        <div className={`rounded-lg p-2.5 border ${getBarBg(occupancyRate)}`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Overall Occupancy</span>
            <span className={`text-sm font-bold ${getOccupancyColor(occupancyRate)}`}>
              {occupancyRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(occupancyRate)}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Ward Breakdown — each row is clickable */}
        {safeWards.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
              Ward Breakdown <span className="normal-case font-normal">(click a ward to ask AI)</span>
            </p>
            <div className="space-y-2">
              {safeWards.map((ward, i) => {
                const wTotal = ward.totalBeds ?? 0;
                const wOccupied = ward.occupiedBeds ?? 0;
                const wardRate = wTotal > 0 ? Math.round((wOccupied / wTotal) * 100) : 0;
                const wardAvailable = wTotal - wOccupied;
                const isSelected = selectedWard === ward.name;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleWardClick(ward)}
                    className={`w-full text-left rounded-lg p-2.5 border transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          {ward.name}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {ward.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-bold ${getOccupancyColor(wardRate)}`}>
                          {wardAvailable} free
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {wOccupied}/{wTotal} beds
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getBarColor(wardRate)}`}
                        style={{ width: `${wardRate}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAdmitPatient}
            className="text-[11px] font-semibold py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 transition-colors border border-green-200 dark:border-green-800"
          >
            ➕ Admit Patient
          </button>
          <button
            onClick={handleCapacityPlan}
            className="text-[11px] font-semibold py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-800"
          >
            📊 Capacity Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedAvailability;
