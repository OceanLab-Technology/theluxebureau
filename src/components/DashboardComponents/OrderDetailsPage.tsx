"use client";

import { useEffect, useState } from "react";
import { Link } from 'next-view-transitions';
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, User, MapPin } from "lucide-react";
import { useOrderDetailsStore } from "@/store/admin/orderStore";
import { useRouter } from "next/navigation";

interface OrderDetailsPageProps {
  orderId: string;
}

export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  // const { order, loading, error, fetchOrder, updateOrder } = useOrderDetailsStore();
  const { order, loading, error, fetchOrder, updateOrder, deleteOrder } = useOrderDetailsStore();
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
        ([key, val]) => val !== (order?.orderInfo[key as keyof typeof formData] || "")
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

  const renderReadOnly = (label: string, value?: string | null) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{value || "—"}</p>
    </div>
  );

  const handleDelete = async () => {
    if (!order) return;

    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    await deleteOrder(order.id);

    router.push("/admin/orders");
  };


  if (loading || !order) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
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

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Customer Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Name:</strong> {order.customerInfo.name}</p>
              <p><strong>Email:</strong> {order.customerInfo.email}</p>
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
            <CardContent className="space-y-4">
              <p><strong>Name:</strong> {order.recipientInfo.name}</p>
              <p><strong>Address:</strong> {order.recipientInfo.address}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Order Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {renderInput("Delivery Date", "deliveryDate")}
            {renderInput("Total (€)", "total", "number")}
            {renderInput("Status", "status")}
            {renderInput("Notes", "notes")}
            {renderReadOnly("Payment Status", order.orderInfo.paymentStatus)}
            {renderReadOnly("Placed At", order.orderInfo.placedAt)}
            {renderReadOnly("Updated At", order.orderInfo.updatedAt)}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <div className="flex justify-end gap-2">
            <Button onClick={handleSave} disabled={!hasChanges}>
              Save
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
