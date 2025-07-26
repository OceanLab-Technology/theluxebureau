"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Euro, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Clock,
  Package,
  Calendar
} from "lucide-react"

// Dummy data
const stats = [
  {
    title: "Total Revenue",
    value: "€149.00",
    change: "+13.5% from last month",
    changeType: "increase" as const,
    icon: Euro,
  },
  {
    title: "Orders",
    value: "6",
    change: "+4.2% from last month",
    changeType: "increase" as const,
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "0",
    change: "+15.3% from last month",
    changeType: "increase" as const,
    icon: Users,
  },
  {
    title: "Growth Rate",
    value: "0.0%",
    change: "+2.4% from last month",
    changeType: "increase" as const,
    icon: TrendingUp,
  },
]

const recentActivities = [
  {
    id: 1,
    type: "created",
    title: "New product created: TEST 1234567890",
    description: "€100.000 • Stock: 0",
    timestamp: "15.07.2025 14:31",
    status: "Created",
  },
  {
    id: 2,
    type: "updated",
    title: "Product updated: Test",
    description: "€30.00 • Stock: 10",
    timestamp: "15.07.2025 14:29",
    status: "Updated",
  },
  {
    id: 3,
    type: "updated",
    title: "Product updated: Test",
    description: "€30 • Stock: 10",
    timestamp: "15.07.2025 14:28",
    status: "Updated",
  },
  {
    id: 4,
    type: "updated",
    title: "Product updated: Test",
    description: "€30 • Stock: 10",
    timestamp: "15.07.2025 14:24",
    status: "Updated",
  },
  {
    id: 5,
    type: "updated",
    title: "Product updated: Test",
    description: "€30 • Stock: 10",
    timestamp: "15.07.2025 14:21",
    status: "Updated",
  },
  {
    id: 6,
    type: "updated",
    title: "Product updated: Test",
    description: "€30 • Stock: 10",
    timestamp: "15.07.2025 14:21",
    status: "Updated",
  },
]

export function AdminDashboard() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold font-century">Admin Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-century">Overview</h2>
            <p className="text-muted-foreground">
              Welcome to your admin dashboard. Here's an overview of your business performance.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="grid gap-4 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Recent Activities</CardTitle>
              </div>
              <CardDescription>
                Real user activities from the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.type === "created" ? "default" : "secondary"}
                      className="ml-auto"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
