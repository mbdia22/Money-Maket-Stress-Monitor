# API Integration Guide for Real-Time Data

This guide covers all available APIs for getting real money market and repo data for your stress monitor.

## Free APIs (Recommended to Start)

### 1. FRED API (Federal Reserve Economic Data) - **FREE** ⭐

**Best for**: SOFR, EFFR, IORB, OBFR, repo rates, historical data

**Setup**:
1. Go to https://fred.stlouisfed.org/docs/api/api_key.html
2. Request a free API key (instant approval)
3. Add to `.env`: `FRED_API_KEY=69865b500c68ec155c37c2bb90d1a428`

**Available Data**:
- `SOFR` - Secured Overnight Financing Rate
- `BGCR` - Broad General Collateral Rate
- `TGCR` - Tri-party General Collateral Rate
- `GCFREPO` - GCF Repo Rate
- `EFFR` - Effective Federal Funds Rate
- `IORB` - Interest on Reserve Balances
- `OBFR` - Overnight Bank Funding Rate
- `RRPONTSYD` - Overnight Reverse Repo Rate
- `RRPONTSYAWARD` - Reverse Repo Volume
- `RIFSPPNAAD90_N.B` - General Collateral Repo
- `RIFSRPD90_N.B` - Tri-party Repo

**Rate Limits**: 
- Free tier: Unlimited requests
- No authentication required for public data

**Documentation**: https://fred.stlouisfed.org/docs/api/

---

### 2. New York Fed Data APIs - **FREE**

**Best for**: Repo market data, Fed facility data

**Available Endpoints**:
1. **SOFR Data**: https://www.newyorkfed.org/markets/reference-rates/sofr
   - Daily SOFR rates and components
   - Historical data available
   - CSV/JSON downloads

2. **Repo Market Data** (OFR):
   - URL: https://www.financialresearch.gov/short-term-funding-monitor/datasets/repo/
   - Daily repo rates and volumes
   - Centrally cleared and tri-party repo data
   - Available as CSV downloads (can be automated)

3. **Fed Facility Data**:
   - Reverse Repo Facility: https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/reverse-repo
   - Standing Repo Facility: https://www.newyorkfed.org/markets/standing-repo-facility

**Setup**: No API key required, but data is available via web scraping or CSV downloads

---

### 3. Office of Financial Research (OFR) - **FREE**

**Best for**: Detailed repo market analysis, stress indicators

**Available Data**:
- Repo rates by tenor and collateral type
- Daily volume data
- Stress indicators
- Cross-currency basis data

**URL**: https://www.financialresearch.gov/short-term-funding-monitor/

**Access**: CSV downloads, can be automated with web scraping

---

### 4. Financial Modeling Prep (FMP) - **FREE Tier Available**

**Best for**: Treasury rates, FX rates, additional market data

**Setup**:
1. Go to https://site.financialmodelingprep.com/developer/docs/
2. Sign up for free account
3. Get API key
4. Add to `.env`: `FMP_API_KEY=6kKCDupCFTvbr8pqWNLjZZzm80C4sPCY`

**Available Data**:
- Treasury rates (all maturities)
- FX rates
- Economic indicators
- Real-time quotes

**Rate Limits**:
- Free tier: 250 requests/day
- Paid tiers available

**Documentation**: https://site.financialmodelingprep.com/developer/docs/

---

### 5. ExchangeRate-API - **FREE (No Key Required)**

**Best for**: FX rates

**Setup**: No API key needed

**Rate Limits**: 
- Free: 1,500 requests/month
- Updates every 24 hours

**URL**: https://www.exchangerate-api.com/

---

## Paid APIs (For Production)

### 6. Bloomberg API

**Best for**: Comprehensive real-time data, all repo rates

**Cost**: Requires Bloomberg Terminal subscription (~$2,000/month)

**Features**:
- Real-time repo rates
- All Fed facility data
- Historical data
- Global coverage

---

### 7. Refinitiv (formerly Thomson Reuters)

**Best for**: Professional-grade data

**Cost**: Enterprise pricing

**Features**:
- Real-time market data
- Historical data
- EMEA repo rates
- Comprehensive coverage

---

### 8. ICE Data Services

**Best for**: Repo market data, fixed income

**Cost**: Enterprise pricing

**Features**:
- Comprehensive repo data
- Historical data
- Professional-grade

---

## Recommended Setup for Your App

### Phase 1: Free APIs (Start Here)

1. **FRED API** - Primary data source
   - Get API key: https://fred.stlouisfed.org/docs/api/api_key.html
   - Add to `.env`: `FRED_API_KEY=69865b500c68ec155c37c2bb90d1a428`

2. **FMP API** - Secondary data source
   - Get free API key
   - Add to `.env`: `FMP_API_KEY=6kKCDupCFTvbr8pqWNLjZZzm80C4sPCY`

3. **ExchangeRate-API** - FX rates
   - No setup needed (already integrated)

### Phase 2: Enhanced Data (Optional)

1. **NY Fed Data Scraping** - For additional repo data
2. **OFR Data** - For detailed repo analysis
3. **Web scraping** - For Fed facility volumes

### Phase 3: Production (If Needed)

1. **Bloomberg API** - For comprehensive coverage
2. **Refinitiv** - For professional-grade data
3. **ICE Data Services** - For specialized repo data

---

## Implementation Status

✅ **Currently Integrated**:
- FRED API (partial)
- ExchangeRate-API
- Enhanced mock data with realistic structure

🔄 **Ready to Integrate**:
- FMP API
- NY Fed data scraping
- OFR data integration

⏳ **Future Enhancements**:
- Bloomberg API
- Refinitiv
- ICE Data Services

---

## API Series IDs for FRED

Here are the key FRED series IDs you'll need:

```javascript
const FRED_SERIES = {
  // Money Market Rates
  SOFR: 'SOFR',
  BGCR: 'BGCR',
  TGCR: 'TGCR',
  GCFREPO: 'GCFREPO',
  EFFR: 'EFFR',
  IORB: 'IORB',
  OBFR: 'OBFR',
  
  // Reverse Repo
  RRP_RATE: 'RRPONTSYD',
  RRP_VOLUME: 'RRPONTSYAWARD',
  
  // Repo Rates
  GC_REPO: 'RIFSPPNAAD90_N.B',
  TRIPARTY_REPO: 'RIFSRPD90_N.B',
  
  // Treasury Rates
  TREASURY_3M: 'DGS3MO',
  TREASURY_1Y: 'DGS1',
  TREASURY_2Y: 'DGS2',
  TREASURY_10Y: 'DGS10',
};
```

---

## Next Steps

1. **Get FRED API Key** (5 minutes)
   - Go to https://fred.stlouisfed.org/docs/api/api_key.html
   - Request key
   - Add to `.env`

2. **Get FMP API Key** (5 minutes)
   - Sign up at https://site.financialmodelingprep.com/
   - Get free API key
   - Add to `.env`

3. **Test Integration**
   - Restart server
   - Check console for API responses
   - Verify data in frontend

4. **Monitor Rate Limits**
   - FRED: Unlimited (free)
   - FMP: 250 requests/day (free)
   - ExchangeRate: 1,500 requests/month (free)

---

## Troubleshooting

### "FRED_API_KEY not set"
- Add key to `.env` file
- Restart server
- Check key is correct

### Rate Limit Errors
- Check API usage
- Implement caching (already done)
- Upgrade to paid tier if needed

### Missing Data
- Some series may not have recent data
- Check FRED website for data availability
- Use fallback to enhanced mock data

---

## Data Update Frequency

- **FRED**: Daily updates (next business day)
- **FMP**: Real-time for some data, daily for others
- **ExchangeRate-API**: Daily updates
- **NY Fed**: Daily updates
- **OFR**: Daily updates

---

## Cost Summary

**Free Tier (Recommended)**:
- FRED API: Free, unlimited
- FMP API: Free, 250 requests/day
- ExchangeRate-API: Free, 1,500 requests/month
- **Total: $0/month**

**Paid Tier (Production)**:
- Bloomberg: ~$2,000/month
- Refinitiv: Enterprise pricing
- ICE Data: Enterprise pricing
- **Total: $2,000+/month**

---

For most use cases, the free APIs (FRED + FMP) will provide sufficient data for your stress monitor!

