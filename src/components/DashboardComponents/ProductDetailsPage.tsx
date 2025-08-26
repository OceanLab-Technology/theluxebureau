// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ArrowLeft, Package, ImageIcon } from "lucide-react";
// import { useProductAdminStore } from "@/store/admin/productStore";
// import { useRouter } from "next/navigation";

// interface ProductDetailsPageProps {
//   productId: string;
// }

// function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
//   const {
//     selectedProduct,
//     loading,
//     error,
//     fetchProductById,
//     updateProduct,
//     deleteProduct,
//   } = useProductAdminStore();
//   const router = useRouter();
//   const [isDeleting, setIsDeleting] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     inventory: "",
//     category: "",
//     slug: "",
//     image_1: "",
//     image_2: "",
//     image_3: "",
//     image_4: "",
//     image_5: "",
//   });

//   const [hasChanges, setHasChanges] = useState(false);

//   useEffect(() => {
//     if (productId) {
//       fetchProductById(productId);
//     }
//   }, [productId, fetchProductById]);

//   useEffect(() => {
//     if (selectedProduct) {
//       setFormData({
//         name: selectedProduct.name || "",
//         description: selectedProduct.description || "",
//         price: selectedProduct.price?.toString() || "",
//         inventory: selectedProduct.inventory?.toString() || "",
//         category: selectedProduct.category || "",
//         slug: selectedProduct.slug || "",
//         image_1: selectedProduct.image_1 || "",
//         image_2: selectedProduct.image_2 || "",
//         image_3: selectedProduct.image_3 || "",
//         image_4: selectedProduct.image_4 || "",
//         image_5: selectedProduct.image_5 || "",
//       });
//       setHasChanges(false);
//     }
//   }, [selectedProduct]);

//   const handleFieldChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => {
//       const updated = { ...prev, [field]: value };
//       const changed = Object.entries(updated).some(
//         ([key, val]) =>
//           val !==
//           (selectedProduct?.[key as keyof typeof formData]?.toString() || "")
//       );
//       setHasChanges(changed);
//       return updated;
//     });
//   };

//   const handleSave = async () => {
//     if (!selectedProduct || !hasChanges) return;

//     try {
//       await updateProduct(selectedProduct.id, {
//         ...formData,
//         price: parseFloat(formData.price) || 0,
//         inventory: parseInt(formData.inventory) || 0,
//       });
//       setHasChanges(false);
//     } catch (error) {
//       console.error("Failed to save product:", error);
//     }
//   };

//   const handleUpload = async (file: File, field: keyof typeof formData) => {
//     if (!selectedProduct?.id) return;

//     try {
//       const form = new FormData();
//       form.append("image_" + field.split("_")[1], file);

//       const updated = await updateProduct(selectedProduct.id, form);
//       if (updated?.[field]) {
//         handleFieldChange(field, String(updated[field]));
//       }
//     } catch (error) {
//       console.error("Failed to upload image:", error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedProduct?.id) return;

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this product?"
//     );
//     if (!confirmed) return;

//     try {
//       setIsDeleting(true);
//       await deleteProduct(selectedProduct.id);
//       router.push("/admin/products");
//     } catch (error) {
//       console.error("Failed to delete product:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const renderInput = (
//     label: string,
//     field: keyof typeof formData,
//     type: "text" | "number" = "text"
//   ) => (
//     <div className="space-y-1.5">
//       <Label>{label}</Label>
//       <Input
//         type={type}
//         value={formData[field]}
//         onChange={(e) => handleFieldChange(field, e.target.value)}
//       />
//     </div>
//   );

//   const renderImages = () => {
//     return [1, 2, 3, 4, 5].map((i) => {
//       const field = `image_${i}` as keyof typeof formData;
//       const src = formData[field];

//       return (
//         <div
//           key={field}
//           className="flex items-start gap-4 rounded-md border p-3 bg-white shadow-sm"
//         >
//           <div className="relative w-32 h-20 border rounded-md bg-muted overflow-hidden">
//             {src ? (
//               <Image
//                 src={src}
//                 alt={`Image ${i}`}
//                 fill
//                 className="object-cover"
//                 sizes="128px"
//               />
//             ) : (
//               <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
//                 No image
//               </span>
//             )}
//             {src && (
//               <button
//                 type="button"
//                 onClick={() => handleFieldChange(field, "")}
//                 className="absolute top-1 right-1 z-10 rounded-md bg-red-500 text-white px-1 text-xs hover:bg-red-600"
//                 title="Remove image"
//               >
//                 ×
//               </button>
//             )}
//           </div>

//           <div className="flex-1 space-y-2">
//             <Label>Image {i}</Label>
//             <Input
//               type="text"
//               placeholder="Image URL"
//               value={formData[field]}
//               onChange={(e) => handleFieldChange(field, e.target.value)}
//             />
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) handleUpload(file, field);
//               }}
//             />
//           </div>
//         </div>
//       );
//     });
//   };

//   if (loading || !selectedProduct) {
//     return (
//       <div className="flex flex-col font-[Century-Old-Style] min-h-screen bg-muted/50">
//         <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
//           <SidebarTrigger className="-ml-1" />
//           <h1 className="text-lg font-[200]">Product Details</h1>
//           <Skeleton className="h-6 w-24" />
//         </header>

//         <main className="flex-1 p-8 space-y-6">
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-9 w-32" />
//           </div>

//           {/* Product Info Skeleton */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-5 w-5" />
//                 <Skeleton className="h-5 w-40" />
//               </div>
//             </CardHeader>
//             <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="space-y-1.5">
//                   <Skeleton className="h-4 w-24" />
//                   <Skeleton className="h-10 w-full" />
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Product Images Skeleton */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-5 w-5" />
//                 <Skeleton className="h-5 w-40" />
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="flex items-start gap-4 rounded-md border p-3 bg-white shadow-sm"
//                 >
//                   <Skeleton className="h-20 w-32 rounded-md" />
//                   <div className="flex-1 space-y-2">
//                     <Skeleton className="h-4 w-16" />
//                     <Skeleton className="h-10 w-full" />
//                     <Skeleton className="h-10 w-full" />
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           <div className="flex justify-end gap-2">
//             <Skeleton className="h-10 w-24" />
//             <Skeleton className="h-10 w-24" />
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

//   return (
//     <div className="flex flex-col font-[Century-Old-Style] min-h-screen bg-muted/50">
//       <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200]">Product Details</h1>
//         <Badge variant="outline" className="ml-2">
//           {selectedProduct.category}
//         </Badge>
//       </header>

//       <main className="flex-1 p-8 space-y-6">
//         <Button asChild variant="ghost" size="sm">
//           <Link href="/admin/products">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Products
//           </Link>
//         </Button>

//         {/* Product Info */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               <CardTitle>Product Information</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
//             {renderInput("Name", "name")}
//             {renderInput("Category", "category")}
//             {renderInput("Price (£)", "price", "number")}
//             {renderInput("Inventory", "inventory", "number")}
//             {renderInput("Slug", "slug")}
//             {renderInput("Description", "description")}
//           </CardContent>
//         </Card>

//         {/* Product Images */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <ImageIcon className="h-5 w-5" />
//               <CardTitle>Product Images</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">{renderImages()}</CardContent>
//         </Card>

//         <div className="flex justify-end gap-2">
//           <Button
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={isDeleting}
//           >
//             {isDeleting ? "Deleting..." : "Delete"}
//           </Button>
//           <Button onClick={handleSave} disabled={!hasChanges}>
//             Save
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default ProductDetailsPage;


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Package,
  ImageIcon,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { useProductAdminStore } from "@/store/admin/productStore";
import { useRouter } from "next/navigation";

interface ProductDetailsPageProps {
  productId: string;
}

type Variant = {
  name: string;
  inventory: number;
  threshold: number;
  qty_blocked: number;
};

function n(x: unknown, fallback = 0): number {
  if (typeof x === "number" && !Number.isNaN(x)) return x;
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x)))
    return Number(x);
  return fallback;
}

function normVariant(v: any): Variant {
  return {
    name: typeof v?.name === "string" && v.name.trim() ? v.name : "default",
    inventory: n(v?.inventory),
    threshold: n(v?.threshold),
    qty_blocked: n(v?.qty_blocked),
  };
}

function asVariants(input: unknown): Variant[] {
  if (Array.isArray(input)) return input.map(normVariant);
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(normVariant);
    } catch {}
  }
  return [{ name: "default", inventory: 0, threshold: 0, qty_blocked: 0 }];
}

function totalAvailable(variants: Variant[]) {
  return variants.reduce(
    (sum, v) => sum + Math.max(0, n(v.inventory) - n(v.qty_blocked)),
    0
  );
}

function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
    updateProduct,
    deleteProduct,
    // we'll also use all products for related picker
    products,
    fetchProducts,
  } = useProductAdminStore();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // base product fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    slug: "",
    image_1: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
  });

  // variants + related products
  const [variants, setVariants] = useState<Variant[]>([
    { name: "default", inventory: 0, threshold: 0, qty_blocked: 0 },
  ]);
  const [relatedIds, setRelatedIds] = useState<string[]>([]);
  const [relatedQuery, setRelatedQuery] = useState("");

  const [hasChanges, setHasChanges] = useState(false);

  // fetch selected + list for related search
  useEffect(() => {
    if (productId) fetchProductById(productId);
  }, [productId, fetchProductById]);

  useEffect(() => {
    // pull a few pages of products for the selector; tune as needed
    fetchProducts(1, 200);
  }, [fetchProducts]);

  useEffect(() => {
    if (!selectedProduct) return;
    setFormData({
      name: selectedProduct.name || "",
      description: selectedProduct.description || "",
      price: String(selectedProduct.price ?? ""),
      category: selectedProduct.category || "",
      slug: selectedProduct.slug || "",
      image_1: selectedProduct.image_1 || "",
      image_2: selectedProduct.image_2 || "",
      image_3: selectedProduct.image_3 || "",
      image_4: selectedProduct.image_4 || "",
      image_5: selectedProduct.image_5 || "",
    });
    setVariants(asVariants((selectedProduct as any).variants));
    setHasChanges(false);
  }, [selectedProduct]);

  // ----- helpers -----
  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      diffTouch(updated, variants, relatedIds);
      return updated;
    });
  };

  const diffTouch = (
    fd = formData,
    vs = variants,
    rel = relatedIds
  ) => {
    const baseChanged = Object.entries(fd).some(([k, v]) => {
      const original =
        (selectedProduct?.[k as keyof typeof formData] as any) ?? "";
      return String(v ?? "") !== String(original ?? "");
    });
    const variantsChanged =
      JSON.stringify(vs) !==
      JSON.stringify(asVariants((selectedProduct as any)?.variants));
    setHasChanges(baseChanged || variantsChanged);
  };

  const handleSave = async () => {
    if (!selectedProduct || !hasChanges) return;
    try {
      await updateProduct(selectedProduct.id, {
        ...formData,
        price: n(formData.price, 0),
        variants, // jsonb in DB
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleUpload = async (file: File, field: keyof typeof formData) => {
    if (!selectedProduct?.id) return;
    try {
      const form = new FormData();
      form.append("image_" + field.split("_")[1], file);
      const updated = await updateProduct(selectedProduct.id, form);
      if (updated?.[field]) setField(field, String(updated[field]));
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct?.id) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setIsDeleting(true);
      await deleteProduct(selectedProduct.id);
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ----- Variants Editor -----
  const addVariant = () => {
    const v = { name: "", inventory: 0, threshold: 0, qty_blocked: 0 };
    const next = [...variants, v];
    setVariants(next);
    diffTouch(formData, next, relatedIds);
  };

  const updateVariant = <K extends keyof Variant>(
    idx: number,
    key: K,
    value: string
  ) => {
    const next = variants.map((v, i) =>
      i === idx
        ? {
            ...v,
            [key]:
              key === "name" ? value : n(value),
          }
        : v
    );
    setVariants(next);
    diffTouch(formData, next, relatedIds);
  };

  const removeVariant = (idx: number) => {
    const next = variants.filter((_, i) => i !== idx);
    setVariants(next.length ? next : [{ name: "default", inventory: 0, threshold: 0, qty_blocked: 0 }]);
    diffTouch(formData, next, relatedIds);
  };

  const totalStock = useMemo(() => totalAvailable(variants), [variants]);

  // ----- Related Products -----
  const relatedOptions = useMemo(() => {
    const q = relatedQuery.trim().toLowerCase();
    const base = (products ?? []).filter(
      (p: any) => p.id !== selectedProduct?.id
    );
    if (!q) return base.slice(0, 20);
    return base.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        String(p.category ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [products, relatedQuery, selectedProduct?.id]);

  const toggleRelated = (id: string) => {
    const next = relatedIds.includes(id)
      ? relatedIds.filter((x) => x !== id)
      : [...relatedIds, id];
    setRelatedIds(next);
    diffTouch(formData, variants, next);
  };

  // ----- Images UI -----
  const renderImages = () =>
    [1, 2, 3, 4, 5].map((i) => {
      const field = `image_${i}` as keyof typeof formData;
      const src = formData[field];
      return (
        <div
          key={field}
          className="flex items-start gap-4 rounded-md border p-3 bg-white shadow-sm"
        >
          <div className="relative w-32 h-20 border rounded-md bg-muted overflow-hidden">
            {src ? (
              <Image
                src={src}
                alt={`Image ${i}`}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                No image
              </span>
            )}
            {src && (
              <button
                type="button"
                onClick={() => setField(field, "")}
                className="absolute top-1 right-1 z-10 rounded-md bg-red-500 text-white px-1 text-xs hover:bg-red-600"
                title="Remove image"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label>Image {i}</Label>
            <Input
              type="text"
              placeholder="Image URL"
              value={formData[field]}
              onChange={(e) => setField(field, e.target.value)}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, field);
              }}
            />
          </div>
        </div>
      );
    });

  // ----- Loading / Error -----
  if (loading || !selectedProduct) {
    return (
      <div className="flex flex-col font-[Century-Old-Style] min-h-screen bg-muted/50">
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-[200]">Product Details</h1>
          <Skeleton className="h-6 w-24" />
        </header>
        <main className="flex-1 p-8 space-y-6">
          <Skeleton className="h-9 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 rounded-md border p-3 bg-white shadow-sm">
                  <Skeleton className="h-20 w-32 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </main>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  // ----- Render -----
  return (
    <div className="flex flex-col font-[Century-Old-Style] min-h-screen bg-muted/50">
      <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200]">Product Details</h1>
        <Badge variant="outline" className="ml-2">{selectedProduct.category}</Badge>
      </header>

      <main className="flex-1 p-8 space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        {/* Product Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Product Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={formData.name} onChange={(e) => setField("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={formData.category} onChange={(e) => setField("category", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (£)</Label>
              <Input type="number" value={formData.price} onChange={(e) => setField("price", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={(e) => setField("slug", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setField("description", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Total Stock (computed)</Label>
              <Input value={String(totalStock)} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-1" /> Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {variants.map((v, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end border rounded-md p-3 bg-white">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input
                    value={v.name}
                    onChange={(e) => updateVariant(idx, "name", e.target.value)}
                    placeholder="default / small / large"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Inventory</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={String(v.inventory)}
                    onChange={(e) => updateVariant(idx, "inventory", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Threshold</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={String(v.threshold)}
                    onChange={(e) => updateVariant(idx, "threshold", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Qty Blocked</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={String(v.qty_blocked)}
                    onChange={(e) => updateVariant(idx, "qty_blocked", e.target.value)}
                  />
                </div>
                <div className="flex sm:justify-end">
                  <Button variant="ghost" size="icon" onClick={() => removeVariant(idx)} aria-label="Remove variant">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Related Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Related Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  className="pl-8"
                  placeholder="Search by name, slug, or category"
                  value={relatedQuery}
                  onChange={(e) => setRelatedQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {relatedOptions.map((p: any) => {
                const active = relatedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleRelated(p.id)}
                    className={`flex items-center gap-3 rounded-md border p-2 text-left bg-white hover:bg-muted/50 transition ${
                      active ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="relative h-10 w-10 rounded-md overflow-hidden border bg-muted">
                      <Image
                        src={p.image_1 || "/product.jpg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.category} · {p.slug}
                      </div>
                    </div>
                    {active && <Badge>Selected</Badge>}
                  </button>
                );
              })}
            </div>

            {relatedIds.length > 0 && (
              <div className="pt-2">
                <Label>Selected:</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {relatedIds.map((id) => {
                    const p = (products as any[])?.find((x) => x.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-2">
                        {p?.name ?? id}
                        <button
                          type="button"
                          className="ml-1"
                          onClick={() => toggleRelated(id)}
                          aria-label="Remove related"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <CardTitle>Product Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{renderImages()}</CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save
          </Button>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailsPage;
