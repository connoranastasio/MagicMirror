# Chrystal's MagicMirror Setup

This is a customized MagicMirror² installation for Chrystal, featuring:
- Personalized morning/afternoon/evening greetings
- iCloud calendar integration
- Jersey City weather with forecasts
- Multi-source news feeds (NYT, NPR, BBC, CNN, local NJ news)
- Touch screen functionality (32" IR frame)
- Weather-aware compliments and alerts

## Quick Start Guide

### For Development (On Desktop)

1. **Make Changes**
   ```bash
   # Edit config or modules
   nano config/config.js
   ```

2. **Test Locally** (Optional)
   ```bash
   npm run server
   # Visit http://localhost:8080 in browser
   ```

3. **Deploy to Raspberry Pi**
   ```bash
   ./deploy.sh "Your commit message here"
   # Or just: ./deploy.sh
   ```

### For Raspberry Pi Setup (First Time)

Follow the detailed guide in **[DEPLOYMENT.md](DEPLOYMENT.md)**

Key steps:
1. Install Raspberry Pi OS
2. Clone this repository
3. Run `npm install`
4. Configure API keys (OpenWeatherMap)
5. Set up PM2 for auto-start
6. Install touch screen module (see TOUCH_SETUP.md)

## Configuration

### Required API Keys

**OpenWeatherMap API:**
- Sign up: https://openweathermap.org/api
- Get free API key (1000 calls/day)
- Edit `config/config.js` and replace `YOUR_OPENWEATHER_API_KEY`

### Calendar Setup

The iCloud calendar is already configured. To change it:
1. Go to iCloud.com → Calendar
2. Share the desired calendar publicly
3. Get the webcal:// URL and convert to https://
4. Update in `config/config.js`

## Project Structure

```
MagicMirror/
├── config/
│   └── config.js              # Main configuration (Chrystal's setup)
├── modules/
│   ├── default/               # Built-in modules
│   └── MMM-SmartTouch/        # Touch screen module (install separately)
├── CLAUDE.md                  # AI assistant guidance
├── DEPLOYMENT.md              # Raspberry Pi deployment guide
├── TOUCH_SETUP.md            # Touch screen setup instructions
├── deploy.sh                  # Automated deployment script
└── SETUP_README.md           # This file

```

## Modules Configured

| Module | Position | Purpose |
|--------|----------|---------|
| **clock** | top_left | Date and time display (12-hour format) |
| **calendar** | top_left | Chrystal's iCloud calendar + US holidays |
| **compliments** | lower_third | Time-based greetings and weather alerts |
| **weather (current)** | top_right | Jersey City current conditions |
| **weather (forecast)** | top_right | 5-day weather forecast |
| **newsfeed** | bottom_bar | Rotating news from multiple sources |
| **alert** | (global) | System alerts |
| **updatenotification** | top_bar | MagicMirror update notifications |

## Customization Ideas

### Add More News Sources

Edit `config/config.js` and add RSS feeds to the newsfeed module:

```javascript
feeds: [
    {
        title: "Your News Source",
        url: "https://example.com/rss.xml"
    }
]
```

### Change Compliments

Edit the `compliments` section in `config/config.js`:

```javascript
morning: [
    "Your custom morning greeting!",
    "Another greeting!"
]
```

### Adjust Update Intervals

All modules have configurable update intervals:
- `fetchInterval`: How often to fetch new data (milliseconds)
- `updateInterval`: How often to refresh display (milliseconds)

Example: Update weather every 5 minutes instead of 10:
```javascript
updateInterval: 5 * 60 * 1000  // 5 minutes
```

## Common Tasks

### View Logs on Pi
```bash
ssh pi@magicmirror.local
pm2 logs magicmirror
```

### Restart Mirror on Pi
```bash
ssh pi@magicmirror.local
pm2 restart magicmirror
```

### Deploy Changes
```bash
./deploy.sh "Updated weather settings"
```

### Test Configuration
```bash
npm run config:check
```

### Run Locally
```bash
npm run server
# Visit http://localhost:8080
```

## Scheduled Display On/Off

To turn the display off at night and on in the morning, add to Pi's crontab:

```bash
ssh pi@magicmirror.local
crontab -e

# Add these lines:
# Turn off at 11 PM
0 23 * * * vcgencmd display_power 0

# Turn on at 6 AM
0 6 * * * vcgencmd display_power 1
```

## Touch Screen Features

After installing the touch module (see TOUCH_SETUP.md), you can:
- Tap modules to interact with them
- Swipe to navigate between pages
- Touch to show/hide elements
- Control mirror without keyboard/mouse

## Troubleshooting

### Mirror not displaying
- Check PM2 logs: `pm2 logs magicmirror`
- Verify API keys are configured
- Check network connectivity

### Calendar not showing
- Verify iCloud calendar URL is correct
- Make sure calendar is shared publicly
- Check URL is https:// not webcal://

### Weather not updating
- Verify OpenWeatherMap API key
- Check API call limits (free tier = 1000/day)
- Verify Jersey City location ID is correct

### Touch not working
- See TOUCH_SETUP.md for detailed troubleshooting
- Check USB connection
- Verify touch module is installed
- Test with `evtest` command

## Resources

- **MagicMirror² Docs:** https://docs.magicmirror.builders
- **Forum:** https://forum.magicmirror.builders
- **3rd Party Modules:** https://github.com/MichMich/MagicMirror/wiki/3rd-Party-Modules
- **This Repo:** https://github.com/connoranastasio/MagicMirror

## Development Workflow

```
Desktop (Development)                 Raspberry Pi (Production)
─────────────────────                ──────────────────────────
1. Edit config/modules
2. Test locally (optional)
3. Run ./deploy.sh    ─────────────> 4. Git pull
                                      5. npm install
                                      6. pm2 restart
                                      7. Mirror updates!
```

## Support & Maintenance

**Created for:** Chrystal
**Repository:** https://github.com/connoranastasio/MagicMirror
**Based on:** MagicMirror² by Michael Teeuw

For issues or questions:
1. Check DEPLOYMENT.md and TOUCH_SETUP.md
2. View logs with `pm2 logs magicmirror`
3. Search MagicMirror² forum
4. Create issue on GitHub repo

---

**Last Updated:** 2025-11-29
