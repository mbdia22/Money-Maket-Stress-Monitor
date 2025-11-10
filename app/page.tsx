'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import StressIndicator from '@/components/StressIndicator';
import RateCard from '@/components/RateCard';
import RegionalFilter from '@/components/RegionalFilter';
import HistoricalChart from '@/components/HistoricalChart';

interface MarketData {
  current: {
    moneyMarket: Record<string, number>;
    fx: Record<string, number>;
    timestamp: string;
  };
  historical: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  stress: {
    score: number;
    level: string;
    volatility: number;
    spread: number;
    fxVolatility: number;
  };
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
            Market Stress Monitor
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time monitoring of money market rates and FX across EMEA and US
          </p>
        </header>

        <RegionalFilter region={region} onRegionChange={setRegion} />

        {data && (
          <>
            <div className="mb-6">
              <StressIndicator stress={data.stress} />
            </div>

            <Dashboard>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(data.current.moneyMarket).map(([key, value]) => (
                  <RateCard
                    key={key}
                    title={key}
                    value={value}
                    type="moneyMarket"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(data.current.fx).map(([key, value]) => (
                  <RateCard
                    key={key}
                    title={key}
                    value={value}
                    type="fx"
                  />
                ))}
              </div>

              <div className="mt-6">
                <HistoricalChart data={data.historical} />
              </div>
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

