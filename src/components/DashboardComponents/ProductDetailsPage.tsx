"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, ImageIcon } from "lucide-react";
import { useProductAdminStore } from "@/store/admin/productStore";
import { useRouter } from "next/navigation";

interface ProductDetailsPageProps {
  productId: string;
}

function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
    updateProduct,
    deleteProduct,
  } = useProductAdminStore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    inventory: "",
    category: "",
    slug: "",
    image_1: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price?.toString() || "",
        inventory: selectedProduct.inventory?.toString() || "",
        category: selectedProduct.category || "",
        slug: selectedProduct.slug || "",
        image_1: selectedProduct.image_1 || "",
        image_2: selectedProduct.image_2 || "",
        image_3: selectedProduct.image_3 || "",
        image_4: selectedProduct.image_4 || "",
        image_5: selectedProduct.image_5 || "",
      });
      setHasChanges(false);
    }
  }, [selectedProduct]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const changed = Object.entries(updated).some(
        ([key, val]) =>
          val !==
          (selectedProduct?.[key as keyof typeof formData]?.toString() || "")
      );
      setHasChanges(changed);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!selectedProduct || !hasChanges) return;

    try {
      await updateProduct(selectedProduct.id, {
        ...formData,
        price: parseFloat(formData.price) || 0,
        inventory: parseInt(formData.inventory) || 0,
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
      if (updated?.[field]) {
        handleFieldChange(field, String(updated[field]));
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

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

  const renderInput = (
    label: string,
    field: keyof typeof formData,
    type: "text" | "number" = "text"
  ) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={formData[field]}
        onChange={(e) => handleFieldChange(field, e.target.value)}
      />
    </div>
  );

  const renderImages = () => {
    return [1, 2, 3, 4, 5].map((i) => {
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
                onClick={() => handleFieldChange(field, "")}
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
              onChange={(e) => handleFieldChange(field, e.target.value)}
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
  };

  if (loading || !selectedProduct) {
    return (
      <div className="flex flex-col font-[Century-Old-Style] min-h-screen bg-muted/50">
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-[200]">Product Details</h1>
          <Skeleton className="h-6 w-24" />
        </header>

        <main className="flex-1 p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Product Info Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-40" />
              </div>
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

          {/* Product Images Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-40" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-md border p-3 bg-white shadow-sm"
                >
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

  return (
    <div className="flex flex-col font-[Century-Old-Style] min-h-screen bg-muted/50">
      <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200]">Product Details</h1>
        <Badge variant="outline" className="ml-2">
          {selectedProduct.category}
        </Badge>
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
            {renderInput("Name", "name")}
            {renderInput("Category", "category")}
            {renderInput("Price (£)", "price", "number")}
            {renderInput("Inventory", "inventory", "number")}
            {renderInput("Slug", "slug")}
            {renderInput("Description", "description")}
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
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
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
