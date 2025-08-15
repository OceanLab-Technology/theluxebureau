import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../utils";

export interface AnalyticsData {
  mostSellingProducts: ProductSalesData[];
  leastSellingProducts: ProductSalesData[];
  totalRevenue: number;
  revenueByProduct: ProductRevenueData[];
  revenueByCategory: CategoryRevenueData[];
  revenueGrowth: RevenueGrowthData;
  comparisonData?: ComparisonData;
}

export interface ProductSalesData {
  product_id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
  image_url?: string;
}

export interface ProductRevenueData {
  product_id: string;
  product_name: string;
  total_revenue: number;
  total_quantity: number;
  category: string;
}

export interface CategoryRevenueData {
  category: string;
  total_revenue: number;
  total_quantity: number;
  product_count: number;
}

export interface RevenueGrowthData {
  current_period_revenue: number;
  previous_period_revenue: number;
  growth_percentage: number;
  growth_amount: number;
}

export interface ComparisonData {
  period1: {
    start_date: string;
    end_date: string;
    total_revenue: number;
    total_orders: number;
  };
  period2: {
    start_date: string;
    end_date: string;
    total_revenue: number;
    total_orders: number;
  };
  revenue_change: number;
  revenue_change_percentage: number;
  orders_change: number;
  orders_change_percentage: number;
}

function getDateRange(
  preset: string,
  customStart?: string,
  customEnd?: string
) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);

  if (preset === "custom" && customStart && customEnd) {
    startDate = new Date(customStart);
    endDate = new Date(customEnd);
  } else {
    switch (preset) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "last7days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "last30days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "last90days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
    }
  }

  return { startDate, endDate };
}

function getPreviousPeriod(startDate: Date, endDate: Date) {
  const periodLength = endDate.getTime() - startDate.getTime();
  const previousEndDate = new Date(startDate.getTime() - 1);
  const previousStartDate = new Date(previousEndDate.getTime() - periodLength);

  return { previousStartDate, previousEndDate };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get("preset") || "last30days";
    const customStart = searchParams.get("startDate");
    const customEnd = searchParams.get("endDate");
    const compareMode = searchParams.get("compare") === "true";
    const comparePeriod1Start = searchParams.get("period1Start");
    const comparePeriod1End = searchParams.get("period1End");
    const comparePeriod2Start = searchParams.get("period2Start");
    const comparePeriod2End = searchParams.get("period2End");

    let { startDate, endDate } = getDateRange(
      preset,
      customStart || undefined,
      customEnd || undefined
    );

    // Base query for orders with order items and products
    const baseQuery = `
      *,
      order_items (
        quantity,
        price_at_purchase,
        products (
          id,
          name,
          category,
          image_1
        )
      )
    `;

    // Get orders for the selected period
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(baseQuery)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .eq("payment_status", "completed");

    if (ordersError) throw ordersError;

    // Calculate analytics data
    const productSalesMap = new Map<string, ProductSalesData>();
    const categoryRevenueMap = new Map<string, CategoryRevenueData>();
    const categoryProductsSet = new Map<string, Set<string>>(); // Track unique products per category
    let totalRevenue = 0;

    orders?.forEach((order) => {
      order.order_items?.forEach((item: any) => {
        const product = item.products;
        if (!product) return;

        const key = product.id;
        const existing = productSalesMap.get(key);
        // Calculate item revenue using quantity * price_at_purchase
        const itemRevenue = item.quantity * item.price_at_purchase;

        totalRevenue += itemRevenue;

        if (existing) {
          existing.total_quantity += item.quantity;
          existing.total_revenue += itemRevenue;
        } else {
          productSalesMap.set(key, {
            product_id: product.id,
            product_name: product.name,
            category: product.category || "Uncategorized",
            total_quantity: item.quantity,
            total_revenue: itemRevenue,
            image_url: product.image_1,
          });
        }

        // Category revenue aggregation
        const category = product.category || "Uncategorized";
        const existingCategory = categoryRevenueMap.get(category);
        
        // Track unique products per category
        if (!categoryProductsSet.has(category)) {
          categoryProductsSet.set(category, new Set());
        }
        categoryProductsSet.get(category)!.add(product.id);
        
        if (existingCategory) {
          existingCategory.total_revenue += itemRevenue;
          existingCategory.total_quantity += item.quantity;
          existingCategory.product_count = categoryProductsSet.get(category)!.size;
        } else {
          categoryRevenueMap.set(category, {
            category,
            total_revenue: itemRevenue,
            total_quantity: item.quantity,
            product_count: categoryProductsSet.get(category)!.size,
          });
        }
      });
    });

    // Convert maps to arrays and sort
    const productSalesArray = Array.from(productSalesMap.values());
    const mostSellingProducts = productSalesArray.sort(
      (a, b) => b.total_quantity - a.total_quantity
    );
    const leastSellingProducts = productSalesArray.sort(
      (a, b) => a.total_quantity - b.total_quantity
    );

    const revenueByProduct = productSalesArray
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        total_revenue: item.total_revenue,
        total_quantity: item.total_quantity,
        category: item.category,
      }));

    const revenueByCategory = Array.from(categoryRevenueMap.values()).sort(
      (a, b) => b.total_revenue - a.total_revenue
    );

    // Calculate revenue growth
    const { previousStartDate, previousEndDate } = getPreviousPeriod(
      startDate,
      endDate
    );

    const { data: previousOrders, error: previousOrdersError } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", previousStartDate.toISOString())
      .lte("created_at", previousEndDate.toISOString())
      .eq("payment_status", "completed");

    if (previousOrdersError) throw previousOrdersError;

    const previousRevenue =
      previousOrders?.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      ) || 0;
    const growthAmount = totalRevenue - previousRevenue;
    const growthPercentage =
      previousRevenue > 0 ? (growthAmount / previousRevenue) * 100 : 0;

    const revenueGrowth: RevenueGrowthData = {
      current_period_revenue: totalRevenue,
      previous_period_revenue: previousRevenue,
      growth_percentage: growthPercentage,
      growth_amount: growthAmount,
    };

    // Handle comparison mode
    let comparisonData: ComparisonData | undefined;
    if (
      compareMode &&
      comparePeriod1Start &&
      comparePeriod1End &&
      comparePeriod2Start &&
      comparePeriod2End
    ) {
      const period1Start = new Date(comparePeriod1Start);
      const period1End = new Date(comparePeriod1End);
      const period2Start = new Date(comparePeriod2Start);
      const period2End = new Date(comparePeriod2End);

      // Get data for both periods
      const [period1Data, period2Data] = await Promise.all([
        supabase
          .from("orders")
          .select("total_amount, id")
          .gte("created_at", period1Start.toISOString())
          .lte("created_at", period1End.toISOString())
          .eq("payment_status", "completed"),
        supabase
          .from("orders")
          .select("total_amount, id")
          .gte("created_at", period2Start.toISOString())
          .lte("created_at", period2End.toISOString())
          .eq("payment_status", "completed"),
      ]);

      if (period1Data.error) throw period1Data.error;
      if (period2Data.error) throw period2Data.error;

      const period1Revenue =
        period1Data.data?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        ) || 0;
      const period2Revenue =
        period2Data.data?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        ) || 0;
      const period1Orders = period1Data.data?.length || 0;
      const period2Orders = period2Data.data?.length || 0;

      const revenueChange = period2Revenue - period1Revenue;
      const revenueChangePercentage =
        period1Revenue > 0 ? (revenueChange / period1Revenue) * 100 : 0;
      const ordersChange = period2Orders - period1Orders;
      const ordersChangePercentage =
        period1Orders > 0 ? (ordersChange / period1Orders) * 100 : 0;

      comparisonData = {
        period1: {
          start_date: period1Start.toISOString(),
          end_date: period1End.toISOString(),
          total_revenue: period1Revenue,
          total_orders: period1Orders,
        },
        period2: {
          start_date: period2Start.toISOString(),
          end_date: period2End.toISOString(),
          total_revenue: period2Revenue,
          total_orders: period2Orders,
        },
        revenue_change: revenueChange,
        revenue_change_percentage: revenueChangePercentage,
        orders_change: ordersChange,
        orders_change_percentage: ordersChangePercentage,
      };
    }

    const analyticsData: AnalyticsData = {
      mostSellingProducts,
      leastSellingProducts,
      totalRevenue,
      revenueByProduct,
      revenueByCategory,
      revenueGrowth,
      comparisonData,
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    return handleError(error);
  }
}
