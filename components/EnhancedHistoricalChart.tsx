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
  Area,
  AreaChart,
} from 'recharts';

interface EnhancedHistoricalChartProps {
  data: Array<{
    date: string;
    [key: string]: string | number | null;
  }>;
  series?: string[];
  yAxisLabel?: string;
  showPercentiles?: boolean;
  percentiles?: {
    [key: string]: {
      p25?: number;
      p50?: number;
      p75?: number;
      p99?: number;
    };
  };
}

const colors = {
  SOFR: '#3b82f6',
  EFFR: '#f59e0b',
  IORB: '#ef4444',
  'O/N-RRP': '#8b5cf6',
  BGCR: '#10b981',
  TGCR: '#ec4899',
  GCF: '#06b6d4',
  OBFR: '#f97316',
  'EFFR-IORB': '#ef4444',
  'SOFR-IORB': '#3b82f6',
  'SOFR-EFFR': '#f59e0b',
  'TGCR-RRP': '#8b5cf6',
  'GCF-TGCR': '#06b6d4',
};

export default function EnhancedHistoricalChart({ 
  data, 
  series, 
  yAxisLabel = 'Rate (%)',
  showPercentiles = false,
  percentiles 
}: EnhancedHistoricalChartProps) {
  // Format data for chart
  const chartData = data
    .map((item) => {
      const formatted: any = {
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: item.date,
      };

      // Add all series data
      const seriesToShow = series || ['SOFR', 'EFFR', 'IORB'];
      seriesToShow.forEach((s) => {
        const value = item[s];
        if (value !== null && value !== undefined) {
          formatted[s] = typeof value === 'number' ? value : parseFloat(value as string);
        }
      });

      return formatted;
    })
    .filter((item) => item.date !== 'Invalid Date' && !isNaN(new Date(item.fullDate).getTime()));

  // Determine if we're showing spreads (bps) or rates (%)
  const isSpreadChart = series?.some(s => s.includes('-')) || false;
  const yAxisDomain = isSpreadChart ? ['auto', 'auto'] : undefined;

  return (
    <div className="w-full">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {showPercentiles && percentiles ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPercentile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                stroke="#9ca3af"
              />
              <YAxis 
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                stroke="#9ca3af"
                domain={yAxisDomain}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              
              {/* Percentile bands */}
              {percentiles.SOFR && (
                <>
                  <Area
                    type="monotone"
                    dataKey={() => percentiles.SOFR?.p99}
                    stroke="none"
                    fill="#ef4444"
                    fillOpacity={0.1}
                    name="99th Percentile"
                  />
                  <Area
                    type="monotone"
                    dataKey={() => percentiles.SOFR?.p75}
                    stroke="none"
                    fill="#f59e0b"
                    fillOpacity={0.1}
                    name="75th Percentile"
                  />
                  <Area
                    type="monotone"
                    dataKey={() => percentiles.SOFR?.p25}
                    stroke="none"
                    fill="#10b981"
                    fillOpacity={0.1}
                    name="25th Percentile"
                  />
                </>
              )}

              {/* Main series lines */}
              {series?.map((s, idx) => (
                <Line
                  key={s}
                  type="monotone"
                  dataKey={s}
                  stroke={colors[s as keyof typeof colors] || `hsl(${idx * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  name={s}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                stroke="#9ca3af"
              />
              <YAxis 
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                stroke="#9ca3af"
                domain={yAxisDomain}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              
              {series?.map((s, idx) => (
                <Line
                  key={s}
                  type="monotone"
                  dataKey={s}
                  stroke={colors[s as keyof typeof colors] || `hsl(${idx * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  name={s}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

