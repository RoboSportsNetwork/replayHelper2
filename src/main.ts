import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItemConstructorOptions } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';
import {
  getAllVideos,
  getLatestVideoUrl,
  getVideoUrl,
  setVideoDirectory,
  startServer,
  stopServer,
} from './server';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createMenu = (mainWindow: BrowserWindow) => {
  const isMac = process.platform === 'darwin';
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Latest...',
          accelerator: isMac ? 'Command+O' : 'Ctrl+O',
          click: async () => {
            mainWindow.webContents.send('video-file-selected', getLatestVideoUrl());
          },
        },
        {
          label: 'Open Exact...',
          accelerator: isMac ? 'Command+Shift+O' : 'Ctrl+Shift+O',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('video-file-selected', getVideoUrl(result.filePaths[0]));
            }
          },
        },
        {
          label: 'Set Directory...',
          accelerator: isMac ? 'Command+D' : 'Ctrl+D',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openDirectory'],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              setVideoDirectory(result.filePaths[0]);
              mainWindow.webContents.send('video-directory-changed', result.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: isMac ? 'Command+Control+F' : 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
      ],
    },
    { role: 'windowMenu' },
  ] as MenuItemConstructorOptions[];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Create the application menu
  createMenu(mainWindow);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools only in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  startServer(path.join(app.getPath('home'), 'Downloads', 'replay'));
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopServer();
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Set up IPC handlers
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return getVideoUrl(result.filePaths[0]);
  }
  return null;
});

ipcMain.handle('get-all-videos', () => {
  return getAllVideos();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
