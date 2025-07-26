"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, UserPlus, Mail, Phone, Calendar, Eye } from "lucide-react"

// Dummy customers data
const customers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    totalOrders: 12,
    totalSpent: "€1,249.00",
    joinDate: "2024-01-15",
    status: "Active",
    avatar: "",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@company.com",
    phone: "+1 (555) 987-6543",
    totalOrders: 8,
    totalSpent: "€892.50",
    joinDate: "2024-02-20",
    status: "Active",
    avatar: "",
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma.w@domain.com",
    phone: "+1 (555) 456-7890",
    totalOrders: 5,
    totalSpent: "€567.25",
    joinDate: "2024-03-10",
    status: "Active",
    avatar: "",
  },
  {
    id: "4",
    name: "David Rodriguez",
    email: "david.r@email.com",
    phone: "+1 (555) 321-0987",
    totalOrders: 3,
    totalSpent: "€234.75",
    joinDate: "2024-04-05",
    status: "Inactive",
    avatar: "",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@mail.com",
    phone: "+1 (555) 654-3210",
    totalOrders: 15,
    totalSpent: "€1,890.00",
    joinDate: "2023-12-08",
    status: "VIP",
    avatar: "",
  },
]

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

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export function CustomersPage() {
  return (
    <div className="flex flex-col font-century">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-century">Customers</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold font-century">Customers</h2>
            <p className="text-muted-foreground">
              Manage your customer relationships and data
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.status === "VIP").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
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
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                    <TableCell className="font-medium">{customer.totalSpent}</TableCell>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
