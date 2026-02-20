const axios = require('axios');

/**
 * NY Fed Markets Data API Service
 * 
 * Provides access to reference rates (SOFR, BGCR, TGCR) and Fed operations data
 * Base URL: https://markets.newyorkfed.org/api/
 * No API key required for public endpoints
 */

class NYFedService {
    constructor() {
        this.baseURL = 'https://markets.newyorkfed.org/api';
        this.cache = new Map();
        this.cacheTTL = 300000; // 5 minutes cache (data updates once daily ~8am ET)

        // Periodically evict stale entries to prevent unbounded memory growth
        setInterval(() => this._evictExpiredCache(), this.cacheTTL * 5);
    }

    _evictExpiredCache() {
        const cutoff = Date.now() - this.cacheTTL * 2;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < cutoff) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Fetch SOFR (Secured Overnight Financing Rate)
     * Published daily around 8:00 AM ET for prior business day
     */
    async fetchSOFR(days = 1) {
        return this.getCachedOrFetch(`sofr-${days}`, async () => {
            try {
                const url = `${this.baseURL}/rates/secured/sofr/last/${days}.json`;
                const response = await axios.get(url, { timeout: 10000 });

                if (response.data?.refRates && response.data.refRates.length > 0) {
                    return response.data.refRates.map(rate => ({
                        date: rate.effectiveDate,
                        value: parseFloat(rate.percentRate),
                        volume: rate.volumeInBillions ? parseFloat(rate.volumeInBillions) : null
                    }));
                }
            } catch (error) {
                console.error('Error fetching SOFR from NY Fed:', error.message);
            }
            return null;
        });
    }

    /**
     * Fetch BGCR (Broad General Collateral Rate)
     */
    async fetchBGCR(days = 1) {
        return this.getCachedOrFetch(`bgcr-${days}`, async () => {
            try {
                const url = `${this.baseURL}/rates/secured/bgcr/last/${days}.json`;
                const response = await axios.get(url, { timeout: 10000 });

                if (response.data?.refRates && response.data.refRates.length > 0) {
                    return response.data.refRates.map(rate => ({
                        date: rate.effectiveDate,
                        value: parseFloat(rate.percentRate),
                        volume: rate.volumeInBillions ? parseFloat(rate.volumeInBillions) : null
                    }));
                }
            } catch (error) {
                console.error('Error fetching BGCR from NY Fed:', error.message);
            }
            return null;
        });
    }

    /**
     * Fetch TGCR (Tri-Party General Collateral Rate)
     */
    async fetchTGCR(days = 1) {
        return this.getCachedOrFetch(`tgcr-${days}`, async () => {
            try {
                const url = `${this.baseURL}/rates/secured/tgcr/last/${days}.json`;
                const response = await axios.get(url, { timeout: 10000 });

                if (response.data?.refRates && response.data.refRates.length > 0) {
                    return response.data.refRates.map(rate => ({
                        date: rate.effectiveDate,
                        value: parseFloat(rate.percentRate),
                        volume: rate.volumeInBillions ? parseFloat(rate.volumeInBillions) : null
                    }));
                }
            } catch (error) {
                console.error('Error fetching TGCR from NY Fed:', error.message);
            }
            return null;
        });
    }

    /**
     * Fetch all repo rates (SOFR, BGCR, TGCR)
     */
    async fetchAllRepoRates(days = 30) {
        const [sofr, bgcr, tgcr] = await Promise.all([
            this.fetchSOFR(days),
            this.fetchBGCR(days),
            this.fetchTGCR(days)
        ]);

        return {
            sofr: sofr || [],
            bgcr: bgcr || [],
            tgcr: tgcr || []
        };
    }

    /**
     * Get current (latest) repo rates
     */
    async getCurrentRepoRates() {
        const [sofr, bgcr, tgcr] = await Promise.all([
            this.fetchSOFR(1),
            this.fetchBGCR(1),
            this.fetchTGCR(1)
        ]);

        return {
            SOFR: sofr && sofr.length > 0 ? sofr[0].value : null,
            BGCR: bgcr && bgcr.length > 0 ? bgcr[0].value : null,
            TGCR: tgcr && tgcr.length > 0 ? tgcr[0].value : null,
            timestamp: new Date().toISOString(),
            dataSource: 'NY Fed Markets Data API'
        };
    }

    /**
     * Get cached data or fetch new
     */
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

    /**
     * Check if NY Fed API is available
     */
    async isAvailable() {
        try {
            const url = `${this.baseURL}/rates/secured/sofr/last/1.json`;
            const response = await axios.get(url, { timeout: 5000 });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new NYFedService();
