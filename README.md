# Market Stress Monitor

A real-time web application for monitoring money market stress across EMEA and US regions. This tool tracks key money market rates, FX rates, and calculates stress indicators to help identify market volatility and potential stress points.

## Features

- **Real-time Market Data**: Monitor key money market rates (SOFR, LIBOR, EURIBOR, SONIA) and major FX pairs
- **Stress Indicators**: Automated calculation of stress scores based on volatility, spreads, and FX movements
- **Regional Filtering**: Filter data by region (US, EMEA, or All)
- **Historical Trends**: 30-day historical charts for rate movements
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

### Data Sources (To Be Integrated)

For production use, you'll need to integrate with financial data providers:

1. **Money Market Rates**:
   - Federal Reserve Economic Data (FRED) API for SOFR
   - Bloomberg API or Refinitiv for LIBOR, EURIBOR, SONIA
   - Central bank APIs (ECB, BoE, Fed)

2. **FX Rates**:
   - Alpha Vantage API
   - ExchangeRate-API
   - OANDA API
   - Yahoo Finance API

3. **Alternative Options**:
   - Financial Modeling Prep API
   - Twelve Data API
   - Polygon.io

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

## Stress Calculation

The stress score (0-100) is calculated based on:

1. **Volatility**: Standard deviation of recent rate changes
2. **Spread**: Difference between key regional rates (e.g., SOFR vs EURIBOR)
3. **FX Volatility**: Volatility in major currency pairs

Stress levels:
- **Low** (0-30): Normal market conditions
- **Medium** (31-50): Elevated volatility
- **High** (51-70): Significant stress
- **Critical** (71-100): Extreme market stress

## Next Steps for Production

1. **Integrate Real Data Sources**:
   - Replace mock data generator with actual API calls
   - Set up API keys and authentication
   - Implement rate limiting and error handling

2. **Add More Indicators**:
   - Credit spreads (e.g., TED spread)
   - VIX or other volatility indices
   - Central bank policy rates
   - Yield curve metrics

3. **Enhanced Features**:
   - Alert system for threshold breaches
   - Historical stress index calculations
   - Export functionality (CSV, PDF)
   - User authentication and saved preferences
   - Real-time WebSocket connections

4. **Deployment**:
   - Deploy backend to cloud (AWS, Heroku, Railway)
   - Deploy frontend to Vercel or similar
   - Set up CI/CD pipeline
   - Configure environment variables

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
# Add API keys for data providers when integrating real APIs
# ALPHA_VANTAGE_API_KEY=your_key_here
# FRED_API_KEY=your_key_here
```

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

