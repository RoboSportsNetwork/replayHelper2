import './index.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { VideoPlayer } from './components/VideoPlayer';
import { Telestrator } from './components/Telestrator';
import { SpeedIndicator } from './components/SpeedIndicator';
import { VideoThumbnail } from './components/VideoThumbnail';
import { useVideoControlStore } from './stores/useVideoControlStore';
import { useDrawingStore } from './stores/useDrawingStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { SettingsDialog } from './components/SettingsDialog';
import { RsnLogo } from './components/RsnLogo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from './components/ui/dialog';
import { VideoList } from './components/VideoList';
import { Video } from './types';

const SPEED_STEPS = [0.25, 0.5, 1, 2];

export function App() {
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [proxyPath, setProxyPath] = useState<string | null>(null);
  const [proxyGenerating, setProxyGenerating] = useState(false);
  const { playbackSpeed, setPlaybackSpeed } = useVideoControlStore();
  const { scrub, proxy, loadSettings } = useSettingsStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { clearDrawings } = useDrawingStore();
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const lastScrollTimeRef = useRef<number>(0);
  const accumulatedScrollRef = useRef<number>(0);
  const verticalAccumRef = useRef<number>(0);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    clearDrawings();
  }, [videoPath, clearDrawings]);

  // Generate scrub proxy whenever a new video is loaded
  useEffect(() => {
    if (!videoPath) return;
    setProxyPath(null);
    if (!proxy.enabled) return;
    setProxyGenerating(true);
    window.electronAPI.generateProxy(videoPath, proxy.keyframeInterval).then((url) => {
      // Preserve playback position when switching to proxy
      const currentTime = videoRef.current?.currentTime ?? 0;
      setProxyPath(url);
      setProxyGenerating(false);
      // Restore position after the src change re-renders
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.currentTime = currentTime;
      });
    }).catch(() => setProxyGenerating(false));
  }, [videoPath, proxy.enabled]);

  useEffect(() => {
    // Listen for video file selections from the menu
    window.electronAPI.onVideoFileSelected((url) => {
      console.log(url);
      setVideoPath(url);
    });

    window.electronAPI.onVideoDirectoryChanged((url) => {
      console.log(url);
    });
  }, []);

  useEffect(() => {
    window.electronAPI.getAllVideos().then((videos) => {
      setVideos(videos);
    });
  }, [showVideoSelector]);

  const updateVideoTime = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const timeChange = delta * (-scrub.sensitivity) * playbackSpeed;
      const newTime = video.currentTime + timeChange;
      video.currentTime = Math.max(0, Math.min(newTime, video.duration));
    },
    [playbackSpeed, scrub.sensitivity]
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (showVideoSelector || !videoRef.current) return;
      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      e.preventDefault();

      if (!isHorizontalScroll) {
        // Vertical scroll — step through playback speeds.
        // Accumulate so trackpad gestures feel natural and mouse notches step once per click.
        const pixelDeltaY =
          e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 600 : e.deltaY;
        verticalAccumRef.current += pixelDeltaY;
        while (Math.abs(verticalAccumRef.current) >= scrub.verticalScrollThreshold) {
          const direction = verticalAccumRef.current < 0 ? 1 : -1; // scroll up = faster
          verticalAccumRef.current -= Math.sign(verticalAccumRef.current) * scrub.verticalScrollThreshold;
          const currentIndex = SPEED_STEPS.indexOf(playbackSpeed);
          const newIndex = Math.max(0, Math.min(SPEED_STEPS.length - 1, currentIndex + direction));
          if (newIndex !== currentIndex) setPlaybackSpeed(SPEED_STEPS[newIndex]);
        }
        return;
      }

      const now = performance.now();

      // Normalize delta: deltaMode=1 (line) is common on Windows mice, convert to pixels.
      // Also cap per-event contribution so discrete tilt-wheel clicks (~120px/notch on Windows)
      // don't cause large jumps, while trackpad events (2–10px each) pass through unchanged.
      const pixelDelta =
        e.deltaMode === 1 ? e.deltaX * 16 : e.deltaMode === 2 ? e.deltaX * 600 : e.deltaX;
      const normalizedDelta = Math.sign(pixelDelta) * Math.min(Math.abs(pixelDelta), scrub.maxDeltaPerEvent);

      // Accumulate scroll delta
      accumulatedScrollRef.current += normalizedDelta;

      // Clear any pending updates
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }

      // Schedule the next update
      scrollTimeoutRef.current = requestAnimationFrame(() => {
        // Horizontal scroll - scrub through video
        updateVideoTime(accumulatedScrollRef.current);
        accumulatedScrollRef.current = 0;

        lastScrollTimeRef.current = now;
      });
    },
    [updateVideoTime, setPlaybackSpeed, scrub.maxDeltaPerEvent, scrub.verticalScrollThreshold, playbackSpeed]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      if (videoRef.current?.paused) {
        videoRef.current?.play();
      } else {
        videoRef.current?.pause();
      }
      return;
    }
    if (e.ctrlKey && e.shiftKey) {
      switch (e.code) {
        case 'ArrowLeft':
          if (videoRef.current) {
            videoRef.current.currentTime -= 15;
          }
          break;
        case 'ArrowRight':
          if (videoRef.current) {
            videoRef.current.currentTime += 15;
          }
          break;
        case 'Digit1':
          setPlaybackSpeed(1);
          break;
        case 'Digit2':
          setPlaybackSpeed(2);
          break;
        case 'Digit4':
          setPlaybackSpeed(0.25);
          break;
        case 'Digit5':
          setPlaybackSpeed(0.5);
          break;
      }
    }
    if (e.ctrlKey && e.code === 'KeyR') {
      setShowVideoSelector(!showVideoSelector);
    }
    if (e.ctrlKey && e.code === 'Comma') {
      setShowSettings((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black">
      <RsnLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-[#FFCC00]/40" />
      {videoPath && <VideoPlayer src={proxyPath ?? videoPath} ref={videoRef} />}
      <Telestrator />
      <SpeedIndicator />
      {proxyGenerating && (
        <div className="fixed bottom-4 left-4 bg-black/70 text-white/70 px-3 py-1 rounded-lg text-xs font-mono">
          generating scrub proxy...
        </div>
      )}
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <Dialog open={showVideoSelector} onOpenChange={setShowVideoSelector}>
        <DialogContent className="w-[90vw] h-[90vh] max-w-none">
          <DialogHeader>
            <DialogTitle>Select Video</DialogTitle>
          </DialogHeader>
          <VideoList videos={videos} onSelectVideo={(video) => setVideoPath(video.url)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

let root;
const container = document.getElementById('root');
if (container) {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
}
