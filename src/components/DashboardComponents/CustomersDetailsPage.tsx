"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerAdminStore } from "@/store/admin/customerStore";

export function CustomerDetailsPage({ customerId }: { customerId: string }) {
  const id = customerId;

  const customer = useCustomerAdminStore((state) => state.customer);
  const loading = useCustomerAdminStore((state) => state.loading);
  const fetchCustomer = useCustomerAdminStore((state) => state.fetchCustomer);
  const updateCustomer = useCustomerAdminStore((state) => state.updateCustomer);
  const deleteCustomer = useCustomerAdminStore((state) => state.deleteCustomer);

  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    totalSpent: "",
    totalOrders: "",
    joinDate: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Fetch customer data
  useEffect(() => {
    if (id) fetchCustomer(id);
  }, [id]);

  // Initialize form data
  useEffect(() => {
    if (customer) {
      const initialData = {
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        totalSpent: customer.totalSpent.toFixed(2),
        totalOrders: String(customer.totalOrders),
        joinDate: customer.joinDate || "",
      };

      setFormData(initialData);
      setHasChanges(false);
    }
  }, [customer?.id]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (!customer) return updated;

      const changed = Object.keys(updated).some((key) => {
        const original = String((customer as any)[key] ?? "");
        const current = updated[key];
        return original !== current;
      });

      setHasChanges(changed);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!customer || !hasChanges) return;

    const updates: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const original = String((customer as any)[key] ?? "");
      if (value !== original) {
        updates[key] = value;
      }
    });

    if (Object.keys(updates).length > 0) {
      await updateCustomer(customer.id, updates);
      setHasChanges(false);
    }
  };

  if (loading || !customer) {
    return (
      <div className="flex flex-col font-century min-h-screen bg-muted/50">
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-[200]">Customer Details</h1>
          <Skeleton className="ml-2 h-6 w-20" />
        </header>

        <main className="flex-1 p-8 space-y-6">
          <Skeleton className="h-9 w-36" />

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Skeleton className="h-10 w-20" />
          </div>
        </main>
      </div>
    );
  }

  const renderField = (
    field: keyof typeof formData,
    label: string,
    type: "text" | "number" = "text"
  ) => (
    <div key={field} className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={formData[field]}
        onChange={(e) => handleFieldChange(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="flex flex-col font-century min-h-screen bg-muted/50">
      <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200]">Customer Details</h1>
        <Badge variant="outline" className="ml-2">
          {customer.status}
        </Badge>
      </header>

      <main className="flex-1 p-8 space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            {renderField("name", "Name")}
            {renderField("email", "Email")}
            {renderField("phone", "Phone")}
            {renderField("address", "Address")}
            {renderField("totalSpent", "Total Spent (£)", "number")}
            {renderField("totalOrders", "Total Orders", "number")}
            {renderField("joinDate", "Join Date")}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className={!hasChanges ? "opacity-50 pointer-events-none" : ""}
          >
            Save
          </Button>
        </div>
      </main>
    </div>
  );
}
