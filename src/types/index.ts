export {};

declare global {
  interface Window {
    electronAPI: {
      openFileDialog(): Promise<string | null>;
      onVideoFileSelected(callback: (url: string) => void): void;
      onVideoDirectoryChanged(callback: (url: string) => void): void;
    };
  }
}
