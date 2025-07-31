import { Skeleton } from "@/components/ui/skeleton";

export function PersonalizeSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Product Preview Skeleton */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Steps Skeleton */}
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                {index < 3 && <Skeleton className="w-16 h-0.5 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form content skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
