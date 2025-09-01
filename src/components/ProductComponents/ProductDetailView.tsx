// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { useMainStore } from "@/store/mainStore";
// import { usePersonaliseStore } from "@/store/personaliseStore";
// import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { LoginRequiredModal } from "@/components/ui/login-required-modal";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { ProductRecommendations } from "./ProductRecommendations";
// import { PersonaliseSheet } from "../PersonaliseComponents/PersonaliseSheet";

// interface ProductDetailViewProps {
//   productId: string;
// }

// export function ProductDetailView({ productId }: ProductDetailViewProps) {
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [user, setUser] = useState<any>(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [touchStartX, setTouchStartX] = useState(0);
//   const [isSwiping, setIsSwiping] = useState(false);
//   const { currentProduct, detailedProductLoading, fetchProductById } =
//     useMainStore();
//   const { setSelectedProduct, resetCheckout } = usePersonaliseStore();
//   const router = useRouter();
//   const supabase = createClient();
//   const imageContainerRef = useRef<HTMLDivElement>(null);

//   const images = [
//     currentProduct?.image_1,
//     currentProduct?.image_2,
//     currentProduct?.image_3,
//     currentProduct?.image_4,
//   ].filter(Boolean);

//   useEffect(() => {
//     fetchProductById(productId);
//   }, [productId, fetchProductById]);

//   // Check authentication state
//   useEffect(() => {
//     const getUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUser(user);
//     };

//     getUser();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, [supabase.auth]);

//   const handleImageChange = (index: number) => {
//     if (index !== selectedImageIndex) {
//       setSelectedImageIndex(index);
//     }
//   };

//   const handleNextImage = () => {
//     if (selectedImageIndex < images.length - 1) {
//       setSelectedImageIndex(selectedImageIndex + 1);
//     }
//   };

//   const handlePrevImage = () => {
//     if (selectedImageIndex > 0) {
//       setSelectedImageIndex(selectedImageIndex - 1);
//     }
//   };

//   const handlePersonalise = () => {
//     // Check if user is authenticated
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     if (currentProduct) {
//       resetCheckout();
//       setSelectedProduct(currentProduct);
//       router.push(`/personalise?productId=${currentProduct.id}`);
//     }
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStartX(e.touches[0].clientX);
//     setIsSwiping(true);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!isSwiping) return;

//     const touchEndX = e.touches[0].clientX;
//     const diff = touchStartX - touchEndX;

//     // Only change image if swipe is significant
//     if (Math.abs(diff) > 50) {
//       if (diff > 0) {
//         handleNextImage();
//       } else {
//         handlePrevImage();
//       }
//       setIsSwiping(false);
//     }
//   };

//   const handleTouchEnd = () => {
//     setIsSwiping(false);
//   };

//   const handleWheel = (e: React.WheelEvent) => {
//     e.preventDefault();

//     if (e.deltaX > 30) {
//       handleNextImage();
//     } else if (e.deltaX < -30) {
//       handlePrevImage();
//     }
//   };

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowRight') {
//         handleNextImage();
//       } else if (e.key === 'ArrowLeft') {
//         handlePrevImage();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedImageIndex, images.length]);

//   if (detailedProductLoading) {
//     return <ProductDetailSkeleton />;
//   }

//   if (!currentProduct) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
//         <Link href="/products">
//           <Button variant="outline">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Products
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   const availability = currentProduct.inventory == null ? "in-stock" : "sold-out";
//   // const availability = currentProduct.inventory > 0 ? "in-stock" : "sold-out";

//   return (
//     <div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6 overflow-hidden pt-8 font-[Century-Old-Style]">
//         <div className="space-y-4">
//           <div
//             ref={imageContainerRef}
//             className="lg:w-full lg:h-[60%] relative h-[30.5rem] bg-muted/20 overflow-hidden"
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//             onWheel={handleWheel}
//           >
//             <AnimatePresence mode="wait" initial={false}>
//               <motion.img
//                 key={selectedImageIndex}
//                 src={images[selectedImageIndex] || currentProduct.image_1!}
//                 alt={currentProduct.name}
//                 className="h-full w-full object-cover object-center"
//                 initial={{ opacity: 0, x: selectedImageIndex > 0 ? 100 : -100 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: selectedImageIndex > 0 ? -100 : 100 }}
//                 transition={{ duration: 0.3, ease: "easeInOut" }}
//               />
//             </AnimatePresence>

//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//               {Array.from({ length: images.length }).map((_, index) => (
//                 <motion.span
//                   key={index}
//                   className={`h-2 w-2 rounded-full inline-block cursor-pointer ${selectedImageIndex === index
//                     ? "bg-[#FBD060]"
//                     : "bg-background/50"
//                     }`}
//                   onClick={() => handleImageChange(index)}
//                   whileHover={{ scale: 1.2 }}
//                   whileTap={{ scale: 0.9 }}
//                   animate={
//                     selectedImageIndex === index ? { scale: [1, 1.2, 1] } : {}
//                   }
//                   transition={{ duration: 0.3 }}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-5 gap-2 px-4">
//             {images.map((imageUrl, index) => (
//               <motion.button
//                 key={index}
//                 onClick={() => handleImageChange(index)}
//                 className={`md:h-[10.375rem] md:w-[8.25rem] lg:w-full lg:h-full bg-muted/20 overflow-hidden border-2 transition-all ${selectedImageIndex === index
//                   ? "border-yellow-500"
//                   : "border-transparent"
//                   }`}
//                 animate={
//                   selectedImageIndex === index
//                     ? {
//                       borderColor: ["#eab308", "#fbbf24", "#eab308"],
//                       transition: { duration: 0.5 },
//                     }
//                     : {
//                       borderColor: "transparent",
//                     }
//                 }
//               >
//                 <img
//                   src={imageUrl}
//                   alt={`${currentProduct.name} ${index + 1}`}
//                   className="h-full w-full object-contain"
//                 />
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-6 py-10 lg:px-4 px-6">
//           <div className="md:w-96">
//             <div className="small-text gap-2 mb-2 text-stone-600 uppercase">
//               <span>{currentProduct.category}</span>
//             </div>

//             <h1 className="text-[2rem] leading-none text-secondary-foreground font-medium">
//               {currentProduct.name}
//             </h1>
//             <span className="text-[2rem] font-medium">
//               £{currentProduct.price}
//             </span>
//           </div>

//           <p className="text-[20px] leading-[30px] font-[400]">
//             {currentProduct.description}
//           </p>


//           <div className="md:mt-4">
//             {availability === "sold-out" ? (
//               <Button
//                 size={"lg"}
//                 disabled
//                 variant="box_yellow"
//                 className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase"
//               >
//                 Sold Out
//               </Button>
//             ) : (
//               <PersonaliseSheet
//                 handleOnClick={() => {
//                   resetCheckout();
//                   setSelectedProduct(currentProduct);

//                   //     resetCheckout();
// //     const payload = hasVariants ? { ...currentProduct, selectedVariant } : currentProduct;
// //     setSelectedProduct(payload);

//                 }}
//               />
//             )}
//           </div>

//           {currentProduct.tags && currentProduct.tags.length > 0 && (
//             <div>
//               <h3 className="font-medium mb-2">Tags:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {currentProduct.tags.map((tag, index) => (
//                   <Badge key={index} variant="secondary">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(currentProduct.why_we_chose_it ||
//             currentProduct.about_the_maker ||
//             currentProduct.particulars) && (
//               <div className="mt-20">
//                 <Accordion type="single" collapsible className="">
//                   {currentProduct.why_we_chose_it && (
//                     <AccordionItem value="why-we-chose-it">
//                       <AccordionTrigger className="text-left small-text font-medium uppercase">
//                         Why We Chose It
//                       </AccordionTrigger>
//                       <AccordionContent>
//                         <p className="text-muted-foreground leading-relaxed font-[Marfa]">
//                           {currentProduct.why_we_chose_it}
//                         </p>
//                       </AccordionContent>
//                     </AccordionItem>
//                   )}

//                   {currentProduct.about_the_maker && (
//                     <AccordionItem value="about-the-maker">
//                       <AccordionTrigger className="text-left font-medium uppercase small-text">
//                         About the Maker
//                       </AccordionTrigger>
//                       <AccordionContent>
//                         <p className="text-muted-foreground leading-relaxed font-[Marfa]">
//                           {currentProduct.about_the_maker}
//                         </p>
//                       </AccordionContent>
//                     </AccordionItem>
//                   )}

//                   {currentProduct.particulars && (
//                     <AccordionItem value="particulars">
//                       <AccordionTrigger className="text-left font-medium uppercase small-text">
//                         Particulars
//                       </AccordionTrigger>
//                       <AccordionContent>
//                         {/* <p className="text-muted-foreground leading-relaxed font-[Marfa]">
//                           {currentProduct.particulars}
//                         </p> */}
//                         <div>
//                           {currentProduct.particulars?.split(",").map((item, idx) => (
//                             <p
//                               key={idx}
//                               className="text-muted-foreground leading-relaxed font-[Marfa] flex"
//                             >
//                               <span className="font-bold mr-2">•</span>
//                               <span>{item.trim()}</span>
//                             </p>
//                           ))}
//                         </div>

//                       </AccordionContent>
//                     </AccordionItem>
//                   )}
//                 </Accordion>
//               </div>
//             )}
//         </div>
//       </div>
//       <div className="md:flex hidden justify-end flex-col items-end px-10">
//         <p className="text-[1.5rem] w-110 font-[Century-Old-Style] text-right leading-[1.875rem] font-[400] text-secondary-foreground">
//           "The meaning of life is to find your gift. The purpose of life is to
//           give it away."
//         </p>
//         <span className="small-text pt-2">PABLO PICASSO</span>
//       </div>
//       <ProductRecommendations currentProductId={currentProduct.id!} />

//       {/* Login Required Modal */}
//       <LoginRequiredModal
//         isOpen={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         feature="personalization"
//       />
//     </div>
//   );
// }










"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useMainStore } from "@/store/mainStore";
import { usePersonaliseStore } from "@/store/personaliseStore";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductRecommendations } from "./ProductRecommendations";
import { PersonaliseSheet } from "../PersonaliseComponents/PersonaliseSheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDetailViewProps {
  productId: string;
}

type Variant = {
  name: string;
  inventory: number;
  threshold: number | boolean;
  qty_blocked: number;
};

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  // ---- hooks (keep ALL hooks before any early returns) ----
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [selectedVariantName, setSelectedVariantName] = useState<string | null>(null);

  const { currentProduct, detailedProductLoading, fetchProductById } = useMainStore();
  const { setSelectedProduct, resetCheckout } = usePersonaliseStore();
  const router = useRouter();
  const supabase = createClient();
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // =========================
  // VARIANT UTILS (no hooks)
  // =========================
  function normalizeVariants(raw: unknown): Variant[] {
    try {
      if (Array.isArray(raw)) return raw as Variant[];
      if (typeof raw === "string" && raw.trim()) {
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? (parsed as Variant[]) : [];
      }
    } catch {
      // swallow parse errors and fall through
    }
    return [];
  }

  function getProductVariants(product: any): Variant[] {
    // Check new format first (product_variants relation)
    if (Array.isArray(product?.product_variants)) {
      return normalizeVariants(product.product_variants);
    }
    // Fallback to old format (variants JSONB field)
    if (product?.variants) {
      return normalizeVariants(product.variants);
    }
    // Default fallback
    return [];
  }

  // ---- fetch product ----
  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  // ---- auth state ----
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // ---- auto-select single variant (KEEP ABOVE EARLY RETURNS) ----
  useEffect(() => {
    const parsed = getProductVariants(currentProduct);
    if (parsed.length === 1) {
      setSelectedVariantName(parsed[0].name);
    }
  }, [currentProduct]);

  // ---- images (no hooks) ----
  const images = [
    currentProduct?.image_1,
    currentProduct?.image_2,
    currentProduct?.image_3,
    currentProduct?.image_4,
  ].filter(Boolean) as string[];

  // ---- gallery handlers (no hooks) ----
  const handleImageChange = (index: number) => {
    if (index !== selectedImageIndex) setSelectedImageIndex(index);
  };
  const handleNextImage = () => {
    if (selectedImageIndex < images.length - 1) setSelectedImageIndex((i) => i + 1);
  };
  const handlePrevImage = () => {
    if (selectedImageIndex > 0) setSelectedImageIndex((i) => i - 1);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = touchStartX - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNextImage() : handlePrevImage();
      setIsSwiping(false);
    }
  };
  const handleTouchEnd = () => setIsSwiping(false);
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaX > 30) handleNextImage();
    else if (e.deltaX < -30) handlePrevImage();
  };

  // ---- early returns (AFTER all hooks) ----
  if (detailedProductLoading) return <ProductDetailSkeleton />;
  if (!currentProduct) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  // =========================
  // VARIANT + STOCK LOGIC
  // =========================
  const variants: Variant[] = getProductVariants(currentProduct);
  const hasVariants = variants.length > 0;

  const calcAvailableStock = (v: Variant) =>
    (v?.inventory ?? 0) - (v?.qty_blocked ?? 0);

  const isVariantInStock = (v: Variant) => calcAvailableStock(v) > 0;

  const anyInStock = variants.some(isVariantInStock);

  const selectedVariant: Variant | null =
    hasVariants && selectedVariantName
      ? variants.find((v) => v.name === selectedVariantName) ?? null
      : null;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6 overflow-hidden pt-8 font-[Century-Old-Style]">
        <div className="space-y-4">
          <div
            ref={imageContainerRef}
            className="lg:w-full lg:h-[60%] relative h-[30.5rem] bg-muted/20 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={selectedImageIndex}
                src={images[selectedImageIndex] || currentProduct.image_1!}
                alt={currentProduct.name}
                className="h-full w-full object-cover object-center"
                initial={{ opacity: 0, x: selectedImageIndex > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: selectedImageIndex > 0 ? -100 : 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {Array.from({ length: images.length }).map((_, index) => (
                <motion.span
                  key={index}
                  className={`h-2 w-2 rounded-full inline-block cursor-pointer ${selectedImageIndex === index ? "bg-[#FBD060]" : "bg-background/50"
                    }`}
                  onClick={() => handleImageChange(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={selectedImageIndex === index ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 px-4">
            {images.map((imageUrl, index) => (
              <motion.button
                key={index}
                onClick={() => handleImageChange(index)}
                className={`md:h-[10.375rem] md:w-[8.25rem] lg:w-full lg:h-full bg-muted/20 overflow-hidden border-2 transition-all ${selectedImageIndex === index ? "border-yellow-500" : "border-transparent"
                  }`}
                animate={
                  selectedImageIndex === index
                    ? {
                      borderColor: ["#eab308", "#fbbf24", "#eab308"],
                      transition: { duration: 0.5 },
                    }
                    : { borderColor: "transparent" }
                }
              >
                <img
                  src={imageUrl}
                  alt={`${currentProduct.name} ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:py-40 py-10 lg:px-30 px-6">
          <div className="md:w-96">
            <div className="small-text gap-2 mb-2 text-stone-600 uppercase">
              <span>{currentProduct.category}</span>
            </div>

            <h1 className="text-[2rem] py-4 leading-none text-secondary-foreground font-medium">
              {currentProduct.name}
            </h1>
            <h1 className="text-[1.5rem] leading-none text-secondary-foreground font-medium">
              {currentProduct.item}
            </h1>
            <span className="text-[1.5rem] font-medium">£{currentProduct.price}</span>
            <p className="small-text font-medium md:mb-16 mt-4 uppercase">
              {currentProduct.female_founded && "Female Founded"}
            </p>
          </div>

          <p className="text-[1rem] leading-[30px] font-[400]">
            {currentProduct.description}
          </p>

          {/* {hasVariants && variants.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="small-text uppercase text-stone-600">Options</span>
              <Select
                value={selectedVariantName ?? undefined}
                onValueChange={(value) => setSelectedVariantName(value)}
              >
                <SelectTrigger className="w-[200px] h-9 border-stone-300 bg-transparent rounded-[0.3rem] px-2">
                  <SelectValue placeholder="Select option" />
                  <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                </SelectTrigger>
                <SelectContent className="rounded-[0.3rem]">
                  {variants.map((v) => {
                    const inStock = isVariantInStock(v);
                    return (
                      <SelectItem key={v.name} value={v.name} disabled={!inStock}>
                        {v.name}
                        {!inStock ? " — Out of stock" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )} */}

          {/* ====== personalise / SOLD-OUT BUTTON (variant-aware) ====== */}
          {/* <div className="md:mt-4">
            {!anyInStock ? (
              <Button
                size="lg"
                disabled
                variant="box_yellow"
                className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase"
              >
                Sold Out
              </Button>
            ) : hasVariants ? (
              // if only one variant, it's auto-selected via effect; else user selects
              selectedVariant ? (
                isVariantInStock(selectedVariant) ? (
                  <PersonaliseSheet handleOnClick={handlePersonalise} />
                ) : (
                  <Button
                    size="lg"
                    disabled
                    variant="box_yellow"
                    className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase"
                  >
                    Sold Out
                  </Button>
                )
              ) : (
                // multiple variants but not selected yet
                <Button
                  size="lg"
                  disabled
                  variant="box_yellow"
                  className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase"
                  title="Select options to personalise"
                >
                  personalise
                </Button>
              )
            ) : (
              // edge: if ever no variants exist at all, treat as sold out (stock is variant-based)
              <Button
                size="lg"
                disabled
                variant="box_yellow"
                className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase"
              >
                Sold Out
              </Button>
            )}
          </div> */}

          {/* ====== VARIANT + BUTTON ====== */}
          {hasVariants && variants.length > 1 ? (
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <div className="flex items-center gap-3">
                <Select
                  value={selectedVariantName ?? undefined}
                  onValueChange={(value) => setSelectedVariantName(value)}
                >
                  <SelectTrigger className="capitalize w-[200px] h-9 border-stone-300">
                    <SelectValue placeholder="Select" />
                    <ChevronDown className="ml-auto h-4 w-4 opacity-100" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[0.25rem]">
                    {variants.map((v) => {
                      const inStock = isVariantInStock(v);
                      return (
                        <SelectItem key={v.name} value={v.name} disabled={!inStock} className="capitalize small-text">
                          {v.name}
                          {!inStock ? " — Out of stock" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* ====== BUTTON (responsive position) ====== */}
              <div className="mt-3 md:mt-0">
                {!anyInStock ? (
                  <Button
                    disabled
                    className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase rounded-[0.25rem] bg-[#FDCF5F] text-stone-700 hover:bg-[#FDCF5F]/80"
                  >
                    Sold Out
                  </Button>
                ) : hasVariants ? (
                  selectedVariant ? (
                    isVariantInStock(selectedVariant) ? (
                      <PersonaliseSheet handleOnClick={() => {
                        resetCheckout();
                        const payload = hasVariants ? { ...currentProduct, selectedVariant: selectedVariant.name } : currentProduct;
                        setSelectedProduct(payload);
                        console.log(payload);
                      }} />
                    ) : (
                      <Button
                        disabled
                        className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] text-stone-700 uppercase rounded-[0.25rem] bg-[#FDCF5F] hover:bg-[#FDCF5F]/80"
                      >
                        Sold Out
                      </Button>
                    )
                  ) : (
                    <Button
                      disabled
                      className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase rounded-[0.25rem] bg-[#FDCF5F] hover:bg-[#FDCF5F]/80"
                      title="Select options to personalise"
                    >
                      personalise
                    </Button>
                  )
                ) : (
                  <Button
                    disabled
                    className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase text-stone-700 rounded-[0.25rem] bg-[#FDCF5F] hover:bg-[#FDCF5F]/80"
                  >
                    Sold Out
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // if only 1 variant or no variants (button only)
            <div className="md:mt-4">
              {!anyInStock ? (
                <Button
                  disabled
                  className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem] uppercase rounded-[0.25rem] bg-[#FDCF5F] text-stone-700 hover:bg-[#FDCF5F]/80"
                >
                  Sold Out
                </Button>
              ) : (
                selectedVariant &&
                isVariantInStock(selectedVariant) && (
                  <PersonaliseSheet handleOnClick={() => {
                    resetCheckout();
                    const payload = hasVariants ? { ...currentProduct, selectedVariant: selectedVariant.name } : currentProduct;
                    setSelectedProduct(payload);
                  }} />
                )
              )}
            </div>
          )}


          {currentProduct.tags && currentProduct.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {currentProduct.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(currentProduct.why_we_chose_it ||
            currentProduct.about_the_maker ||
            currentProduct.particulars) && (
              <div className="mt-20">
                <Accordion type="single" collapsible className="">
                  {currentProduct.why_we_chose_it && (
                    <AccordionItem value="why-we-chose-it">
                      <AccordionTrigger className="text-left small-text font-medium uppercase">
                        Who It's For
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed font-[Marfa]">
                          {currentProduct.why_we_chose_it}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {currentProduct.about_the_maker && (
                    <AccordionItem value="about-the-maker">
                      <AccordionTrigger className="text-left font-medium uppercase small-text">
                        About the Maker
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed font-[Marfa]">
                          {currentProduct.about_the_maker}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {currentProduct.particulars && (
                    <AccordionItem value="particulars">
                      <AccordionTrigger className="text-left font-medium uppercase small-text">
                        Particulars
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          {currentProduct.particulars
                            ?.split(",")
                            .map((item: string, idx: number) => (
                              <p
                                key={idx}
                                className="text-muted-foreground leading-relaxed font-[Marfa] flex"
                              >
                                <span className="font-bold mr-2">•</span>
                                <span>{item.trim()}</span>
                              </p>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            )}
        </div>
      </div>

      <div className="md:flex hidden justify-end flex-col items-end px-10">
        <p className="text-[1.5rem] w-110 font-[Century-Old-Style] text-right leading-[1.875rem] font-[400] text-secondary-foreground">
          "The meaning of life is to find your gift. The purpose of life is to
          give it away."
        </p>
        <span className="small-text pt-2">PABLO PICASSO</span>
      </div>

          <ProductRecommendations currentProductId={currentProduct.id!} />

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="personalization"
      />
    </div>
  );
}