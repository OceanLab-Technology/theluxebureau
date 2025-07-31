import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="space-y-8 font-century mb-10">
      <div className="md:px-10 px-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-6 w-96 mb-4" />
      </div>
      
      <div className="grid grid-cols-2 md:gap-6 gap-3 md:px-10 px-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center space-x-2 pt-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-10" />
        ))}
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="transition-all font-century duration-300 overflow-hidden md:w-120">
      <div className="relative aspect-auto overflow-hidden md:h-130 h-66">
        <Skeleton className="w-full h-full" />
      </div>
      
      <div className="flex flex-col md:my-3 my-2 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
