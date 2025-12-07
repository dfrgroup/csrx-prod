# GitHub Releases Setup Guide for Auto-Updates

This guide explains how to set up GitHub Releases for the CSRX app to enable automatic updates.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js and npm installed
- Your app code pushed to GitHub repository: `dfrgroup/csrx-prod`

## Step 1: Create a GitHub Personal Access Token

You need a GitHub token with permissions to create releases and upload assets.

### Create Token:

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a descriptive name: `CSRX App Releases`
4. Set expiration (recommended: 90 days or No expiration for automation)
5. Select the following scopes:
   - `repo` (Full control of private repositories)
6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately (you won't be able to see it again)

### Set Token as Environment Variable:

**On macOS/Linux:**
```bash
export GH_TOKEN="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"
```
export GH_TOKEN="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"
Add to your `~/.zshrc` or `~/.bashrc` to make it permanent:
```bash
echo 'export GH_TOKEN="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"' >> ~/.zshrc
source ~/.zshrc
```

**On Windows (PowerShell):**
```powershell
$env:GH_TOKEN="your_github_token_here"
```

For permanent (System Environment Variables):
```powershell
[System.Environment]::SetEnvironmentVariable('GH_TOKEN', 'your_github_token_here', 'User')
```

## Step 2: Build Your App

Before publishing, test the build locally:

```bash
npm run build:mac
```

This creates distributable files in the `dist/` folder.

## Step 3: Version Your Release

Before publishing, update the version in `package.json`:

```bash
npm version patch   # 1.0.0 → 1.0.1
# or
npm version minor   # 1.0.0 → 1.1.0
# or
npm version major   # 1.0.0 → 2.0.0
```

This automatically:
- Updates `package.json` version
- Creates a git commit
- Creates a git tag

## Step 4: Push Changes and Tags

```bash
git push
git push --tags
```

## Step 5: Publish to GitHub Releases

Now publish your app with auto-upload to GitHub Releases:

```bash
npm run publish
```

This command will:
1. Build for all platforms (Mac, Windows, Linux)
2. Create a GitHub Release with the version from `package.json`
3. Upload all installers and update files to the release

**For a specific platform only:**
```bash
# Mac only
GH_TOKEN=your_token electron-builder --mac --publish always

# Windows only (on Windows or with Wine)
electron-builder --win --publish always

# Linux only
electron-builder --linux --publish always
```

## Step 6: Verify the Release

1. Go to your GitHub repository: https://github.com/dfrgroup/csrx-prod
2. Click on **"Releases"** tab
3. You should see your new release with:
   - DMG file (Mac installer)
   - ZIP file (Mac)
   - latest-mac.yml (update metadata)
   - NSIS installer (Windows)
   - AppImage (Linux)
   - And other platform-specific files

## Step 7: Test Auto-Updates

1. Install the app from the release (download the DMG/installer)
2. Run the app
3. Make a code change and bump the version:
   ```bash
   npm version patch
   git push && git push --tags
   npm run publish
   ```
4. In your running app, click **"Check for Updates"**
5. You should see update messages in the UI
6. The update will download automatically
7. Restart the app to install the update

## Important Notes

### Version Format
- Always use semantic versioning: `MAJOR.MINOR.PATCH`
- Example: `1.0.0`, `1.0.1`, `2.0.0`

### Release Types
The app is configured for `"releaseType": "release"` in package.json. This means:
- Only full releases trigger updates
- Draft and pre-release versions are ignored

### Auto-Update Behavior
Based on `main.js` configuration:
- `autoDownload: false` - Downloads require user confirmation (currently auto-downloads when update is available)
- `autoInstallOnAppQuit: true` - Updates install when user quits the app
- Updates check on app startup automatically

### Platform-Specific Notes

**macOS:**
- Code signing recommended for distribution (requires Apple Developer account)
- Without signing, users see "unidentified developer" warning
- DMG and ZIP formats are created

**Windows:**
- NSIS installer and portable version created
- Consider code signing for production (requires code signing certificate)

**Linux:**
- AppImage and DEB packages created
- Works without code signing

## Workflow for Releases

### Regular Release Process:

```bash
# 1. Make your changes
git add .
git commit -m "Add new feature"

# 2. Bump version
npm version patch

# 3. Push to GitHub
git push && git push --tags

# 4. Build and publish
npm run publish
```

### Quick Commands Reference:

```bash
# Start app in development
npm start

# Build for current platform only
npm run build:mac     # or build:win, build:linux

# Build for all platforms
npm run build

# Build and publish to GitHub Releases
npm run publish
```

## Troubleshooting

### "GH_TOKEN is not set"
- Ensure environment variable is set: `echo $GH_TOKEN`
- Restart terminal after setting

### "Cannot find module 'electron-builder'"
```bash
npm install
```

### "Release already exists"
- Delete the existing release on GitHub or bump version

### Updates not detected
- Check GitHub Release exists
- Verify `latest-mac.yml` (or platform equivalent) is in the release
- Check browser console for errors
- Check logs in: `~/Library/Logs/csrx/main.log` (macOS)

### Icon not showing
- Create icons in `build/` folder:
  - `build/icon.icns` (Mac)
  - `build/icon.ico` (Windows)
  - `build/icon.png` (Linux, 512x512px)

## Security Best Practices

1. **Never commit GH_TOKEN to git**
2. Use environment variables for tokens
3. Consider using GitHub Actions for automated builds
4. Enable code signing for production releases
5. Rotate tokens periodically

## GitHub Actions (Optional)

For automated releases on every tag push, create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install
      - run: npm run publish
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This automatically builds and publishes when you push tags!

## Next Steps

1. Set up code signing for production
2. Add app icons
3. Configure update channels (stable, beta)
4. Add crash reporting
5. Implement delta updates for faster downloads

---

Your app is now configured for automatic updates via GitHub Releases!
