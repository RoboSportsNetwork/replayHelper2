import { useEffect, useRef, useState } from 'react';

interface VideoThumbnailProps {
  thumbnailUrl: string;
  className?: string;
}

export function VideoThumbnail({ thumbnailUrl, className = '' }: VideoThumbnailProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover rounded-md"
        onError={(e) => {
          // Fallback to a placeholder if thumbnail fails to load
          const target = e.target as HTMLImageElement;
          target.src =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Tm8gVGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPg==';
        }}
      />
    </div>
  );
}
