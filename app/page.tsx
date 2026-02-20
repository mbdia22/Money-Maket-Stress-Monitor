'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/MetricCard';
import InteractiveChart from '@/components/InteractiveChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MarketData {
  current: {
    rates?: Record<string, number>;
    moneyMarket?: Record<string, number>;
    repo?: Record<string, number>;
    fx: Record<string, number>;
    spreads?: Record<string, number>;
    reserveScarcity?: Record<string, number | string>;
    facilities?: Record<string, number>;
    timestamp: string;
  };
  historical: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  stress: {
    score: number;
    level: string;
  };
  dataSource?: string;
}

export default function Home() {
  const [data, setData] = useState<MarketData | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; [key: string]: string | number | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market-data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('/api/historical-data?days=1825'); // 5 years
      if (!response.ok) throw new Error('Failed to fetch historical data');
      const result = await response.json();
      setHistoricalData(result.historical || []);
      console.log(`Loaded ${result.count} days of historical data`);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchHistoricalData(); // Fetch 5 years of data once on mount
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-xl font-medium text-[var(--text-secondary)]">Loading market data...</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-xl font-medium text-error">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  const spreads = data.current.spreads || {};
  const repo = data.current.repo || {};
  const facilities = data.current.facilities || {};

  // Calculate statuses
  const effrIorbValue = spreads['EFFR-IORB'] || 0;
  const effrIorbStatus = effrIorbValue > 0 ? 'error' : effrIorbValue < -5 ? 'warning' : 'success';
  const effrIorbLabel = effrIorbValue > 0 ? 'SCARCITY' : effrIorbValue < -5 ? 'EXCESS' : 'AMPLE';

  const sofrIorbValue = spreads['SOFR-IORB'] || 0;
  const sofrIorbStatus = sofrIorbValue > 10 ? 'warning' : sofrIorbValue > 0 ? 'info' : 'success';
  const sofrIorbLabel = sofrIorbValue > 10 ? 'HIGH ACTIVITY' : sofrIorbValue > 0 ? 'ACTIVE' : 'NORMAL';

  const gcfTgcrValue = spreads['GCF-TGCR'] || 0;
  const gcfTgcrStatus = gcfTgcrValue > 5 ? 'error' : gcfTgcrValue > 2 ? 'warning' : 'success';
  const gcfTgcrLabel = gcfTgcrValue > 5 ? 'INFLEXIBLE' : gcfTgcrValue > 2 ? 'CONSTRAINED' : 'FLEXIBLE';

  const tgcrRrpValue = spreads['TGCR-RRP'] || 0;

  const stressLevel = data.stress.level.toUpperCase();
  const stressStatus = stressLevel === 'CRITICAL' || stressLevel === 'HIGH' ? 'error' :
    stressLevel === 'MEDIUM' ? 'warning' : 'success';

  return (
    <main className="min-h-screen p-6 bg-[var(--bg-secondary)]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                Money Market Plumbing Monitor
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Real-time monitoring of money market rates, Fed facilities, and reserve scarcity
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold mb-1 ${stressStatus === 'success' ? 'text-success' : stressStatus === 'warning' ? 'text-warning' : 'text-error'}`}>
                Stress: {stressLevel}
              </div>
              {data.dataSource && (
                <div className="text-xs text-[var(--text-tertiary)]">
                  Source: {data.dataSource === 'hybrid' ? 'NY Fed + FRED' : data.dataSource.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Key Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Reserve Scarcity"
            value={effrIorbValue}
            status={effrIorbStatus}
            statusLabel={effrIorbLabel}
            description="EFFR-IORB spread measures reserve scarcity"
          />
          <MetricCard
            title="Bank Repo Activity"
            value={sofrIorbValue}
            status={sofrIorbStatus}
            statusLabel={sofrIorbLabel}
            description="SOFR-IORB indicates bank activity in repo"
          />
          <MetricCard
            title="Dealer Capacity"
            value={gcfTgcrValue}
            status={gcfTgcrStatus}
            statusLabel={gcfTgcrLabel}
            description="GCF-TGCR shows dealer balance sheet capacity"
          />
          <MetricCard
            title="Repo Demand"
            value={tgcrRrpValue}
            status="info"
            statusLabel="MONITORING"
            description="TGCR-RRP spread (collateral vs cash)"
          />
        </div>

        {/* Repo Rates Section - Interactive Chart with 5-year history */}
        {historicalData.length > 0 && (
          <InteractiveChart
            data={historicalData}
            lines={[
              { dataKey: 'SOFR', name: 'SOFR', color: '#0066cc' },
              { dataKey: 'BGCR', name: 'BGCR', color: '#10b981' },
              { dataKey: 'TGCR', name: 'TGCR', color: '#f59e0b' },
            ]}
            title="Repo Rates (from NY Fed API) - 5 Year History"
            yAxisLabel="%"
          />
        )}

        {/* Spreads Chart - Interactive with 5-year history */}
        {historicalData.length > 0 && (
          <InteractiveChart
            data={historicalData}
            lines={[
              { dataKey: 'EFFR-IORB', name: 'EFFR-IORB (Reserve Scarcity)', color: '#ef4444' },
              { dataKey: 'SOFR-IORB', name: 'SOFR-IORB (Bank Activity)', color: '#3b82f6' },
              { dataKey: 'TGCR-RRP', name: 'TGCR-RRP (Repo Demand)', color: '#10b981' },
            ]}
            title="Key Money Market Spreads - 5 Year History"
            yAxisLabel=" bps"
          />
        )}

        {/* Fed Facilities */}
        {facilities && Object.keys(facilities).length > 0 && (
          <div className="card mb-6">
            <h2 className="card-header">Fed Facilities Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(facilities).map(([key, value]) => (
                value !== null && value !== undefined && (
                  <div key={key} className="border border-[var(--border-light)] rounded-lg p-4">
                    <div className="text-sm text-[var(--text-secondary)] mb-2">{key}</div>
                    <div className="text-2xl font-bold text-[var(--accent-primary)]">
                      ${typeof value === 'number' ? value.toFixed(1) : value}B
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Spreads Table */}
        <div className="card">
          <h2 className="card-header">Key Money Market Spreads</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Spread</th>
                <th>Value (bps)</th>
                <th>Status</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">EFFR-IORB</td>
                <td className={effrIorbStatus === 'success' ? 'text-success' : effrIorbStatus === 'warning' ? 'text-warning' : 'text-error'}>
                  {effrIorbValue > 0 ? '+' : ''}{effrIorbValue.toFixed(2)}
                </td>
                <td>
                  <span className={`status-badge status-${effrIorbStatus}`}>{effrIorbLabel}</span>
                </td>
                <td className="text-sm text-[var(--text-secondary)]">Reserve scarcity measure</td>
              </tr>
              <tr>
                <td className="font-medium">SOFR-IORB</td>
                <td className={sofrIorbStatus === 'success' ? 'text-success' : sofrIorbStatus === 'warning' ? 'text-warning' : 'text-info'}>
                  {sofrIorbValue > 0 ? '+' : ''}{sofrIorbValue.toFixed(2)}
                </td>
                <td>
                  <span className={`status-badge status-${sofrIorbStatus}`}>{sofrIorbLabel}</span>
                </td>
                <td className="text-sm text-[var(--text-secondary)]">Bank activity in repo</td>
              </tr>
              <tr>
                <td className="font-medium">SOFR-EFFR</td>
                <td className="text-info">
                  {(spreads['SOFR-EFFR'] || 0) > 0 ? '+' : ''}{(spreads['SOFR-EFFR'] || 0).toFixed(2)}
                </td>
                <td>
                  <span className="status-badge status-info">MONITORING</span>
                </td>
                <td className="text-sm text-[var(--text-secondary)]">FHLB repo demand</td>
              </tr>
              <tr>
                <td className="font-medium">TGCR-RRP</td>
                <td className="text-info">
                  {tgcrRrpValue > 0 ? '+' : ''}{tgcrRrpValue.toFixed(2)}
                </td>
                <td>
                  <span className="status-badge status-info">MONITORING</span>
                </td>
                <td className="text-sm text-[var(--text-secondary)]">Private repo demand</td>
              </tr>
              <tr>
                <td className="font-medium">GCF-TGCR</td>
                <td className={gcfTgcrStatus === 'success' ? 'text-success' : gcfTgcrStatus === 'warning' ? 'text-warning' : 'text-error'}>
                  {gcfTgcrValue > 0 ? '+' : ''}{gcfTgcrValue.toFixed(2)}
                </td>
                <td>
                  <span className={`status-badge status-${gcfTgcrStatus}`}>{gcfTgcrLabel}</span>
                </td>
                <td className="text-sm text-[var(--text-secondary)]">Dealer balance sheet capacity</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-xs text-[var(--text-tertiary)] text-center">
          <div className="mb-1">
            Source: Federal Reserve Bank of New York Markets Data API, Federal Reserve Economic Data (FRED)
          </div>
          <div>
            Last Updated: {new Date(data.current.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </footer>
      </div>
    </main>
  );
}
