# Market Stress Monitor

A real-time web application for monitoring money market stress across EMEA and US regions. This tool tracks key money market rates, FX rates, and calculates stress indicators to help identify market volatility and potential stress points.

## Features

- **Real-time Market Data**: Monitor key money market rates (SOFR, LIBOR, EURIBOR, SONIA) and major FX pairs
- **Repo Market Rates**: Track repurchase agreement rates (US GC Repo, Tri-party Repo, EUR/GBP Repo)
- **Enhanced Stress Analysis**: Multi-component stress scoring (Repo, Credit, FX, Volatility) with granular indicators
- **Key Spreads**: Monitor LIBOR-OIS, TED Spread, SOFR-EFFR, and other critical stress indicators
- **Regional Filtering**: Filter data by region (US, EMEA, or All)
- **Historical Trends**: 90-day historical charts for comprehensive trend analysis
- **Real-time Data Integration**: Supports FRED API, Alpha Vantage, and ExchangeRate-API with automatic fallback
- **Auto-refresh**: Data updates every 30 seconds
- **Modern UI**: Responsive design with dark mode support

## Architecture

### Frontend
- **Next.js 14** with TypeScript
- **React** for UI components
- **Recharts** for data visualization
- **Tailwind CSS** for styling

### Backend
- **Express.js** API server
- Mock data generator (replace with real API integrations)
- Stress calculation algorithms

### Data Sources (Integrated & Available)

The app now supports real-time data integration:

1. **Money Market Rates** (✅ Integrated):
   - **FRED API** (FREE) - SOFR, EFFR, repo rates
   - Enhanced mock data with realistic repo rates
   - Ready for ECB/BoE API integration

2. **FX Rates** (✅ Integrated):
   - **ExchangeRate-API** (FREE, no key required)
   - **Alpha Vantage API** (FREE tier available)
   - Real-time currency pairs

3. **Repo Rates** (✅ Integrated):
   - US General Collateral Repo
   - US Tri-party Repo
   - EUR and GBP Repo rates

4. **Stress Indicators** (✅ Enhanced):
   - LIBOR-OIS spread
   - TED Spread
   - Repo spreads
   - FX volatility
   - Multi-component stress scoring

See [REAL_DATA_SETUP.md](./REAL_DATA_SETUP.md) for detailed setup instructions.

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server (in one terminal):
```bash
npm run server
```

3. Start the frontend development server (in another terminal):
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
market-stress-monitor/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Dashboard.tsx      # Main dashboard container
│   ├── StressIndicator.tsx # Stress score display
│   ├── RateCard.tsx       # Individual rate cards
│   ├── RegionalFilter.tsx # Region filter buttons
│   └── HistoricalChart.tsx # Historical data chart
├── server/                 # Backend API
│   └── index.js           # Express server
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── tailwind.config.js     # Tailwind CSS config
```

## Enhanced Stress Calculation

The comprehensive stress score (0-100) is calculated based on four components:

1. **Repo Stress (0-25 points)**: Repo spread vs risk-free rate, funding stress
2. **Credit Stress (0-35 points)**: LIBOR-OIS spread, TED Spread, interbank lending stress
3. **FX Stress (0-20 points)**: Currency volatility, cross-currency spreads
4. **Volatility (0-20 points)**: Rate volatility, historical deviation analysis

### Key Spreads Monitored:
- **LIBOR-OIS Spread**: Banking system stress indicator
- **TED Spread**: Credit risk and liquidity indicator
- **SOFR-EFFR Spread**: Money market efficiency
- **SOFR-EURIBOR Spread**: Cross-regional stress

### Stress Levels:
- **Low** (0-30): Normal market conditions
- **Medium** (31-50): Elevated volatility, watch for trends
- **High** (51-70): Significant stress, increased monitoring needed
- **Critical** (71-100): Extreme market stress, potential systemic risk

## Next Steps for Production

1. **Set Up Real Data Sources** (✅ Ready):
   - Get free API keys (FRED, Alpha Vantage)
   - Add keys to `.env` file
   - See [REAL_DATA_SETUP.md](./REAL_DATA_SETUP.md) for details

2. **Additional Indicators** (Future):
   - VIX or other volatility indices
   - Central bank policy rates
   - Yield curve metrics
   - Credit default swap spreads

3. **Enhanced Features** (Future):
   - Alert system for threshold breaches
   - Historical stress index calculations
   - Export functionality (CSV, PDF)
   - User authentication and saved preferences
   - Real-time WebSocket connections
   - Machine learning stress prediction

4. **Deployment**:
   - Deploy backend to cloud (AWS, Heroku, Railway)
   - Deploy frontend to Vercel or similar
   - Set up CI/CD pipeline
   - Configure environment variables securely

## Getting Real Data

To use real-time data instead of mock data, you need API keys. **All APIs have free tiers!**

### Quick Start (5 minutes)

1. **Get FRED API Key (FREE)**:
   - Go to: https://fred.stlouisfed.org/docs/api/api_key.html
   - Request free API key (instant approval)
   - Add to `.env`: `FRED_API_KEY=your_key_here`

2. **Restart server**: `npm run server`

3. **Verify**: Check console for "✅ Real data fetched successfully"

That's it! Your app will now use real Federal Reserve data.

### Available APIs

- **FRED API** (FREE, unlimited) - Primary data source for all rates
- **FMP API** (FREE, 250 requests/day) - Treasury rates, additional data
- **ExchangeRate-API** (FREE, no key needed) - FX rates
- **Alpha Vantage** (FREE tier) - Alternative FX data

See [QUICK_START_API.md](./QUICK_START_API.md) for detailed setup instructions.

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for comprehensive API documentation.

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001

# FRED API (FREE, unlimited) - PRIMARY DATA SOURCE
FRED_API_KEY=your_fred_key_here

# Financial Modeling Prep API (FREE, 250 requests/day)
FMP_API_KEY=your_fmp_key_here

# Alpha Vantage API (FREE tier)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

### Automated Setup

Run the setup script to interactively add API keys:

```bash
./setup-api-keys.sh
```

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

