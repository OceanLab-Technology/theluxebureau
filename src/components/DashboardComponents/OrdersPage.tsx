"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Edit, Euro, ShoppingCart } from "lucide-react";
import { useOrdersStore } from "@/store/admin/orderStore";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
    case "processing":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "shipped":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "delivered":
      return "bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400";
    case "cancelled":
      return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
    default:
      return "bg-muted text-muted-foreground dark:bg-muted/20 dark:text-muted-foreground";
  }
};

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { orders, loading, fetchOrders, pagination } = useOrdersStore();

  useEffect(() => {
    const filters: Record<string, string> = {};
    if (statusFilter !== "all") filters.status = statusFilter;

    fetchOrders(filters, page);
  }, [statusFilter, page]);

  const totalRevenue = orders.reduce((acc, order) => {
    const rawTotal = order.total ?? "0";
    const num = parseFloat(rawTotal.replace(/[^\d.-]/g, ""));
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="flex flex-col font-century">
      {/* 🔘 Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-century">Orders</h1>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* 🏷️ Page Title + Filter */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold font-century">ORDERS</h2>
            <p className="text-muted-foreground">
              Manage and track customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-foreground text-background font-century">
                <Filter className="mr-2 h-4 w-4 text-background" />
                <SelectValue placeholder="Filter orders" />
              </SelectTrigger>
              <SelectContent className="text-foreground font-century">
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 📊 Summary Cards */}
        <div className="flex-1 space-y-4">
          {loading ? (
            <OrdersSummarySkeleton />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>New Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      orders.filter((o) => o.status.toLowerCase() === "new")
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Total Revenue</CardTitle>
                  <Euro className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    €{totalRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* 📋 Orders Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <OrdersTableSkeleton />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Recipient Name</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customerName || "-"}</TableCell>
                        <TableCell>{order.recipientName}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell className="font-medium">
                          {order.total}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(order.status)}
                            variant="secondary"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />  
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        {/* ⏩ Pagination Controls */}
        {!loading && pagination && (
          <div className="flex justify-between items-center gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * 10 + 1} to{" "}
              {Math.min(page * 10, pagination.total)} of {pagination.total}{" "}
              entries
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTableSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 animate-pulse"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function OrdersSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      className={`animate-pulse bg-muted rounded-md ${className}`}
    />
  );
}
