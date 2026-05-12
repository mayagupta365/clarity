import type { AISummary } from "@/lib/types";
import { Lightbulb, ListChecks, Compass, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SummaryPanelProps {
  summary: AISummary | null;
  isLoading: boolean;
  transcript: string | null;
  onRegenerate?: () => void;
}

export function SummaryPanel({ summary, isLoading, transcript, onRegenerate }: SummaryPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Lightbulb className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm">Select a video to generate an AI summary</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-1">
      {/* Core Takeaway */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Lightbulb className="h-4 w-4" />
          Core Takeaway
        </div>
        <p className="text-sm leading-relaxed text-foreground bg-primary/5 rounded-lg p-3 border border-primary/10">
          {summary.takeaway}
        </p>
      </div>

      {/* Key Lessons */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-score-high">
          <ListChecks className="h-4 w-4" />
          Key Lessons
        </div>
        <ul className="space-y-2">
          {summary.bullets.map((lesson, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-score-high/10 text-xs font-bold text-score-high">
                {i + 1}
              </span>
              <span className="leading-relaxed">{lesson}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Follow-up Topics */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-chart-5">
          <Compass className="h-4 w-4" />
          Explore Next
        </div>
        <div className="flex flex-wrap gap-2">
          {summary.followup.map((topic, i) => (
            <span
              key={i}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        {onRegenerate && (
          <Button variant="ghost" size="sm" onClick={onRegenerate} className="text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Regenerate
          </Button>
        )}
        {transcript && (
          <Button variant="ghost" size="sm" onClick={copyTranscript} className="text-xs">
            {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
            {copied ? "Copied!" : "Copy Transcript"}
          </Button>
        )}
      </div>
    </div>
  );
}
