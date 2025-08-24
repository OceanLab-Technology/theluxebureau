import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="space-y-8 w-full font-[Century-Old-Style]">
      <div className="md:px-6 px-6 mb-15">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-8 w-full max-w-2xl mb-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] md:gap-[6px] px-2 md:px-0 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      <div className="h-[15.75rem] w-full px-10 bg-[rgba(80,70,45,0.19)] flex items-center md:justify-end justify-center">
        <div className="text-foreground">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="transition-all font-[Century-Old-Style] duration-300 overflow-hidden text-secondary-foreground p-0 md:p-[6px] h-[22rem] md:h-[44rem] flex flex-col justify-between w-full bg-[#f8f6ea] rounded-none md:rounded">
      <div className="relative overflow-hidden w-full h-[15rem] md:h-[36rem] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
      
      <div className="flex flex-col mt-4 uppercase font-schoolbook-cond text-[1rem] leading-[1.2rem] font-[400] px-2 md:px-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="md:mt-4">
        <Skeleton className="h-10 w-full md:px-20" />
      </div>
    </div>
  );
}