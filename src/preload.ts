// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  onVideoFileSelected: (callback: (url: string) => void) => {
    ipcRenderer.on('video-file-selected', (_event, url) => callback(url));
  },
  onVideoDirectoryChanged: (callback: (url: string) => void) => {
    ipcRenderer.on('video-directory-changed', (_event, url) => callback(url));
  },
  getAllVideos: () => ipcRenderer.invoke('get-all-videos'),
});
