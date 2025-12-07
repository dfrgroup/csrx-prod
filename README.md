# CSRX - System Information Desktop App

A modern Electron desktop application that displays operating system information with a beautiful UI, splash screen, and auto-update functionality.

## Features

- **Splash Screen**: Beautiful loading screen on startup
- **OS Information Display**: Shows detailed system information including:
  - Platform and Architecture
  - Hostname
  - OS Release and Version
  - Memory (Total and Free)
  - CPU Model and Cores
  - System Uptime
  - Home and Temp Directories
- **Auto-Update**: Built-in update checker with real-time status updates
- **Modern UI**: Gradient design with smooth animations

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

## Project Structure

- `main.js` - Main process (Electron backend)
- `preload.js` - Secure bridge between main and renderer processes
- `index.html` - Main window UI
- `splash.html` - Splash screen UI
- `renderer.js` - Renderer process logic (UI interactions)

## How It Works

1. The app starts with a splash screen that displays for 2 seconds
2. The main window loads and displays OS information
3. Click "Check for Updates" to manually check for app updates
4. Click "Refresh OS Info" to reload system information

## Building the App

Build for your current platform:

```bash
npm run build:mac     # macOS
npm run build:win     # Windows
npm run build:linux   # Linux
```

Build for all platforms:

```bash
npm run build
```

## Publishing to GitHub Releases

The app is configured to publish updates via GitHub Releases.

### Quick Start:

1. **Set GitHub Token:**
   ```bash
   export GH_TOKEN="your_github_personal_access_token"
   ```

2. **Bump Version:**
   ```bash
   npm version patch  # or minor, major
   ```

3. **Push to GitHub:**
   ```bash
   git push && git push --tags
   ```

4. **Build and Publish:**
   ```bash
   npm run publish
   ```

### Detailed Setup:

See **[GITHUB_RELEASES_SETUP.md](./GITHUB_RELEASES_SETUP.md)** for complete instructions on:
- Creating GitHub Personal Access Token
- Configuring environment variables
- Publishing releases
- Testing auto-updates
- Troubleshooting

## Auto-Update Behavior

- App checks for updates automatically on startup
- Click "Check for Updates" button to manually check
- Updates download automatically when available
- Updates install on app restart
- Real-time progress shown in UI

## Development

The app is built with:
- Electron 39.x
- electron-updater for auto-updates
- electron-builder for packaging
- electron-log for logging
- Native Node.js modules for OS information

## Repository

- GitHub: https://github.com/dfrgroup/csrx-prod
- Releases: https://github.com/dfrgroup/csrx-prod/releases

## License

ISC
