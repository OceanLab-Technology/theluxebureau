// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { DateRange } from "react-day-picker"
// import { cn } from "@/lib/utils"
// import {
//   BarChart3,
//   TrendingUp,
//   TrendingDown,
//   CalendarIcon,
//   DollarSign,
//   Package,
//   Filter,
//   GitCompare,
//   ArrowUpRight,
//   ArrowDownRight
// } from "lucide-react"

// interface AnalyticsData {
//   mostSellingProducts: ProductSalesData[];
//   leastSellingProducts: ProductSalesData[];
//   totalRevenue: number;
//   revenueByProduct: ProductRevenueData[];
//   revenueByCategory: CategoryRevenueData[];
//   revenueGrowth: RevenueGrowthData;
//   comparisonData?: ComparisonData;
// }

// interface ProductSalesData {
//   product_id: string;
//   product_name: string;
//   category: string;
//   total_quantity: number;
//   total_revenue: number;
//   image_url?: string;
// }

// interface ProductRevenueData {
//   product_id: string;
//   product_name: string;
//   total_revenue: number;
//   total_quantity: number;
//   category: string;
// }

// interface CategoryRevenueData {
//   category: string;
//   total_revenue: number;
//   total_quantity: number;
//   product_count: number;
// }

// interface RevenueGrowthData {
//   current_period_revenue: number;
//   previous_period_revenue: number;
//   growth_percentage: number;
//   growth_amount: number;
// }

// interface ComparisonData {
//   period1: {
//     start_date: string;
//     end_date: string;
//     total_revenue: number;
//     total_orders: number;
//   };
//   period2: {
//     start_date: string;
//     end_date: string;
//     total_revenue: number;
//     total_orders: number;
//   };
//   revenue_change: number;
//   revenue_change_percentage: number;
//   orders_change: number;
//   orders_change_percentage: number;
// }

// export function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [dateFilter, setDateFilter] = useState('last30days')
//   const [customStartDate, setCustomStartDate] = useState('')
//   const [customEndDate, setCustomEndDate] = useState('')
//   const [compareMode, setCompareMode] = useState(false)
//   const [compareRange, setCompareRange] = useState<DateRange | undefined>()

//   const fetchAnalytics = async () => {
//     setLoading(true)
//     try {
//       const params = new URLSearchParams({
//         preset: dateFilter,
//         ...(dateFilter === 'custom' && customStartDate && customEndDate && {
//           startDate: customStartDate,
//           endDate: customEndDate
//         }),
//         ...(compareMode && compareRange?.from && compareRange?.to && {
//           compare: 'true',
//           period1Start: format(compareRange.from, 'yyyy-MM-dd'),
//           period1End: format(compareRange.to, 'yyyy-MM-dd'),
//           // For comparison, use the same period length but shifted back by the duration
//           period2Start: format(
//             new Date(compareRange.from.getTime() - (compareRange.to.getTime() - compareRange.from.getTime())), 
//             'yyyy-MM-dd'
//           ),
//           period2End: format(compareRange.from, 'yyyy-MM-dd')
//         })
//       })

//       const response = await fetch(`/api/analytics?${params}`)
//       const result = await response.json()

//       if (result.success) {
//         setData(result.data)
//       }
//     } catch (error) {
//       console.error('Failed to fetch analytics:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAnalytics()
//   }, [])

//   const handleDateFilterChange = (value: string) => {
//     setDateFilter(value)
//     if (value !== 'custom') {
//       fetchAnalytics()
//     }
//   }

//   const handleCustomDateApply = () => {
//     if (customStartDate && customEndDate) {
//       fetchAnalytics()
//     }
//   }

//   const handleComparisonApply = () => {
//     if (compareRange?.from && compareRange?.to) {
//       fetchAnalytics()
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'EUR'
//     }).format(amount)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-10 w-32" />
//         </div>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {[1, 2, 3, 4].map((i) => (
//             <Card key={i}>
//               <CardHeader>
//                 <Skeleton className="h-4 w-24" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-8 w-32 mb-2" />
//                 <Skeleton className="h-4 w-20" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6 font-century">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200] font-century">Analytics</h1>
//       </header>

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//           <p className="text-muted-foreground">
//             Track your business performance and insights
//           </p>
//         </div>

//         {/* <div className="flex items-center gap-4"> */}
//           {/* <Button
//             variant={compareMode ? "default" : "outline"}
//             onClick={() => setCompareMode(!compareMode)}
//             className="gap-2"
//           >
//             <GitCompare className="h-4 w-4" />
//             Compare Periods
//           </Button> */}

//           {/* {(compareMode || dateFilter === 'custom') && (
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setCompareMode(false)
//                 setCompareRange(undefined)
//                 setDateFilter('last30days')
//                 setCustomStartDate('')
//                 setCustomEndDate('')
//                 fetchAnalytics()
//               }}
//               className="gap-2"
//             >
//               <Filter className="h-4 w-4" />
//               Clear Filters
//             </Button>
//           )}
//            */}
//           <div className="flex items-center gap-2">
//             <Label htmlFor="date-filter">Period:</Label>
//             <Select value={dateFilter} onValueChange={handleDateFilterChange}>
//               <SelectTrigger className="w-40">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent className="w-40">
//                 <SelectItem value="today" >Today</SelectItem>
//                 <SelectItem value="yesterday">Yesterday</SelectItem>
//                 <SelectItem value="last7days">Last 7 Days</SelectItem>
//                 <SelectItem value="last30days">Last 30 Days</SelectItem>
//                 <SelectItem value="last90days">Last 90 Days</SelectItem>
//                 <SelectItem value="custom">Custom Range</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         {/* </div> */}
//       </div>

//       {/* Custom Date Range */}
//       {/* {dateFilter === 'custom' && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Custom Date Range</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-4">
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="start-date">Start Date</Label>
//                 <Input
//                   id="start-date"
//                   type="date"
//                   value={customStartDate}
//                   onChange={(e) => setCustomStartDate(e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="end-date">End Date</Label>
//                 <Input
//                   id="end-date"
//                   type="date"
//                   value={customEndDate}
//                   onChange={(e) => setCustomEndDate(e.target.value)}
//                 />
//               </div>
//               <Button onClick={handleCustomDateApply} className="mt-6">
//                 Apply
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//  */}
//       {/* Comparison Mode */}
//       {/* {compareMode && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Compare with Previous Period</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium mb-2">Select Date Range to Compare</h4>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !compareRange && "text-muted-foreground"
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {compareRange?.from && compareRange?.to ? (
//                         `${format(compareRange.from, "LLL dd, y")} - ${format(compareRange.to, "LLL dd, y")}`
//                       ) : (
//                         "Pick a date range"
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       initialFocus
//                       mode="range"
//                       defaultMonth={compareRange?.from}
//                       selected={compareRange}
//                       onSelect={setCompareRange}
//                       numberOfMonths={2}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//             <Button onClick={handleComparisonApply} className="mt-4" disabled={!compareRange?.from || !compareRange?.to}>
//               Compare Period
//             </Button>
//           </CardContent>
//         </Card>
//       )} */}

//       {/* Comparison Results */}
//       {/* {data?.comparisonData && (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Selected Period Revenue</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {formatCurrency(data.comparisonData.period1.total_revenue)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {formatDate(data.comparisonData.period1.start_date)} - {formatDate(data.comparisonData.period1.end_date)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Previous Period Revenue</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {formatCurrency(data.comparisonData.period2.total_revenue)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {formatDate(data.comparisonData.period2.start_date)} - {formatDate(data.comparisonData.period2.end_date)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Revenue Change</CardTitle>
//               {data.comparisonData.revenue_change >= 0 ? (
//                 <ArrowUpRight className="h-4 w-4 text-green-600" />
//               ) : (
//                 <ArrowDownRight className="h-4 w-4 text-red-600" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {formatCurrency(Math.abs(data.comparisonData.revenue_change))}
//               </div>
//               <p className={`text-xs flex items-center gap-1 ${
//                 data.comparisonData.revenue_change >= 0 ? "text-green-600" : "text-red-600"
//               }`}>
//                 {data.comparisonData.revenue_change_percentage.toFixed(1)}% 
//                 {data.comparisonData.revenue_change >= 0 ? " increase" : " decrease"}
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Orders Change</CardTitle>
//               {data.comparisonData.orders_change >= 0 ? (
//                 <ArrowUpRight className="h-4 w-4 text-green-600" />
//               ) : (
//                 <ArrowDownRight className="h-4 w-4 text-red-600" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {Math.abs(data.comparisonData.orders_change)}
//               </div>
//               <p className={`text-xs flex items-center gap-1 ${
//                 data.comparisonData.orders_change >= 0 ? "text-green-600" : "text-red-600"
//               }`}>
//                 {data.comparisonData.orders_change_percentage.toFixed(1)}% 
//                 {data.comparisonData.orders_change >= 0 ? " increase" : " decrease"}
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       )} */}

//       {/* Key Metrics */}
//       {data && !compareMode && (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
//               <p className={`text-xs flex items-center gap-1 ${
//                 data.revenueGrowth.growth_percentage >= 0 ? "text-green-600" : "text-red-600"
//               }`}>
//                 {data.revenueGrowth.growth_percentage >= 0 ? (
//                   <TrendingUp className="h-3 w-3" />
//                 ) : (
//                   <TrendingDown className="h-3 w-3" />
//                 )}
//                 {Math.abs(data.revenueGrowth.growth_percentage).toFixed(1)}% from previous period
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
//               {data.revenueGrowth.growth_amount >= 0 ? (
//                 <TrendingUp className="h-4 w-4 text-green-600" />
//               ) : (
//                 <TrendingDown className="h-4 w-4 text-red-600" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {formatCurrency(Math.abs(data.revenueGrowth.growth_amount))}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 vs {formatCurrency(data.revenueGrowth.previous_period_revenue)} previous period
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Product Categories</CardTitle>
//               <Package className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{data.revenueByCategory.length}</div>
//               <p className="text-xs text-muted-foreground">
//                 Active categories
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Analytics Tabs */}
//       <Tabs defaultValue="products" className="space-y-3">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="products">Products</TabsTrigger>
//           <TabsTrigger value="revenue">Revenue</TabsTrigger>
//           <TabsTrigger value="categories">Categories</TabsTrigger>
//           {/* <TabsTrigger value="trends">Trends</TabsTrigger> */}
//         </TabsList>

//         {/* Most/Least Selling Products */}
//         <TabsContent value="products" className="space-y-4">
//           <div className="grid gap-4 lg:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Most Selling Products</CardTitle>
//                 <CardDescription>
//                   Top performing products by quantity sold
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.mostSellingProducts.slice(0, 10).map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary" className="text-xs">
//                               {product.category}
//                             </Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">
//                           {formatCurrency(product.total_revenue)}
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           Revenue
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.mostSellingProducts || data.mostSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Least Selling Products</CardTitle>
//                 <CardDescription>
//                   Products that need attention - lowest quantity sold
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.leastSellingProducts.slice(0, 10).map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary" className="text-xs">
//                               {product.category}
//                             </Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">
//                           {formatCurrency(product.total_revenue)}
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           Revenue
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.leastSellingProducts || data.leastSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Revenue Analysis */}
//         <TabsContent value="revenue" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Product</CardTitle>
//               <CardDescription>
//                 Product-wise breakdown of total revenue
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByProduct.slice(0, 15).map((product, index) => (
//                   <div
//                     key={product.product_id}
//                     className="flex items-center justify-between p-3 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium truncate">{product.product_name}</p>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Badge variant="secondary" className="text-xs">
//                             {product.category}
//                           </Badge>
//                           <span>•</span>
//                           <span>{product.total_quantity} units</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-lg font-semibold">
//                         {formatCurrency(product.total_revenue)}
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Avg: {formatCurrency(product.total_revenue / product.total_quantity)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByProduct || data.revenueByProduct.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No revenue data available for the selected period
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Categories Analysis */}
//         <TabsContent value="categories" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Category</CardTitle>
//               <CardDescription>
//                 Category-wise aggregation of total revenue
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByCategory.map((category, index) => (
//                   <div
//                     key={category.category}
//                     className="flex items-center justify-between p-4 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-base font-semibold">{category.category}</p>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span>{category.total_quantity} units sold</span>
//                           <span>•</span>
//                           <span>{category.product_count} products</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xl font-bold">
//                         {formatCurrency(category.total_revenue)}
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         Avg per unit: {formatCurrency(category.total_revenue / category.total_quantity)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByCategory || data.revenueByCategory.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No category data available for the selected period
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Trends Analysis */}
//         {/* <TabsContent value="trends" className="space-y-4">
//           <div className="grid gap-4 lg:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue Growth Analysis</CardTitle>
//                 <CardDescription>
//                   Performance compared to previous period
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">Current Period</p>
//                       <p className="text-2xl font-bold">{formatCurrency(data?.revenueGrowth.current_period_revenue || 0)}</p>
//                     </div>
//                     <DollarSign className="h-8 w-8 text-muted-foreground" />
//                   </div>

//                   <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">Previous Period</p>
//                       <p className="text-2xl font-bold">{formatCurrency(data?.revenueGrowth.previous_period_revenue || 0)}</p>
//                     </div>
//                     <Calendar className="h-8 w-8 text-muted-foreground" />
//                   </div>

//                   <div className={`flex items-center justify-between p-4 rounded-lg ${
//                     (data?.revenueGrowth.growth_percentage || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'
//                   }`}>
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">Growth</p>
//                       <p className="text-2xl font-bold">
//                         {Math.abs(data?.revenueGrowth.growth_percentage || 0).toFixed(1)}%
//                       </p>
//                     </div>
//                     {(data?.revenueGrowth.growth_percentage || 0) >= 0 ? (
//                       <TrendingUp className="h-8 w-8 text-green-600" />
//                     ) : (
//                       <TrendingDown className="h-8 w-8 text-red-600" />
//                     )}
//                   </div>

//                   <div className="text-center text-sm text-muted-foreground">
//                     {(data?.revenueGrowth.growth_amount || 0) >= 0 ? (
//                       <span className="text-green-600">
//                         ↗ {formatCurrency(Math.abs(data?.revenueGrowth.growth_amount || 0))} increase
//                       </span>
//                     ) : (
//                       <span className="text-red-600">
//                         ↘ {formatCurrency(Math.abs(data?.revenueGrowth.growth_amount || 0))} decrease
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance Insights</CardTitle>
//                 <CardDescription>
//                   Key insights from your analytics data
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.mostSellingProducts && data.mostSellingProducts.length > 0 && (
//                     <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50">
//                       <p className="text-sm font-medium text-green-800">Top Performer</p>
//                       <p className="text-sm text-green-700">
//                         <strong>{data.mostSellingProducts[0].product_name}</strong> leads with{' '}
//                         {data.mostSellingProducts[0].total_quantity} units sold
//                       </p>
//                     </div>
//                   )}

//                   {data?.revenueByCategory && data.revenueByCategory.length > 0 && (
//                     <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
//                       <p className="text-sm font-medium text-blue-800">Category Leader</p>
//                       <p className="text-sm text-blue-700">
//                         <strong>{data.revenueByCategory[0].category}</strong> generates the most revenue at{' '}
//                         {formatCurrency(data.revenueByCategory[0].total_revenue)}
//                       </p>
//                     </div>
//                   )}

//                   {data?.leastSellingProducts && data.leastSellingProducts.length > 0 && (
//                     <div className="p-3 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50">
//                       <p className="text-sm font-medium text-yellow-800">Needs Attention</p>
//                       <p className="text-sm text-yellow-700">
//                         <strong>{data.leastSellingProducts[0].product_name}</strong> has only{' '}
//                         {data.leastSellingProducts[0].total_quantity} units sold
//                       </p>
//                     </div>
//                   )}

//                   {data?.revenueGrowth && (
//                     <div className={`p-3 rounded-lg border-l-4 ${
//                       data.revenueGrowth.growth_percentage >= 0 
//                         ? 'border-l-green-500 bg-green-50' 
//                         : 'border-l-red-500 bg-red-50'
//                     }`}>
//                       <p className={`text-sm font-medium ${
//                         data.revenueGrowth.growth_percentage >= 0 ? 'text-green-800' : 'text-red-800'
//                       }`}>
//                         Revenue Trend
//                       </p>
//                       <p className={`text-sm ${
//                         data.revenueGrowth.growth_percentage >= 0 ? 'text-green-700' : 'text-red-700'
//                       }`}>
//                         Revenue is {data.revenueGrowth.growth_percentage >= 0 ? 'growing' : 'declining'} by{' '}
//                         {Math.abs(data.revenueGrowth.growth_percentage).toFixed(1)}% compared to previous period
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent> */}
//       </Tabs>
//     </div>
//   )
// }








// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { DateRange } from "react-day-picker"
// import { DollarSign, Package, TrendingUp, TrendingDown, CalendarIcon } from "lucide-react"

// interface AnalyticsData {
//   mostSellingProducts: ProductSalesData[];
//   leastSellingProducts: ProductSalesData[];
//   totalRevenue: number;
//   revenueByProduct: ProductRevenueData[];
//   revenueByCategory: CategoryRevenueData[];
//   revenueGrowth: RevenueGrowthData;
//   comparisonData?: ComparisonData;
// }

// interface ProductSalesData {
//   product_id: string;
//   product_name: string;
//   category: string;
//   total_quantity: number;
//   total_revenue: number;
//   image_url?: string;
// }

// interface ProductRevenueData {
//   product_id: string;
//   product_name: string;
//   total_revenue: number;
//   total_quantity: number;
//   category: string;
// }

// interface CategoryRevenueData {
//   category: string;
//   total_revenue: number;
//   total_quantity: number;
//   product_count: number;
// }

// interface RevenueGrowthData {
//   current_period_revenue: number;
//   previous_period_revenue: number;
//   growth_percentage: number;
//   growth_amount: number;
// }

// interface ComparisonData {
//   period1: {
//     start_date: string;
//     end_date: string;
//     total_revenue: number;
//     total_orders: number;
//   };
//   period2: {
//     start_date: string;
//     end_date: string;
//     total_revenue: number;
//     total_orders: number;
//   };
//   revenue_change: number;
//   revenue_change_percentage: number;
//   orders_change: number;
//   orders_change_percentage: number;
// }

// export function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [dateFilter, setDateFilter] = useState("last30days")
//   const [customRange, setCustomRange] = useState<DateRange | undefined>()
//   const [customApplied, setCustomApplied] = useState(false)

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'EUR'
//     }).format(amount)
//   }

//   const fetchAnalytics = async () => {
//     setLoading(true)
//     try {
//       const params = new URLSearchParams({
//         preset: dateFilter,
//         ...(dateFilter === "custom" &&
//           customRange?.from &&
//           customRange?.to && {
//           startDate: format(customRange.from, "yyyy-MM-dd"),
//           endDate: format(customRange.to, "yyyy-MM-dd"),
//         }),
//       })

//       const response = await fetch(`/api/analytics?${params}`)
//       const result = await response.json()
//       if (result.success) {
//         setData(result.data)
//       }
//     } catch (error) {
//       console.error("Failed to fetch analytics:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (dateFilter !== "custom") {
//       fetchAnalytics()
//     }
//   }, [dateFilter])

//   const handleCustomApply = () => {
//     if (customRange?.from && customRange?.to) {
//       setDateFilter("custom")
//       setCustomApplied(true)
//       fetchAnalytics()
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-10 w-32" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6 font-century">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200] font-century">Analytics</h1>
//       </header>

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//           <p className="text-muted-foreground">Track your business performance and insights</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Label htmlFor="date-filter">Period:</Label>
//           <Select
//             value={dateFilter}
//             onValueChange={(val) => {
//               setDateFilter(val)
//               setCustomApplied(false)
//             }}
//           >
//             <SelectTrigger className="w-44">
//               <SelectValue
//                 placeholder="Select period"
//               // Show "Custom Range" once applied
//               >
//                 {dateFilter === "custom" && customApplied ? "Custom Range" : undefined}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="yesterday">Yesterday</SelectItem>
//               <SelectItem value="last7days">Last 7 Days</SelectItem>
//               <SelectItem value="last30days">Last 30 Days</SelectItem>
//               <SelectItem value="last90days">Last 90 Days</SelectItem>
//               <SelectItem value="custom">
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="flex w-full items-center justify-between"
//                     >
//                       <span>Custom Range</span>
//                       <CalendarIcon className="h-4 w-4 opacity-70" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-3" align="start">
//                     <Calendar
//                       mode="range"
//                       numberOfMonths={2}
//                       selected={customRange}
//                       onSelect={setCustomRange}
//                       initialFocus
//                     />
//                     <div className="flex justify-end mt-2">
//                       <Button
//                         size="sm"
//                         onClick={handleCustomApply}
//                         disabled={!customRange?.from || !customRange?.to}
//                       >
//                         Apply
//                       </Button>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//         <div className="flex items-center gap-2">
//           <Label htmlFor="date-filter">Period:</Label>
//           <Select
//             value={dateFilter}
//             onValueChange={(val) => {
//               setDateFilter(val)
//               setCustomApplied(false)
//             }}
//           >
//             <SelectTrigger className="w-44">
//               <SelectValue placeholder="Select period">
//                 {dateFilter === "custom" && customApplied ? "Custom Range" : undefined}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="yesterday">Yesterday</SelectItem>
//               <SelectItem value="last7days">Last 7 Days</SelectItem>
//               <SelectItem value="last30days">Last 30 Days</SelectItem>
//               <SelectItem value="last90days">Last 90 Days</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Calendar Popover - trigger separately */}
//           {dateFilter === "custom" && (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <CalendarIcon className="h-4 w-4" />
//                   {customRange?.from && customRange?.to
//                     ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`
//                     : "Pick Range"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-3" align="start">
//                 <Calendar
//                   mode="range"
//                   numberOfMonths={2}
//                   selected={customRange}
//                   onSelect={setCustomRange}
//                   initialFocus
//                 />
//                 <div className="flex justify-end mt-2">
//                   <Button
//                     size="sm"
//                     onClick={handleCustomApply}
//                     disabled={!customRange?.from || !customRange?.to}
//                   >
//                     Apply
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           )}
//         </div>



//         <Tabs defaultValue="products" className="space-y-3">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="products">Products</TabsTrigger>
//             <TabsTrigger value="revenue">Revenue</TabsTrigger>
//             <TabsTrigger value="categories">Categories</TabsTrigger>
//           </TabsList>

//           <TabsContent value="products" className="space-y-4">
//             <div className="grid gap-4 lg:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Most Selling Products</CardTitle>
//                   <CardDescription>
//                     Top performing products by quantity sold
//                   </CardDescription>
//                 </CardHeader>               <CardContent>
//                   <div className="space-y-4">
//                     {data?.mostSellingProducts.slice(0, 10).map((product, index) => (
//                       <div
//                         key={product.product_id}
//                         className="flex items-center justify-between p-3 rounded-lg border"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">
//                             {index + 1}
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium truncate">{product.product_name}</p>
//                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                               <Badge variant="secondary" className="text-xs">
//                                 {product.category}
//                               </Badge>
//                               <span>•</span>
//                               <span>{product.total_quantity} units sold</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm font-medium">
//                             {formatCurrency(product.total_revenue)}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             Revenue
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     {(!data?.mostSellingProducts || data.mostSellingProducts.length === 0) && (
//                       <div className="text-center py-8 text-muted-foreground">
//                         No product sales data available for the selected period
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Least Selling Products</CardTitle>
//                   <CardDescription>
//                     Products that need attention - lowest quantity sold
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {data?.leastSellingProducts.slice(0, 10).map((product, index) => (
//                       <div
//                         key={product.product_id}
//                         className="flex items-center justify-between p-3 rounded-lg border"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
//                             {index + 1}
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium truncate">{product.product_name}</p>
//                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                               <Badge variant="secondary" className="text-xs">
//                                 {product.category}
//                               </Badge>
//                               <span>•</span>
//                               <span>{product.total_quantity} units sold</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm font-medium">
//                             {formatCurrency(product.total_revenue)}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             Revenue
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     {(!data?.leastSellingProducts || data.leastSellingProducts.length === 0) && (
//                       <div className="text-center py-8 text-muted-foreground">
//                         No product sales data available for the selected period
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Revenue Analysis */}
//           <TabsContent value="revenue" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue by Product</CardTitle>
//                 <CardDescription>
//                   Product-wise breakdown of total revenue
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.revenueByProduct.slice(0, 15).map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary" className="text-xs">
//                               {product.category}
//                             </Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-lg font-semibold">
//                           {formatCurrency(product.total_revenue)}
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           Avg: {formatCurrency(product.total_revenue / product.total_quantity)}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.revenueByProduct || data.revenueByProduct.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No revenue data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Categories Analysis */}
//           <TabsContent value="categories" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue by Category</CardTitle>
//                 <CardDescription>
//                   Category-wise aggregation of total revenue
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.revenueByCategory.map((category, index) => (
//                     <div
//                       key={category.category}
//                       className="flex items-center justify-between p-4 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-base font-semibold">{category.category}</p>
//                           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                             <span>{category.total_quantity} units sold</span>
//                             <span>•</span>
//                             <span>{category.product_count} products</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xl font-bold">
//                           {formatCurrency(category.total_revenue)}
//                         </div>
//                         <div className="text-sm text-muted-foreground">
//                           Avg per unit: {formatCurrency(category.total_revenue / category.total_quantity)}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.revenueByCategory || data.revenueByCategory.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No category data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>



//       </div>
//       )
// }






























// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { DateRange } from "react-day-picker"
// import { CalendarIcon } from "lucide-react"

// interface AnalyticsData {
//   mostSellingProducts: ProductSalesData[];
//   leastSellingProducts: ProductSalesData[];
//   totalRevenue: number;
//   revenueByProduct: ProductRevenueData[];
//   revenueByCategory: CategoryRevenueData[];
//   revenueGrowth: RevenueGrowthData;
//   comparisonData?: ComparisonData;
// }

// interface ProductSalesData {
//   product_id: string;
//   product_name: string;
//   category: string;
//   total_quantity: number;
//   total_revenue: number;
//   image_url?: string;
// }

// interface ProductRevenueData {
//   product_id: string;
//   product_name: string;
//   total_revenue: number;
//   total_quantity: number;
//   category: string;
// }

// interface CategoryRevenueData {
//   category: string;
//   total_revenue: number;
//   total_quantity: number;
//   product_count: number;
// }

// interface RevenueGrowthData {
//   current_period_revenue: number;
//   previous_period_revenue: number;
//   growth_percentage: number;
//   growth_amount: number;
// }

// interface ComparisonData {
//   period1: {
//     start_date: string;
//     end_date: string;
//     total_revenue: number;
//     total_orders: number;
//   };
//   period2: {
//     start_date: string;
//     end_date: string;
//     total_revenue: number;
//     total_orders: number;
//   };
//   revenue_change: number;
//   revenue_change_percentage: number;
//   orders_change: number;
//   orders_change_percentage: number;
// }

// export function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [dateFilter, setDateFilter] = useState("last30days")
//   const [customRange, setCustomRange] = useState<DateRange | undefined>()
//   const [customApplied, setCustomApplied] = useState(false)

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount)

//   const fetchAnalytics = async () => {
//     setLoading(true)
//     try {
//       const params = new URLSearchParams({
//         preset: dateFilter,
//         ...(dateFilter === "custom" &&
//           customRange?.from &&
//           customRange?.to && {
//           startDate: format(customRange.from, "yyyy-MM-dd"),
//           endDate: format(customRange.to, "yyyy-MM-dd"),
//         }),
//       })

//       const response = await fetch(`/api/analytics?${params}`)
//       const result = await response.json()
//       if (result.success) {
//         setData(result.data)
//       }
//     } catch (error) {
//       console.error("Failed to fetch analytics:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (dateFilter !== "custom") {
//       fetchAnalytics()
//     } else if (customApplied) {
//       fetchAnalytics()
//     }
//   }, [dateFilter, customApplied])

//   const handleCustomApply = () => {
//     if (customRange?.from && customRange?.to) {
//       setCustomApplied(true)
//       fetchAnalytics()
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         {/* Header */}
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//           <SidebarTrigger className="-ml-1" />
//           <h1 className="text-lg font-[200] font-century">Analytics</h1>
//         </header>


//         {/* Sub-header */}
//         <div className="flex items-center justify-between mt-4">
//           <div>
//             <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//             <p className="text-muted-foreground">Track your business performance and insights</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-10 w-44" />
//             <Skeleton className="h-10 w-44" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="grid grid-cols-3 gap-4 mt-6">
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//         </div>

//         {/* Cards */}
//         <div className="grid gap-4 lg:grid-cols-2 mt-6">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="rounded-lg border p-4 space-y-4">
//               <Skeleton className="h-6 w-40" />
//               <Skeleton className="h-4 w-72" />
//               <div className="space-y-3">
//                 {[...Array(4)].map((_, j) => (
//                   <div key={j} className="flex items-center justify-between rounded-md border p-3">
//                     <div className="flex items-center gap-3">
//                       <Skeleton className="h-8 w-8 rounded-full" />
//                       <div className="space-y-2">
//                         <Skeleton className="h-4 w-40" />
//                         <Skeleton className="h-3 w-28" />
//                       </div>
//                     </div>
//                     <div className="text-right space-y-2">
//                       <Skeleton className="h-4 w-20 ml-auto" />
//                       <Skeleton className="h-3 w-16 ml-auto" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }


//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6 font-century">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200] font-century">Analytics</h1>
//       </header>

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//           <p className="text-muted-foreground">Track your business performance and insights</p>
//         </div>

//         <div className="flex items-center gap-2">
//           {dateFilter === "custom" && (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="h-12 w-44 flex items-center justify-start gap-2 text-bold text-center"
//                 >
//                               {/* <SelectTrigger className="w-44 h-10 px-2 text-bold text-center"> */}
//                   <CalendarIcon className="h-4 w-4" />
//                   {customRange?.from && customRange?.to
//                     ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`
//                     : "Pick Range"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-3" align="start">
//                 <Calendar
//                   mode="range"
//                   numberOfMonths={2}
//                   selected={customRange}
//                   onSelect={setCustomRange}
//                   initialFocus
//                 />
//                 <div className="flex justify-end mt-2">
//                   <Button
//                     size="sm"
//                     onClick={handleCustomApply}
//                     disabled={!customRange?.from || !customRange?.to}
//                   >
//                     Apply
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           )}


//           <Label htmlFor="date-filter">Period:</Label>
//           <Select
//             value={dateFilter}
//             onValueChange={(val) => {
//               setDateFilter(val)
//               setCustomApplied(false)
//             }}
//           >
//             {/* <SelectTrigger className="w-44 h-10 px-2 pt-2 pb-2 radius-sm"> */}
//             <SelectTrigger className="w-44 h-10 px-2 text-bold text-center">
//               <CalendarIcon className="h-4 w-4" />
//               <SelectValue placeholder="Select period">
//                 {dateFilter === "custom" && customApplied ? "Custom Range" : undefined}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="yesterday">Yesterday</SelectItem>
//               <SelectItem value="last7days">Last 7 Days</SelectItem>
//               <SelectItem value="last30days">Last 30 Days</SelectItem>
//               <SelectItem value="last90days">Last 90 Days</SelectItem>
//               <SelectItem value="custom">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>

//         </div>

//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="products" className="space-y-3">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="products">Products</TabsTrigger>
//           <TabsTrigger value="revenue">Revenue</TabsTrigger>
//           <TabsTrigger value="categories">Categories</TabsTrigger>
//         </TabsList>

//         {/* Products Tab */}
//         <TabsContent value="products" className="space-y-4">
//           <div className="grid gap-4 lg:grid-cols-2">
//             {/* Most Selling */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Most Selling Products</CardTitle>
//                 <CardDescription>Top performing products by quantity sold</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.mostSellingProducts?.slice(0, 10).map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary">{product.category}</Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
//                         <div className="text-xs text-muted-foreground">Revenue</div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.mostSellingProducts || data.mostSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Least Selling */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Least Selling Products</CardTitle>
//                 <CardDescription>Products that need attention - lowest quantity sold</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.leastSellingProducts?.slice(0, 10).map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary">{product.category}</Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
//                         <div className="text-xs text-muted-foreground">Revenue</div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.leastSellingProducts || data.leastSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Revenue Tab */}
//         <TabsContent value="revenue" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Product</CardTitle>
//               <CardDescription>Product-wise breakdown of total revenue</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByProduct?.slice(0, 15).map((product, index) => (
//                   <div
//                     key={product.product_id}
//                     className="flex items-center justify-between p-3 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium truncate">{product.product_name}</p>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Badge variant="secondary">{product.category}</Badge>
//                           <span>•</span>
//                           <span>{product.total_quantity} units</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-lg font-semibold">{formatCurrency(product.total_revenue)}</div>
//                       <div className="text-xs text-muted-foreground">
//                         Avg: {formatCurrency(product.total_revenue / product.total_quantity)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByProduct || data.revenueByProduct.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No revenue data available for the selected period
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Categories Tab */}
//         <TabsContent value="categories" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Category</CardTitle>
//               <CardDescription>Category-wise aggregation of total revenue</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByCategory?.map((category, index) => (
//                   <div
//                     key={category.category}
//                     className="flex items-center justify-between p-4 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-base font-semibold">{category.category}</p>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span>{category.total_quantity} units sold</span>
//                           <span>•</span>
//                           <span>{category.product_count} products</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xl font-bold">{formatCurrency(category.total_revenue)}</div>
//                       <div className="text-sm text-muted-foreground">
//                         Avg per unit: {formatCurrency(category.total_revenue / category.total_quantity)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByCategory || data.revenueByCategory.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No category data available for the selected period
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }





















// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { DateRange } from "react-day-picker"
// import { CalendarIcon } from "lucide-react"

// interface AnalyticsData {
//   mostSellingProducts: ProductSalesData[]
//   leastSellingProducts: ProductSalesData[]
//   totalRevenue: number
//   revenueByProduct: ProductRevenueData[]
//   revenueByCategory: CategoryRevenueData[]
//   revenueGrowth: RevenueGrowthData
//   comparisonData?: ComparisonData
// }

// interface ProductSalesData {
//   product_id: string
//   product_name: string
//   category: string
//   total_quantity: number
//   total_revenue: number
//   image_url?: string
// }

// interface ProductRevenueData {
//   product_id: string
//   product_name: string
//   total_revenue: number
//   total_quantity: number
//   category: string
// }

// interface CategoryRevenueData {
//   category: string
//   total_revenue: number
//   total_quantity: number
//   product_count: number
// }

// interface RevenueGrowthData {
//   current_period_revenue: number
//   previous_period_revenue: number
//   growth_percentage: number
//   growth_amount: number
// }

// interface ComparisonData {
//   period1: {
//     start_date: string
//     end_date: string
//     total_revenue: number
//     total_orders: number
//   }
//   period2: {
//     start_date: string
//     end_date: string
//     total_revenue: number
//     total_orders: number
//   }
//   revenue_change: number
//   revenue_change_percentage: number
//   orders_change: number
//   orders_change_percentage: number
// }

// function PaginationControls({
//   page,
//   totalPages,
//   onPrev,
//   onNext,
//   onSetPage,
//   limit,
//   onSetLimit,
//   disabled,
// }: {
//   page: number
//   totalPages: number
//   onPrev: () => void
//   onNext: () => void
//   onSetPage?: (n: number) => void
//   limit: number
//   onSetLimit: (n: number) => void
//   disabled?: boolean
// }) {
//   return (
//     <div className="flex items-center justify-between gap-4 mt-4">
//       <div className="flex items-center gap-2">
//         <Button variant="outline" size="sm" onClick={onPrev} disabled={disabled || page <= 1}>
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onSetPage?.(1)}
//           disabled={disabled || page <= 1}
//         >
//           First
//         </Button>
//       </div>

//       <div className="text-sm">
//         Page {page} of {totalPages}
//       </div>

//       <div className="flex items-center gap-2">
//         <Label htmlFor="limit-select" className="text-sm">
//           Per page:
//         </Label>
//         <Select value={String(limit)} onValueChange={(val) => onSetLimit(Number(val))}>
//           <SelectTrigger className="w-24 h-8 px-2 text-sm">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="5">5</SelectItem>
//             <SelectItem value="10">10</SelectItem>
//             <SelectItem value="20">20</SelectItem>
//             <SelectItem value="50">50</SelectItem>
//           </SelectContent>
//         </Select>

//         <Button variant="outline" size="sm" onClick={onNext} disabled={disabled || page >= totalPages}>
//           Next
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onSetPage?.(totalPages)}
//           disabled={disabled || page >= totalPages}
//         >
//           Last
//         </Button>
//       </div>
//     </div>
//   )
// }

// export function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [dateFilter, setDateFilter] = useState("last30days")
//   const [customRange, setCustomRange] = useState<DateRange | undefined>()
//   const [customApplied, setCustomApplied] = useState(false)

//   // active tab
//   const [activeTab, setActiveTab] = useState<"products" | "revenue" | "categories">("products")

//   // pagination states per-tab (page / limit / totalPages)
//   const [pageProducts, setPageProducts] = useState(1)
//   const [limitProducts, setLimitProducts] = useState(10)
//   const [totalPagesProducts, setTotalPagesProducts] = useState(1)

//   const [pageRevenue, setPageRevenue] = useState(1)
//   const [limitRevenue, setLimitRevenue] = useState(15)
//   const [totalPagesRevenue, setTotalPagesRevenue] = useState(1)

//   const [pageCategories, setPageCategories] = useState(1)
//   const [limitCategories, setLimitCategories] = useState(10)
//   const [totalPagesCategories, setTotalPagesCategories] = useState(1)

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount)

//   const resetPagesOnFilterChange = () => {
//     setPageProducts(1)
//     setPageRevenue(1)
//     setPageCategories(1)
//   }

//   const fetchAnalytics = async () => {
//     setLoading(true)
//     try {
//       // Build params; include page & limit for the active tab so the API can return paginated lists
//       const params = new URLSearchParams({
//         preset: dateFilter,
//         // attach page/limit according to activeTab
//         ...(activeTab === "products" ? { page: String(pageProducts), limit: String(limitProducts) } : {}),
//         ...(activeTab === "revenue" ? { page: String(pageRevenue), limit: String(limitRevenue) } : {}),
//         ...(activeTab === "categories" ? { page: String(pageCategories), limit: String(limitCategories) } : {}),
//         ...(dateFilter === "custom" &&
//           customRange?.from &&
//           customRange?.to && {
//           startDate: format(customRange.from, "yyyy-MM-dd"),
//           endDate: format(customRange.to, "yyyy-MM-dd"),
//         }),
//       })

//       const response = await fetch(`/api/analytics?${params}`)
//       const result = await response.json()

//       if (result.success) {
//         setData(result.data)

//         // Try to read total pages from a few common shapes the API might use.
//         // This is defensive: backend might return result.totalPages or result.meta?.products?.totalPages, etc.
//         const getTotalPages = (fallback = 1) => {
//           // 1) Top-level totalPages
//           if (typeof result.totalPages === "number") return result.totalPages
//           // 2) result.meta.{products|revenue|categories}.totalPages
//           if (result.meta) {
//             if (activeTab === "products" && result.meta.products?.totalPages) return result.meta.products.totalPages
//             if (activeTab === "revenue" && result.meta.revenue?.totalPages) return result.meta.revenue.totalPages
//             if (activeTab === "categories" && result.meta.categories?.totalPages) return result.meta.categories.totalPages
//           }
//           // 3) result.pagination?.products?.totalPages
//           if (result.pagination) {
//             if (activeTab === "products" && result.pagination.products?.totalPages) return result.pagination.products.totalPages
//             if (activeTab === "revenue" && result.pagination.revenue?.totalPages) return result.pagination.revenue.totalPages
//             if (activeTab === "categories" && result.pagination.categories?.totalPages) return result.pagination.categories.totalPages
//           }
//           // fallback
//           return fallback
//         }

//         const tp = getTotalPages(1)
//         if (activeTab === "products") setTotalPagesProducts(tp)
//         if (activeTab === "revenue") setTotalPagesRevenue(tp)
//         if (activeTab === "categories") setTotalPagesCategories(tp)
//       } else {
//         console.error("Analytics API returned success=false", result)
//       }
//     } catch (error) {
//       console.error("Failed to fetch analytics:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     // When date filter changes, reset pages and fetch
//     resetPagesOnFilterChange()
//     if (dateFilter !== "custom") {
//       fetchAnalytics()
//     } else if (customApplied) {
//       fetchAnalytics()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateFilter, customApplied, activeTab])

//   // Re-fetch when any pagination parameters change for their respective tab
//   useEffect(() => {
//     // Only fetch when activeTab is products because these page/limit belong to products
//     if (activeTab === "products") fetchAnalytics()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageProducts, limitProducts])

//   useEffect(() => {
//     if (activeTab === "revenue") fetchAnalytics()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageRevenue, limitRevenue])

//   useEffect(() => {
//     if (activeTab === "categories") fetchAnalytics()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageCategories, limitCategories])

//   const handleCustomApply = () => {
//     if (customRange?.from && customRange?.to) {
//       setCustomApplied(true)
//       resetPagesOnFilterChange()
//       fetchAnalytics()
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         {/* Header */}
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//           <SidebarTrigger className="-ml-1" />
//           <h1 className="text-lg font-[200] font-century">Analytics</h1>
//         </header>

//         {/* Sub-header */}
//         <div className="flex items-center justify-between mt-4">
//           <div>
//             <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//             <p className="text-muted-foreground">Track your business performance and insights</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-10 w-44" />
//             <Skeleton className="h-10 w-44" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="grid grid-cols-3 gap-4 mt-6">
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//         </div>

//         {/* Cards */}
//         <div className="grid gap-4 lg:grid-cols-2 mt-6">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="rounded-lg border p-4 space-y-4">
//               <Skeleton className="h-6 w-40" />
//               <Skeleton className="h-4 w-72" />
//               <div className="space-y-3">
//                 {[...Array(4)].map((_, j) => (
//                   <div key={j} className="flex items-center justify-between rounded-md border p-3">
//                     <div className="flex items-center gap-3">
//                       <Skeleton className="h-8 w-8 rounded-full" />
//                       <div className="space-y-2">
//                         <Skeleton className="h-4 w-40" />
//                         <Skeleton className="h-3 w-28" />
//                       </div>
//                     </div>
//                     <div className="text-right space-y-2">
//                       <Skeleton className="h-4 w-20 ml-auto" />
//                       <Skeleton className="h-3 w-16 ml-auto" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6 font-century">
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200] font-century">Analytics</h1>
//       </header>

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//           <p className="text-muted-foreground">Track your business performance and insights</p>
//         </div>

//         <div className="flex items-center gap-2">
//           {dateFilter === "custom" && (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="h-12 w-44 flex items-center justify-start gap-2 text-bold text-center"
//                 >
//                   <CalendarIcon className="h-4 w-4" />
//                   {customRange?.from && customRange?.to
//                     ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`
//                     : "Pick Range"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-3" align="start">
//                 <Calendar
//                   mode="range"
//                   numberOfMonths={2}
//                   selected={customRange}
//                   onSelect={setCustomRange}
//                   initialFocus
//                 />
//                 <div className="flex justify-end mt-2">
//                   <Button
//                     size="sm"
//                     onClick={handleCustomApply}
//                     disabled={!customRange?.from || !customRange?.to}
//                   >
//                     Apply
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           )}

//           <Label htmlFor="date-filter">Period:</Label>
//           <Select
//             value={dateFilter}
//             onValueChange={(val) => {
//               setDateFilter(val)
//               setCustomApplied(false)
//             }}
//           >
//             <SelectTrigger className="w-44 h-10 px-2 text-bold text-center">
//               <CalendarIcon className="h-4 w-4" />
//               <SelectValue placeholder="Select period">
//                 {dateFilter === "custom" && customApplied ? "Custom Range" : undefined}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="yesterday">Yesterday</SelectItem>
//               <SelectItem value="last7days">Last 7 Days</SelectItem>
//               <SelectItem value="last30days">Last 30 Days</SelectItem>
//               <SelectItem value="last90days">Last 90 Days</SelectItem>
//               <SelectItem value="custom">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Tabs
//         defaultValue="products"
//         value={activeTab}
//         onValueChange={(val) => {
//           setActiveTab(val as "products" | "revenue" | "categories")
//         }}
//         className="space-y-3"
//       >
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="products">Products</TabsTrigger>
//           <TabsTrigger value="revenue">Revenue</TabsTrigger>
//           <TabsTrigger value="categories">Categories</TabsTrigger>
//         </TabsList>

//         {/* Products Tab */}
//         <TabsContent value="products" className="space-y-4">
//           <div className="grid gap-4 lg:grid-cols-2">
//             {/* Most Selling */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Most Selling Products</CardTitle>
//                 <CardDescription>Top performing products by quantity sold</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.mostSellingProducts?.map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">
//                           {index + 1 + (pageProducts - 1) * limitProducts}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary">{product.category}</Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
//                         <div className="text-xs text-muted-foreground">Revenue</div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.mostSellingProducts || data.mostSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>

//                 <PaginationControls
//                   page={pageProducts}
//                   totalPages={totalPagesProducts}
//                   onPrev={() => setPageProducts((p) => Math.max(1, p - 1))}
//                   onNext={() => setPageProducts((p) => Math.min(totalPagesProducts, p + 1))}
//                   onSetPage={(n) => setPageProducts(n)}
//                   limit={limitProducts}
//                   onSetLimit={(n) => {
//                     setLimitProducts(n)
//                     setPageProducts(1)
//                   }}
//                   disabled={loading}
//                 />
//               </CardContent>
//             </Card>

//             {/* Least Selling */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Least Selling Products</CardTitle>
//                 <CardDescription>Products that need attention - lowest quantity sold</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.leastSellingProducts?.map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
//                           {index + 1 + (pageProducts - 1) * limitProducts}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary">{product.category}</Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
//                         <div className="text-xs text-muted-foreground">Revenue</div>
//                       </div>
//                     </div>
//                   ))}

//                   {(!data?.leastSellingProducts || data.leastSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>

//                 {/* Use same pagination controls as most-selling (products tab pagination) */}
//                 <PaginationControls
//                   page={pageProducts}
//                   totalPages={totalPagesProducts}
//                   onPrev={() => setPageProducts((p) => Math.max(1, p - 1))}
//                   onNext={() => setPageProducts((p) => Math.min(totalPagesProducts, p + 1))}
//                   onSetPage={(n) => setPageProducts(n)}
//                   limit={limitProducts}
//                   onSetLimit={(n) => {
//                     setLimitProducts(n)
//                     setPageProducts(1)
//                   }}
//                   disabled={loading}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Revenue Tab */}
//         <TabsContent value="revenue" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Product</CardTitle>
//               <CardDescription>Product-wise breakdown of total revenue</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByProduct?.map((product, index) => (
//                   <div
//                     key={product.product_id}
//                     className="flex items-center justify-between p-3 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
//                         {index + 1 + (pageRevenue - 1) * limitRevenue}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium truncate">{product.product_name}</p>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Badge variant="secondary">{product.category}</Badge>
//                           <span>•</span>
//                           <span>{product.total_quantity} units</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-lg font-semibold">{formatCurrency(product.total_revenue)}</div>
//                       <div className="text-xs text-muted-foreground">
//                         Avg: {formatCurrency(product.total_revenue / Math.max(1, product.total_quantity))}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByProduct || data.revenueByProduct.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No revenue data available for the selected period
//                   </div>
//                 )}
//               </div>

//               <PaginationControls
//                 page={pageRevenue}
//                 totalPages={totalPagesRevenue}
//                 onPrev={() => setPageRevenue((p) => Math.max(1, p - 1))}
//                 onNext={() => setPageRevenue((p) => Math.min(totalPagesRevenue, p + 1))}
//                 onSetPage={(n) => setPageRevenue(n)}
//                 limit={limitRevenue}
//                 onSetLimit={(n) => {
//                   setLimitRevenue(n)
//                   setPageRevenue(1)
//                 }}
//                 disabled={loading}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Categories Tab */}
//         <TabsContent value="categories" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Category</CardTitle>
//               <CardDescription>Category-wise aggregation of total revenue</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByCategory?.map((category, index) => (
//                   <div
//                     key={category.category}
//                     className="flex items-center justify-between p-4 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
//                         {index + 1 + (pageCategories - 1) * limitCategories}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-base font-semibold">{category.category}</p>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span>{category.total_quantity} units sold</span>
//                           <span>•</span>
//                           <span>{category.product_count} products</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xl font-bold">{formatCurrency(category.total_revenue)}</div>
//                       <div className="text-sm text-muted-foreground">
//                         Avg per unit: {formatCurrency(category.total_revenue / Math.max(1, category.total_quantity))}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByCategory || data.revenueByCategory.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No category data available for the selected period
//                   </div>
//                 )}
//               </div>

//               <PaginationControls
//                 page={pageCategories}
//                 totalPages={totalPagesCategories}
//                 onPrev={() => setPageCategories((p) => Math.max(1, p - 1))}
//                 onNext={() => setPageCategories((p) => Math.min(totalPagesCategories, p + 1))}
//                 onSetPage={(n) => setPageCategories(n)}
//                 limit={limitCategories}
//                 onSetLimit={(n) => {
//                   setLimitCategories(n)
//                   setPageCategories(1)
//                 }}
//                 disabled={loading}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



























// "use client"

// import { useState, useEffect } from "react"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CalendarIcon } from "lucide-react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { DateRange } from "react-day-picker"
// import { format } from "date-fns"

// interface AnalyticsData {
//   mostSellingProducts: ProductSalesData[];
//   leastSellingProducts: ProductSalesData[];
//   totalRevenue: number;
//   revenueByProduct: ProductRevenueData[];
//   revenueByCategory: CategoryRevenueData[];
//   revenueGrowth: RevenueGrowthData;
// }

// interface ProductSalesData {
//   product_id: string;
//   product_name: string;
//   category: string;
//   total_quantity: number;
//   total_revenue: number;
//   image_url?: string;
// }

// interface ProductRevenueData {
//   product_id: string;
//   product_name: string;
//   total_revenue: number;
//   total_quantity: number;
//   category: string;
// }

// interface CategoryRevenueData {
//   category: string;
//   total_revenue: number;
//   total_quantity: number;
//   product_count: number;
// }

// interface RevenueGrowthData {
//   current_period_revenue: number;
//   previous_period_revenue: number;
//   growth_percentage: number;
//   growth_amount: number;
// }

// export function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [dateFilter, setDateFilter] = useState("last30days")
//   const [customRange, setCustomRange] = useState<DateRange | undefined>()
//   const [customApplied, setCustomApplied] = useState(false)

//   // pagination
//   const [page, setPage] = useState(1)
//   const [limit, setLimit] = useState(5)
//   const [total, setTotal] = useState(0)

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount)

//   const fetchAnalytics = async () => {
//     setLoading(true)
//     try {
//       const params = new URLSearchParams({
//         preset: dateFilter,
//         page: page.toString(),
//         limit: limit.toString(),
//         ...(dateFilter === "custom" &&
//           customRange?.from &&
//           customRange?.to && {
//           startDate: format(customRange.from, "yyyy-MM-dd"),
//           endDate: format(customRange.to, "yyyy-MM-dd"),
//         }),
//       })

//       const response = await fetch(`/api/analytics?${params}`)
//       const result = await response.json()
//       if (result.success) {
//         setData(result.data)
//         setTotal(result.total || 0) // API should return total
//       }
//     } catch (error) {
//       console.error("Failed to fetch analytics:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (dateFilter !== "custom") {
//       fetchAnalytics()
//     } else if (customApplied) {
//       fetchAnalytics()
//     }
//   }, [dateFilter, customApplied, page, limit])

//   const handleCustomApply = () => {
//     if (customRange?.from && customRange?.to) {
//       setCustomApplied(true)
//       setPage(1)
//       fetchAnalytics()
//     }
//   }

//   const startEntry = (page - 1) * limit + 1
//   const endEntry = Math.min(page * limit, total)
//   const totalPages = Math.ceil(total / limit)

//   if (loading) {
//     return (
//       <div className="flex-1 p-8">
//         <p>Loading analytics...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6 font-century">
//       {/* Header */}
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
//         <SidebarTrigger className="-ml-1" />
//         <h1 className="text-lg font-[200] font-century">Analytics</h1>
//       </header>

//       {/* Filters */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
//           <p className="text-muted-foreground">Track your business performance and insights</p>
//         </div>

//         <div className="flex items-center gap-2">
//           {dateFilter === "custom" && (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="h-12 w-44 flex items-center justify-start gap-2">
//                   <CalendarIcon className="h-4 w-4" />
//                   {customRange?.from && customRange?.to
//                     ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`
//                     : "Pick Range"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-3" align="start">
//                 <Calendar
//                   mode="range"
//                   numberOfMonths={2}
//                   selected={customRange}
//                   onSelect={setCustomRange}
//                   initialFocus
//                 />
//                 <div className="flex justify-end mt-2">
//                   <Button
//                     size="sm"
//                     onClick={handleCustomApply}
//                     disabled={!customRange?.from || !customRange?.to}
//                   >
//                     Apply
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           )}

//           <Label htmlFor="date-filter">Period:</Label>
//           <Select
//             value={dateFilter}
//             onValueChange={(val) => {
//               setDateFilter(val)
//               setCustomApplied(false)
//             }}
//           >
//             <SelectTrigger className="w-44 h-10 px-2">
//               <CalendarIcon className="h-4 w-4" />
//               <SelectValue placeholder="Select period">
//                 {dateFilter === "custom" && customApplied ? "Custom Range" : undefined}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="yesterday">Yesterday</SelectItem>
//               <SelectItem value="last7days">Last 7 Days</SelectItem>
//               <SelectItem value="last30days">Last 30 Days</SelectItem>
//               <SelectItem value="last90days">Last 90 Days</SelectItem>
//               <SelectItem value="custom">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="products" className="space-y-3">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="products">Products</TabsTrigger>
//           <TabsTrigger value="revenue">Revenue</TabsTrigger>
//           <TabsTrigger value="categories">Categories</TabsTrigger>
//         </TabsList>

//         {/* Products Tab */}
//         <TabsContent value="products" className="space-y-4">
//           <div className="grid gap-4 lg:grid-cols-2">
//             {/* Most Selling */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Most Selling Products</CardTitle>
//                 <CardDescription>Top performing products by quantity sold</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.mostSellingProducts?.map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary">{product.category}</Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
//                         <div className="text-xs text-muted-foreground">Revenue</div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.mostSellingProducts || data.mostSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Least Selling */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Least Selling Products</CardTitle>
//                 <CardDescription>Products that need attention - lowest quantity sold</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data?.leastSellingProducts?.map((product, index) => (
//                     <div
//                       key={product.product_id}
//                       className="flex items-center justify-between p-3 rounded-lg border"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium truncate">{product.product_name}</p>
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <Badge variant="secondary">{product.category}</Badge>
//                             <span>•</span>
//                             <span>{product.total_quantity} units sold</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{formatCurrency(product.total_revenue)}</div>
//                         <div className="text-xs text-muted-foreground">Revenue</div>
//                       </div>
//                     </div>
//                   ))}
//                   {(!data?.leastSellingProducts || data.leastSellingProducts.length === 0) && (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No product sales data available for the selected period
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Revenue Tab */}
//         <TabsContent value="revenue" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Product</CardTitle>
//               <CardDescription>Product-wise breakdown of total revenue</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByProduct?.map((product, index) => (
//                   <div
//                     key={product.product_id}
//                     className="flex items-center justify-between p-3 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium truncate">{product.product_name}</p>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Badge variant="secondary">{product.category}</Badge>
//                           <span>•</span>
//                           <span>{product.total_quantity} units</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-lg font-semibold">{formatCurrency(product.total_revenue)}</div>
//                       <div className="text-xs text-muted-foreground">
//                         Avg: {formatCurrency(product.total_revenue / product.total_quantity)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByProduct || data.revenueByProduct.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No revenue data available for the selected period
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Categories Tab */}
//         <TabsContent value="categories" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue by Category</CardTitle>
//               <CardDescription>Category-wise aggregation of total revenue</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {data?.revenueByCategory?.map((category, index) => (
//                   <div
//                     key={category.category}
//                     className="flex items-center justify-between p-4 rounded-lg border"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-base font-semibold">{category.category}</p>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span>{category.total_quantity} units sold</span>
//                           <span>•</span>
//                           <span>{category.product_count} products</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xl font-bold">{formatCurrency(category.total_revenue)}</div>
//                       <div className="text-sm text-muted-foreground">
//                         Avg per unit: {formatCurrency(category.total_revenue / category.total_quantity)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(!data?.revenueByCategory || data.revenueByCategory.length === 0) && (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No category data available for the selected period
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Pagination */}
//       {total > 0 && (
//         <div className="flex items-center justify-between border-t pt-4">
//           <div className="text-sm text-muted-foreground">
//             Showing {startEntry} to {endEntry} of {total} entries
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setPage((p) => Math.max(p - 1, 1))}
//               disabled={page === 1}
//             >
//               Previous
//             </Button>
//             <span className="text-sm">
//               Page {page} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//               disabled={page === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


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
    new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount)

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
          <h1 className="text-lg font-[200] font-century">Analytics</h1>
        </header>


        {/* Sub-header */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
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
    <div className="flex-1 space-y-4 p-8 pt-6 font-century">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 -mx-8 -mt-6 mb-6">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-[200] font-century">Analytics</h1>
      </header>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold font-century">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your business performance and insights</p>
        </div>

        <div className="flex items-center gap-2">
          {dateFilter === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 w-44 flex items-center justify-start gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {customRange?.from && customRange?.to
                    ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`
                    : "Pick Range"}
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
            <SelectTrigger className="w-44 h-10 px-2">
              <CalendarIcon className="h-4 w-4" />
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
        onValueChange={(val: "products" | "revenue" | "categories") => {
          setCurrentTab(val)
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
