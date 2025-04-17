import { cn } from '../lib/utils';
import { DialogClose } from './ui/dialog';
import { VideoThumbnail } from './VideoThumbnail';
import { Video } from '../types';

export type VideoListProps = {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
};

export function VideoList({ videos, onSelectVideo }: VideoListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 overflow-y-auto w-full">
      {videos.map((video, index) => (
        <DialogClose key={video.url} asChild>
          <div
            className={cn(
              'flex items-center gap-4 p-4 hover:bg-gray-100 rounded-md cursor-pointer'
            )}
            onClick={() => onSelectVideo(video)}
          >
            <VideoThumbnail thumbnailUrl={video.thumbnailUrl} className="w-[600px] aspect-video" />
            <div className="text-2xl font-medium">{video.name}</div>
          </div>
        </DialogClose>
      ))}
    </div>
  );
}
