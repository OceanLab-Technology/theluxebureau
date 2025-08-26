// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Edit, Trash } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ProductFormSheet } from "./Forms/ProductFormSheet";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../ui/alert-dialog";

// import { useProductAdminStore } from "@/store/admin/productStore";

// export function ProductsPage() {
//   const { products, loading, fetchProducts, deleteProduct } = useProductAdminStore();
//   const [editingProduct, setEditingProduct] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const handleConfirmDelete = async () => {
//     if (!deleteId) return;
//     await deleteProduct(deleteId);
//     setDeleteId(null);
//   };

//   const renderSkeletonRow = () =>
//     Array.from({ length: 5 }).map((_, i) => (
//       <TableRow key={i}>
//         <TableCell>
//           <Skeleton className="h-12 w-12 rounded-md" />
//         </TableCell>
//         <TableCell>
//           <Skeleton className="h-4 w-24" />
//         </TableCell>
//         <TableCell>
//           <Skeleton className="h-4 w-20" />
//         </TableCell>
//         <TableCell>
//           <Skeleton className="h-4 w-16" />
//         </TableCell>
//         <TableCell>
//           <Skeleton className="h-4 w-12" />
//         </TableCell>
//         <TableCell>
//           <Skeleton className="h-6 w-20 rounded-full" />
//         </TableCell>
//         <TableCell className="text-right">
//           <div className="flex justify-end gap-2">
//             <Skeleton className="h-8 w-8 rounded-md" />
//             <Skeleton className="h-8 w-8 rounded-md" />
//           </div>
//         </TableCell>
//       </TableRow>
//     ));

//   return (
//     <div className="flex flex-col">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-semibold font-[Century-Old-Style]">Products</h1>
//       </header>

//       <div className="flex-1 space-y-6 p-8 pt-6">
//         {/* Page Header */}
//         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight font-[Century-Old-Style]">Products</h2>
//             <p className="text-muted-foreground">Manage your product catalog and inventory</p>
//           </div>
//           <ProductFormSheet />
//         </div>

//         {/* Product Table */}
//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">Image</TableHead>
//                   <TableHead>Product Name</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Stock</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {loading && (!products || products.length === 0)
//                   ? renderSkeletonRow()
//                   : products?.map((product) => (
//                     <TableRow key={product.id} className="hover:bg-muted/20 transition">
//                       <TableCell>
//                         <div className="relative h-12 w-12 overflow-hidden rounded-md border">
//                           <Image
//                             src={product.image_1 || "/product.jpg"}
//                             alt={product.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-medium">{product.name}</TableCell>
//                       <TableCell>{product.category}</TableCell>
//                       <TableCell className="font-medium">€{product.price}</TableCell>
//                       <TableCell>{product.inventory}</TableCell>
//                       <TableCell>
//                         <Badge variant="default">
//                           {product.inventory === 0
//                             ? "Out of Stock"
//                             : product.inventory < 10
//                               ? "Low Stock"
//                               : "In Stock"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           {/* Edit Button */}
//                           <ProductFormSheet
//                             isEdit
//                             productId={product.id}
//                             open={editingProduct === product.id}
//                             onOpenChange={(open) => !open && setEditingProduct(null)}
//                             trigger={
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => setEditingProduct(product.id)}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                             }
//                           />

//                           {/* Delete Button with AlertDialog */}
//                           <AlertDialog
//                             open={deleteId === product.id}
//                             onOpenChange={(open) => !open && setDeleteId(null)}
//                           >
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 aria-label="Delete"
//                                 onClick={() => setDeleteId(product.id)}
//                               >
//                                 <Trash className="h-4 w-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>
//                                   Are you sure you want to delete the product?
//                                 </AlertDialogTitle>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel onClick={() => setDeleteId(null)}>
//                                   Cancel
//                                 </AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={handleConfirmDelete}
//                                   className="bg-destructive text-white"
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



















// =============================   ===============================
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Edit, Trash } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ProductFormSheet } from "./Forms/ProductFormSheet";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../ui/alert-dialog";

// import { useProductAdminStore } from "@/store/admin/productStore";

// export function ProductsPage() {
//   const {
//     products,
//     loading,
//     fetchProducts,
//     deleteProduct,
//     page: storePage,
//     totalPages,
//   } = useProductAdminStore();

//   const [editingProduct, setEditingProduct] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchProducts(currentPage, itemsPerPage);
//   }, [fetchProducts, currentPage]);

//   const handleConfirmDelete = async () => {
//     if (!deleteId) return;
//     await deleteProduct(deleteId);
//     setDeleteId(null);
//     // Refresh current page after delete
//     fetchProducts(currentPage, itemsPerPage);
//   };

//   const renderSkeletonRow = () =>
//     Array.from({ length: 5 }).map((_, i) => (
//       <TableRow key={i}>
//         <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
//         <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//         <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//         <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//         <TableCell><Skeleton className="h-4 w-12" /></TableCell>
//         <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//         <TableCell className="text-right flex justify-end gap-2">
//           <Skeleton className="h-8 w-8 rounded-md" />
//           <Skeleton className="h-8 w-8 rounded-md" />
//         </TableCell>
//       </TableRow>
//     ));

//   return (
//     <div className="flex flex-col">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-semibold font-[Century-Old-Style]">Products</h1>
//       </header>

//       <div className="flex-1 space-y-6 p-8 pt-6">
//         {/* Page Header */}
//         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight font-[Century-Old-Style]">Products</h2>
//             <p className="text-muted-foreground">Manage your product catalog and inventory</p>
//           </div>
//           <ProductFormSheet />
//         </div>

//         {/* Product Table */}
//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">Image</TableHead>
//                   <TableHead>Product Name</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Stock</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {loading && (!products || products.length === 0)
//                   ? renderSkeletonRow()
//                   : products?.map((product) => (
//                     <TableRow key={product.id} className="hover:bg-muted/20 transition">
//                       <TableCell>
//                         <div className="relative h-12 w-12 overflow-hidden rounded-md border">
//                           <Image
//                             src={product.image_1 || "/product.jpg"}
//                             alt={product.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-medium">{product.name}</TableCell>
//                       <TableCell>{product.category}</TableCell>
//                       <TableCell className="font-medium">£{product.price}</TableCell>
//                       <TableCell>{product.inventory}</TableCell>
//                       <TableCell>
//                         <Badge variant="default">
//                           {product.inventory === 0
//                             ? "Out of Stock"
//                             : product.inventory < product.threshold
//                               ? "Low Stock"
//                               : "In Stock"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right flex justify-end gap-2">
//                         <ProductFormSheet
//                           isEdit
//                           productId={product.id}
//                           open={editingProduct === product.id}
//                           onOpenChange={(open) => !open && setEditingProduct(null)}
//                           trigger={
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => setEditingProduct(product.id)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           }
//                         />
//                         <AlertDialog
//                           open={deleteId === product.id}
//                           onOpenChange={(open) => !open && setDeleteId(null)}
//                         >
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               aria-label="Delete"
//                               onClick={() => setDeleteId(product.id)}
//                             >
//                               <Trash className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you sure you want to delete the product?</AlertDialogTitle>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
//                               <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-white">
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>

//             {/* Pagination Controls */}
//             {products && totalPages > 1 && (
//               <div className="flex items-center justify-between px-4 py-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </Button>

//                 <span>Page {currentPage} of {totalPages}</span>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }









"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFormSheet } from "./Forms/ProductFormSheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import { useProductAdminStore } from "@/store/admin/productStore";

/** ---------- Types & utils ---------- */
export type Variant = {
  name: string;
  inventory: number;
  threshold: number;   // ✅ always a number
  qty_blocked: number;
};

function coerceNumber(n: unknown, fallback = 0): number {
  if (typeof n === "number" && !Number.isNaN(n)) return n;
  if (typeof n === "string" && n.trim() !== "" && !Number.isNaN(Number(n))) {
    return Number(n);
  }
  return fallback;
}

function normalizeVariant(v: any): Variant {
  return {
    name: typeof v?.name === "string" && v.name.trim() ? v.name : "default",
    inventory: coerceNumber(v?.inventory, 0),
    threshold: coerceNumber(v?.threshold, 0), // ✅ force numeric
    qty_blocked: coerceNumber(v?.qty_blocked, 0),
  };
}

function asVariants(input: unknown): Variant[] {
  if (Array.isArray(input)) return input.map(normalizeVariant);
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(normalizeVariant);
    } catch {
      /* ignore bad JSON */
    }
  }
  return [];
}

function totalAvailable(variants: Variant[]) {
  return variants.reduce((sum, v) => {
    const avail = Math.max(0, v.inventory - v.qty_blocked);
    return sum + avail;
  }, 0);
}

function totalThreshold(variants: Variant[]) {
  return variants.reduce((sum, v) => sum + v.threshold, 0);
}

function computeStockBadge(variants: Variant[]) {
  const avail = totalAvailable(variants);
  const thrSum = totalThreshold(variants);

  if (avail <= 0) return { label: "Out of Stock", variant: "destructive" as const };
  if (thrSum > 0 && avail <= thrSum)
    return { label: "Low Stock", variant: "secondary" as const };
  return { label: "In Stock", variant: "default" as const };
}

/** ---------- Component ---------- */
export function ProductsPage() {
  const { products, loading, fetchProducts, deleteProduct, totalPages } =
    useProductAdminStore();

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage);
  }, [fetchProducts, currentPage]);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
    fetchProducts(currentPage, itemsPerPage);
  };

  const renderSkeletonRow = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-12 w-12 rounded-md" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-12" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>
        <TableCell className="text-right flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-[Century-Old-Style]">
          Products
        </h1>
      </header>

      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-[Century-Old-Style]">
              Products
            </h2>
            <p className="text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <ProductFormSheet />
        </div>

        {/* Product Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (!products || products.length === 0)
                  ? renderSkeletonRow()
                  : products?.map((product: any) => {
                      // variants is jsonb in DB and follows your shape
                      const variants: Variant[] = asVariants(product.variants);
                      const stock = totalAvailable(variants);
                      const badge = computeStockBadge(variants);

                      return (
                        <TableRow
                          key={product.id}
                          className="hover:bg-muted/20 transition"
                        >
                          <TableCell>
                            <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                              <Image
                                src={product.image_1 || "/product.jpg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="font-medium">
                            £{String(product.price ?? "")}
                          </TableCell>
                          <TableCell>{stock}</TableCell>
                          <TableCell>
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <ProductFormSheet
                              isEdit
                              productId={product.id}
                              open={editingProduct === product.id}
                              onOpenChange={(open) =>
                                !open && setEditingProduct(null)
                              }
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setEditingProduct(product.id)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <AlertDialog
                              open={deleteId === product.id}
                              onOpenChange={(open) =>
                                !open && setDeleteId(null)
                              }
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label="Delete"
                                  onClick={() => setDeleteId(product.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete the product?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setDeleteId(null)}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleConfirmDelete}
                                    className="bg-destructive text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {products && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span>Page {currentPage}</span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
