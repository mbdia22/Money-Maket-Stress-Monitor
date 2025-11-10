'use client';

import React from 'react';

interface ReserveScarcityMonitorProps {
  indicators: {
    'EFFR-IORB-Status'?: string;
    'SOFR-IORB-Status'?: string;
    'TGCR-RRP-Status'?: string;
    'GCF-TGCR-Status'?: string;
  };
  spreads: {
    'EFFR-IORB'?: number;
    'SOFR-IORB'?: number;
    'SOFR-EFFR'?: number;
    'TGCR-RRP'?: number;
    'GCF-TGCR'?: number;
  };
}

export default function ReserveScarcityMonitor({ indicators, spreads }: ReserveScarcityMonitorProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-500';
    if (status.includes('SCARCITY') || status.includes('EXCESS-COLLATERAL') || status.includes('INFLEXIBLE')) {
      return 'bg-red-600';
    }
    if (status.includes('ABUNDANCE') || status.includes('EXCESS-CASH') || status.includes('FLEXIBLE')) {
      return 'bg-green-600';
    }
    if (status.includes('BANKS-DEPLOYING')) {
      return 'bg-yellow-600';
    }
    return 'bg-blue-600';
  };

  const getStatusText = (status?: string) => {
    if (!status) return 'N/A';
    return status.replace(/-/g, ' ');
  };

  const metrics = [
    {
      title: 'EFFR-IORB Spread',
      description: 'The Fed\'s major measure of cash vs collateral in the system',
      spread: spreads['EFFR-IORB'],
      status: indicators['EFFR-IORB-Status'],
      unit: 'bps',
    },
    {
      title: 'SOFR-IORB Spread',
      description: 'SOFR above IORB points to sizeable bank activity in repo',
      spread: spreads['SOFR-IORB'],
      status: indicators['SOFR-IORB-Status'],
      unit: 'bps',
    },
    {
      title: 'TGCR-RRP Spread',
      description: 'Spread between private repo & Fed RRP rates',
      spread: spreads['TGCR-RRP'],
      status: indicators['TGCR-RRP-Status'],
      unit: 'bps',
    },
    {
      title: 'GCF-TGCR Spread',
      description: 'Dealer balance sheet capacity proxy',
      spread: spreads['GCF-TGCR'],
      status: indicators['GCF-TGCR-Status'],
      unit: 'bps',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Reserve Scarcity & Money Market Spreads
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {metric.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {metric.description}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(metric.status)}`}
              >
                {getStatusText(metric.status)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.spread !== undefined && metric.spread !== null && typeof metric.spread === 'number'
                  ? metric.spread.toFixed(2) 
                  : 'N/A'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

