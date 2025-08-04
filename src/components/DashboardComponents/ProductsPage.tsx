"use client";

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
import { Edit } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useProductAdminStore } from "@/store/admin/productStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFormDialog } from "./Forms/ProductFormDialog";
import Link from "next/link";

const getStatusColor = (inventory: number) => {
  if (inventory === 0) {
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  } else if (inventory < 10) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
  } else {
    return "bg-stone-400 text-stone-800 dark:bg-green-900/20 dark:text-green-400";
  }
};

export function ProductsPage() {
  const { products, loading, fetchProducts } =
    useProductAdminStore();

  useEffect(() => {
    fetchProducts();
  }, []);

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
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-century">Products</h1>
      </header>

      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-century">
              Products
            </h2>
            <p className="text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <ProductFormDialog />
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
                  : products?.map((product) => (
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
                          €{product.price}
                        </TableCell>
                        <TableCell>{product.inventory}</TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(product.inventory)}
                            variant="secondary"
                          >
                            {product.inventory === 0
                              ? "Out of Stock"
                              : product.inventory < 10
                              ? "Low Stock"
                              : "In Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
