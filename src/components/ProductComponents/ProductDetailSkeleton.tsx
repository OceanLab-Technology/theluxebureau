import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function ProductDetailSkeleton() {
  return (
    <div className="font-century">
      <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12">
        {/* Image Section Skeleton */}
        <div className="space-y-4">
          <div className="md:aspect-square w-full bg-muted/20 overflow-hidden">
            <Skeleton className="lg:w-[950px] h-96 w-full lg:h-[1080px]" />
          </div>

          <div className="grid grid-cols-4 gap-4 md:py-2 md:px-8 px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square bg-muted/20 overflow-hidden">
                <Skeleton className="w-[212px] h-[262px]" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section Skeleton */}
        <div className="space-y-6 md:p-25 py-8 px-4">
          <div className="w-66">
            <div className="flex items-center gap-2 mb-2 text-stone-600">
              <Skeleton className="h-4 w-20" />
            </div>

            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>

          <Skeleton className="h-20 w-full" />

          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Tags section skeleton */}
          <div>
            <Skeleton className="h-5 w-12 mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-16" />
              ))}
            </div>
          </div>

          {/* Accordion sections skeleton */}
          <div className="mt-25 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Recommendations Section Skeleton */}
      <div className="mt-16 space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
