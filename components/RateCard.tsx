import React from 'react';

interface RateCardProps {
  title: string;
  value: number;
  type: 'moneyMarket' | 'fx';
}

export default function RateCard({ title, value, type }: RateCardProps) {
  const formatValue = (val: number, type: 'moneyMarket' | 'fx') => {
    if (type === 'moneyMarket') {
      return `${val.toFixed(2)}%`;
    }
    return val.toFixed(4);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
        {title}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {formatValue(value, type)}
      </div>
    </div>
  );
}

