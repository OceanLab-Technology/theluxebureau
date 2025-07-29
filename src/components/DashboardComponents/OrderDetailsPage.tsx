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
// import { ArrowLeft, Calendar, User, MapPin } from "lucide-react";
// import Link from "next/link";

// interface OrderDetailsPageProps {
//   orderId: string;
// }

// // Dummy order details data
// const orderDetails = {
//   id: "29a82dcb...",
//   customerInfo: {
//     name: "",
//     email: "",
//   },
//   recipientInfo: {
//     name: "dw",
//     address: "dw",
//   },
//   orderInfo: {
//     deliveryDate: "09/07/2025",
//     total: "€0.00",
//     status: "New",
//   },
// };

// export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
//   return (
//     <div className="flex flex-col">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200] font-century">Order Details</h1>
//         <Badge variant="outline" className="ml-2">
//           {orderDetails.orderInfo.status}
//         </Badge>
//       </header>

//       <div className="flex-1 space-y-6 p-8 pt-6">
//         <Button variant="ghost" size="sm" asChild>
//           <Link href="/admin/orders">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Orders
//           </Link>
//         </Button>
//         <div className="grid gap-6 md:grid-cols-2">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 <CardTitle>Customer Information</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Name:
//                 </label>
//                 <p className="text-sm">
//                   {orderDetails.customerInfo.name || "Not provided"}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Email:
//                 </label>
//                 <p className="text-sm">
//                   {orderDetails.customerInfo.email || "Not provided"}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 <CardTitle>Recipient Information</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Name:
//                 </label>
//                 <p className="text-sm">{orderDetails.recipientInfo.name}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Address:
//                 </label>
//                 <p className="text-sm">{orderDetails.recipientInfo.address}</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               <CardTitle>Order Information</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-3">
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Delivery Date:
//                 </label>
//                 <p className="text-sm font-medium">
//                   {orderDetails.orderInfo.deliveryDate}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Total:
//                 </label>
//                 <p className="text-sm font-medium">
//                   {orderDetails.orderInfo.total}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-muted-foreground">
//                   Status:
//                 </label>
//                 <Badge
//                   variant="secondary"
//                   className="bg-blue-100 text-blue-800"
//                 >
//                   {orderDetails.orderInfo.status}
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex gap-4">
//           <Button>Update Status</Button>
//           <Button variant="outline">Send Notification</Button>
//           <Button variant="outline">Print Invoice</Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useOrderDetailsStore } from "@/store/admin/orderStore";

interface OrderDetailsPageProps {
  orderId: string;
}

export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const { order, loading, error, fetchOrder } = useOrderDetailsStore();

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 ml-2" />
        </header>

        <div className="flex-1 space-y-6 p-8 pt-6">
          <Skeleton className="h-8 w-40" />

          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-36" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!order) return null;

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200] font-century">Order Details</h1>
        <Badge variant="outline" className="ml-2">
          {order.orderInfo.status}
        </Badge>
      </header>

      <div className="flex-1 space-y-6 p-8 pt-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Customer Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name:
                </label>
                <p className="text-sm">
                  {order.customerInfo.name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email:
                </label>
                <p className="text-sm">
                  {order.customerInfo.email || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>Recipient Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name:
                </label>
                <p className="text-sm">{order.recipientInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address:
                </label>
                <p className="text-sm">{order.recipientInfo.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Order Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Delivery Date:
                </label>
                <p className="text-sm font-medium">
                  {order.orderInfo.deliveryDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Total:
                </label>
                <p className="text-sm font-medium">
                  {order.orderInfo.total}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status:
                </label>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {order.orderInfo.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button>Update Status</Button>
          <Button variant="outline">Send Notification</Button>
          <Button variant="outline">Print Invoice</Button>
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} />
  );
}
