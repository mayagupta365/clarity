import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  const level = score > 9 ? "High" : score >= 7 ? "Mid" : "Low";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5 font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all",
        level === "High" && "score-badge-high",
        level === "Mid" && "score-badge-mid",
        level === "Low" && "score-badge-low",
        sizeClasses[size],
        className
      )}
    >
      ⚡ {score} / 10 , {level}
    </span>
  );
}
