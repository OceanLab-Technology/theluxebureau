"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Eye,
  Calendar
} from "lucide-react"

// Dummy analytics data
const metrics = [
  {
    title: "Revenue",
    value: "€45,231.89",
    change: "+20.1%",
    changeType: "increase" as const,
    period: "from last month",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+180.1%",
    changeType: "increase" as const,
    period: "from last month",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "12,234",
    change: "+19%",
    changeType: "increase" as const,
    period: "from last month",
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-4.3%",
    changeType: "decrease" as const,
    period: "from last month",
    icon: BarChart3,
  },
]

const topProducts = [
  { name: "Luxury Rose Box", sales: 234, revenue: "€34,860", trend: "up" },
  { name: "Premium Champagne Gift", sales: 123, revenue: "€36,777", trend: "up" },
  { name: "Custom Perfume Collection", sales: 98, revenue: "€19,502", trend: "down" },
  { name: "Handcrafted Jewelry Box", sales: 87, revenue: "€7,743", trend: "up" },
  { name: "Artisan Chocolate Selection", sales: 156, revenue: "€7,020", trend: "up" },
]

const recentActivity = [
  { action: "New order placed", user: "Sarah Johnson", time: "2 minutes ago" },
  { action: "Product updated", user: "Admin", time: "15 minutes ago" },
  { action: "Customer registered", user: "Michael Chen", time: "1 hour ago" },
  { action: "Payment received", user: "Emma Williams", time: "2 hours ago" },
  { action: "Inventory updated", user: "Admin", time: "3 hours ago" },
]

export function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold font-century">Analytics</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-century">Analytics</h2>
            <p className="text-muted-foreground">
              Track your business performance and insights
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs flex items-center gap-1 ${
                  metric.changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.changeType === "increase" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change} {metric.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Best performing products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{product.revenue}</span>
                      {product.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions in your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue trends for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-8 w-8" />
                <p className="text-sm">Chart component would go here</p>
                <p className="text-xs">Integration with charts library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
