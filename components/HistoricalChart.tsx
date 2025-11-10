'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalChartProps {
  data: Array<{
    date: string;
    [key: string]: string | number;
  }>;
}

export default function HistoricalChart({ data }: HistoricalChartProps) {
  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    SOFR: typeof item.SOFR === 'number' ? item.SOFR : parseFloat(item.SOFR as string),
    EURIBOR: typeof item.EURIBOR === 'number' ? item.EURIBOR : parseFloat(item.EURIBOR as string),
    'LIBOR-USD-3M': typeof item['LIBOR-USD-3M'] === 'number' 
      ? item['LIBOR-USD-3M'] 
      : parseFloat(item['LIBOR-USD-3M'] as string),
    'US-GC-REPO': typeof item['US-GC-REPO'] === 'number' 
      ? item['US-GC-REPO'] 
      : (item['US-GC-REPO'] ? parseFloat(item['US-GC-REPO'] as string) : null),
    'EUR/USD': typeof item['EUR/USD'] === 'number' ? item['EUR/USD'] : parseFloat(item['EUR/USD'] as string),
    'GBP/USD': typeof item['GBP/USD'] === 'number' ? item['GBP/USD'] : parseFloat(item['GBP/USD'] as string),
  })).filter(item => item.date !== 'Invalid Date');

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Historical Trends (90 Days)
      </h3>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'FX Rate', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="SOFR"
              stroke="#3b82f6"
              strokeWidth={2}
              name="SOFR (%)"
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="EURIBOR"
              stroke="#10b981"
              strokeWidth={2}
              name="EURIBOR (%)"
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="LIBOR-USD-3M"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="LIBOR-USD-3M (%)"
              dot={false}
            />
            {chartData.some(d => d['US-GC-REPO'] !== null) && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="US-GC-REPO"
                stroke="#f59e0b"
                strokeWidth={2}
                name="US GC Repo (%)"
                dot={false}
              />
            )}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="EUR/USD"
              stroke="#ef4444"
              strokeWidth={2}
              name="EUR/USD"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="GBP/USD"
              stroke="#ec4899"
              strokeWidth={2}
              name="GBP/USD"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
