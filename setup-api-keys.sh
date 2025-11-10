#!/bin/bash

# Setup script for API keys
# This script helps you set up API keys for real-time data

echo "🔑 Market Stress Monitor - API Key Setup"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
    echo "# API Keys for Market Stress Monitor" >> .env
    echo "" >> .env
fi

# FRED API Key
echo "📊 FRED API (Federal Reserve Economic Data)"
echo "   - FREE, unlimited requests"
echo "   - Get key at: https://fred.stlouisfed.org/docs/api/api_key.html"
echo ""
read -p "Enter your FRED API key (or press Enter to skip): " fred_key

if [ ! -z "$fred_key" ]; then
    # Remove existing FRED_API_KEY if present
    sed -i '' '/FRED_API_KEY/d' .env
    echo "FRED_API_KEY=$fred_key" >> .env
    echo "✅ FRED API key added!"
else
    echo "⏭️  Skipping FRED API key"
fi

echo ""

# FMP API Key
echo "💹 Financial Modeling Prep API"
echo "   - FREE tier: 250 requests/day"
echo "   - Get key at: https://site.financialmodelingprep.com/"
echo ""
read -p "Enter your FMP API key (or press Enter to skip): " fmp_key

if [ ! -z "$fmp_key" ]; then
    # Remove existing FMP_API_KEY if present
    sed -i '' '/FMP_API_KEY/d' .env
    echo "FMP_API_KEY=$fmp_key" >> .env
    echo "✅ FMP API key added!"
else
    echo "⏭️  Skipping FMP API key"
fi

echo ""

# Alpha Vantage API Key
echo "📈 Alpha Vantage API"
echo "   - FREE tier: 5 calls/minute, 500 calls/day"
echo "   - Get key at: https://www.alphavantage.co/support/#api-key"
echo ""
read -p "Enter your Alpha Vantage API key (or press Enter to skip): " av_key

if [ ! -z "$av_key" ]; then
    # Remove existing ALPHA_VANTAGE_API_KEY if present
    sed -i '' '/ALPHA_VANTAGE_API_KEY/d' .env
    echo "ALPHA_VANTAGE_API_KEY=$av_key" >> .env
    echo "✅ Alpha Vantage API key added!"
else
    echo "⏭️  Skipping Alpha Vantage API key"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Your .env file has been updated with API keys."
echo "🔄 Restart your server to use real data: npm run server"
echo ""
echo "💡 Note: ExchangeRate-API works without a key (free tier)"
echo ""

