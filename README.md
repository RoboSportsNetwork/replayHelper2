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

### Video Controls

- `Ctrl + Space`: Play/Pause
- `Ctrl + Shift + Left Arrow`: Jump back 15 seconds
- `Ctrl + Shift + Right Arrow`: Jump forward 15 seconds
- `Ctrl + Shift + 1`: Set playback speed to 1x
- `Ctrl + Shift + 2`: Set playback speed to 2x
- `Ctrl + Shift + 4`: Set playback speed to 0.25x
- `Ctrl + Shift + 5`: Set playback speed to 0.5x

### Drawing Controls

- `Escape`: Clear all drawings
- `Ctrl + Shift + 6`: Set drawing color to green
- `Ctrl + Shift + 7`: Set drawing color to yellow
- `Ctrl + Shift + 8`: Set drawing color to red
- `Ctrl + Shift + 9`: Set drawing color to blue
- `Ctrl + Shift + 0`: Set drawing color to white

### File Operations

- `Ctrl + O`: Open video file
- `Ctrl + D`: Set video directory
- `F11` (Windows) or `Cmd + Ctrl + F` (Mac): Toggle full screen

## Scroll Interactions

- **Horizontal Scroll**: Scrub through the video timeline

  - Scroll left to move backward in time
  - Scroll right to move forward in time
  - Scrolling speed is affected by current playback speed

- **Vertical Scroll**: Adjust playback speed
  - Scroll up to increase playback speed
  - Scroll down to decrease playback speed
  - Speed range: 0.1x to 4x
  - Current speed is displayed in the bottom-right corner

## Logitech MX Creative Console Configuration

The application includes pre-configured profiles for the Logitech MX Creative console to enhance the video replay experience. Two configuration files are provided in the `config/logitech` directory:

- `Replay Helper - Keys.lp5`: Configures the keyboard shortcuts for the MX Creative Keypad
- `Replay Helper - Dial.lp5`: Configures the dial controls for the MX Creative Dialpad

### Installation Instructions

1. Open Logitech Options+ software
2. Navigate to the "Profiles" section
3. Click "Import Profile"
4. Select the appropriate `.lp5` file from the `config/logitech` directory
5. The profile will be automatically configured with the following mappings:

#### MX Creative Keypad Configuration

- All standard keyboard shortcuts are pre-configured
- Optimized for quick access to video controls

![Keypad Configuration Page 1](config/logitech/Keypad%20Config%20-%20Page%201.png)
![Keypad Configuration Page 2](config/logitech/Keypad%20Config%20-%20Page%202.png)

#### MX Creative Dialpad Configuration

- Dial rotation: Adjusts playback speed
- Bottom left button: Toggles play/pause
- Bottom right button: Resets video speed

![Dialpad Configuration](config/logitech/Dialpad%20Config.png)

Note: Make sure to have Logitech Options+ software installed and running for these configurations to work properly.

## License

MIT
