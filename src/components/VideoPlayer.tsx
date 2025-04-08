import { forwardRef, memo } from 'react';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = memo(
  forwardRef<HTMLVideoElement | null, VideoPlayerProps>(({ src }, ref) => {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black relative">
        <video ref={ref} src={src} className="max-w-full max-h-full object-contain" muted />
      </div>
    );
  })
);
