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
    <div className="grid grid-cols-1 gap-6 p-6 overflow-y-auto">
      {videos.map((video, index) => (
        <DialogClose key={video.url} asChild>
          <div
            className={cn(
              'flex flex-col items-center gap-4 p-4 hover:bg-gray-100 rounded-md cursor-pointer'
            )}
            onClick={() => onSelectVideo(video)}
          >
            <VideoThumbnail thumbnailUrl={video.thumbnailUrl} className="w-[90%] aspect-video" />
            <div className="text-lg font-medium">{video.name}</div>
          </div>
        </DialogClose>
      ))}
    </div>
  );
}
