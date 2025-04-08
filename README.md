# ReplayHelper

A video replay tool for FRC teams, built with Electron, React, and Tailwind CSS.

## Features

- Open and play local video files
- Horizontal scroll to scrub through video
- Vertical scroll to adjust playback speed
- Touch screen drawing capabilities
- Keyboard shortcuts for common actions

## Development

### Prerequisites

- Node.js 20 or later
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Building and Releasing

This project uses GitHub Actions to automatically build and release executables for Windows and Ubuntu.

### Automatic Builds

Builds are automatically triggered on:

- Pushes to the `main` branch
- Creation of new releases

### Creating a Release

To create a new release:

1. Update the version in `package.json`
2. Create and push a new tag:
   ```bash
   git tag v1.0.0  # Replace with your version number
   git push origin v1.0.0
   ```

The GitHub Actions workflow will:

- Build the application for both Windows and Ubuntu
- Create a GitHub release
- Attach the following files to the release:
  - Windows: `.exe` installer and `.zip` archive
  - Ubuntu: `.deb` package and `.zip` archive

### Accessing Builds

Built executables are available in two places:

1. GitHub Releases page
2. GitHub Actions artifacts (for every build, including non-release builds)

## Keyboard Shortcuts

- `Ctrl + Space`: Play/Pause
- `Ctrl + Shift + Left Arrow`: Jump back 15 seconds
- `Ctrl + Shift + Right Arrow`: Jump forward 15 seconds
- `Ctrl + Shift + 1`: Set playback speed to 1x
- `Ctrl + Shift + 2`: Set playback speed to 2x
- `Ctrl + Shift + 4`: Set playback speed to 0.25x
- `Ctrl + Shift + 5`: Set playback speed to 0.5x

## License

MIT
