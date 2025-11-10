'use client';

import React, { useState } from 'react';
import FedBenchmarkMonitor from './FedBenchmarkMonitor';
import ReserveScarcityMonitor from './ReserveScarcityMonitor';
import FedFacilitiesMonitor from './FedFacilitiesMonitor';
import HistoricalChart from './HistoricalChart';
import EnhancedHistoricalChart from './EnhancedHistoricalChart';
import StressIndicator from './StressIndicator';

interface TabbedMonitorsProps {
  data: any;
}

export default function TabbedMonitors({ data }: TabbedMonitorsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'fed-benchmarks', label: 'Fed Benchmarks', icon: '🏦' },
    { id: 'reserve-scarcity', label: 'Reserve Scarcity', icon: '💧' },
    { id: 'fed-facilities', label: 'Fed Facilities', icon: '🏛️' },
    { id: 'money-market-spreads', label: 'Money Market Spreads', icon: '📈' },
    { id: 'historical', label: 'Historical Trends', icon: '📉' },
    { id: 'education', label: 'Learn More', icon: '📚' },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-1 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StressIndicator stress={data?.stress} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FedBenchmarkMonitor 
                rates={data?.current?.rates || {}} 
                percentiles={data?.current?.percentiles}
              />
              <ReserveScarcityMonitor 
                indicators={data?.current?.reserveScarcity || {}}
                spreads={data?.current?.spreads || {}}
              />
            </div>
            <FedFacilitiesMonitor facilities={data?.current?.facilities || {}} />
          </div>
        )}

        {activeTab === 'fed-benchmarks' && (
          <FedBenchmarksTab data={data} />
        )}

        {activeTab === 'reserve-scarcity' && (
          <ReserveScarcityTab data={data} />
        )}

        {activeTab === 'fed-facilities' && (
          <FedFacilitiesTab data={data} />
        )}

        {activeTab === 'money-market-spreads' && (
          <MoneyMarketSpreadsTab data={data} />
        )}

        {activeTab === 'historical' && (
          <HistoricalTab data={data} />
        )}

        {activeTab === 'education' && (
          <EducationTab />
        )}
      </div>
    </div>
  );
}

// Individual Tab Components
function FedBenchmarksTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Understanding Fed Rate Benchmarks
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          The Federal Reserve administers several key rate benchmarks that reflect different segments of the money market.
          These rates help monitor liquidity conditions and funding stress across the financial system.
        </p>
      </div>

      <FedBenchmarkMonitor 
        rates={data?.current?.rates || {}} 
        percentiles={data?.current?.percentiles}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Fed Rate Benchmarks Over Time
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This chart shows how key Fed-administered rates move relative to each other. When spreads widen, it indicates stress in specific market segments.
        </p>
        <EnhancedHistoricalChart 
          data={data?.historical || []}
          series={['SOFR', 'EFFR', 'IORB', 'O/N-RRP']}
          yAxisLabel="Rate (%)"
          showPercentiles={true}
          percentiles={data?.current?.percentiles}
        />
      </div>
    </div>
  );
}

function ReserveScarcityTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
          Reserve Scarcity Indicators Explained
        </h3>
        <div className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
          <p>
            <strong>EFFR-IORB Spread:</strong> The primary measure of reserve scarcity. When positive, it indicates scarce reserves.
            When negative, it shows excess cash in the system.
          </p>
          <p>
            <strong>SOFR-IORB Spread:</strong> When positive, banks are consistently deploying reserves into repo markets,
            reducing liquidity elsewhere. This is a key indicator of bank behavior.
          </p>
          <p>
            <strong>TGCR-RRP Spread:</strong> Measures demand for cash vs collateral. Positive values indicate excess collateral,
            negative values indicate excess cash.
          </p>
        </div>
      </div>

      <ReserveScarcityMonitor 
        indicators={data?.current?.reserveScarcity || {}}
        spreads={data?.current?.spreads || {}}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Reserve Scarcity Spreads Over Time
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          These spreads help identify periods of reserve scarcity or abundance. Watch for sustained positive values in EFFR-IORB as a warning sign.
        </p>
        <EnhancedHistoricalChart 
          data={data?.historical || []}
          series={['EFFR-IORB', 'SOFR-IORB', 'TGCR-RRP']}
          yAxisLabel="Spread (bps)"
        />
      </div>
    </div>
  );
}

function FedFacilitiesTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          Fed Facility Activity
        </h3>
        <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
          <p>
            <strong>O/N RRP:</strong> The Reverse Repo Facility allows eligible counterparties to lend cash to the Fed overnight.
            High volumes indicate excess liquidity in the system.
          </p>
          <p>
            <strong>Foreign Repo Pool:</strong> Repos with foreign official accounts. Rising levels indicate strong foreign demand
            for safe dollar assets.
          </p>
          <p>
            <strong>SRF (Standing Repo Facility):</strong> Emergency repo facility. Any usage indicates potential funding stress
            and should be monitored closely.
          </p>
        </div>
      </div>

      <FedFacilitiesMonitor facilities={data?.current?.facilities || {}} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Fed Facility Volumes Over Time
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Monitor facility usage for signs of liquidity stress or excess. SRF usage is particularly important as it indicates emergency funding needs.
        </p>
        <EnhancedHistoricalChart 
          data={data?.historical || []}
          series={['SOFR', 'EFFR']}
          yAxisLabel="Rate (%)"
        />
      </div>
    </div>
  );
}

function MoneyMarketSpreadsTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
          Money Market Spreads Explained
        </h3>
        <div className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
          <p>
            <strong>GCF-TGCR Spread:</strong> Measures dealer balance sheet capacity. Positive values indicate inflexible
            balance sheets and funding demand pressure.
          </p>
          <p>
            <strong>SOFR-EFFR Spread:</strong> Indicates where Federal Home Loan Banks might deploy more liquidity into repos.
            Positive values suggest FHLB activity in repo markets.
          </p>
        </div>
      </div>

      <ReserveScarcityMonitor 
        indicators={data?.current?.reserveScarcity || {}}
        spreads={data?.current?.spreads || {}}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          All Money Market Spreads
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Monitor these spreads for early warning signs of market stress. Sustained widening indicates increasing funding pressure.
        </p>
        <EnhancedHistoricalChart 
          data={data?.historical || []}
          series={['EFFR-IORB', 'SOFR-IORB', 'SOFR-EFFR', 'TGCR-RRP', 'GCF-TGCR']}
          yAxisLabel="Spread (bps)"
        />
      </div>
    </div>
  );
}

function HistoricalTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Historical Analysis
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Historical trends provide context for current market conditions. Compare current levels to historical ranges
          to assess whether current stress is elevated or normal.
        </p>
      </div>

      <HistoricalChart data={data?.historical || []} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Rate Percentiles Over Time
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Percentile bands show the distribution of rates. When current rates approach the 99th percentile, it indicates extreme conditions.
        </p>
        <EnhancedHistoricalChart 
          data={data?.historical || []}
          series={['SOFR', 'EFFR', 'IORB']}
          yAxisLabel="Rate (%)"
          showPercentiles={true}
          percentiles={data?.current?.percentiles}
        />
      </div>
    </div>
  );
}

function EducationTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Money Market Stress Monitor - Educational Guide
        </h2>
      </div>

      <div className="space-y-6">
        <EducationSection
          title="Understanding Money Markets"
          content={`
            Money markets are where financial institutions borrow and lend money for short periods (typically overnight to one year).
            These markets are crucial for:
            - Daily liquidity management
            - Funding operations
            - Managing reserve requirements
            - Providing safe, short-term investment options
          `}
        />

        <EducationSection
          title="Key Rate Benchmarks"
          content={`
            <strong>SOFR (Secured Overnight Financing Rate):</strong> The average rate of secured overnight repo transactions.
            It reflects the cost of borrowing cash against Treasury securities.
            
            <strong>EFFR (Effective Federal Funds Rate):</strong> The interest rate at which banks lend reserves to each other overnight.
            This is the primary policy rate target.
            
            <strong>IORB (Interest on Reserve Balances):</strong> The rate the Fed pays banks on excess reserves. This sets a floor
            for short-term rates.
            
            <strong>O/N RRP:</strong> The rate the Fed pays on reverse repos, setting a floor for money market rates.
          `}
        />

        <EducationSection
          title="Reserve Scarcity Indicators"
          content={`
            When reserves become scarce, banks compete more aggressively for funding, causing rates to rise above the IORB.
            
            <strong>EFFR-IORB Spread:</strong> The primary indicator. Positive values mean reserves are scarce. The Fed typically
            responds by adding reserves through open market operations.
            
            <strong>SOFR-IORB Spread:</strong> When positive, banks are actively deploying reserves into repo markets rather than
            holding them. This reduces liquidity available for interbank lending.
          `}
        />

        <EducationSection
          title="Fed Facilities"
          content={`
            The Fed operates several facilities to manage liquidity:
            
            <strong>Reverse Repo Facility (RRP):</strong> Allows counterparties to lend cash to the Fed overnight. High usage
            indicates excess liquidity in the system.
            
            <strong>Standing Repo Facility (SRF):</strong> Emergency facility for primary dealers. Usage indicates funding stress.
            
            <strong>Foreign Repo Pool:</strong> Repos with foreign central banks. Rising levels indicate strong global demand for
            safe dollar assets.
          `}
        />

        <EducationSection
          title="Interpreting Stress Levels"
          content={`
            <strong>Low (0-30):</strong> Normal market conditions. Spreads are tight, facilities are not heavily used.
            
            <strong>Medium (31-50):</strong> Elevated volatility. Some spreads widening, but not yet concerning.
            
            <strong>High (51-70):</strong> Significant stress. Multiple indicators showing stress, increased facility usage.
            
            <strong>Critical (71-100):</strong> Extreme stress. Multiple warning signs, potential systemic risk. Fed intervention
            likely needed.
          `}
        />

        <EducationSection
          title="What to Watch For"
          content={`
            <strong>Early Warning Signs:</strong>
            - EFFR-IORB spread turning positive and widening
            - SOFR-IORB spread staying positive for extended periods
            - SRF facility usage (any usage is a red flag)
            - Spreads approaching historical extremes
            
            <strong>Sustained Stress Indicators:</strong>
            - Multiple spreads widening simultaneously
            - Percentile bands showing rates at extremes
            - Facility volumes spiking
            - Cross-currency basis widening
          `}
        />
      </div>
    </div>
  );
}

function EducationSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <div 
        className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    </div>
  );
}


