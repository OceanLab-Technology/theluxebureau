// "use client";

// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Mail, Phone, ArrowLeft } from "lucide-react";
// import { useCustomerAdminStore } from "@/store/admin/customerStore"; // You’ll create this

// export default function CustomerDetailsPage() {
//   const { customerId } = useParams() as { customerId: string };
//   const { customer, loading, fetchCustomer } = useCustomerAdminStore();

//   useEffect(() => {
//     fetchCustomer(customerId);
//   }, [customerId]);

//   if (loading || !customer) {
//     return (
//       <div className="p-8 space-y-4">
//         <Skeleton className="h-8 w-40" />
//         <Skeleton className="h-6 w-64" />
//         <Skeleton className="h-4 w-48" />
//         <Skeleton className="h-4 w-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col font-century">
//       <header className="flex h-16 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200]">Customer Details</h1>
//         <Badge variant="outline" className="ml-2">{customer.status}</Badge>
//       </header>

//       <div className="flex-1 p-8 pt-6 space-y-6">
//         <Button asChild variant="ghost" size="sm">
//           <Link href="/admin/customers">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Customers
//           </Link>
//         </Button>

//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="text-sm"><strong>Name:</strong> {customer.name}</div>
//             <div className="text-sm flex items-center gap-2">
//               <Mail className="w-4 h-4" />
//               {customer.email}
//             </div>
//             <div className="text-sm flex items-center gap-2 text-muted-foreground">
//               <Phone className="w-4 h-4" />
//               {customer.phone}
//             </div>
//             <div className="text-sm">
//               <strong>Total Spent:</strong> €{customer.totalSpent?.toFixed(2)}
//             </div>
//             <div className="text-sm">
//               <strong>Join Date:</strong> {customer.joinDate}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Optional: Edit, Delete, etc. */}
//         <div className="flex gap-4">
//           <Button>Edit Customer</Button>
//           <Button variant="destructive">Delete Customer</Button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Mail, Phone, ArrowLeft } from "lucide-react";
// import { useCustomerAdminStore } from "@/store/admin/customerStore";

// export default function CustomerDetailsPage() {
//   const router = useRouter();
//   const { id } = useParams() as { id: string };

//   const {
//     customer,
//     loading,
//     error,
//     fetchCustomer,
//     deleteCustomer,
//   } = useCustomerAdminStore();

//   useEffect(() => {
//     if (id) fetchCustomer(id);
//     console.log("customerId:", id);
//   }, [id]);

//   const handleDelete = async () => {
//     if (!customer) return;
//     const confirm = window.confirm(
//       `Are you sure you want to delete ${customer.name}?`
//     );
//     if (!confirm) return;

//     await deleteCustomer(customer.id);
//     router.push("/admin/customers");
//   };

//   if (loading || !customer) {
//     return (
//       <div className="p-8 space-y-4">
//         <Skeleton className="h-8 w-40" />
//         <Skeleton className="h-6 w-64" />
//         <Skeleton className="h-4 w-48" />
//         <Skeleton className="h-4 w-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col font-century">
//       <header className="flex h-16 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200]">Customer Details</h1>
//         <Badge variant="outline" className="ml-2">
//           {customer.status}
//         </Badge>
//       </header>

//       <div className="flex-1 p-8 pt-6 space-y-6">
//         <Button asChild variant="ghost" size="sm">
//           <Link href="/admin/customers">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Customers
//           </Link>
//         </Button>

//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="text-sm">
//               <strong>Name:</strong> {customer.name}
//             </div>
//             <div className="text-sm flex items-center gap-2">
//               <Mail className="w-4 h-4" />
//               {customer.email}
//             </div>
//             <div className="text-sm flex items-center gap-2 text-muted-foreground">
//               <Phone className="w-4 h-4" />
//               {customer.phone}
//             </div>
//             <div className="text-sm">
//               <strong>Address:</strong> {customer.address}
//             </div>
//             <div className="text-sm">
//               <strong>Total Spent:</strong> €{customer.totalSpent?.toFixed(2)}
//             </div>
//             <div className="text-sm">
//               <strong>Total Orders:</strong> {customer.totalOrders}
//             </div>
//             <div className="text-sm">
//               <strong>Join Date:</strong> {customer.joinDate}
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex gap-4">
//           <Button asChild>
//             <Link href={`/admin/customers/${customer.id}/edit`}>Edit</Link>
//           </Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Mail, Phone, ArrowLeft } from "lucide-react";
// import { useCustomerAdminStore } from "@/store/admin/customerStore";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function CustomerDetailsPage() {
//   const router = useRouter();
//   const { id } = useParams() as { id: string };

//   const {
//     customer,
//     loading,
//     error,
//     fetchCustomer,
//     deleteCustomer,
//   } = useCustomerAdminStore();

//   useEffect(() => {
//     if (id) fetchCustomer(id);
//   }, [id]);

//   const handleDelete = async () => {
//     if (!customer) return;
//     const confirm = window.confirm(
//       `Are you sure you want to delete ${customer.name}?`
//     );
//     if (!confirm) return;

//     await deleteCustomer(customer.id);
//     router.push("/admin/customers");
//   };

//   if (loading || !customer) {
//     return (
//       <div className="p-8 space-y-4">
//         <Skeleton className="h-8 w-40" />
//         <Skeleton className="h-6 w-64" />
//         <Skeleton className="h-4 w-48" />
//         <Skeleton className="h-4 w-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col font-century min-h-screen bg-muted/50">
//       <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200]">Customer Details</h1>
//         <Badge variant="outline" className="ml-2">{customer.status}</Badge>
//       </header>

//       <main className="flex-1 p-8 space-y-6">
//         <Button asChild variant="ghost" size="sm">
//           <Link href="/admin/customers">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Customers
//           </Link>
//         </Button>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Customer Information</CardTitle>
//           </CardHeader>

//           <CardContent className="grid gap-6 sm:grid-cols-2">
//             <div className="space-y-1.5">
//               <Label>Name</Label>
//               <Input value={customer.name} readOnly />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Email</Label>
//               <Input value={customer.email} readOnly />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Phone</Label>
//               <Input value={customer.phone} readOnly />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Address</Label>
//               <Input value={customer.address} readOnly />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Total Spent</Label>
//               <Input value={`€${customer.totalSpent.toFixed(2)}`} readOnly />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Total Orders</Label>
//               <Input value={String(customer.totalOrders)} readOnly />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Join Date</Label>
//               <Input value={customer.joinDate} readOnly />
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex gap-4 justify-end">
//           <Button asChild>
//             <Link href={`/admin/customers/${customer.id}/edit`}>Edit</Link>
//           </Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ArrowLeft } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useCustomerAdminStore } from "@/store/admin/customerStore";

// export default function CustomerDetailsPage() {
//   const router = useRouter();
//   const { id } = useParams() as { id: string };

//   const customer = useCustomerAdminStore((state) => state.customer);
//   const loading = useCustomerAdminStore((state) => state.loading);
//   const fetchCustomer = useCustomerAdminStore((state) => state.fetchCustomer);
//   const updateCustomer = useCustomerAdminStore((state) => state.updateCustomer);
//   const deleteCustomer = useCustomerAdminStore((state) => state.deleteCustomer);

//   const [editing, setEditing] = useState<Record<string, boolean>>({});
//   const [formData, setFormData] = useState<Record<string, string>>({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     totalSpent: "",
//     totalOrders: "",
//     joinDate: "",
//   });

//   // Fetch customer when ID changes
//   useEffect(() => {
//     if (id) fetchCustomer(id);
//   }, [id]);

//   // Initialize form data when customer loads
//   useEffect(() => {
//     if (customer) {
//       setFormData({
//         name: customer.name || "",
//         email: customer.email || "",
//         phone: customer.phone || "",
//         address: customer.address || "",
//         totalSpent: customer.totalSpent.toFixed(2),
//         totalOrders: String(customer.totalOrders),
//         joinDate: customer.joinDate || "",
//       });
//     }
//   }, [customer?.id]);

//   const handleFieldChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleBlur = async (field: string) => {
//     setEditing((prev) => ({ ...prev, [field]: false }));
//     if (!customer) return;

//     const newValue = formData[field];
//     const originalValue = String((customer as any)[field] ?? "");

//     if (newValue !== originalValue) {
//       await updateCustomer(customer.id, { [field]: newValue });
//     }
//   };

//   const handleDelete = async () => {
//     if (!customer) return;
//     const confirmed = window.confirm(`Are you sure you want to delete ${customer.name}?`);
//     if (!confirmed) return;

//     await deleteCustomer(customer.id);
//     router.push("/admin/customers");
//   };

//   if (loading || !customer) {
//     return (
//       <div className="p-8 space-y-4">
//         <Skeleton className="h-8 w-40" />
//         <Skeleton className="h-6 w-64" />
//         <Skeleton className="h-4 w-48" />
//         <Skeleton className="h-4 w-48" />
//       </div>
//     );
//   }

//   const renderField = (
//     field: keyof typeof formData,
//     label: string,
//     type: "text" | "number" = "text"
//   ) => (
//     <div key={field} className="space-y-1.5">
//       <Label>{label}</Label>
//       <Input
//         type={type}
//         value={formData[field]}
//         readOnly={!editing[field]}
//         onClick={() => setEditing((prev) => ({ ...prev, [field]: true }))}
//         onChange={(e) => handleFieldChange(field, e.target.value)}
//         onBlur={() => handleBlur(field)}
//         className={editing[field] ? "border-ring" : "cursor-pointer"}
//       />
//     </div>
//   );

//   return (
//     <div className="flex flex-col font-century min-h-screen bg-muted/50">
//       <header className="flex h-16 items-center gap-2 border-b px-4 bg-background">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200]">Customer Details</h1>
//         <Badge variant="outline" className="ml-2">
//           {customer.status}
//         </Badge>
//       </header>

//       <main className="flex-1 p-8 space-y-6">
//         <Button asChild variant="ghost" size="sm">
//           <Link href="/admin/customers">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Customers
//           </Link>
//         </Button>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Customer Information</CardTitle>
//           </CardHeader>
//           <CardContent className="grid gap-6 sm:grid-cols-2">
//             {renderField("name", "Name")}
//             {renderField("email", "Email")}
//             {renderField("phone", "Phone")}
//             {renderField("address", "Address")}
//             {renderField("totalSpent", "Total Spent (€)", "number")}
//             {renderField("totalOrders", "Total Orders", "number")}
//             {renderField("joinDate", "Join Date")}
//           </CardContent>
//         </Card>

//         <div className="flex gap-4 justify-end">
//           <Button asChild>
//             <Link href={`/admin/customers/${customer.id}/edit`}>Edit</Link>
//           </Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerAdminStore } from "@/store/admin/customerStore";

export default function CustomerDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

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
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-48" />
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
            {renderField("totalSpent", "Total Spent (€)", "number")}
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
