const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data generator for demonstration
// In production, replace with real API calls to financial data providers
const generateMockData = () => {
  const now = new Date();
  const baseRates = {
    SOFR: 5.25 + (Math.random() - 0.5) * 0.5,
    'LIBOR-USD-3M': 5.30 + (Math.random() - 0.5) * 0.5,
    EURIBOR: 3.75 + (Math.random() - 0.5) * 0.3,
    SONIA: 5.00 + (Math.random() - 0.5) * 0.4,
  };

  const fxRates = {
    'EUR/USD': 1.08 + (Math.random() - 0.5) * 0.02,
    'GBP/USD': 1.26 + (Math.random() - 0.5) * 0.02,
    'USD/JPY': 149.50 + (Math.random() - 0.5) * 1.0,
    'USD/CHF': 0.88 + (Math.random() - 0.5) * 0.01,
  };

  // Generate historical data (last 30 days)
  const historical = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    historical.push({
      date: date.toISOString().split('T')[0],
      SOFR: baseRates.SOFR + (Math.random() - 0.5) * 0.3,
      EURIBOR: baseRates.EURIBOR + (Math.random() - 0.5) * 0.2,
      'EUR/USD': fxRates['EUR/USD'] + (Math.random() - 0.5) * 0.015,
      'GBP/USD': fxRates['GBP/USD'] + (Math.random() - 0.5) * 0.015,
    });
  }

  return {
    current: {
      moneyMarket: baseRates,
      fx: fxRates,
      timestamp: now.toISOString(),
    },
    historical,
  };
};

// Calculate stress indicators
const calculateStressIndicators = (data) => {
  const { current, historical } = data;
  
  // Calculate volatility (standard deviation of recent changes)
  const recentChanges = historical.slice(-7).map((d, i) => {
    if (i === 0) return 0;
    return Math.abs(d.SOFR - historical[i - 1].SOFR);
  });
  const volatility = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;

  // Calculate spread (difference between key rates)
  const spread = Math.abs(current.moneyMarket.SOFR - current.moneyMarket.EURIBOR);

  // Calculate FX volatility
  const fxChanges = historical.slice(-7).map((d, i) => {
    if (i === 0) return 0;
    return Math.abs(d['EUR/USD'] - historical[i - 1]['EUR/USD']);
  });
  const fxVolatility = fxChanges.reduce((a, b) => a + b, 0) / fxChanges.length;

  // Normalize stress score (0-100)
  const stressScore = Math.min(100, (volatility * 20 + spread * 2 + fxVolatility * 50));

  let stressLevel = 'low';
  if (stressScore > 70) stressLevel = 'critical';
  else if (stressScore > 50) stressLevel = 'high';
  else if (stressScore > 30) stressLevel = 'medium';

  return {
    score: Math.round(stressScore),
    level: stressLevel,
    volatility: Math.round(volatility * 1000) / 1000,
    spread: Math.round(spread * 100) / 100,
    fxVolatility: Math.round(fxVolatility * 10000) / 10000,
  };
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/market-data', (req, res) => {
  const { region } = req.query;
  const data = generateMockData();
  
  // Filter by region if specified
  let filteredData = data;
  if (region === 'US') {
    filteredData = {
      ...data,
      current: {
        ...data.current,
        moneyMarket: {
          SOFR: data.current.moneyMarket.SOFR,
          'LIBOR-USD-3M': data.current.moneyMarket['LIBOR-USD-3M'],
        },
      },
    };
  } else if (region === 'EMEA') {
    filteredData = {
      ...data,
      current: {
        ...data.current,
        moneyMarket: {
          EURIBOR: data.current.moneyMarket.EURIBOR,
          SONIA: data.current.moneyMarket.SONIA,
        },
      },
    };
  }

  const stress = calculateStressIndicators(data);
  
  res.json({
    ...filteredData,
    stress,
  });
});

app.get('/api/stress-indicators', (req, res) => {
  const data = generateMockData();
  const stress = calculateStressIndicators(data);
  res.json(stress);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Market data API available at http://localhost:${PORT}/api/market-data`);
});

