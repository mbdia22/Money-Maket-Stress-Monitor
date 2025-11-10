import React from 'react';

interface RegionalFilterProps {
  region: string;
  onRegionChange: (region: string) => void;
}

export default function RegionalFilter({ region, onRegionChange }: RegionalFilterProps) {
  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'US', label: 'United States' },
    { value: 'EMEA', label: 'EMEA' },
  ];

  return (
    <div className="mb-6 flex gap-2">
      {regions.map((r) => (
        <button
          key={r.value}
          onClick={() => onRegionChange(r.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            region === r.value
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

