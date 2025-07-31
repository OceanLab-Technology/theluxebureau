import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="flex items-start space-x-6 md:py-6 py-4 border-y border-secondary-foreground">
      <div className="flex-shrink-0">
        <Skeleton className="w-32 h-32" />
      </div>

      <div className="flex flex-col justify-between flex-grow h-full">
        <div className="h-full">
          <Skeleton className="h-6 w-48 mb-2" />
          
          {/* Custom data skeleton */}
          <div className="text-xs text-stone-500 mb-3 space-y-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-36" />
          </div>

          <Skeleton className="h-6 w-16 mb-4" />
        </div>

        <div className="flex md:items-center md:flex-row flex-col md:space-x-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            
            {/* Mobile actions */}
            <div className="flex-col flex md:hidden justify-start items-end text-sm">
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          <div className="flex items-center mt-2 md:mt-0">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-12 mx-2" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="hidden flex-col md:flex justify-start items-end text-sm">
        <Skeleton className="h-4 w-8 mb-1" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function CartContainerSkeleton() {
  return (
    <div className="md:mx-12 md:my-14 py-10 px-6">
      <div className="flex items-center justify-between md:mb-8 pb-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-32 md:block hidden" />
      </div>

      <div className="space-y-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <CartItemSkeleton key={index} />
        ))}
      </div>

      {/* Cart Summary Skeleton */}
      <div className="mt-8 pt-6 border-t border-secondary-foreground">
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
