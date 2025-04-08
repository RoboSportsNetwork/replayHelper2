import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

export type LineColor = string;

export interface Drawing {
  points: Point[];
  color: LineColor;
}

interface DrawingState {
  drawings: Drawing[];
  lineColor: LineColor;
  setDrawings: (drawings: Drawing[]) => void;
  setLineColor: (color: LineColor) => void;
  clearDrawings: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  drawings: [],
  lineColor: 'yellow',
  setDrawings: (drawings) => set({ drawings }),
  setLineColor: (color) => set({ lineColor: color }),
  clearDrawings: () => set({ drawings: [] }),
}));

// Initialize keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    useDrawingStore.getState().clearDrawings();
  }
  if (e.ctrlKey && e.shiftKey) {
    switch (e.code) {
      case 'Digit6':
        useDrawingStore.getState().setLineColor('#66CDAA');
        break;
      case 'Digit7':
        useDrawingStore.getState().setLineColor('yellow');
        break;
      case 'Digit8':
        useDrawingStore.getState().setLineColor('red');
        break;
      case 'Digit9':
        useDrawingStore.getState().setLineColor('blue');
        break;
      case 'Digit0':
        useDrawingStore.getState().setLineColor('white');
        break;
    }
  }
};

window.addEventListener('keydown', handleKeyDown);
