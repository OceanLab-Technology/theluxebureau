// "use client";

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ProductCard } from "./ProductCard";
// import { ProductGridSkeleton } from "./ProductGridSkeleton";
// import { useProductStore } from "@/store/productStore";
// import { ChevronRight, Loader2 } from "lucide-react";
// import { useSearchParams, useRouter } from "next/navigation";

// interface ProductGridProps {
//   searchQuery?: string;
//   selectedCategory?: string;
//   priceRange?: [number, number];
//   availability?: string;
//   onCategoryChange?: (category: string) => void;
//   onClose?: () => void;
// }

// export function ProductGrid({
//   searchQuery = "",
//   selectedCategory = "",
//   onCategoryChange,
// }: ProductGridProps) {
//   const { products, loading, error, fetchProducts } = useProductStore();
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const categories = ["Literature", "Drinks & Spirits", "Floral", "Home & Lifestyle"];

//   const pageVariants = {
//     initial: {
//       opacity: 0,
//       filter: "blur(10px)",
//     },
//     in: {
//       opacity: 1,
//       filter: "blur(0px)",
//     },
//     out: {
//       opacity: 0,
//       filter: "blur(10px)",
//     },
//   };

//   const pageTransition = {
//     type: "tween" as const,
//     ease: "easeInOut" as const,
//     duration: 0.6,
//   };

//   const gridVariants = {
//     hidden: {
//       opacity: 0,
//       filter: "blur(8px)",
//     },
//     visible: {
//       opacity: 1,
//       filter: "blur(0px)",
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1,
//       },
//     },
//     exit: {
//       opacity: 0,
//       filter: "blur(8px)",
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const cardVariants = {
//     hidden: {
//       opacity: 0,
//       filter: "blur(5px)",
//     },
//     visible: {
//       opacity: 1,
//       filter: "blur(0px)",
//       transition: {
//         duration: 0.4,
//       },
//     },
//   };

//   const getNextCategory = () => {
//     if (!selectedCategory) return categories[0];
//     const currentIndex = categories.indexOf(selectedCategory);
//     return categories[(currentIndex + 1) % categories.length];
//   };

//   const handleNextCategory = () => {
//     if (onCategoryChange) {
//       setIsTransitioning(true);
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//       setTimeout(() => {
//         const nextCategory = getNextCategory();
//         onCategoryChange(nextCategory);
//         setTimeout(() => setIsTransitioning(false), 600);
//       }, 300);
//     }
//   };

//   useEffect(() => {
//     const params: any = {};

//     if (selectedCategory) params.category = selectedCategory;
//     if (searchQuery) params.name = searchQuery;

//     fetchProducts(params).finally(() => {
//       setIsInitialLoad(false);
//     });
//   }, [selectedCategory, searchQuery, fetchProducts]);


//   const normalizeCategory = (category: string) => {
//     return category.toLowerCase().trim().replace(/\s+/g, ' ');
//   };

//   const filteredProducts = products.filter(product => {
//     if (!selectedCategory) return true;
//     const productCategory = product.category ? normalizeCategory(product.category) : '';
//     const selectedCat = normalizeCategory(selectedCategory);

//     return productCategory === selectedCat;
//   });


//   if (loading) {
//     return <ProductGridSkeleton />;
//   }

//   if (!loading && filteredProducts.length === 0) {
//     return (
//       <div className="w-full flex items-center justify-center min-h-[20vh] p-20 flex-col text-center">
//         <div className="max-w-md w-full space-y-6 pb-20 text-left lg:pl-10 lg:pb-20">
//           <div className="space-y-4">
//             <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-[Century-Old-Style]">
//               No products found
//             </h2>
//             <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-[Century-Old-Style]">
//               Try adjusting your filters or search terms.
//             </p>
//           </div>
//           <div className="">
//             <button
//               onClick={() => router.push("/products")}
//               className="bg-[#FBD060] text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[15.812rem] h-[2rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.75rem] lg:w-[20.812rem] lg:h-[2.5rem]"
//             >

//               CONTINUE SHOPPING &gt;
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={selectedCategory}
//         initial="initial"
//         animate="in"
//         exit="out"
//         variants={pageVariants}
//         transition={pageTransition}
//         className="space-y-8 w-full font-[Century-Old-Style]"
//       >
//         <motion.div
//           className="md:px-6 px-6 mb-15"
//           initial={{ opacity: 0, filter: "blur(5px)" }}
//           animate={{ opacity: 1, filter: "blur(0px)" }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//         >
//           <motion.h2
//             className="text-[20px] leading-[24px] font-schoolbook-cond font-[400] uppercase text-secondary-foreground"
//             initial={{ opacity: 0, filter: "blur(3px)" }}
//             animate={{ opacity: 1, filter: "blur(0px)" }}
//             transition={{ delay: 0.3, duration: 0.4 }}
//           >
//             {selectedCategory === "" ? "Shop All" : selectedCategory}
//           </motion.h2>
//           <motion.p
//             className="mt-2 md:text-[1.625rem] text-[1.1rem] lg:w-[55.56rem] text-secondary-foreground font-[100] md:leading-7"
//             initial={{ opacity: 0, filter: "blur(3px)" }}
//             animate={{ opacity: 1, filter: "blur(0px)" }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//           >
//             {selectedCategory === ""
//               ? "Refined pieces that bring comfort, character, and an everyday reminder of your quiet generosity."
//               : selectedCategory === "Literature"
//                 ? "The Luxe Bureau offers a curated selection of literature, from timeless classics to contemporary masterpieces, each chosen for its enduring impact and literary significance."
//                 : selectedCategory === "Drinks & Spirits"
//                   ? "Thoughtfully curated and artfully presented, our selection of wines and spirits transforms exceptional bottles into extraordinary gestures"
//                   : selectedCategory === "Floral"
//                     ? "Explore our exquisite floral arrangements, where each bloom is handpicked to create stunning displays that bring beauty and elegance to any occasion."
//                     : selectedCategory === "Home & Lifestyle"
//                       ? "Discover our curated collection of home decor, where each piece is chosen for its unique design and ability to transform your living space into a haven of style and comfort."
//                       : ""}
//           </motion.p>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`${selectedCategory}-products`}
//             variants={gridVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             className="grid grid-cols-2 md:grid-cols-3 gap-y-[12px] md:gap-y-[6px] gap-x-[12px] md:gap-x-1 px-2 md:px-0 w-full max-w-full"
//           >
//             {filteredProducts.map((product, idx) => (
//               <motion.div
//                 key={product.id}
//                 variants={cardVariants}
//                 className={`flex ${idx === 0 ? "md:ml-3" : ""} ${idx === filteredProducts.length - 1 ? "md:mr-3" : ""}`}
//               >
//                 <ProductCard product={product} />
//               </motion.div>
//             ))}
//           </motion.div>
//         </AnimatePresence>

//         <motion.div
//           className="h-[15.75rem] w-full px-10 bg-[rgba(80,70,45,0.19)] flex items-center md:justify-end justify-center"
//           initial={{ opacity: 0, filter: "blur(5px)" }}
//           animate={{ opacity: 1, filter: "blur(0px)" }}
//           transition={{ delay: 0.6, duration: 0.5 }}
//         >
//           <div className="text-foreground">
//             <motion.h2
//               className={`small-text uppercase text-secondary-foreground transition-opacity duration-200 ${isTransitioning ? "animate-pulse" : ""
//                 }`}
//               animate={isTransitioning ? { opacity: [1, 0.5, 1] } : {}}
//               transition={{
//                 duration: 0.3,
//                 repeat: isTransitioning ? Infinity : 0,
//               }}
//             >
//               Next Section
//             </motion.h2>
//             <motion.div
//               className={`flex items-center gap-1 text-[2rem] font-[100] cursor-pointer hover:text-[#FBD060] transition-all duration-200 transform hover:scale-105 ${isTransitioning ? "opacity-70" : "opacity-100"
//                 }`}
//               onClick={handleNextCategory}
//               whileHover={{ opacity: 0.8 }}
//               whileTap={{ opacity: 0.6 }}
//             >
//               <motion.span
//                 className="transition-all duration-300"
//                 animate={isTransitioning ? { opacity: [1, 0.3, 1] } : {}}
//                 transition={{
//                   duration: 0.5,
//                   repeat: isTransitioning ? Infinity : 0,
//                 }}
//               >
//                 {getNextCategory()}
//               </motion.span>
//               <motion.div
//                 animate={isTransitioning ? { rotate: 360 } : { rotate: 0 }}
//                 transition={{
//                   duration: 0.5,
//                   repeat: isTransitioning ? Infinity : 0,
//                 }}
//               >
//                 <ChevronRight className="size-8" />
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {loading && products.length > 0 && (
//           <motion.div
//             className="grid grid-cols-3 md:gap-6 gap-3 md:px-10 px-4"
//             initial={{ opacity: 0, filter: "blur(5px)" }}
//             animate={{ opacity: 1, filter: "blur(0px)" }}
//             exit={{ opacity: 0, filter: "blur(5px)" }}
//           >
//             {Array.from({ length: 2 }).map((_, index) => (
//               <motion.div
//                 key={index}
//                 className="space-y-2 animate-pulse"
//                 initial={{ opacity: 0, filter: "blur(3px)" }}
//                 animate={{ opacity: 1, filter: "blur(0px)" }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <div className="md:h-90 h-86 bg-muted/20 rounded"></div>
//                 <div className="h-4 bg-muted/20 rounded w-3/4"></div>
//                 <div className="h-4 bg-muted/20 rounded w-16"></div>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// components/ProductGrid.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { useProductStore } from "@/store/productStore";
import { ChevronRight, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  priceRange?: [number, number];
  availability?: string;
  onCategoryChange?: (category: string) => void;
  onClose?: () => void;
}

export function ProductGrid({
  searchQuery = "",
  selectedCategory = "",
  onCategoryChange,
}: ProductGridProps) {
  const {
    products,
    loading,
    loadingMore,
    error,
    fetchProducts,
    page: storePage,
    hasMore,
    limit,
    // resetProducts,
  } = useProductStore();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [page, setPage] = useState<number>(1); // local page tracking (1-indexed)
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const categories = ["Literature", "Drinks & Spirits", "Floral", "Home & Lifestyle"];
  const PAGE_SIZE = limit || 18;

  // category helpers (unchanged)
  const getNextCategory = () => {
    if (!selectedCategory) return categories[0];
    const currentIndex = categories.indexOf(selectedCategory);
    return categories[(currentIndex + 1) % categories.length];
  };

  const handleNextCategory = () => {
    if (onCategoryChange) {
      setIsTransitioning(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        const nextCategory = getNextCategory();
        onCategoryChange(nextCategory);
        setTimeout(() => setIsTransitioning(false), 600);
      }, 300);
    }
  };

  // normalize filter helper (same)
  const normalizeCategory = (category: string) => category.toLowerCase().trim().replace(/\s+/g, " ");

  const filteredProducts = products.filter((product) => {
    if (!selectedCategory) return true;
    const productCategory = product.category ? normalizeCategory(product.category) : "";
    const selectedCat = normalizeCategory(selectedCategory);
    return productCategory === selectedCat;
  });

  // fetch page (page defaults to 1). append if page > 1
  const loadPage = useCallback(
    async (p: number) => {
      const append = p > 1;
      await fetchProducts({ category: selectedCategory || undefined, name: searchQuery || undefined, page: p, append });
    },
    [fetchProducts, selectedCategory, searchQuery]
  );

  // initial / filter change effect: reset to page 1 and fetch
  useEffect(() => {
    setPage(1);
    // fetch page 1 (not append)
    loadPage(1).finally(() => setIsInitialLoad(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery, loadPage]);

  // intersection observer to load more
  useEffect(() => {
    if (!hasMore) return;

    // cleanup existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          // load next page
          setPage((prev) => {
            const next = prev + 1;
            loadPage(next);
            return next;
          });
        }
      });
    }, {
      root: null,
      rootMargin: "200px",
      threshold: 0.2,
    });

    const el = lastItemRef.current;
    if (el) observerRef.current.observe(el);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, loadingMore, loading, loadPage]);

  // dev counter/log (optional)
  useEffect(() => {
    // console.info("ProductGrid products:", products.length, "page:", page, "hasMore:", hasMore);
  }, [products.length, page, hasMore]);

  // render states
  if (loading && page === 1) {
    return <ProductGridSkeleton />;
  }

  if (!loading && filteredProducts.length === 0) {
    return (
      <div className="w-full flex items-center justify-center min-h-[20vh] p-20 flex-col text-center">
        <div className="max-w-md w-full space-y-6 pb-20 text-left lg:pl-10 lg:pb-20">
          <div className="space-y-4">
            <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-[Century-Old-Style]">
              No products found
            </h2>
            <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-[Century-Old-Style]">
              Try adjusting your filters or search terms.
            </p>
          </div>
          <div>
            <button
              onClick={() => router.push("/products")}
              className="bg-[#FBD060] text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[15.812rem] h-[2rem] uppercase rounded-[0.25rem] hover:opacity-90 transition-opacity lg:text-[0.75rem] lg:w-[20.812rem] lg:h-[2.5rem]"
            >
              CONTINUE SHOPPING &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCategory}
        initial="initial"
        animate="in"
        exit="out"
        className="space-y-8 w-full font-[Century-Old-Style]"
      >
        {/* Header area (unchanged) */}
        <motion.div className="md:px-6 px-6 mb-15" initial={{ opacity: 0, filter: "blur(5px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.2, duration: 0.5 }}>
          <motion.h2 className="text-[20px] leading-[24px] font-schoolbook-cond font-[400] uppercase text-secondary-foreground" initial={{ opacity: 0, filter: "blur(3px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.3, duration: 0.4 }}>
            {selectedCategory === "" ? "Shop All" : selectedCategory}
          </motion.h2>
          <motion.p className="mt-2 md:text-[1.625rem] text-[1.1rem] lg:w-[55.56rem] text-secondary-foreground font-[100] md:leading-7" initial={{ opacity: 0, filter: "blur(3px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.4, duration: 0.5 }}>
            {selectedCategory === ""
              ? "Refined pieces that bring comfort, character, and an everyday reminder of your quiet generosity."
              : selectedCategory === "Literature"
              ? "The Luxe Bureau offers a curated selection of literature, from timeless classics to contemporary masterpieces, each chosen for its enduring impact and literary significance."
              : selectedCategory === "Drinks & Spirits"
              ? "Thoughtfully curated and artfully presented, our selection of wines and spirits transforms exceptional bottles into extraordinary gestures"
              : selectedCategory === "Floral"
              ? "Explore our exquisite floral arrangements, where each bloom is handpicked to create stunning displays that bring beauty and elegance to any occasion."
              : selectedCategory === "Home & Lifestyle"
              ? "Discover our curated collection of home decor, where each piece is chosen for its unique design and ability to transform your living space into a haven of style and comfort."
              : ""}
          </motion.p>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div variants={{
            hidden: { opacity: 0, filter: "blur(8px)" },
            visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, staggerChildren: 0.1 } },
            exit: { opacity: 0, filter: "blur(8px)", transition: { duration: 0.3 } },
          }} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-2 md:grid-cols-3 gap-y-[12px] md:gap-y-[6px] gap-x-[12px] md:gap-x-1 px-2 md:px-0 w-full max-w-full">
            {filteredProducts.map((product, idx) => {
              const isLast = idx === filteredProducts.length - 1;
              return (
                <motion.div
                  key={product.id}
                  className={`flex ${idx === 0 ? "md:ml-3" : ""} ${idx === filteredProducts.length - 1 ? "md:mr-3" : ""}`}
                >
                  <div ref={isLast ? lastItemRef : undefined} className="w-full">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Next section (unchanged) */}
        <motion.div className="h-[15.75rem] w-full px-10 bg-[rgba(80,70,45,0.19)] flex items-center md:justify-end justify-center" initial={{ opacity: 0, filter: "blur(5px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.6, duration: 0.5 }}>
          <div className="text-foreground">
            <motion.h2 className={`small-text uppercase text-secondary-foreground transition-opacity duration-200 ${isTransitioning ? "animate-pulse" : ""}`} animate={isTransitioning ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 0.3, repeat: isTransitioning ? Infinity : 0 }}>
              Next Section
            </motion.h2>
            <motion.div className={`flex items-center gap-1 text-[2rem] font-[100] cursor-pointer hover:text-[#FBD060] transition-all duration-200 transform hover:scale-105 ${isTransitioning ? "opacity-70" : "opacity-100"}`} onClick={handleNextCategory} whileHover={{ opacity: 0.8 }} whileTap={{ opacity: 0.6 }}>
              <motion.span className="transition-all duration-300" animate={isTransitioning ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 0.5, repeat: isTransitioning ? Infinity : 0 }}>
                {getNextCategory()}
              </motion.span>
              <motion.div animate={isTransitioning ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.5, repeat: isTransitioning ? Infinity : 0 }}>
                <ChevronRight className="size-8" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* loader / placeholders when loading more */}
        {(loadingMore || (loading && products.length > 0)) && (
          <div className="w-full flex items-center justify-center py-6">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin" />
              <span>{loadingMore ? "Loading more products…" : "Loading…"}</span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
