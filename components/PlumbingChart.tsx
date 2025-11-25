'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

interface PlumbingChartProps {
  data: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  dataKey: string;
  title: string;
  subtitle?: string;
  warningZone?: { min: number; max: number };
  criticalZone?: { min: number; max: number };
  normalRange?: { min: number; max: number };
  currentValue?: number;
  unit?: string;
}

export default function PlumbingChart({
  data,
  dataKey,
  title,
  subtitle,
  warningZone,
  criticalZone,
  normalRange,
  currentValue,
  unit = 'bps'
}: PlumbingChartProps) {
  // Determine status based on current value
  const getStatus = () => {
    if (!currentValue) return 'info';
    if (criticalZone && (currentValue < criticalZone.min || currentValue > criticalZone.max)) {
      return 'critical';
    }
    if (warningZone && (currentValue < warningZone.min || currentValue > warningZone.max)) {
      return 'warning';
    }
    return 'normal';
  };

  const status = getStatus();
  const statusColors = {
    normal: '#00ff41',
    warning: '#ffff00',
    critical: '#ff0000',
    info: '#00ffff'
  };

  return (
    <div className="terminal-panel">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="terminal-panel-header terminal-glow">{title}</h3>
          {subtitle && (
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
        {currentValue !== undefined && (
          <div className="text-right">
            <div className={`spread-value status-${status} terminal-glow`}>
              {currentValue > 0 ? '+' : ''}{currentValue.toFixed(2)}
            </div>
            <div className="spread-label">{unit}</div>
          </div>
        )}
      </div>

      <div className="chart-container" style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={statusColors[status]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={statusColors[status]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis 
              dataKey="date" 
              stroke="#808080"
              style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `'${date.getFullYear().toString().slice(2)}`;
              }}
            />
            <YAxis 
              stroke="#808080"
              style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '0',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px'
              }}
              labelStyle={{ color: '#b0b0b0' }}
              itemStyle={{ color: statusColors[status] }}
            />
            
            {/* Warning zones */}
            {criticalZone && (
              <>
                <ReferenceLine 
                  y={criticalZone.max} 
                  stroke="#ff0000" 
                  strokeDasharray="3 3" 
                  label={{ value: 'CRITICAL', position: 'right', fill: '#ff0000', fontSize: 9 }}
                />
                <ReferenceLine 
                  y={criticalZone.min} 
                  stroke="#ff0000" 
                  strokeDasharray="3 3"
                />
              </>
            )}
            
            {warningZone && (
              <>
                <ReferenceLine 
                  y={warningZone.max} 
                  stroke="#ffff00" 
                  strokeDasharray="3 3"
                  label={{ value: 'WARNING', position: 'right', fill: '#ffff00', fontSize: 9 }}
                />
                <ReferenceLine 
                  y={warningZone.min} 
                  stroke="#ffff00" 
                  strokeDasharray="3 3"
                />
              </>
            )}

            {normalRange && (
              <ReferenceLine 
                y={0} 
                stroke="#00ff41" 
                strokeDasharray="3 3"
                label={{ value: 'AMPLE', position: 'right', fill: '#00ff41', fontSize: 9 }}
              />
            )}
            
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={statusColors[status]} 
              strokeWidth={2}
              fill={`url(#gradient-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
