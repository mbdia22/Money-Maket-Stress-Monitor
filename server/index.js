const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dataService = require('./services/dataService');
const stressAnalyzer = require('./services/stressAnalyzer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Enhanced mock data generator with all sophisticated metrics
const generateEnhancedMockData = () => {
  const now = new Date();

  // Base rates with realistic relationships
  const iorb = 4.50 + (Math.random() - 0.5) * 0.1;
  const effr = iorb - 0.05 + (Math.random() - 0.5) * 0.1;
  const sofr = iorb + 0.02 + (Math.random() - 0.5) * 0.15;
  const obfr = effr + 0.01 + (Math.random() - 0.5) * 0.05;

  // Granular repo rates
  const tgcr = sofr - 0.01 + (Math.random() - 0.5) * 0.05;
  const bgcr = sofr - 0.005 + (Math.random() - 0.5) * 0.03;
  const gcf = tgcr + 0.005 + (Math.random() - 0.5) * 0.08;
  const onrrp = iorb - 0.30 + (Math.random() - 0.5) * 0.05;

  const rates = {
    SOFR: sofr,
    BGCR: bgcr,
    TGCR: tgcr,
    GCF: gcf,
    EFFR: effr,
    OBFR: obfr,
    IORB: iorb,
    'O/N-RRP': onrrp,
    EURIBOR: 3.75 + (Math.random() - 0.5) * 0.2,
    SONIA: 5.00 + (Math.random() - 0.5) * 0.2,
  };

  // Calculate percentiles (simulated)
  const sofrSeries = Array.from({ length: 30 }, () => sofr + (Math.random() - 0.5) * 0.2);
  sofrSeries.sort((a, b) => a - b);
  const percentiles = {
    p25: sofrSeries[7],
    p50: sofrSeries[15],
    p75: sofrSeries[22],
    p99: sofrSeries[29],
  };

  // Fed facilities
  const facilities = {
    'O/N-RRP-Volume': 150 + (Math.random() - 0.5) * 50, // in billions
    'Foreign-Repo-Pool': 350 + (Math.random() - 0.5) * 30,
    'SRF-Volume': Math.random() > 0.9 ? 5 + Math.random() * 10 : 0, // Occasional spikes
  };

  // Calculate spreads
  const spreads = {
    'EFFR-IORB': (effr - iorb) * 100,
    'SOFR-IORB': (sofr - iorb) * 100,
    'SOFR-EFFR': (sofr - effr) * 100,
    'TGCR-RRP': (tgcr - onrrp) * 100,
    'GCF-TGCR': (gcf - tgcr) * 100,
  };

  // Reserve scarcity status
  const reserveScarcity = {
    'EFFR-IORB-Status': spreads['EFFR-IORB'] > 0 ? 'SCARCITY' :
      spreads['EFFR-IORB'] < -5 ? 'ABUNDANCE' : 'AMPLE',
    'SOFR-IORB-Status': spreads['SOFR-IORB'] > 0 ? 'BANKS-DEPLOYING-RESERVES' : 'NORMAL',
    'TGCR-RRP-Status': spreads['TGCR-RRP'] > 0 ? 'EXCESS-COLLATERAL' : 'EXCESS-CASH',
    'GCF-TGCR-Status': spreads['GCF-TGCR'] > 0 ? 'INFLEXIBLE-BALANCE-SHEETS' : 'FLEXIBLE-BALANCE-SHEETS',
  };

  // FX rates
  const fxRates = {
    'EUR/USD': 1.08 + (Math.random() - 0.5) * 0.02,
    'GBP/USD': 1.26 + (Math.random() - 0.5) * 0.02,
    'USD/JPY': 149.50 + (Math.random() - 0.5) * 1.0,
    'USD/CHF': 0.88 + (Math.random() - 0.5) * 0.01,
  };

  // XCCY Basis (simulated)
  const xccyBasis = {
    'EUR/USD-3M': -3.5 + (Math.random() - 0.5) * 2.0,
    'GBP/USD-3M': -2.0 + (Math.random() - 0.5) * 1.5,
  };

  // Generate historical data (90 days)
  const historical = [];
  const historicalRates = {
    SOFR: [],
    EFFR: [],
    IORB: [],
    'EFFR-IORB': [],
    'SOFR-IORB': [],
    'TGCR-RRP': [],
  };

  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const hSofr = sofr + (Math.random() - 0.5) * 0.3;
    const hEffr = effr + (Math.random() - 0.5) * 0.2;
    const hIorb = iorb + (Math.random() - 0.5) * 0.1;
    const hTgcr = tgcr + (Math.random() - 0.5) * 0.15;
    const hOnrrp = onrrp + (Math.random() - 0.5) * 0.05;

    historical.push({
      date: dateStr,
      SOFR: hSofr,
      EFFR: hEffr,
      IORB: hIorb,
      BGCR: bgcr + (Math.random() - 0.5) * 0.1,
      TGCR: hTgcr,
      GCF: gcf + (Math.random() - 0.5) * 0.1,
      'EFFR-IORB': (hEffr - hIorb) * 100,
      'SOFR-IORB': (hSofr - hIorb) * 100,
      'TGCR-RRP': (hTgcr - hOnrrp) * 100,
      'EUR/USD': fxRates['EUR/USD'] + (Math.random() - 0.5) * 0.015,
    });

    historicalRates.SOFR.push(hSofr);
    historicalRates.EFFR.push(hEffr);
    historicalRates.IORB.push(hIorb);
    historicalRates['EFFR-IORB'].push((hEffr - hIorb) * 100);
    historicalRates['SOFR-IORB'].push((hSofr - hIorb) * 100);
    historicalRates['TGCR-RRP'].push((hTgcr - hOnrrp) * 100);
  }

  return {
    current: {
      rates,
      repo: {
        SOFR: sofr,
        BGCR: bgcr,
        TGCR: tgcr,
        GCF: gcf,
        'O/N-RRP': onrrp,
      },
      moneyMarket: {
        EFFR: effr,
        OBFR: obfr,
        IORB: iorb,
      },
      spreads,
      reserveScarcity,
      facilities,
      fx: fxRates,
      xccyBasis,
      percentiles: {
        SOFR: percentiles,
      },
      timestamp: now.toISOString(),
    },
    historical,
    historicalRates,
  };
};

// Fetch real data with fallback to enhanced mock
const fetchMarketData = async () => {
  try {
    const realData = await dataService.fetchAllMarketData();

    if (realData && Object.keys(realData.rates).length > 0) {
      const mockData = generateEnhancedMockData();
      return {
        ...mockData,
        current: {
          ...mockData.current,
          rates: { ...mockData.current.rates, ...realData.rates },
          repo: { ...mockData.current.repo, ...realData.repo },
          spreads: { ...mockData.current.spreads, ...realData.spreads },
          facilities: { ...mockData.current.facilities, ...realData.facilities },
        },
        dataSource: 'hybrid',
      };
    }
  } catch (error) {
    console.error('Error fetching real data, using enhanced mock:', error.message);
  }

  return {
    ...generateEnhancedMockData(),
    dataSource: 'mock',
  };
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      dataService: 'active',
      stressAnalyzer: 'active',
    },
  });
});

app.get('/api/market-data', async (req, res) => {
  try {
    const { region } = req.query;
    const data = await fetchMarketData();

    // Update stress analyzer history
    stressAnalyzer.updateHistory({
      rates: data.current.rates,
      spreads: data.current.spreads,
      facilities: data.current.facilities,
    });

    // Calculate comprehensive stress analysis
    const stress = stressAnalyzer.calculateComprehensiveStress(
      data.current,
      data.historicalRates || {}
    );

    // Filter by region if specified
    let filteredData = data;
    if (region === 'US') {
      // Keep US-specific data
    } else if (region === 'EMEA') {
      // Keep EMEA-specific data
    }

    res.json({
      ...filteredData,
      stress,
    });
  } catch (error) {
    console.error('Error in /api/market-data:', error);
    res.status(500).json({ error: 'Failed to fetch market data', message: error.message });
  }
});

// New endpoint for fetching extended historical data (up to 5 years)
app.get('/api/historical-data', async (req, res) => {
  try {
    const { days = 1825 } = req.query; // Default to 5 years (365 * 5)
    const requestedDays = Math.min(parseInt(days), 1825); // Cap at 5 years

    console.log(`Fetching ${requestedDays} days of historical data...`);

    // Fetch historical data for key series
    const [sofrData, effrData, iorbData, bgcrData, tgcrData, rrpData] = await Promise.all([
      dataService.fetchFREDData('SOFR', requestedDays * 2),
      dataService.fetchFREDData('EFFR', requestedDays * 2),
      dataService.fetchFREDData('IORB', requestedDays * 2),
      dataService.fetchFREDData('BGCR', requestedDays * 2),
      dataService.fetchFREDData('TGCR', requestedDays * 2),
      dataService.fetchFREDData('RRPONTSYD', requestedDays * 2),
    ]);

    // Combine data by date
    const dataByDate = new Map();

    const addToMap = (data, key) => {
      if (data && Array.isArray(data)) {
        data.forEach(item => {
          if (!dataByDate.has(item.date)) {
            dataByDate.set(item.date, { date: item.date });
          }
          dataByDate.get(item.date)[key] = item.value;
        });
      }
    };

    addToMap(sofrData, 'SOFR');
    addToMap(effrData, 'EFFR');
    addToMap(iorbData, 'IORB');
    addToMap(bgcrData, 'BGCR');
    addToMap(tgcrData, 'TGCR');
    addToMap(rrpData, 'O/N-RRP');

    // Convert to array and calculate spreads
    const historical = Array.from(dataByDate.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        ...item,
        'EFFR-IORB': item.EFFR && item.IORB ? (item.EFFR - item.IORB) * 100 : null,
        'SOFR-IORB': item.SOFR && item.IORB ? (item.SOFR - item.IORB) * 100 : null,
        'SOFR-EFFR': item.SOFR && item.EFFR ? (item.SOFR - item.EFFR) * 100 : null,
        'TGCR-RRP': item.TGCR && item['O/N-RRP'] ? (item.TGCR - item['O/N-RRP']) * 100 : null,
      }))
      .filter(item => item.SOFR || item.EFFR || item.IORB); // Keep only rows with at least one value

    console.log(`✅ Fetched ${historical.length} days of historical data`);

    res.json({
      historical,
      count: historical.length,
      requestedDays,
      dataSource: 'FRED API'
    });
  } catch (error) {
    console.error('Error in /api/historical-data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data', message: error.message });
  }
});

app.get('/api/repo-rates', async (req, res) => {
  try {
    const data = await fetchMarketData();
    res.json({
      repo: data.current.repo,
      spreads: data.current.spreads,
      facilities: data.current.facilities,
      timestamp: data.current.timestamp,
    });
  } catch (error) {
    console.error('Error in /api/repo-rates:', error);
    res.status(500).json({ error: 'Failed to fetch repo rates', message: error.message });
  }
});

app.get('/api/reserve-scarcity', async (req, res) => {
  try {
    const data = await fetchMarketData();
    res.json({
      indicators: data.current.reserveScarcity,
      spreads: {
        'EFFR-IORB': data.current.spreads['EFFR-IORB'],
        'SOFR-IORB': data.current.spreads['SOFR-IORB'],
        'SOFR-EFFR': data.current.spreads['SOFR-EFFR'],
      },
      timestamp: data.current.timestamp,
    });
  } catch (error) {
    console.error('Error in /api/reserve-scarcity:', error);
    res.status(500).json({ error: 'Failed to fetch reserve scarcity', message: error.message });
  }
});

app.get('/api/fed-facilities', async (req, res) => {
  try {
    const data = await fetchMarketData();
    res.json({
      facilities: data.current.facilities,
      timestamp: data.current.timestamp,
    });
  } catch (error) {
    console.error('Error in /api/fed-facilities:', error);
    res.status(500).json({ error: 'Failed to fetch Fed facilities', message: error.message });
  }
});

app.get('/api/money-market-spreads', async (req, res) => {
  try {
    const data = await fetchMarketData();
    res.json({
      spreads: data.current.spreads,
      reserveScarcity: data.current.reserveScarcity,
      timestamp: data.current.timestamp,
    });
  } catch (error) {
    console.error('Error in /api/money-market-spreads:', error);
    res.status(500).json({ error: 'Failed to fetch spreads', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Market data API: http://localhost:${PORT}/api/market-data`);
  console.log(`💱 Repo rates: http://localhost:${PORT}/api/repo-rates`);
  console.log(`📉 Reserve scarcity: http://localhost:${PORT}/api/reserve-scarcity`);
  console.log(`🏦 Fed facilities: http://localhost:${PORT}/api/fed-facilities`);
  console.log(`📈 Money market spreads: http://localhost:${PORT}/api/money-market-spreads`);
  console.log(`\n💡 To use real data, set API keys in .env file:`);
  console.log(`   - FRED_API_KEY (for SOFR, EFFR, IORB, repo rates)`);
});
