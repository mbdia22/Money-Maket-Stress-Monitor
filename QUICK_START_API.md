# Quick Start: Get Real Data in 5 Minutes

## Step 1: Get FRED API Key (FREE) ⭐

1. Go to: https://fred.stlouisfed.org/docs/api/api_key.html
2. Fill in the form (takes 30 seconds)
3. Copy your API key
4. Add to `.env` file:
   ```
   FRED_API_KEY=your_key_here
   ```

**That's it!** Your app will now fetch real data from the Federal Reserve.

## Step 2: (Optional) Get FMP API Key

1. Go to: https://site.financialmodelingprep.com/
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env` file:
   ```
   FMP_API_KEY=your_key_here
   ```

## Step 3: Restart Server

```bash
npm run server
```

## Step 4: Verify Real Data

1. Check server console - you should see:
   ```
   ✅ Real data fetched successfully from FRED API
      Rates available: SOFR, EFFR, IORB, ...
   ```

2. Open browser at http://localhost:3000
3. Check if data shows real values (not mock data)

## What Data You'll Get

With FRED API key, you'll get:
- ✅ SOFR (Secured Overnight Financing Rate)
- ✅ BGCR (Broad General Collateral Rate)
- ✅ TGCR (Tri-party General Collateral Rate)
- ✅ EFFR (Effective Federal Funds Rate)
- ✅ IORB (Interest on Reserve Balances)
- ✅ OBFR (Overnight Bank Funding Rate)
- ✅ O/N RRP (Reverse Repo Rate)
- ✅ Historical data for charts
- ✅ Percentile calculations

## Troubleshooting

### "FRED_API_KEY not set" warning
- Make sure `.env` file exists in project root
- Check that key is correct (no spaces)
- Restart server after adding key

### No data showing
- Check server console for errors
- Verify API key is correct
- Check internet connection
- FRED updates data daily (may not have today's data yet)

### Rate limit errors
- FRED: Unlimited (free) ✅
- FMP: 250 requests/day (free tier)
- ExchangeRate: 1,500 requests/month (free)

## Automated Setup

Run the setup script:
```bash
./setup-api-keys.sh
```

This will guide you through adding API keys interactively.

## Cost

**Total cost: $0/month** for free tier APIs!

- FRED API: Free, unlimited
- FMP API: Free, 250 requests/day
- ExchangeRate-API: Free, 1,500 requests/month

## Next Steps

1. Get FRED API key (5 minutes)
2. Add to `.env` file
3. Restart server
4. Enjoy real data! 🎉

For more details, see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

