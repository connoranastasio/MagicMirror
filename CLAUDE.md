# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MagicMirror² is an open source modular smart mirror platform built with Electron. It runs as a full-screen application displaying customizable modules on a Raspberry Pi or other device. This is a personal fork optimized for additional functionality and increased performance.

## Development Commands

### Running the Application

```bash
# Standard start (uses DISPLAY environment variable)
npm start

# Development mode (enables dev tools)
npm run start:dev

# Server-only mode (no Electron, access via browser)
npm run server
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit        # Unit tests only
npm run test:electron    # Electron tests only
npm run test:e2e         # End-to-end tests only
npm run test:coverage    # Generate coverage report

# Test specific modules
npm run test:calendar    # Debug calendar module
```

### Linting & Code Quality

```bash
# Run all linters
npm run test:prettier    # Check formatting
npm run test:js          # ESLint for JavaScript
npm run test:css         # StyleLint for CSS

# Auto-fix issues
npm run lint:prettier    # Fix formatting
npm run lint:js          # Fix JavaScript issues
npm run lint:css         # Fix CSS issues
npm run lint:staged      # Fix staged files (used by husky)
```

### Configuration

```bash
# Validate config file
npm run config:check
```

## Architecture

### Core Components

MagicMirror² follows a client-server architecture with two main execution contexts:

1. **Electron Main Process** (`js/electron.js`) - Manages the Electron application window and lifecycle
2. **Client-side** (`js/main.js`, `js/module.js`, `js/loader.js`) - Runs in the browser/Electron renderer, handles UI and module rendering
3. **Server-side** (`js/app.js`, `js/server.js`) - Express server that serves the UI and coordinates module helpers
4. **Node Helpers** (`js/node_helper.js`) - Server-side module code for backend operations (API calls, data fetching, etc.)

### Module System

Modules are the core building blocks. Each module can have:

- **Frontend component** (`module_name.js`) - Extends the `Module` class, handles display logic
  - Key methods: `getDom()`, `start()`, `getScripts()`, `getStyles()`, `notificationReceived()`
  - Located in `modules/default/` or `modules/` for third-party modules

- **Backend component** (`node_helper.js`) - Extends `NodeHelper` class, handles server-side operations
  - Key methods: `start()`, `socketNotificationReceived()`, `sendSocketNotification()`
  - Uses module aliases: `require("node_helper")` and `require("logger")` (defined in package.json `_moduleAliases`)

- **Communication**: Modules communicate via Socket.IO notifications
  - Frontend to backend: `this.sendSocketNotification(notification, payload)`
  - Backend to frontend: `this.sendSocketNotification(notification, payload)`
  - Between modules: `this.sendNotification(notification, payload)`

### Key Files

- `js/app.js` - Main application bootstrap, loads config, starts server, initializes node helpers
- `js/main.js` - Core client-side MM object, manages module lifecycle and DOM updates
- `js/loader.js` - Module loading system, dynamically loads module files and dependencies
- `js/module.js` - Base Module class that all frontend modules extend
- `js/node_helper.js` - Base NodeHelper class for backend module logic
- `js/server.js` - Express server setup with Socket.IO
- `js/electron.js` - Electron application wrapper
- `config/config.js` - Main configuration file (create from `config.js.sample`)

### Module Loading Flow

1. Server starts (`js/app.js`) and loads config from `config/config.js`
2. Config specifies modules array with module names and positions
3. Loader (`js/loader.js`) reads module list and loads each module's files
4. Node helpers are initialized server-side
5. Frontend modules are loaded client-side
6. Each module's `start()` method is called
7. Modules render via `getDom()` which returns HTML elements
8. DOM updates are managed by the core MM object

### Configuration Structure

Config file (`config/config.js`) contains:
- Server settings (address, port, ipWhitelist, HTTPS)
- Display settings (language, locale, timeFormat, units)
- modules array - each entry has:
  - `module`: module name
  - `position`: where to display (e.g., "top_left", "bottom_bar")
  - `config`: module-specific configuration
  - `header`: optional header text
  - `classes`: optional CSS classes

### Default Modules

Located in `modules/default/`:
- `alert` - System alerts and notifications
- `calendar` - Calendar/events display (has node_helper for iCal fetching)
- `clock` - Clock display
- `compliments` - Random compliments
- `helloworld` - Example module template
- `newsfeed` - RSS feed reader (has node_helper)
- `updatenotification` - Checks for MagicMirror updates (has node_helper)
- `weather` - Weather display with multiple providers

### Testing Structure

Jest configuration (`jest.config.js`) defines three test projects:
- **unit** - Unit tests in `tests/unit/`, uses mocked logger
- **electron** - Electron-specific tests in `tests/electron/`
- **e2e** - End-to-end tests in `tests/e2e/`, uses Playwright

Coverage includes: `clientonly/`, `js/`, `modules/default/`, `serveronly/`

## Important Patterns

### Creating a New Module

1. Create directory in `modules/` with module name
2. Create main module file (e.g., `mymodule.js`) extending `Module.register()`
3. Optionally create `node_helper.js` extending `NodeHelper.create()`
4. Add configuration to `config/config.js` modules array
5. Module structure:
   ```javascript
   Module.register("modulename", {
       defaults: { /* default config */ },
       start: function() { /* initialization */ },
       getDom: function() { /* return DOM element */ },
       notificationReceived: function(notification, payload, sender) { /* handle notifications */ }
   });
   ```

### Socket Communication Pattern

Frontend module:
```javascript
this.sendSocketNotification("NOTIFICATION_NAME", {data: "value"});
```

Node helper:
```javascript
socketNotificationReceived: function(notification, payload) {
    if (notification === "NOTIFICATION_NAME") {
        // process payload
        this.sendSocketNotification("RESPONSE", responseData);
    }
}
```

### Module Aliases

The codebase uses module-alias (see package.json `_moduleAliases`):
- `require("node_helper")` → `js/node_helper.js`
- `require("logger")` → `js/logger.js`

These work in node_helper.js files but not in frontend modules.

## Development Notes

- Frontend code runs in browser context (or Electron renderer), cannot use Node.js APIs
- Backend code (node_helper.js) has full Node.js access
- CSS uses main.css plus module-specific stylesheets loaded via `getStyles()`
- Translations use `js/translator.js` and files in `translations/`
- The app uses nunjucks for templating in modules (see `module.js` getDom)
- Server mode (`npm run server`) allows access via browser without Electron
- Config can use environment variables via `config.js.template` files with envsub
- Husky pre-commit hooks run lint-staged for automatic linting

## Common Gotchas

- Module names must match the directory name and the string passed to `Module.register()`
- Position names are predefined: top_bar, top_left, top_center, top_right, upper_third, middle_center, lower_third, bottom_left, bottom_center, bottom_right, bottom_bar, fullscreen_above, fullscreen_below
- Socket.IO namespaces are per-module (each module gets its own namespace)
- Module visibility is controlled via `this.show()`, `this.hide()`, and lock strings
- Config changes require restart - there's no hot reload
