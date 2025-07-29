"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Mail,
  Phone,
  Calendar,
  Eye
} from "lucide-react"
import { useCustomerAdminStore } from "@/store/admin/customerStore"
import { useEffect, useRef, useCallback } from "react"
import Link from "next/link";
import { CustomerFormDialog } from "./Forms/CustomerFormDialog"

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    case "vip":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  }
}

const renderSkeletonRow = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
    </TableRow>
  ))

export function CustomersPage() {
  const {
    customers,
    page,
    totalPages,
    loading,
    fetchCustomers,
    setPage,
  } = useCustomerAdminStore()

  const loaderRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!customers || customers.length === 0) {
      fetchCustomers(1)
    }
  }, [])

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && !loading && page < totalPages) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchCustomers(nextPage)
      }
    },
    [loading, page, totalPages]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    })

    if (loaderRef.current) observer.observe(loaderRef.current)

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [handleObserver])

  return (
    <div className="flex flex-col font-century">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-century">Customers</h1>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold font-century">Customers</h2>
            <p className="text-muted-foreground">
              Manage your customer relationships and data
            </p>
          </div>
          <CustomerFormDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardHeader><CardTitle>Total Customers</CardTitle></CardHeader><CardContent>{customers?.length || 0}</CardContent></Card>
          <Card><CardHeader><CardTitle>Active Customers</CardTitle></CardHeader><CardContent>{customers?.filter(c => c.status === "Active").length || 0}</CardContent></Card>
          <Card><CardHeader><CardTitle>VIP Customers</CardTitle></CardHeader><CardContent>{customers?.filter(c => c.status === "VIP").length || 0}</CardContent></Card>
          <Card><CardHeader><CardTitle>New This Month</CardTitle></CardHeader><CardContent>2</CardContent></Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Join Date
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (!customers || customers.length === 0)
                  ? renderSkeletonRow()
                  : customers?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{customer.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>€{customer.totalSpent.toFixed?.(2) ?? customer.totalSpent}</TableCell>
                      <TableCell>{customer.joinDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(customer.status)}
                          variant="secondary"
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <div ref={loaderRef} className="py-6 text-center text-muted-foreground text-sm">
              {loading ? "Loading more customers..." : "Scroll to load more"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
