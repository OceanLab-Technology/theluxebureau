"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Mail, Phone, Edit, UserPlus, Users, Loader2 } from "lucide-react";
import { useCustomerAdminStore } from "@/store/admin/customerStore";
import { CustomerFormDialog } from "./Forms/CustomerFormDialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} />;
}

function CustomersTableSkeleton({ rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    </TableRow>
  ));
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-24" /></CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CustomersPage() {
  const {
    customers,
    totalCustomers,
    page,
    totalPages,
    loading,
    fetchCustomers,
    setPage,
    updateCustomer,
    updatingCustomerId,
  } = useCustomerAdminStore();

  const [rowsPerPage] = useState(10);

  useEffect(() => {
    fetchCustomers(page);
  }, [page, fetchCustomers]);

  const handleStatusChange = async (customerId: string, newStatus: string) => {
    await updateCustomer(customerId, { status: newStatus });
  };

  return (
    <div className="flex flex-col font-century">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold">Customers</h1>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Customers</h2>
            <p className="text-muted-foreground">Manage your customer relationships and data</p>
          </div>
          <CustomerFormDialog />
        </div>

        {/* Summary Cards */}
        {loading ? <SummarySkeleton /> : (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle>Total Customers</CardTitle><Users className="h-4 w-4" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">{totalCustomers || 0}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle>Active Customers</CardTitle><Users className="h-4 w-4" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {customers?.filter(c => c.status.toLowerCase() === "active").length || 0}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle>VIP Customers</CardTitle><Users className="h-4 w-4" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {customers?.filter(c => c.status.toLowerCase() === "vip").length || 0}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle>New This Month</CardTitle><UserPlus className="h-4 w-4" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">2</CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <CustomersTableSkeleton />
            ) : customers?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" /> {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" /> {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>
                        £{customer.totalSpent.toFixed?.(2) ?? customer.totalSpent}
                      </TableCell>
                      {/* <TableCell>{customer.joinDate}</TableCell> */}
                      <TableCell>
                        {customer.joinDate ? (() => {
                          const date = new Date(customer.joinDate);
                          const dayName = date.toLocaleDateString("en-GB", { weekday: "long" });
                          const day = date.getDate();
                          const month = date.toLocaleDateString("en-GB", { month: "long" });
                          const year = date.getFullYear();
                          const getOrdinalSuffix = (d: number) => {
                            if (d >= 11 && d <= 13) return "th";
                            switch (d % 10) {
                              case 1: return "st";
                              case 2: return "nd";
                              case 3: return "rd";
                              default: return "th";
                            }
                          };
                          const ordinalSuffix = getOrdinalSuffix(day);
                          return (
                            <>
                              {dayName} {day}
                              <sup className="text-xs">{ordinalSuffix}</sup> {month} {year}
                            </>
                          );
                        })() : "-"}
                      </TableCell>

                      <TableCell>
                        <Select
                          value={customer.status}
                          onValueChange={(newStatus) => handleStatusChange(customer.id, newStatus)}
                          disabled={updatingCustomerId === customer.id}
                        >
                          <SelectTrigger className="w-[130px] h-6 text-[15px] border-stone-300 hover:bg-secondary bg-transparent py-0 focus:ring-0">
                            <div className="flex items-center gap-2">
                              {updatingCustomerId === customer.id ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="opacity-70">{customer.status}</span>
                                </>
                              ) : (
                                <span>{customer.status}</span>
                              )}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="VIP">VIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalCustomers || 0)} of {totalCustomers || 0} entries
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
