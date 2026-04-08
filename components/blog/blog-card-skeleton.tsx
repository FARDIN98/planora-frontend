import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-video w-full" />

      {/* Content Skeleton */}
      <CardContent className="p-4 space-y-2">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Excerpt - 3 lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        {/* Meta */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>

      {/* Button Skeleton */}
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
