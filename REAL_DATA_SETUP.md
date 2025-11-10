# Real-Time Data Integration Guide

This guide explains how to integrate real-time financial data sources into your Market Stress Monitor.

## Current Features

The app now includes:
- ✅ **Repo Market Rates**: US GC Repo, Tri-party Repo, EUR Repo, GBP Repo
- ✅ **Enhanced Stress Analysis**: Multi-component stress scoring (Repo, Credit, FX, Volatility)
- ✅ **Key Spreads**: LIBOR-OIS, TED Spread, SOFR-EFFR, SOFR-EURIBOR
- ✅ **90-Day Historical Data**: Extended history for better trend analysis
- ✅ **Hybrid Data Mode**: Automatically uses real APIs when available, falls back to enhanced mock data

## Data Sources Supported

### 1. FRED API (Federal Reserve Economic Data) - **FREE**

**Best for**: US money market rates (SOFR, EFFR, repo rates)

**Setup**:
1. Go to https://fred.stlouisfed.org/docs/api/api_key.html
2. Request a free API key
3. Add to `.env`:
   ```env
   FRED_API_KEY=your_fred_api_key_here
   ```

**Available Series**:
- `SOFR` - Secured Overnight Financing Rate
- `EFFR` - Effective Federal Funds Rate
- `RIFSPPNAAD90_N.B` - General Collateral Repo Rate
- `RIFSRPD90_N.B` - Tri-party Repo Rate

### 2. ExchangeRate-API - **FREE (No Key Required)**

**Best for**: FX rates

**Setup**: No API key needed! Works out of the box.

**Limitations**: 
- Free tier: 1,500 requests/month
- Updates every 24 hours

### 3. Alpha Vantage - **FREE Tier Available**

**Best for**: FX rates (real-time)

**Setup**:
1. Go to https://www.alphavantage.co/support/#api-key
2. Get a free API key
3. Add to `.env`:
   ```env
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
   ```

**Limitations**:
- Free tier: 5 API calls/minute, 500 calls/day
- Real-time FX data

## Enhanced Stress Analysis

The stress analyzer now calculates a comprehensive score (0-100) based on:

### Component Breakdown:
1. **Repo Stress (0-25 points)**
   - Repo spread vs risk-free rate
   - Repo market volatility
   - Funding stress indicators

2. **Credit Stress (0-35 points)**
   - LIBOR-OIS spread (banking system stress)
   - TED Spread (credit risk indicator)
   - Interbank lending stress

3. **FX Stress (0-20 points)**
   - Currency volatility
   - Cross-currency spreads
   - FX market disruptions

4. **Volatility (0-20 points)**
   - Rate volatility (7-day rolling)
   - Historical deviation analysis
   - Market uncertainty

### Stress Levels:
- **Low (0-30)**: Normal market conditions
- **Medium (31-50)**: Elevated volatility, watch for trends
- **High (51-70)**: Significant stress, increased monitoring needed
- **Critical (71-100)**: Extreme market stress, potential systemic risk

## Key Spreads Explained

### LIBOR-OIS Spread
- **What it measures**: Banking system stress
- **Normal**: < 15 bps
- **Elevated**: 15-30 bps
- **High Stress**: > 30 bps
- **Critical**: > 50 bps

### TED Spread
- **What it measures**: Credit risk and liquidity
- **Normal**: < 25 bps
- **Elevated**: 25-50 bps
- **High Stress**: > 50 bps
- **Critical**: > 100 bps

### SOFR-EFFR Spread
- **What it measures**: Money market efficiency
- **Normal**: < 5 bps
- **Elevated**: 5-10 bps
- **High Stress**: > 10 bps

## Advanced Data Sources (Paid)

For production use, consider these premium data providers:

### Bloomberg API
- Comprehensive global market data
- Real-time repo rates across all regions
- Requires Bloomberg Terminal subscription

### Refinitiv (formerly Thomson Reuters)
- Real-time FX and money market data
- EMEA repo rates
- Professional pricing

### ICE Data Services
- Comprehensive repo market data
- Historical data access
- Enterprise pricing

### ECB Statistical Data Warehouse
- Free access to EURIBOR, EONIA, repo rates
- REST API available
- No authentication required for public data

### Bank of England API
- SONIA rates
- UK repo rates
- Free public API

## Setting Up Real Data

1. **Create `.env` file** in the project root:
   ```env
   PORT=3001
   FRED_API_KEY=your_key_here
   ALPHA_VANTAGE_API_KEY=your_key_here
   ```

2. **Restart the server**:
   ```bash
   npm run server
   ```

3. **Check the console** - you should see:
   - Real data being fetched (if APIs are configured)
   - "Data source: hybrid" in the frontend (when real data is available)

## Testing Real Data Integration

1. **Test FRED API**:
   ```bash
   curl http://localhost:3001/api/market-data
   ```
   Check if SOFR and EFFR have real values (not null)

2. **Test FX Rates**:
   Check if EUR/USD, GBP/USD show real-time values

3. **Monitor Console**:
   Watch for API errors or rate limit warnings

## Data Refresh Rates

- **Current**: 30 seconds (configurable in `app/page.tsx`)
- **Cache TTL**: 60 seconds (configurable in `server/services/dataService.js`)
- **Historical Data**: Updated daily (or on manual refresh)

## Troubleshooting

### "FRED_API_KEY not set" warning
- This is normal if you haven't set up API keys
- App will use enhanced mock data
- To fix: Add your FRED API key to `.env`

### Rate Limit Errors
- Alpha Vantage: 5 calls/minute (free tier)
- Solution: Increase cache TTL or upgrade to paid tier

### No Real Data Showing
- Check API keys are correct in `.env`
- Verify API keys are active
- Check server console for error messages
- Ensure internet connection is active

## Next Steps

1. **Get Free API Keys**: Start with FRED and ExchangeRate-API
2. **Monitor Usage**: Track API call limits
3. **Enhance Analysis**: Add more indicators as needed
4. **Scale Up**: Consider paid APIs for production use

## Additional Resources

- [FRED API Documentation](https://fred.stlouisfed.org/docs/api/)
- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [ExchangeRate-API Documentation](https://www.exchangerate-api.com/docs)
- [ECB Statistical Data Warehouse](https://sdw.ecb.europa.eu/)
- [Bank of England API](https://www.bankofengland.co.uk/boeapps/database)

