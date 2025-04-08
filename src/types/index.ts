export {};

declare global {
  interface Window {
    electronAPI: {
      openFileDialog(): Promise<string | null>;
      onVideoFileSelected(callback: (url: string) => void): void;
    };
  }
}
