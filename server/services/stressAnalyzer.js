/**
 * Advanced Stress Analysis Service
 * Calculates comprehensive stress indicators based on multiple market metrics
 */

class StressAnalyzer {
  constructor() {
    // Historical data for trend analysis
    this.historicalData = [];
    this.maxHistoryDays = 90;
  }

  // Calculate volatility (standard deviation of returns)
  calculateVolatility(series, period = 7) {
    if (series.length < period) return 0;

    const recent = series.slice(-period);
    const returns = [];
    for (let i = 1; i < recent.length; i++) {
      if (recent[i - 1] !== 0) {
        returns.push((recent[i] - recent[i - 1]) / recent[i - 1]);
      }
    }

    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100; // Return as percentage
  }

  // Calculate Z-score (how many standard deviations from mean)
  calculateZScore(value, series) {
    if (series.length < 10) return 0;

    const mean = series.reduce((a, b) => a + b, 0) / series.length;
    const stdDev = Math.sqrt(
      series.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / series.length
    );

    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  }

  // Analyze repo market stress
  analyzeRepoStress(repoRates, moneyMarketRates) {
    const indicators = {
      repoSpread: null,
      repoVolatility: null,
      stressLevel: 'low',
    };

    // Calculate repo spread vs risk-free rate
    if (repoRates['US-GC-REPO'] && moneyMarketRates.SOFR) {
      indicators.repoSpread = Math.abs(
        repoRates['US-GC-REPO'] - moneyMarketRates.SOFR
      );

      // High repo spread indicates funding stress
      if (indicators.repoSpread > 0.5) {
        indicators.stressLevel = 'high';
      } else if (indicators.repoSpread > 0.25) {
        indicators.stressLevel = 'medium';
      }
    }

    return indicators;
  }

  // Analyze credit stress using spreads
  analyzeCreditStress(spreads) {
    const indicators = {
      liborOisStress: 'low',
      tedSpreadStress: 'low',
      overallCreditStress: 'low',
    };

    // LIBOR-OIS spread analysis
    if (spreads['LIBOR-OIS']) {
      if (spreads['LIBOR-OIS'] > 50) {
        indicators.liborOisStress = 'critical';
      } else if (spreads['LIBOR-OIS'] > 30) {
        indicators.liborOisStress = 'high';
      } else if (spreads['LIBOR-OIS'] > 15) {
        indicators.liborOisStress = 'medium';
      }
    }

    // TED Spread analysis
    if (spreads['TED-SPREAD']) {
      if (spreads['TED-SPREAD'] > 100) {
        indicators.tedSpreadStress = 'critical';
      } else if (spreads['TED-SPREAD'] > 50) {
        indicators.tedSpreadStress = 'high';
      } else if (spreads['TED-SPREAD'] > 25) {
        indicators.tedSpreadStress = 'medium';
      }
    }

    // Overall credit stress
    const stressLevels = [
      indicators.liborOisStress,
      indicators.tedSpreadStress,
    ];
    if (stressLevels.includes('critical')) {
      indicators.overallCreditStress = 'critical';
    } else if (stressLevels.includes('high')) {
      indicators.overallCreditStress = 'high';
    } else if (stressLevels.includes('medium')) {
      indicators.overallCreditStress = 'medium';
    }

    return indicators;
  }

  // Analyze FX stress
  analyzeFXStress(fxRates, historicalFX) {
    const indicators = {
      volatility: {},
      stressLevel: 'low',
    };

    Object.keys(fxRates).forEach((pair) => {
      if (fxRates[pair] && historicalFX[pair]) {
        const series = historicalFX[pair].slice(-30);
        indicators.volatility[pair] = this.calculateVolatility(series, 7);

        // High FX volatility indicates stress
        if (indicators.volatility[pair] > 2.0) {
          indicators.stressLevel = 'high';
        } else if (indicators.volatility[pair] > 1.0) {
          indicators.stressLevel = 'medium';
        }
      }
    });

    return indicators;
  }

  // Calculate comprehensive stress score
  calculateComprehensiveStress(data, historicalData) {
    const {
      moneyMarket,
      repo,
      fx,
      spreads,
    } = data;

    // Component scores (0-100 each)
    let repoStressScore = 0;
    let creditStressScore = 0;
    let fxStressScore = 0;
    let volatilityScore = 0;

    // Repo stress (0-25 points)
    const repoAnalysis = this.analyzeRepoStress(repo, moneyMarket);
    if (repoAnalysis.repoSpread !== null) {
      repoStressScore = Math.min(25, repoAnalysis.repoSpread * 50);
    }

    // Credit stress (0-35 points)
    const creditAnalysis = this.analyzeCreditStress(spreads);
    if (spreads['LIBOR-OIS']) {
      creditStressScore += Math.min(20, spreads['LIBOR-OIS'] * 0.4);
    }
    if (spreads['TED-SPREAD']) {
      creditStressScore += Math.min(15, spreads['TED-SPREAD'] * 0.15);
    }

    // FX stress (0-20 points)
    const fxAnalysis = this.analyzeFXStress(fx, historicalData.fx || {});
    const avgFXVol = Object.values(fxAnalysis.volatility).reduce(
      (a, b) => a + b,
      0
    ) / Object.keys(fxAnalysis.volatility).length || 0;
    fxStressScore = Math.min(20, avgFXVol * 10);

    // Volatility score (0-20 points)
    if (historicalData.moneyMarket) {
      const sofrSeries = historicalData.moneyMarket.SOFR || [];
      if (sofrSeries.length > 0) {
        const vol = this.calculateVolatility(sofrSeries, 7);
        volatilityScore = Math.min(20, vol * 5);
      }
    }

    // Total stress score
    const totalScore = Math.min(
      100,
      repoStressScore + creditStressScore + fxStressScore + volatilityScore
    );

    // Determine stress level
    let level = 'low';
    if (totalScore > 70) level = 'critical';
    else if (totalScore > 50) level = 'high';
    else if (totalScore > 30) level = 'medium';

    return {
      score: Math.round(totalScore),
      level,
      components: {
        repo: Math.round(repoStressScore),
        credit: Math.round(creditStressScore),
        fx: Math.round(fxStressScore),
        volatility: Math.round(volatilityScore),
      },
      details: {
        repo: repoAnalysis,
        credit: creditAnalysis,
        fx: fxAnalysis,
        spreads,
      },
    };
  }

  // Update historical data
  updateHistory(currentData) {
    const today = new Date().toISOString().split('T')[0];
    this.historicalData.push({
      date: today,
      ...currentData,
    });

    // Keep only last N days
    if (this.historicalData.length > this.maxHistoryDays) {
      this.historicalData.shift();
    }
  }

  // Get historical data
  getHistory() {
    return this.historicalData;
  }
}

module.exports = new StressAnalyzer();

