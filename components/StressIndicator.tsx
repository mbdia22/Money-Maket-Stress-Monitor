import React from 'react';

interface StressIndicatorProps {
  stress: {
    score: number;
    level: string;
    components?: {
      repo: number;
      credit: number;
      fx: number;
      volatility: number;
    };
    details?: {
      repo?: any;
      credit?: any;
      fx?: any;
      spreads?: Record<string, number>;
    };
  };
}

export default function StressIndicator({ stress }: StressIndicatorProps) {
  const getColorClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-stress-critical';
      case 'high':
        return 'bg-stress-high';
      case 'medium':
        return 'bg-stress-medium';
      default:
        return 'bg-stress-low';
    }
  };

  const getTextColor = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return 'text-white';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Comprehensive Stress Analysis
      </h2>
      
      <div className="flex items-center gap-6 flex-wrap mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Overall Stress Score</span>
            <span className={`font-bold text-2xl ${getTextColor(stress.level)}`}>
              {stress.score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${getColorClass(stress.level)}`}
              style={{ width: `${stress.score}%` }}
            />
          </div>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getColorClass(stress.level)} ${getTextColor(stress.level)}`}>
              {stress.level.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {stress.components && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Stress Components
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Repo Stress</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stress.components.repo}/25
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Credit Stress</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stress.components.credit}/35
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">FX Stress</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stress.components.fx}/20
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volatility</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stress.components.volatility}/20
              </div>
            </div>
          </div>
        </div>
      )}

      {stress.details?.spreads && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Key Spread Indicators
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stress.details.spreads).map(([key, value]) => (
              <div key={key} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-sm">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{key}</div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {typeof value === 'number' ? value.toFixed(2) : value} bps
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
