# Bloomberg API Setup Guide

## Quick Checklist Before Starting

- [ ] Reviewed Bloomberg license agreement
- [ ] Got approval from employer/manager
- [ ] Confirmed data usage is allowed for your use case
- [ ] Bloomberg Terminal is installed and running
- [ ] Have Bloomberg Terminal login credentials

## Installation Steps

### 1. Install Bloomberg Terminal
- Ensure Bloomberg Terminal is installed on your machine
- Log in and verify it's working
- Terminal must be running for API access

### 2. Install BLPAPI SDK

#### For Node.js:
```bash
# Install Bloomberg API SDK (requires C++ library)
# Download from: https://www.bloomberg.com/professional/support/api-library/

# Install Node.js wrapper (if available)
npm install blpapi
```

#### For Python:
```bash
pip install blpapi
```

### 3. Configure Environment Variables

Add to `.env` file:
```env
# Bloomberg API Configuration
BLOOMBERG_ENABLED=true
BLOOMBERG_HOST=localhost
BLOOMBERG_PORT=8194
```

### 4. Enable API Access in Bloomberg Terminal

1. Open Bloomberg Terminal
2. Go to: `API` → `API Developer`
3. Enable API access
4. Note the host and port (usually localhost:8194)

### 5. Test Connection

```bash
# Test Bloomberg API connection
node -e "const blp = require('blpapi'); console.log('Bloomberg API loaded');"
```

## Integration with Your App

### Step 1: Uncomment Bloomberg Service

In `server/services/dataService.js`:
```javascript
// Uncomment this line:
const bloombergService = require('./bloombergService');
```

### Step 2: Enable Bloomberg in Code

In `server/services/dataService.js`, uncomment the Bloomberg integration sections.

### Step 3: Restart Server

```bash
npm run server
```

### Step 4: Verify Data

Check console for:
```
✅ Bloomberg API connected
✅ Fetching data from Bloomberg
```

## What Data Bloomberg Provides

### EMEA Rates (Not in Free APIs):
- EURIBOR (various tenors)
- SONIA
- EMEA repo rates
- European money market rates

### Enhanced Data:
- Cross-currency basis (real-time)
- More granular repo rates
- Fed facility volumes
- Additional stress indicators

### Real-time Data:
- All rates update in real-time
- Historical data available
- High-quality, validated data

## Troubleshooting

### "Bloomberg API not available"
- Check Bloomberg Terminal is running
- Verify API access is enabled
- Check host/port configuration
- Review Bloomberg Terminal logs

### "License Error"
- Verify license allows API access
- Check with Bloomberg support
- Confirm usage is within license terms

### "Connection Refused"
- Ensure Bloomberg Terminal is running
- Check firewall settings
- Verify host/port in .env file

## Hybrid Approach (Recommended)

**Use Bloomberg for:**
- EMEA rates (EURIBOR, SONIA)
- Cross-currency basis
- Data not available in free APIs

**Use Free APIs for:**
- US rates (FRED API - free, unlimited)
- Basic FX rates
- Public data

This approach:
- Reduces Bloomberg data usage
- Lower license risk
- More cost-effective
- Still comprehensive

## Next Steps

1. **Get Approval** - Confirm with employer/Bloomberg
2. **Install SDK** - Set up BLPAPI
3. **Configure** - Add environment variables
4. **Test** - Verify connection works
5. **Integrate** - Uncomment Bloomberg service
6. **Monitor** - Check data quality and usage

## Support

- Bloomberg API Support: https://www.bloomberg.com/professional/support/api-library/
- Bloomberg Terminal Help: `HELP HELP` in Terminal
- API Documentation: Available in Bloomberg Terminal

## Legal Reminder

⚠️ **Always verify license terms before using Bloomberg data for personal projects!**

