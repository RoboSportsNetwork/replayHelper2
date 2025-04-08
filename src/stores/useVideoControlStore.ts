import { create } from 'zustand';

interface VideoControlState {
  playbackSpeed: number;
  showSpeed: boolean;
  setPlaybackSpeed: (speed: number) => void;
  resetPlaybackSpeed: () => void;
}

export const useVideoControlStore = create<VideoControlState>((set) => {
  let timeoutRef: NodeJS.Timeout | null = null;

  const resetPlaybackSpeed = () => {
    set({ playbackSpeed: 1, showSpeed: true });

    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }

    timeoutRef = setTimeout(() => {
      set({ showSpeed: false });
    }, 1000);
  };

  // Set up keyboard event listeners
  if (typeof window !== 'undefined') {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === '1') {
        e.preventDefault();
        resetPlaybackSpeed();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  }

  return {
    playbackSpeed: 1,
    showSpeed: false,
    setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
    resetPlaybackSpeed,
  };
});
