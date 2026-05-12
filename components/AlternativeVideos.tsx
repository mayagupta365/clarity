import type { VideoResult } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";

interface AlternativeVideosProps {
  videos: VideoResult[];
  selectedId: string;
  onSelect: (video: VideoResult) => void;
}

const handleScroll = (direction: 'left' | 'right') => {
  const scrollArea = document.querySelector('.custom-scrollbar');
  if (scrollArea) {
    scrollArea.scrollLeft += direction === 'left' ? -100 : 100;
  }
};
export function AlternativeVideos({ videos, selectedId, onSelect }: AlternativeVideosProps) {
  const alternatives = videos.filter((v) => v.id !== selectedId);
  if (alternatives.length === 0) return null;

  return (
    <div className="space-y-3 relative">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Other Top Results
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
        <div onClick={() => handleScroll('right')} className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 w-12 h-12 text-2xl rounded-full flex justify-center items-center bg-black z-10">{">"}</div>
        <div onClick={() => handleScroll('left')} className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 w-12 h-12 text-2xl rounded-full flex justify-center items-center bg-black z-10">{"<"}</div>
        {alternatives.map((video) => (
          <button
            key={video.id}
            onClick={() => onSelect(video)}
            className="group flex-shrink-0 w-56 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent transition-all overflow-hidden text-left"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 right-2">
                <ScoreBadge score={video.score} size="sm" />
              </div>
            </div>
            <div className="p-3 space-y-1">
              <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">
                {video.title}
              </p>
              <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
