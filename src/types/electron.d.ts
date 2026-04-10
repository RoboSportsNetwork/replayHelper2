import { Video } from './index';

interface ElectronAPI {
  openFileDialog: () => Promise<string | null>;
  onVideoFileSelected: (callback: (url: string) => void) => void;
  onVideoDirectoryChanged: (callback: (url: string) => void) => void;
  getAllVideos: () => Promise<Video[]>;
  generateProxy: (videoUrl: string) => Promise<string>;
  loadSettings: () => Promise<Record<string, unknown> | null>;
  saveSettings: (settings: Record<string, unknown>) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
