import { useVideoControlStore } from '../stores/useVideoControlStore';

export function SpeedIndicator() {
  const { playbackSpeed } = useVideoControlStore();

  if (playbackSpeed === 1) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-mono">
      {playbackSpeed.toFixed(1)}x
    </div>
  );
}
