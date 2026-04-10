import { create } from 'zustand';

export interface ScrubSettings {
  sensitivity: number;             // seconds per normalized pixel, positive (default: 0.01)
  maxDeltaPerEvent: number;        // pixel cap per wheel event (default: 30)
  verticalScrollThreshold: number; // px to accumulate before stepping playback speed (default: 100)
}

export interface ProxySettings {
  enabled: boolean;            // whether to generate a scrub proxy (default: true)
  keyframeInterval: number;    // frames between keyframes in the scrub proxy (default: 30)
}

export const SCRUB_DEFAULTS: ScrubSettings = {
  sensitivity: 0.01,
  maxDeltaPerEvent: 30,
  verticalScrollThreshold: 100,
};

export const PROXY_DEFAULTS: ProxySettings = {
  enabled: true,
  keyframeInterval: 30,
};

interface SettingsState {
  scrub: ScrubSettings;
  proxy: ProxySettings;
  loaded: boolean;
  setScrub: (partial: Partial<ScrubSettings>) => void;
  setProxy: (partial: Partial<ProxySettings>) => void;
  resetScrub: () => void;
  resetProxy: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  scrub: { ...SCRUB_DEFAULTS },
  proxy: { ...PROXY_DEFAULTS },
  loaded: false,

  setScrub: (partial) => {
    const updated = { ...get().scrub, ...partial };
    set({ scrub: updated });
    window.electronAPI.saveSettings({ scrub: updated, proxy: get().proxy });
  },

  setProxy: (partial) => {
    const updated = { ...get().proxy, ...partial };
    set({ proxy: updated });
    window.electronAPI.saveSettings({ scrub: get().scrub, proxy: updated });
  },

  resetScrub: () => {
    set({ scrub: { ...SCRUB_DEFAULTS } });
    window.electronAPI.saveSettings({ scrub: { ...SCRUB_DEFAULTS }, proxy: get().proxy });
  },

  resetProxy: () => {
    set({ proxy: { ...PROXY_DEFAULTS } });
    window.electronAPI.saveSettings({ scrub: get().scrub, proxy: { ...PROXY_DEFAULTS } });
  },

  loadSettings: async () => {
    const saved = await window.electronAPI.loadSettings();
    set({
      scrub: { ...SCRUB_DEFAULTS, ...(saved?.scrub as Partial<ScrubSettings> ?? {}) },
      proxy: { ...PROXY_DEFAULTS, ...(saved?.proxy as Partial<ProxySettings> ?? {}) },
      loaded: true,
    });
  },
}));
