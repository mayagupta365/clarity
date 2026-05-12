import type { VideoResult } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, Calendar, Info } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VideoPlayerProps {
  video: VideoResult;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Guard against undefined video
  if (!video) return null

  const channelInitial = (video.channelTitle || video.channel || "?")[0]

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
          title={video.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-bold leading-tight text-foreground lg:text-2xl">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {channelInitial}
            </div>
            <span className="text-sm font-medium text-foreground">
              {video.channelTitle || video.channel}
            </span>
          </div>
          <ScoreBadge score={video.score} size="md" />
          {video.scoreBreakdown && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Info className="h-3.5 w-3.5" />
                    Why this video?
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs bg-card text-card-foreground border border-border p-3">
                  <p className="font-semibold mb-2">Score Breakdown</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Like Ratio (35%)</span>
                      <span>{(video.scoreBreakdown.likeRatio * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement (35%)</span>
                      <span>{video.scoreBreakdown.engagementRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freshness (20%)</span>
                      <span>{video.scoreBreakdown.timeDecay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comments (10%)</span>
                      <span>{video.scoreBreakdown.commentScore.toFixed(1)}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" />
            {formatNumber(video.likeCount || video.likes || 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsDown className="h-4 w-4" />
            {formatNumber(video.dislikeCount || video.dislikes || 0)}
            <span className="text-xs opacity-60">(est.)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            {formatNumber(video.commentCount || video.comments || 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {formatNumber(video.viewCount || video.views || 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(video.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  )
}