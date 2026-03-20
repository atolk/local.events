import { Skeleton } from "@/components/ui/primitives/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="mb-4 h-8 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
