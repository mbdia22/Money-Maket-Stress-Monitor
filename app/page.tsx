'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import StressIndicator from '@/components/StressIndicator';
import RateCard from '@/components/RateCard';
import RegionalFilter from '@/components/RegionalFilter';
import HistoricalChart from '@/components/HistoricalChart';
import TabbedMonitors from '@/components/TabbedMonitors';

interface MarketData {
  current: {
    rates?: Record<string, number>;
    moneyMarket?: Record<string, number>;
    repo?: Record<string, number>;
    fx: Record<string, number>;
    spreads?: Record<string, number>;
    reserveScarcity?: Record<string, string>;
    facilities?: Record<string, number>;
    xccyBasis?: Record<string, number>;
    percentiles?: {
      SOFR?: {
        p25?: number;
        p50?: number;
        p75?: number;
        p99?: number;
      };
    };
    timestamp: string;
  };
  historical: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  stress: {
    score: number;
    level: string;
    components?: {
      repo: number;
      credit: number;
      fx: number;
      volatility: number;
    };
    details?: {
      repo?: any;
      credit?: any;
      fx?: any;
      spreads?: Record<string, number>;
    };
  };
  dataSource?: string;
}

export default function Home() {
  const [data, setData] = useState<MarketData | null>(null);
  const [region, setRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = region === 'all' 
        ? '/api/market-data' 
        : `/api/market-data?region=${region}`;
      const response = await fetch(url);
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [region]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading market data...</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Money Market Stress Monitor
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time monitoring of repo rates, Fed facilities, reserve scarcity, and market stress indicators
          </p>
          {data?.dataSource && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Data source: {data.dataSource === 'hybrid' ? 'Real-time + Enhanced' : 'Enhanced Mock'}
            </p>
          )}
        </header>

        <RegionalFilter region={region} onRegionChange={setRegion} />

        {data && (
          <>
            <TabbedMonitors data={data} />
            
            <Dashboard className="mt-6">
              {data.current.repo && Object.keys(data.current.repo).length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Granular Repo Rates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {Object.entries(data.current.repo).map(([key, value]) => (
                      value !== null && value !== undefined && (
                        <RateCard
                          key={key}
                          title={key}
                          value={value}
                          type="moneyMarket"
                        />
                      )
                    ))}
                  </div>
                </>
              )}

              {data.current.moneyMarket && Object.keys(data.current.moneyMarket).length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white mt-6">
                    Money Market Rates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {Object.entries(data.current.moneyMarket).map(([key, value]) => (
                      value !== null && value !== undefined && (
                        <RateCard
                          key={key}
                          title={key}
                          value={value}
                          type="moneyMarket"
                        />
                      )
                    ))}
                  </div>
                </>
              )}

              {data.current.xccyBasis && Object.keys(data.current.xccyBasis).length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white mt-6">
                    Cross-Currency Basis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {Object.entries(data.current.xccyBasis).map(([key, value]) => (
                      value !== null && (
                        <div
                          key={key}
                          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg shadow-md border border-orange-200 dark:border-orange-700"
                        >
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                            {key}
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {typeof value === 'number' ? `${value.toFixed(2)} bps` : value}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </>
              )}

            </Dashboard>
          </>
        )}

        {data && (
          <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
            Last updated: {new Date(data.current.timestamp).toLocaleString()}
          </footer>
        )}
      </div>
    </main>
  );
}
