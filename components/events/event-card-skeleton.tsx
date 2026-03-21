import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-[60%]" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[45%]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[35%]" />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Skeleton className="h-4 w-[30%]" />
        <Skeleton className="h-4 w-[20%]" />
      </CardFooter>
    </Card>
  );
}
