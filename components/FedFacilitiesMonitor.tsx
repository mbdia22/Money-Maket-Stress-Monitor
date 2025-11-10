'use client';

import React from 'react';

interface FedFacilitiesMonitorProps {
  facilities: {
    'O/N-RRP-Volume'?: number;
    'Foreign-Repo-Pool'?: number;
    'SRF-Volume'?: number;
  };
}

export default function FedFacilitiesMonitor({ facilities }: FedFacilitiesMonitorProps) {
  const facilityData = [
    {
      name: 'O/N RRP Volume',
      value: facilities['O/N-RRP-Volume'],
      description: 'Overnight Reverse Repo Facility - Public & Private',
      unit: '$bln',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Foreign Repo Pool',
      value: facilities['Foreign-Repo-Pool'],
      description: 'Reverse Repos with Foreign Official Accounts',
      unit: '$bln',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'SRF Volume',
      value: facilities['SRF-Volume'],
      description: 'Standing Repo Facility - Emergency Repo Volumes',
      unit: '$bln',
      color: facilities['SRF-Volume'] && facilities['SRF-Volume'] > 0 
        ? 'from-red-500 to-red-600' 
        : 'from-gray-400 to-gray-500',
      alert: facilities['SRF-Volume'] && facilities['SRF-Volume'] > 0,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Fed Facility Activity
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {facilityData.map((facility, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${facility.color} p-4 rounded-lg shadow-md text-white relative`}
          >
            {facility.alert && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                ALERT
              </div>
            )}
            <div className="text-sm font-medium mb-1 opacity-90">{facility.name}</div>
            <div className="text-3xl font-bold mb-1">
              {facility.value !== undefined && facility.value !== null && typeof facility.value === 'number' 
                ? `${facility.value.toFixed(1)}` 
                : 'N/A'}
            </div>
            <div className="text-xs opacity-75 mb-2">{facility.unit}</div>
            <div className="text-xs opacity-75">{facility.description}</div>
          </div>
        ))}
      </div>

      {facilities['SRF-Volume'] !== undefined && facilities['SRF-Volume'] !== null && facilities['SRF-Volume'] > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-600 dark:text-red-400 font-bold">⚠️</span>
            <span className="text-red-800 dark:text-red-300 font-semibold">
              Standing Repo Facility activity detected - indicates potential funding stress
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

