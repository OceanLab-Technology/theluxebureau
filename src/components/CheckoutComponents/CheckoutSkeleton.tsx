import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutItemSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-20 my-4 pb-2" />
      <div className="flex gap-6">
        <div className="bg-muted/20 w-30 h-40 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="flex flex-col w-full justify-center space-y-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl md:p-16 md:pb-4 md:px-0 px-4 mx-auto">
        <div className="flex items-center justify-between py-10">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="grid lg:grid-cols-2 md:gap-12 gap-4">
          <div className="flex flex-col md:space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <CheckoutItemSkeleton key={index} />
            ))}
          </div>

          {/* Checkout Form Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-40" />
            
            {/* Form fields skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
