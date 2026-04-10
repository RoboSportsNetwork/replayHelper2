# ReplayHelper

A video replay tool for FRC teams, built with Electron, React, and Tailwind CSS.

## Features

- Browse and play local video files with thumbnail previews
- Open any video file directly or quickly load the most recent recording
- Horizontal scroll to scrub through video
- Touch screen drawing / telestrator capabilities
- Keyboard shortcuts for common actions

## Typical Workflow

1. **Set Video Directory**

   - Use `Ctrl + D` to set the directory where your video files are stored
   - The app defaults to `~/Downloads/replay` on startup
   - This directory will be remembered for future sessions

2. **Select a Video**

   - Use `Ctrl + R` to open the video selector — a browsable list of all videos in the directory, each showing a thumbnail preview
   - Use `Ctrl + O` to instantly open the most recent video file in the directory
   - Use `Ctrl + Shift + O` to browse and open any specific file

3. **Navigate to Relevant Section**

   - Use horizontal scroll to scrub through the video
   - For precise control, use `Ctrl + Shift + Left/Right Arrow` to jump in 15-second increments
   - Adjust playback speed with keyboard shortcuts

4. **Analyze and Annotate**
   - Use touch screen or mouse to draw on the video
   - Change drawing colors using the keyboard shortcuts
   - Clear drawings with `Escape` when needed

## Development

### Prerequisites

- Node.js 20 or later
- npm
- ffmpeg (required for thumbnail generation)

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

- `Space`: Play/Pause
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

- `Ctrl + O`: Open latest video in directory
- `Ctrl + Shift + O`: Open a specific video file
- `Ctrl + R`: Open video selector (browse all videos with thumbnails)
- `Ctrl + D`: Set video directory
- `F11` (Windows) or `Cmd + Ctrl + F` (Mac): Toggle full screen

> **Mac users:** `Ctrl` shortcuts use `Cmd` instead (e.g., `Cmd + O`, `Cmd + D`).

## Scroll Interactions

- **Horizontal Scroll**: Scrub through the video timeline
  - Scroll left to move backward in time
  - Scroll right to move forward in time
  - Scrolling speed is affected by current playback speed

## How It Works

The app runs a local HTTP server (port 3000) to serve video files from the configured directory. When the video selector is opened, thumbnails are automatically generated using ffmpeg and cached in a `thumbnails/` subfolder inside the video directory.

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
