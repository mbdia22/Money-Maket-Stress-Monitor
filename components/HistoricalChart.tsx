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
    'EUR/USD': typeof item['EUR/USD'] === 'number' ? item['EUR/USD'] : parseFloat(item['EUR/USD'] as string),
    'GBP/USD': typeof item['GBP/USD'] === 'number' ? item['GBP/USD'] : parseFloat(item['GBP/USD'] as string),
  }));

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Historical Trends (30 Days)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="SOFR"
              stroke="#3b82f6"
              strokeWidth={2}
              name="SOFR (%)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="EURIBOR"
              stroke="#10b981"
              strokeWidth={2}
              name="EURIBOR (%)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="EUR/USD"
              stroke="#f59e0b"
              strokeWidth={2}
              name="EUR/USD"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="GBP/USD"
              stroke="#ef4444"
              strokeWidth={2}
              name="GBP/USD"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

