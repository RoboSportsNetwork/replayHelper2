import './index.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { VideoPlayer } from './components/VideoPlayer';
import { Telestrator } from './components/Telestrator';
import { SpeedIndicator } from './components/SpeedIndicator';
import { VideoThumbnail } from './components/VideoThumbnail';
import { useVideoControlStore } from './stores/useVideoControlStore';
import { useDrawingStore } from './stores/useDrawingStore';
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

export function App() {
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const { playbackSpeed, setPlaybackSpeed } = useVideoControlStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { clearDrawings } = useDrawingStore();
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const lastScrollTimeRef = useRef<number>(0);
  const accumulatedScrollRef = useRef<number>(0);

  useEffect(() => {
    clearDrawings();
  }, [videoPath, clearDrawings]);

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

      const scrollSensitivity = -0.01;
      const timeChange = delta * scrollSensitivity * playbackSpeed;
      const newTime = video.currentTime + timeChange;
      video.currentTime = Math.max(0, Math.min(newTime, video.duration));
    },
    [playbackSpeed]
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
      if (!isHorizontalScroll) return;
      e.preventDefault();
      const now = performance.now();

      // Accumulate scroll delta
      accumulatedScrollRef.current += e.deltaX;

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
    [updateVideoTime, setPlaybackSpeed]
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
      {videoPath && <VideoPlayer src={videoPath} ref={videoRef} />}
      <Telestrator />
      <SpeedIndicator />
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
