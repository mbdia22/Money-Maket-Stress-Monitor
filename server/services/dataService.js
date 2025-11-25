const axios = require('axios');
const nyFedService = require('./nyFedService');
// const bloombergService = require('./bloombergService'); // Uncomment if using Bloomberg

/**
 * Enhanced Data Service for fetching real-time financial data
 * Supports multiple data sources: NY Fed, FRED, FMP, ExchangeRate-API, Bloomberg (optional)
 */

class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 60000; // 1 minute cache
  }

  // FRED API - Federal Reserve Economic Data (FREE, unlimited)
  async fetchFREDData(seriesId, limit = 1) {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) {
      console.warn(`FRED_API_KEY not set. Get free key at: https://fred.stlouisfed.org/docs/api/api_key.html`);
      return null;
    }

    try {
      const url = `https://api.stlouisfed.org/fred/series/observations`;
      const response = await axios.get(url, {
        params: {
          series_id: seriesId,
          api_key: apiKey,
          file_type: 'json',
          limit: limit,
          sort_order: 'desc',
        },
        timeout: 10000,
      });

      if (response.data?.observations && response.data.observations.length > 0) {
        if (limit === 1) {
          const value = response.data.observations[0].value;
          return value !== '.' ? parseFloat(value) : null;
        }
        return response.data.observations
          .map(obs => ({
            date: obs.date,
            value: obs.value !== '.' ? parseFloat(obs.value) : null,
          }))
          .filter(obs => obs.value !== null && !isNaN(obs.value));
      }
    } catch (error) {
      console.error(`Error fetching FRED data for ${seriesId}:`, error.message);
    }
    return null;
  }

  // Financial Modeling Prep API (FREE tier: 250 requests/day)
  async fetchFMPData(endpoint, params = {}) {
    const apiKey = process.env.FMP_API_KEY;
    if (!apiKey) {
      console.warn(`FMP_API_KEY not set. Get free key at: https://site.financialmodelingprep.com/`);
      return null;
    }

    try {
      const url = `https://financialmodelingprep.com/api/v3/${endpoint}`;
      const response = await axios.get(url, {
        params: {
          ...params,
          apikey: apiKey,
        },
        timeout: 10000,
      });

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn('FMP API rate limit reached. Free tier: 250 requests/day');
      } else {
        console.error(`Error fetching FMP data for ${endpoint}:`, error.message);
      }
    }
    return null;
  }

  // ExchangeRate-API (Free tier, no key required)
  async fetchFXRateFree(baseCurrency = 'USD') {
    try {
      const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
      const response = await axios.get(url, { timeout: 5000 });

      if (response.data?.rates) {
        return response.data.rates;
      }
    } catch (error) {
      console.error('Error fetching free FX rates:', error.message);
    }
    return null;
  }


  // Fetch granular repo rates - NY Fed API as primary source, FRED as fallback
  async fetchGranularRepoRates() {
    const repoRates = {};

    // Try NY Fed API first for SOFR, BGCR, TGCR (better data quality)
    const nyFedRates = await nyFedService.getCurrentRepoRates();

    // Fetch remaining rates from FRED
    const [gcf, onrrp, iorb, obfr, effr] = await Promise.all([
      this.fetchFREDData('GCFREPO'),
      this.fetchFREDData('RRPONTSYD'),
      this.fetchFREDData('IORB'),
      this.fetchFREDData('OBFR'),
      this.fetchFREDData('EFFR'),
    ]);

    // Use NY Fed data if available, otherwise fall back to FRED
    if (nyFedRates.SOFR !== null) {
      repoRates.SOFR = nyFedRates.SOFR;
      console.log('✅ Using SOFR from NY Fed API');
    } else {
      const fredSofr = await this.fetchFREDData('SOFR');
      if (fredSofr !== null) repoRates.SOFR = fredSofr;
    }

    if (nyFedRates.BGCR !== null) {
      repoRates.BGCR = nyFedRates.BGCR;
      console.log('✅ Using BGCR from NY Fed API');
    } else {
      const fredBgcr = await this.fetchFREDData('BGCR');
      if (fredBgcr !== null) repoRates.BGCR = fredBgcr;
    }

    if (nyFedRates.TGCR !== null) {
      repoRates.TGCR = nyFedRates.TGCR;
      console.log('✅ Using TGCR from NY Fed API');
    } else {
      const fredTgcr = await this.fetchFREDData('TGCR');
      if (fredTgcr !== null) repoRates.TGCR = fredTgcr;
    }

    // Add FRED-only rates
    if (gcf !== null) repoRates.GCF = gcf;
    if (onrrp !== null) repoRates['O/N-RRP'] = onrrp;
    if (iorb !== null) repoRates.IORB = iorb;
    if (obfr !== null) repoRates.OBFR = obfr;
    if (effr !== null) repoRates.EFFR = effr;

    return repoRates;
  }


  // Fetch historical data for percentile calculation and charts (up to 5 years)
  async fetchHistoricalRates(seriesId, days = 30) {
    try {
      // For 5 years, we need ~1825 days (365 * 5)
      // FRED returns data in reverse chronological order
      // Request extra to account for weekends/holidays
      const requestDays = days > 365 ? days * 1.5 : days * 2;
      const data = await this.fetchFREDData(seriesId, Math.ceil(requestDays));

      if (data && Array.isArray(data)) {
        // Get last N valid data points
        return data.slice(0, days).map(d => d.value);
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${seriesId}:`, error.message);
    }
    return null;
  }

  // Fetch Fed facility activity
  async fetchFedFacilities() {
    const facilities = {};

    // O/N RRP Volume (in billions)
    const rrpVolume = await this.fetchFREDData('RRPONTSYAWARD');
    if (rrpVolume !== null) {
      // Convert from millions to billions
      facilities['O/N-RRP-Volume'] = rrpVolume / 1000;
    }

    // Foreign Repo Pool (if available)
    // Note: This may require additional FRED series or NY Fed data
    facilities['Foreign-Repo-Pool'] = null;

    // SRF Volume - would need NY Fed API or scraping
    // For now, monitoring via FRED or manual updates
    facilities['SRF-Volume'] = null;

    return facilities;
  }

  // Fetch Treasury rates from FMP (backup to FRED)
  async fetchTreasuryRates() {
    try {
      const rates = await this.fetchFMPData('treasury', {});
      if (rates && Array.isArray(rates) && rates.length > 0) {
        return {
          '3M': rates.find(r => r.maturity === '3M')?.rate,
          '1Y': rates.find(r => r.maturity === '1Y')?.rate,
          '2Y': rates.find(r => r.maturity === '2Y')?.rate,
          '10Y': rates.find(r => r.maturity === '10Y')?.rate,
        };
      }
    } catch (error) {
      console.error('Error fetching Treasury rates from FMP:', error.message);
    }
    return null;
  }

  // Calculate reserve scarcity indicators
  calculateReserveScarcityIndicators(rates) {
    const indicators = {};

    // EFFR-IORB Spread (major reserve scarcity measure)
    if (rates.EFFR !== null && rates.EFFR !== undefined &&
      rates.IORB !== null && rates.IORB !== undefined) {
      indicators['EFFR-IORB'] = (rates.EFFR - rates.IORB) * 100; // in bps
      indicators['EFFR-IORB-Status'] =
        indicators['EFFR-IORB'] > 0 ? 'SCARCITY' :
          indicators['EFFR-IORB'] < -5 ? 'ABUNDANCE' : 'AMPLE';
    }

    // SOFR-IORB Spread (bank activity in repo)
    if (rates.SOFR !== null && rates.SOFR !== undefined &&
      rates.IORB !== null && rates.IORB !== undefined) {
      indicators['SOFR-IORB'] = (rates.SOFR - rates.IORB) * 100; // in bps
      indicators['SOFR-IORB-Status'] =
        indicators['SOFR-IORB'] > 0 ? 'BANKS-DEPLOYING-RESERVES' : 'NORMAL';
    }

    // SOFR-EFFR Spread (FHLB repo demand indicator)
    if (rates.SOFR !== null && rates.SOFR !== undefined &&
      rates.EFFR !== null && rates.EFFR !== undefined) {
      indicators['SOFR-EFFR'] = (rates.SOFR - rates.EFFR) * 100; // in bps
    }

    // TGCR-RRP Spread (private repo demand vs Fed RRP)
    if (rates.TGCR !== null && rates.TGCR !== undefined &&
      rates['O/N-RRP'] !== null && rates['O/N-RRP'] !== undefined) {
      indicators['TGCR-RRP'] = (rates.TGCR - rates['O/N-RRP']) * 100; // in bps
      indicators['TGCR-RRP-Status'] =
        indicators['TGCR-RRP'] > 0 ? 'EXCESS-COLLATERAL' : 'EXCESS-CASH';
    }

    // GCF-TPR Spread (dealer balance sheet capacity)
    if (rates.GCF !== null && rates.GCF !== undefined &&
      rates.TGCR !== null && rates.TGCR !== undefined) {
      indicators['GCF-TGCR'] = (rates.GCF - rates.TGCR) * 100; // in bps
      indicators['GCF-TGCR-Status'] =
        indicators['GCF-TGCR'] > 0 ? 'INFLEXIBLE-BALANCE-SHEETS' : 'FLEXIBLE-BALANCE-SHEETS';
    }

    return indicators;
  }

  // Calculate percentile data (for stress analysis)
  calculatePercentiles(series, percentiles = [25, 50, 75, 99]) {
    if (!series || series.length === 0) return null;

    const sorted = [...series].sort((a, b) => a - b);
    const result = {};

    percentiles.forEach(p => {
      const index = Math.ceil((p / 100) * sorted.length) - 1;
      result[`p${p}`] = sorted[Math.max(0, index)];
    });

    return result;
  }

  // Fetch money market rates with percentiles
  async fetchMoneyMarketRatesWithPercentiles() {
    const rates = {};
    const percentiles = {};

    // Fetch current rates
    const repoRates = await this.fetchGranularRepoRates();
    Object.assign(rates, repoRates);

    // Fetch historical data for SOFR percentile calculation
    const sofrHistory = await this.fetchHistoricalRates('SOFR', 30);
    if (sofrHistory && sofrHistory.length > 0) {
      percentiles.SOFR = this.calculatePercentiles(sofrHistory);
    }

    // Fetch historical data for EFFR
    const effrHistory = await this.fetchHistoricalRates('EFFR', 30);
    if (effrHistory && effrHistory.length > 0) {
      percentiles.EFFR = this.calculatePercentiles(effrHistory);
    }

    return {
      rates,
      percentiles: Object.keys(percentiles).length > 0 ? percentiles : undefined,
    };
  }

  // Calculate cross-currency basis (EUR/USD XCCY Basis)
  async calculateXCCYBasis() {
    // This would typically come from swap markets or futures
    // For now, using a simplified calculation
    const fxRates = await this.fetchFXRateFree('USD');

    if (!fxRates || !fxRates.EUR) return null;

    // Simplified XCCY basis calculation
    // In reality, this would come from swap markets or futures
    const basis = {
      'EUR/USD-3M': null, // Would fetch from swap market
      'GBP/USD-3M': null,
    };

    return basis;
  }

  // Get cached data or fetch new
  async getCachedOrFetch(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    const data = await fetchFn();
    if (data !== null) {
      this.cache.set(key, { data, timestamp: Date.now() });
    }
    return data;
  }

  // Aggregate all enhanced market data
  async fetchAllMarketData() {
    console.log('Fetching real-time market data...');

    // Try Bloomberg first if enabled (for EMEA rates, XCCY basis, etc.)
    // const bloombergData = await bloombergService.fetchAllMarketData();

    const [repoRatesData, fxRates, facilities] = await Promise.all([
      this.getCachedOrFetch('moneyMarket', () => this.fetchMoneyMarketRatesWithPercentiles()),
      this.getCachedOrFetch('fxRates', () => this.fetchFXRateFree('USD')),
      this.getCachedOrFetch('facilities', () => this.fetchFedFacilities()),
    ]);

    const rates = repoRatesData?.rates || {};
    const percentiles = repoRatesData?.percentiles;

    // Merge Bloomberg data if available (for EMEA rates, XCCY basis, etc.)
    // if (bloombergData) {
    //   Object.assign(rates, bloombergData.rates || {});
    //   if (bloombergData.xccyBasis) {
    //     xccyBasis = { ...xccyBasis, ...bloombergData.xccyBasis };
    //   }
    //   if (bloombergData.facilities) {
    //     facilities = { ...facilities, ...bloombergData.facilities };
    //   }
    // }

    // Calculate FX pairs
    const fxPairs = {};
    if (fxRates) {
      fxPairs['EUR/USD'] = fxRates.EUR || null;
      fxPairs['GBP/USD'] = fxRates.GBP || null;
      fxPairs['USD/JPY'] = fxRates.JPY ? 1 / fxRates.JPY : null;
      fxPairs['USD/CHF'] = fxRates.CHF ? 1 / fxRates.CHF : null;
    }

    // Calculate all spreads and indicators
    const allRates = { ...rates };
    const spreads = this.calculateReserveScarcityIndicators(allRates);

    // Calculate XCCY basis (use Bloomberg if available, otherwise mock)
    const xccyBasis = await this.calculateXCCYBasis();

    // Log data availability
    const dataAvailable = Object.keys(rates).length > 0;
    if (dataAvailable) {
      console.log('✅ Real data fetched successfully from FRED API');
      console.log(`   Rates available: ${Object.keys(rates).join(', ')}`);
    } else {
      console.log('⚠️  No real data available. Using enhanced mock data.');
      console.log('   To get real data, set FRED_API_KEY in .env file');
      console.log('   Get free key at: https://fred.stlouisfed.org/docs/api/api_key.html');
    }

    return {
      rates,
      repo: rates, // Repo rates are part of main rates
      moneyMarket: {
        EFFR: rates.EFFR,
        OBFR: rates.OBFR,
        IORB: rates.IORB,
      },
      fx: fxPairs,
      spreads,
      facilities,
      xccyBasis,
      percentiles,
      timestamp: new Date().toISOString(),
      dataSource: dataAvailable ? 'real' : 'mock',
    };
  }
}

module.exports = new DataService();
