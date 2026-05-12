import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Video Player Skeleton */}
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-16" />
          ))}
        </div>
      </div>

      {/* Alternative Videos Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-56 space-y-2">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
