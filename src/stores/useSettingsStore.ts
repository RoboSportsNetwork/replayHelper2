import { create } from 'zustand';

export interface ScrubSettings {
  sensitivity: number;       // seconds per normalized pixel, positive (default: 0.01)
  maxDeltaPerEvent: number;  // pixel cap per wheel event (default: 30)
}

export const SCRUB_DEFAULTS: ScrubSettings = {
  sensitivity: 0.01,
  maxDeltaPerEvent: 30,
};

interface SettingsState {
  scrub: ScrubSettings;
  loaded: boolean;
  setScrub: (partial: Partial<ScrubSettings>) => void;
  resetScrub: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  scrub: { ...SCRUB_DEFAULTS },
  loaded: false,

  setScrub: (partial) => {
    const updated = { ...get().scrub, ...partial };
    set({ scrub: updated });
    window.electronAPI.saveSettings({ scrub: updated });
  },

  resetScrub: () => {
    set({ scrub: { ...SCRUB_DEFAULTS } });
    window.electronAPI.saveSettings({ scrub: { ...SCRUB_DEFAULTS } });
  },

  loadSettings: async () => {
    const saved = await window.electronAPI.loadSettings();
    if (saved?.scrub) {
      set({ scrub: { ...SCRUB_DEFAULTS, ...saved.scrub }, loaded: true });
    } else {
      set({ loaded: true });
    }
  },
}));
