# Touch Screen Setup Guide

This guide covers setting up the IR touch frame for Chrystal's MagicMirror.

## Hardware

**IR Touch Frame:** 32" Infrared Touch Frame
**Link:** https://www.amazon.com/dp/B078T62LGF

## Touch Module Installation

We'll use the MMM-SmartTouch module which provides touch functionality for MagicMirror².

**GitHub:** https://github.com/EbenKouao/MMM-SmartTouch

### 1. Install the Touch Module

SSH into your Raspberry Pi and run:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/EbenKouao/MMM-SmartTouch.git
cd MMM-SmartTouch
npm install
```

### 2. Configure IR Touch Frame Hardware

The IR touch frame should be recognized as a USB HID (Human Interface Device) when connected to the Raspberry Pi.

#### Connect the Hardware

1. Connect the IR touch frame USB cable to one of the Raspberry Pi's USB ports
2. Power on the Raspberry Pi
3. Verify the touch frame is detected:

```bash
# Check if touch device is recognized
lsusb
# You should see a USB device listed (likely as "HID-compliant touch screen" or similar)

# Check input devices
ls /dev/input/
# Look for event devices (event0, event1, etc.)

# Test touch input (optional)
sudo apt install -y evtest
sudo evtest
# Select the touch device from the list and tap the screen to see if events are detected
```

#### Calibrate Touch Input (if needed)

```bash
# Install calibration tool
sudo apt install -y xinput-calibrator

# Run calibration
DISPLAY=:0 xinput_calibrator

# Follow on-screen instructions - tap the crosshairs
# Save the calibration output to a file
```

### 3. Enable Touch in MagicMirror Config

Edit your `config/config.js` to enable the touch module:

```bash
cd ~/MagicMirror
nano config/config.js
```

Find the commented-out MMM-SmartTouch section and uncomment/configure it:

```javascript
{
	module: "MMM-SmartTouch",
	position: "bottom_center",    // Can be any position or leave empty for invisible
	config: {
		// Touch gesture support
		enableGestures: true,

		// Show touch overlay/buttons (set to false for gesture-only mode)
		showBorder: true,

		// Styling
		borderColor: "white",

		// Module-specific actions
		// Define what happens when you touch different modules
		moduleActions: {
			// Example: Tap clock to toggle calendar
			clock: {
				tap: function() {
					this.sendNotification("TOGGLE_CALENDAR");
				}
			},
			// Example: Tap weather to refresh
			weather: {
				tap: function() {
					this.sendNotification("FETCH_WEATHER");
				}
			}
		}
	}
},
```

### 4. Alternative: MMM-Touch Module

If MMM-SmartTouch doesn't work well, try MMM-Touch as an alternative:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/MMRIZE/MMM-Touch.git
cd MMM-Touch
npm install
```

Configuration for MMM-Touch:

```javascript
{
	module: "MMM-Touch",
	position: "bottom_center",
	config: {
		// Enable different gestures
		enableTap: true,
		enableDoubleTap: true,
		enablePress: true,
		enableSwipe: true,

		// Gesture timeouts (milliseconds)
		tapTimeout: 300,
		doubleTapInterval: 500,
		pressTimeout: 1000,

		// Configure per-module actions
		actions: {
			// Tap on clock module to toggle
			"clock": {
				tap: (module) => {
					module.toggle();
				}
			},
			// Swipe left on news to go to next item
			"newsfeed": {
				swipeLeft: (module) => {
					module.sendNotification("ARTICLE_NEXT");
				},
				swipeRight: (module) => {
					module.sendNotification("ARTICLE_PREVIOUS");
				}
			}
		}
	}
},
```

### 5. Common Touch Actions

Here are some useful touch actions you can configure:

```javascript
// Show/Hide Modules
module.show();
module.hide();
module.toggle();

// Update/Refresh Module
this.sendNotification("FETCH_CALENDAR");
this.sendNotification("FETCH_WEATHER");

// Navigate News
this.sendNotification("ARTICLE_NEXT");
this.sendNotification("ARTICLE_PREVIOUS");

// Custom notifications between modules
this.sendNotification("CUSTOM_ACTION", {param: "value"});
```

### 6. Create Touch Control Panel (Advanced)

For more advanced control, consider installing MMM-Pages and MMM-Remote-Control:

```bash
# Install MMM-Pages for multiple screens
cd ~/MagicMirror/modules
git clone https://github.com/edward-shen/MMM-pages.git
cd MMM-pages
npm install

# Install MMM-Remote-Control for web-based control
cd ~/MagicMirror/modules
git clone https://github.com/Jopyth/MMM-Remote-Control.git
cd MMM-Remote-Control
npm install
```

With these, you can:
- Swipe between different "pages" of modules
- Control the mirror from a web interface
- Create custom touch buttons
- Schedule different displays for different times

### 7. Optimize Touch Performance

#### Reduce Touch Latency

Edit `/boot/config.txt`:

```bash
sudo nano /boot/config.txt

# Add these lines at the end:
# Reduce USB polling interval for better touch response
dwc_otg.speed=1
```

#### Disable Screen Blanking

```bash
# Edit lightdm config
sudo nano /etc/lightdm/lightdm.conf

# Find [Seat:*] section and add/modify:
xserver-command=X -s 0 -dpms

# Or use xset in autostart
nano ~/.config/lxsession/LXDE-pi/autostart
# Add:
@xset s noblank
@xset s off
@xset -dpms
```

### 8. Testing Touch Functionality

After configuration, test the touch:

```bash
# Restart MagicMirror
pm2 restart magicmirror

# Watch logs for touch events
pm2 logs magicmirror
```

Touch the screen and verify:
1. Touch events appear in logs
2. Configured actions trigger correctly
3. No lag or missed touches
4. Multi-touch works (if enabled)

## Troubleshooting

### Touch Not Detected

```bash
# Check USB connection
lsusb

# Check input events
cat /proc/bus/input/devices
# Look for your touch device

# Test raw events
sudo evtest
# Select touch device and test
```

### Touch Offset/Inaccurate

```bash
# Recalibrate
DISPLAY=:0 xinput_calibrator

# Or install touchscreen utility
sudo apt install -y xinput
xinput list
xinput list-props "Device Name"
```

### Touch Module Not Loading

```bash
# Check module installation
ls ~/MagicMirror/modules/MMM-SmartTouch

# Check logs
pm2 logs magicmirror

# Verify config.js syntax
cd ~/MagicMirror
npm run config:check
```

### Electron Touch vs. Browser Touch

If running in Electron mode (default), touch works differently than browser mode:

```bash
# For better touch support, you might need to run in server mode
# and use Chromium in kiosk mode instead

# Install chromium
sudo apt install -y chromium-browser

# Create startup script
nano ~/start-mirror.sh

# Add:
#!/bin/bash
chromium-browser --kiosk --noerrdialogs --disable-infobars http://localhost:8080

# Make executable
chmod +x ~/start-mirror.sh
```

## Gesture Reference

Common gestures to implement:

| Gesture | Action Example |
|---------|---------------|
| **Single Tap** | Toggle module visibility |
| **Double Tap** | Refresh/reload module |
| **Press & Hold** | Show module menu |
| **Swipe Left** | Next page/item |
| **Swipe Right** | Previous page/item |
| **Swipe Up** | Hide all modules |
| **Swipe Down** | Show all modules |
| **Pinch** | Zoom (if applicable) |
| **Two-finger tap** | Home/reset view |

## Advanced: Voice + Touch Integration

Consider adding voice control alongside touch:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/fewieden/MMM-voice.git
# Or
git clone https://github.com/bugsounet/MMM-GoogleAssistant.git
```

This allows Chrystal to use both touch and voice commands like:
- "Hey Mirror, what's the weather?"
- "Show my calendar"
- "Turn off display"

## Resources

- MMM-SmartTouch: https://github.com/EbenKouao/MMM-SmartTouch
- MMM-Touch: https://github.com/MMRIZE/MMM-Touch
- MMM-Pages: https://github.com/edward-shen/MMM-pages
- MMM-Remote-Control: https://github.com/Jopyth/MMM-Remote-Control
- MagicMirror Touch Modules: https://github.com/MichMich/MagicMirror/wiki/3rd-Party-Modules#touch

## Next Steps

1. Test basic touch functionality
2. Configure gestures for each module
3. Add MMM-Pages for multiple screens
4. Create custom touch controls
5. Consider adding voice control
