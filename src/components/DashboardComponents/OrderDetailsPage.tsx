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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Package,
  Settings,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { useOrderDetailsStore } from "@/store/admin/orderStore";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface OrderDetailsPageProps {
  orderId: string;
}

export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const { order, loading, error, fetchOrder, updateOrder, deleteOrder } =
    useOrderDetailsStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    deliveryDate: "",
    status: "",
    total: "",
    notes: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setFormData({
        deliveryDate: order.orderInfo.deliveryDate || "",
        status: order.orderInfo.status || "",
        total: order.orderInfo.total || "",
        notes: order.orderInfo.notes || "",
      });
      setHasChanges(false);
    }
  }, [order?.id]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const changed = Object.entries(updated).some(
        ([key, val]) =>
          val !== (order?.orderInfo[key as keyof typeof formData] || "")
      );
      setHasChanges(changed);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!order || !hasChanges) return;

    await updateOrder(order.id, {
      orderInfo: { ...order.orderInfo, ...formData },
    });

    setHasChanges(false);
  };

  const handleDelete = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmed) return;

    await deleteOrder(order.id);
    router.push("/admin/orders");
  };

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  const renderOrderItemCard = (item: any, index: number) => (
    <Card key={item.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Item #{index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={item.products?.image_1 || "/placeholder.jpg"}
              alt={item.products?.name || "Product"}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm whitespace-normal break-words">{item.products?.name}</h4>
            <p className="text-xs text-muted-foreground">{item.products?.category}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs">Qty: {item.quantity}</span>
              <span className="font-medium text-sm">${item.price_at_purchase?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {item.custom_data && Object.keys(item.custom_data).length > 0 && (
          <div>
            <Label className="text-xs font-medium">Personalization</Label>
            <div className="mt-1 space-y-1">
              {Object.entries(item.custom_data).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium max-w-32 whitespace-normal break-words">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/50">
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-[200]">Order Details</h1>
          <Skeleton className="h-6 w-20" />
        </header>
        <main className="flex-1 p-8 space-y-6">
          <Skeleton className="h-9 w-32" />
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col font-century min-h-screen bg-muted/50">
      <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200]">Order Details</h1>
        <Badge variant="outline" className="ml-2">
          {order.orderInfo.status}
        </Badge>
      </header>

      <main className="flex-1 p-8 space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Customer Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>Recipient Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <p className="text-sm text-muted-foreground">{order.recipientInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm">Address</Label>
                <p className="text-sm text-muted-foreground">{order.recipientInfo.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Status Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Payment & Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Payment Status</Label>
                <Badge variant="outline" className="ml-2">
                  {order.orderInfo.paymentStatus}
                </Badge>
              </div>
              <div>
                <Label className="text-sm">Order Status</Label>
                <Badge variant="outline" className="ml-2">
                  {order.orderInfo.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm">Total Amount</Label>
                <p className="text-lg font-semibold">${order.orderInfo.total}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Delivery Date</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.orderInfo.deliveryDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm">Placed At</Label>
                <p className="text-sm text-muted-foreground">
                  {formatTimestamp(order.orderInfo.placedAt)}
                </p>
              </div>
              <div>
                <Label className="text-sm">Updated At</Label>
                <p className="text-sm text-muted-foreground">
                  {formatTimestamp(order.orderInfo.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editable Order Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Edit Order Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Delivery Date</Label>
              <Input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleFieldChange("deliveryDate", e.target.value)}
              />
            </div>
            {/* <div className="space-y-1.5">
              <Label>Status</Label>
              <Input
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
              />
            </div> */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleFieldChange("status", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Total ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => handleFieldChange("total", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        {order.orderItems && order.orderItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <CardTitle>Order Items ({order.orderItems.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {order.orderItems.map((item, index) => renderOrderItemCard(item, index))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save Changes
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete Order
          </Button>
        </div>
      </main>
    </div>
  );
}
