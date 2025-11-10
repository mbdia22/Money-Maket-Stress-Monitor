'use client';

import React from 'react';

interface FedBenchmarkMonitorProps {
  rates: {
    SOFR?: number;
    BGCR?: number;
    TGCR?: number;
    EFFR?: number;
    OBFR?: number;
    IORB?: number;
    'O/N-RRP'?: number;
  };
  percentiles?: {
    SOFR?: {
      p25?: number;
      p50?: number;
      p75?: number;
      p99?: number;
    };
  };
}

export default function FedBenchmarkMonitor({ rates, percentiles }: FedBenchmarkMonitorProps) {
  const benchmarks = [
    {
      name: 'SOFR',
      value: rates.SOFR,
      description: 'Secured Overnight Financing Rate (Tri-party + GCF + DVP Repo)',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'BGCR',
      value: rates.BGCR,
      description: 'Broad General Collateral Rate (GCF + Tri-party)',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'TGCR',
      value: rates.TGCR,
      description: 'Tri-party General Collateral Rate',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'EFFR',
      value: rates.EFFR,
      description: 'Effective Federal Funds Rate',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      name: 'OBFR',
      value: rates.OBFR,
      description: 'Overnight Bank Funding Rate (Eurodollars + Fed Funds + Domestics)',
      color: 'from-pink-500 to-pink-600',
    },
    {
      name: 'IORB',
      value: rates.IORB,
      description: 'Interest on Reserve Balances',
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'O/N RRP',
      value: rates['O/N-RRP'],
      description: 'Overnight Reverse Repo Facility',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Fed Rate Benchmark Monitor
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {benchmarks.map((benchmark) => (
          <div
            key={benchmark.name}
            className={`bg-gradient-to-br ${benchmark.color} p-4 rounded-lg shadow-md text-white`}
          >
            <div className="text-sm font-medium mb-1 opacity-90">{benchmark.name}</div>
            <div className="text-2xl font-bold mb-1">
              {benchmark.value !== undefined && benchmark.value !== null && typeof benchmark.value === 'number'
                ? `${benchmark.value.toFixed(2)}%` 
                : 'N/A'}
            </div>
            <div className="text-xs opacity-75">{benchmark.description}</div>
          </div>
        ))}
      </div>

      {percentiles?.SOFR && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            SOFR Percentiles (30-day)
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">25th Percentile</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {percentiles.SOFR.p25 !== undefined && percentiles.SOFR.p25 !== null 
                  ? `${percentiles.SOFR.p25.toFixed(2)}%` 
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Median (50th)</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {percentiles.SOFR.p50 !== undefined && percentiles.SOFR.p50 !== null 
                  ? `${percentiles.SOFR.p50.toFixed(2)}%` 
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">75th Percentile</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {percentiles.SOFR.p75 !== undefined && percentiles.SOFR.p75 !== null 
                  ? `${percentiles.SOFR.p75.toFixed(2)}%` 
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">99th Percentile</div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {percentiles.SOFR.p99 !== undefined && percentiles.SOFR.p99 !== null 
                  ? `${percentiles.SOFR.p99.toFixed(2)}%` 
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

