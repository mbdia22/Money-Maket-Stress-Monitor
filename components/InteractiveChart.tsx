'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush } from 'recharts';

interface InteractiveChartProps {
    data: Array<{
        date: string;
        [key: string]: string | number;
    }>;
    lines: Array<{
        dataKey: string;
        name: string;
        color: string;
    }>;
    title: string;
    yAxisLabel?: string;
}

export default function InteractiveChart({
    data,
    lines,
    title,
    yAxisLabel = '%'
}: InteractiveChartProps) {
    const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL'>('3M');

    // Filter data based on selected time range
    const getFilteredData = () => {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case '1M':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6M':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case '5Y':
                startDate.setFullYear(now.getFullYear() - 5);
                break;
            case 'ALL':
                return data;
        }

        return data.filter(d => new Date(d.date) >= startDate);
    };

    const filteredData = getFilteredData();

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-4">
                <h2 className="card-header mb-0">{title}</h2>

                {/* Time Range Selector */}
                <div className="flex gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg">
                    {(['1M', '3M', '6M', '1Y', '5Y', 'ALL'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-all ${timeRange === range
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis
                            dataKey="date"
                            stroke="var(--text-tertiary)"
                            style={{ fontSize: '11px' }}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                if (timeRange === '5Y' || timeRange === 'ALL') {
                                    return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
                                }
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            stroke="var(--text-tertiary)"
                            style={{ fontSize: '11px' }}
                            tickFormatter={(value) => `${value.toFixed(2)}${yAxisLabel}`}
                            label={{
                                value: yAxisLabel,
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: '11px', fill: 'var(--text-secondary)' }
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-default)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                            formatter={(value: any) => [`${Number(value).toFixed(3)}${yAxisLabel}`, '']}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            iconType="line"
                        />

                        {/* Brush for zooming/panning */}
                        {filteredData.length > 30 && (
                            <Brush
                                dataKey="date"
                                height={30}
                                stroke="var(--accent-primary)"
                                fill="var(--bg-secondary)"
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                                }}
                            />
                        )}

                        {lines.map((line) => (
                            <Line
                                key={line.dataKey}
                                type="monotone"
                                dataKey={line.dataKey}
                                name={line.name}
                                stroke={line.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 text-xs text-[var(--text-tertiary)]">
                Showing {filteredData.length} data points from {timeRange === 'ALL' ? 'all available data' : `last ${timeRange}`}
            </div>
        </div>
    );
}
