// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Filter, Eye, Calendar } from "lucide-react";
// import Link from "next/link";

// const orders = [
//   {
//     id: "29a82dcb...",
//     customerName: "",
//     recipientName: "dw",
//     deliveryDate: "09/07/2025",
//     total: "€0.00",
//     status: "New",
//   },
//   {
//     id: "3f905326...",
//     customerName: "",
//     recipientName: "w",
//     deliveryDate: "11/07/2025",
//     total: "€0.00",
//     status: "New",
//   },
//   {
//     id: "e84fa661...",
//     customerName: "",
//     recipientName: "gda",
//     deliveryDate: "10/07/2025",
//     total: "€0.00",
//     status: "New",
//   },
//   {
//     id: "b52418e5...",
//     customerName: "",
//     recipientName: "d",
//     deliveryDate: "03/07/2025",
//     total: "€0.00",
//     status: "New",
//   },
//   {
//     id: "15a985be...",
//     customerName: "",
//     recipientName: "wgsdw",
//     deliveryDate: "10/07/2025",
//     total: "€0.00",
//     status: "New",
//   },
//   {
//     id: "c27d8429...",
//     customerName: "sc",
//     recipientName: "sdw",
//     deliveryDate: "24/07/2025",
//     total: "€149.00",
//     status: "New",
//   },
// ];

// const getStatusColor = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "new":
//       return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
//     case "processing":
//       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
//     case "shipped":
//       return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
//     case "delivered":
//       return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
//     case "cancelled":
//       return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
//     default:
//       return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
//   }
// };

// export function OrdersPage() {
//   return (
//     <div className="flex flex-col font-century">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200]">Orders</h1>
//       </header>

//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-semibold font-century ">ORDERS</h2>
//             <p className="text-muted-foreground">
//               Manage and track customer orders
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Select defaultValue="all">
//               <SelectTrigger className="w-[180px]">
//                 <Filter className="mr-2 h-4 w-4" />
//                 <SelectValue placeholder="Filter orders" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Orders</SelectItem>
//                 <SelectItem value="new">New</SelectItem>
//                 <SelectItem value="processing">Processing</SelectItem>
//                 <SelectItem value="shipped">Shipped</SelectItem>
//                 <SelectItem value="delivered">Delivered</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order ID</TableHead>
//                   <TableHead>Customer Name</TableHead>
//                   <TableHead>Recipient Name</TableHead>
//                   <TableHead>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       Delivery Date
//                     </div>
//                   </TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {orders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell className="font-medium">{order.id}</TableCell>
//                     <TableCell>{order.customerName || "-"}</TableCell>
//                     <TableCell>{order.recipientName}</TableCell>
//                     <TableCell>{order.deliveryDate}</TableCell>
//                     <TableCell className="font-medium">{order.total}</TableCell>
//                     <TableCell>
//                       <Badge
//                         className={getStatusColor(order.status)}
//                         variant="secondary"
//                       >
//                         {order.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Link href={`/admin/orders/${order.id}`}>
//                         <Button variant="ghost" size="sm">
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                       </Link>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         <div className="grid gap-4 md:grid-cols-3">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Orders
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{orders.length}</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium">New Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {orders.filter((order) => order.status === "New").length}
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Revenue
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">€149.00</div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Filter, Eye, Calendar } from "lucide-react";
import { useOrdersStore } from "@/store/admin/orderStore";

// 🎨 Status color helper
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "shipped":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "delivered":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export function OrdersPage() {
  const { orders, loading, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        <h1 className="text-lg font-[200]">Orders</h1>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* 🏷️ Page Title + Filter */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold font-century">ORDERS</h2>
            <p className="text-muted-foreground">Manage and track customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter orders" />
              </SelectTrigger>
              <SelectContent>
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

        {/* 📋 Orders Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <OrdersTableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Recipient Name</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Delivery Date
                      </div>
                    </TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName || "-"}</TableCell>
                      <TableCell>{order.recipientName}</TableCell>
                      <TableCell>{order.deliveryDate}</TableCell>
                      <TableCell className="font-medium">{order.total}</TableCell>
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
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 📊 Summary Cards */}
        {loading ? (
          <OrdersSummarySkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "New").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

//
// ✅ Skeleton Components
//

function OrdersTableSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 animate-pulse"
        >
          <Skeleton className="h-4 w-20" /> {/* Order ID */}
          <Skeleton className="h-4 w-32" /> {/* Customer Name */}
          <Skeleton className="h-4 w-32" /> {/* Recipient Name */}
          <Skeleton className="h-4 w-28" /> {/* Delivery Date */}
          <Skeleton className="h-4 w-16" /> {/* Total */}
          <Skeleton className="h-6 w-20 rounded-full" /> {/* Status */}
          <Skeleton className="h-8 w-8 rounded-md" /> {/* View button */}
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

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      className={`animate-pulse bg-muted rounded-md ${className}`}
    />
  );
}
