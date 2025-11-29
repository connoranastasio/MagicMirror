# MagicMirror² Deployment Guide

This guide covers deploying Chrystal's MagicMirror from your desktop to the Raspberry Pi.

## Prerequisites

- Raspberry Pi 4B (recommended 4GB+ RAM)
- MicroSD card (32GB+ recommended, Class 10 or better)
- Power supply for Raspberry Pi
- Monitor/Display
- 32" IR Touch Frame
- Internet connection on Pi

## Initial Raspberry Pi Setup

### 1. Install Raspberry Pi OS

```bash
# Use Raspberry Pi Imager to install:
# - Raspberry Pi OS (64-bit) with desktop
# - Enable SSH in advanced options
# - Set hostname: magicmirror
# - Set username/password
# - Configure WiFi (if using wireless)
```

### 2. First Boot Configuration

```bash
# SSH into your Pi (from desktop)
ssh pi@magicmirror.local
# or use IP address: ssh pi@<PI_IP_ADDRESS>

# Update system
sudo apt update && sudo apt upgrade -y

# Install required dependencies
sudo apt install -y git
```

### 3. Install Node.js (v18+)

```bash
# Install Node.js using NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x or higher
npm --version
```

## MagicMirror Installation

### 1. Clone Your Repository

```bash
cd ~
git clone https://github.com/connoranastasio/MagicMirror.git
cd MagicMirror
```

### 2. Install Dependencies

```bash
# Install MagicMirror dependencies (takes 10-15 minutes)
npm install --no-audit --no-fund --no-update-notifier
```

### 3. Configure API Keys

You need to obtain API keys before the mirror will work properly:

#### OpenWeatherMap API (Weather Module)
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Generate an API key (free tier allows 1000 calls/day)
4. Edit `config/config.js` and replace `YOUR_OPENWEATHER_API_KEY` with your key

#### iCloud Calendar URL
The calendar URL is already configured in `config/config.js`. If you need to change it:
1. Go to https://www.icloud.com/calendar
2. Click the share icon next to the calendar
3. Enable "Public Calendar"
4. Copy the webcal:// URL
5. Change `webcal://` to `https://`
6. Edit `config/config.js` and update the URL

### 4. Test the Installation

```bash
# Run in server mode to test
npm run server

# Open browser on Pi or another device on network:
# http://<PI_IP_ADDRESS>:8080
```

If everything works, you should see the mirror interface with all modules loading.

## Auto-Start Configuration

### Using PM2 (Recommended)

PM2 keeps MagicMirror running and auto-restarts on crashes or reboot.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start MagicMirror with PM2
cd ~/MagicMirror
pm2 start npm --name "magicmirror" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# This will output a command like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
# Copy and run that command
```

### PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs magicmirror

# Restart
pm2 restart magicmirror

# Stop
pm2 stop magicmirror

# Start
pm2 start magicmirror
```

## Development Workflow

### On Desktop (Development)

```bash
# 1. Make changes to config or modules
# 2. Test locally (optional)
npm run server  # Test in browser at http://localhost:8080

# 3. Commit and push changes
git add .
git commit -m "Description of changes"
git push origin main
```

### On Raspberry Pi (Deployment)

```bash
# SSH into Pi
ssh pi@magicmirror.local

# Navigate to MagicMirror directory
cd ~/MagicMirror

# Pull latest changes
git pull origin main

# Install any new dependencies (if package.json changed)
npm install

# Restart MagicMirror
pm2 restart magicmirror

# View logs to verify everything started correctly
pm2 logs magicmirror
```

## Quick Deployment Script

Create this script on your desktop to automate deployment:

```bash
#!/bin/bash
# deploy.sh - Deploy to Raspberry Pi

# Commit and push changes
git add .
git commit -m "${1:-Update configuration}"
git push origin main

# Deploy to Pi
ssh pi@magicmirror.local << 'EOF'
cd ~/MagicMirror
git pull origin main
npm install
pm2 restart magicmirror
echo "Deployment complete! Check logs with: pm2 logs magicmirror"
EOF
```

Make it executable and use it:
```bash
chmod +x deploy.sh
./deploy.sh "Added weather alerts"
```

## Remote Access Options

### SSH Access
```bash
# From desktop
ssh pi@magicmirror.local
# or
ssh pi@<PI_IP_ADDRESS>
```

### VS Code Remote-SSH
1. Install "Remote - SSH" extension in VS Code
2. Connect to `pi@magicmirror.local`
3. Edit files directly on the Pi
4. Restart with `pm2 restart magicmirror` in terminal

### VNC (Full Desktop Access)
```bash
# Enable VNC on Pi
sudo raspi-config
# Interface Options → VNC → Enable

# Use RealVNC Viewer on desktop to connect
```

## Troubleshooting

### Mirror won't start
```bash
# Check logs
pm2 logs magicmirror

# Common issues:
# - Missing API keys (check config/config.js)
# - Port 8080 already in use
# - Network connectivity issues
```

### Module not displaying
```bash
# Check browser console (if using server mode)
# Check PM2 logs for errors
pm2 logs magicmirror --lines 100

# Verify module configuration in config/config.js
npm run config:check
```

### Can't pull from git
```bash
# If you have uncommitted changes on Pi
git stash  # Save local changes
git pull   # Pull updates
git stash pop  # Re-apply local changes (if needed)
```

### Display won't turn off
```bash
# Install screen control tool
sudo apt install -y xscreensaver

# Or use HDMI control
# Add to crontab for scheduled on/off
crontab -e
# Turn off at 11 PM: 0 23 * * * vcgencmd display_power 0
# Turn on at 6 AM: 0 6 * * * vcgencmd display_power 1
```

## Performance Optimization

### Reduce Memory Usage
```bash
# Edit config.js
# Reduce updateInterval for modules
# Reduce maximumEntries for calendar
# Reduce number of news feeds
```

### Improve Boot Time
```bash
# Disable unused services
sudo systemctl disable bluetooth.service
sudo systemctl disable avahi-daemon.service
```

## Backup Configuration

```bash
# On Raspberry Pi - backup config
cd ~/MagicMirror
cp config/config.js config/config.js.backup

# On Desktop - always commit config changes to git
git add config/config.js
git commit -m "Updated configuration"
git push
```

## Next Steps

1. Install touch screen module (see TOUCH_SETUP.md)
2. Configure display rotation if needed (see DISPLAY_SETUP.md)
3. Set up automatic display on/off schedule
4. Install additional modules from https://github.com/MichMich/MagicMirror/wiki/3rd-Party-Modules

## Support

- MagicMirror² Documentation: https://docs.magicmirror.builders
- Forum: https://forum.magicmirror.builders
- GitHub Issues: https://github.com/connoranastasio/MagicMirror/issues
