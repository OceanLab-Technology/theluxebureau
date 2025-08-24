"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Skeleton } from "../ui/skeleton"

interface AnalyticsData {
  mostSellingProducts: ProductSalesData[]
  leastSellingProducts: ProductSalesData[]
  totalRevenue: number
  revenueByProduct: ProductRevenueData[]
  revenueByCategory: CategoryRevenueData[]
  revenueGrowth: RevenueGrowthData
}

interface ProductSalesData {
  product_id: string
  product_name: string
  category: string
  total_quantity: number
  total_revenue: number
  image_url?: string
}

interface ProductRevenueData {
  product_id: string
  product_name: string
  total_revenue: number
  total_quantity: number
  category: string
}

interface CategoryRevenueData {
  category: string
  total_revenue: number
  total_quantity: number
  product_count: number
}

interface RevenueGrowthData {
  current_period_revenue: number
  previous_period_revenue: number
  growth_percentage: number
  growth_amount: number
}

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState("last30days")
  const [customRange, setCustomRange] = useState<DateRange | undefined>()
  const [customApplied, setCustomApplied] = useState(false)

  // pagination
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(7)
  const [total, setTotal] = useState(0)
  const [currentTab, setCurrentTab] = useState<"products" | "revenue" | "categories">("products")

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        preset: dateFilter,
        page: page.toString(),
        limit: limit.toString(),
        ...(dateFilter === "custom" &&
          customRange?.from &&
          customRange?.to && {
          startDate: format(customRange.from, "yyyy-MM-dd"),
          endDate: format(customRange.to, "yyyy-MM-dd"),
        }),
      })

      const response = await fetch(`/api/analytics?${params}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)

        // Select correct total based on current tab
        let tabTotal = 0
        switch (currentTab) {
          case "products":
            tabTotal = result.pagination?.totalMostSelling || 0
            break
          case "revenue":
            tabTotal = result.pagination?.totalRevenueByProduct || 0
            break
          case "categories":
            tabTotal = result.data.revenueByCategory?.length || 0
            break
        }
        setTotal(tabTotal)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dateFilter !== "custom") {
      fetchAnalytics()
    } else if (customApplied) {
      fetchAnalytics()
    }
  }, [dateFilter, customApplied, page, limit, currentTab])

  const handleCustomApply = () => {
    if (customRange?.from && customRange?.to) {
      setCustomApplied(true)
      setPage(1)
      fetchAnalytics()
    }
  }

  const startEntry = (page - 1) * limit + 1
  const endEntry = Math.min(page * limit, total)
  const totalPages = Math.ceil(total / limit)

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-[200] font-[Century-Old-Style]">Analytics</h1>
        </header>


        {/* Sub-header */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <h2 className="text-3xl font-semibold font-[Century-Old-Style]">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Track your business performance and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Cards */}
        <div className="grid gap-4 lg:grid-cols-2 mt-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-72" />
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 font-[Century-Old-Style]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200] font-[Century-Old-Style]">Analytics</h1>
      </header>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold font-[Century-Old-Style]">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your business performance and insights</p>
        </div>

        <div className="flex items-center gap-2">
          {dateFilter === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 flex items-center justify-center"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {customRange?.from && customRange?.to
                        ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`
                        : "Pick Range"}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={customRange}
                  onSelect={setCustomRange}
                  initialFocus
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleCustomApply}
                    disabled={!customRange?.from || !customRange?.to}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Label htmlFor="date-filter">Period:</Label>
          <Select
            value={dateFilter}
            onValueChange={(val) => {
              setDateFilter(val)
              setCustomApplied(false)
            }}
          >
            <SelectTrigger className="bg-foreground w-[170px] text-sm text-background font-[Century-Old-Style]">
              <CalendarIcon className="h-4 w-4 text-background" />
              <SelectValue placeholder="Select period">
                {dateFilter === "custom" && customApplied ? "Custom Range" : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={(val) => {
          setCurrentTab(val as "products" | "revenue" | "categories")
          setPage(1)
        }}
        className="space-y-3"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Most Selling Products</CardTitle>
                <CardDescription>Top performing products by quantity sold</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.mostSellingProducts?.map((product, index) => (
                    <div key={product.product_id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{product.product_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary">{product.category}</Badge>
                            <span>•</span>
                            <span>{product.total_quantity} units sold</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                  ))}
                  {(!data?.mostSellingProducts || data.mostSellingProducts.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">No product sales data available</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Least Selling Products</CardTitle>
                <CardDescription>Products with lowest quantity sold</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.leastSellingProducts?.map((product, index) => (
                    <div key={product.product_id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{product.product_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary">{product.category}</Badge>
                            <span>•</span>
                            <span>{product.total_quantity} units sold</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                  ))}
                  {(!data?.leastSellingProducts || data.leastSellingProducts.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">No product sales data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Product</CardTitle>
              <CardDescription>Product-wise breakdown of total revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.revenueByProduct?.map((product, index) => (
                  <div key={product.product_id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{product.product_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary">{product.category}</Badge>
                          <span>•</span>
                          <span>{product.total_quantity} units</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{formatCurrency(product.total_revenue)}</div>
                      <div className="text-xs text-muted-foreground">
                        Avg: {formatCurrency(product.total_revenue / product.total_quantity)}
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.revenueByProduct || data.revenueByProduct.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">No revenue data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Category-wise aggregation of total revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.revenueByCategory?.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold">{category.category}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{category.total_quantity} units sold</span>
                          <span>•</span>
                          <span>{category.product_count} products</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{formatCurrency(category.total_revenue)}</div>
                      <div className="text-sm text-muted-foreground">
                        Avg per unit: {formatCurrency(category.total_revenue / category.total_quantity)}
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.revenueByCategory || data.revenueByCategory.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">No category data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startEntry} to {endEntry} of {total} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
