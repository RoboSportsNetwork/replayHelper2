export {};

declare global {
  interface Window {
    electronAPI: {
      openFileDialog(): Promise<string | null>;
      onVideoFileSelected(callback: (url: string) => void): void;
      onVideoDirectoryChanged(callback: (url: string) => void): void;
      getAllVideos(): Promise<{ name: string; url: string; thumbnailUrl: string }[]>;
    };
  }
}

export type Video = {
  name: string;
  url: string;
  thumbnailUrl: string;
};
