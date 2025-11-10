import React from 'react';

interface StressIndicatorProps {
  stress: {
    score: number;
    level: string;
    volatility: number;
    spread: number;
    fxVolatility: number;
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
        Stress Indicators
      </h2>
      
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Stress Score</span>
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

        <div className="grid grid-cols-3 gap-4 flex-1 min-w-[300px]">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volatility</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stress.volatility.toFixed(3)}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spread</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stress.spread.toFixed(2)}%
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">FX Volatility</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stress.fxVolatility.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

