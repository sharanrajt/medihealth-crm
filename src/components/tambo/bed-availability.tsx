"use client";
import React from "react";

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

export const BedAvailability: React.FC<BedAvailabilityProps> = ({
  hospitalName,
  totalBeds,
  occupiedBeds,
  wards,
  lastUpdated,
}) => {
  const total = totalBeds ?? 0;
  const occupied = occupiedBeds ?? 0;
  const safeWards = wards ?? [];
  const availableBeds = total - occupied;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "text-red-600 dark:text-red-400";
    if (rate >= 75) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  const getBarColor = (rate: number) => {
    if (rate >= 90) return "bg-red-500";
    if (rate >= 75) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">Bed Availability</h3>
          {hospitalName && (
            <p className="text-rose-100 text-xs">{hospitalName}</p>
          )}
        </div>
        {lastUpdated && (
          <span className="text-xs text-rose-100 bg-white/10 px-2 py-1 rounded-full">
            {lastUpdated}
          </span>
        )}
      </div>

      {/* Overview Stats */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Total
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{occupied}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Occupied
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {availableBeds}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Available
            </p>
          </div>
        </div>

        {/* Overall Occupancy Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Overall Occupancy</span>
            <span className={`text-sm font-bold ${getOccupancyColor(occupancyRate)}`}>
              {occupancyRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${getBarColor(occupancyRate)}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Ward Breakdown */}
        {safeWards.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Ward Breakdown
            </p>
            <div className="space-y-2">
              {safeWards.map((ward, i) => {
                const wTotal = ward.totalBeds ?? 0;
                const wOccupied = ward.occupiedBeds ?? 0;
                const wardRate = wTotal > 0 ? Math.round((wOccupied / wTotal) * 100) : 0;
                const wardAvailable = wTotal - wOccupied;
                return (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {ward.name}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {ward.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-bold ${getOccupancyColor(wardRate)}`}>
                          {wardAvailable} available
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {ward.occupiedBeds}/{ward.totalBeds} beds
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getBarColor(wardRate)}`}
                        style={{ width: `${wardRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedAvailability;
