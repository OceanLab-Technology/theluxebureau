import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError, buildFilters, parseQueryParams } from "../../utils";

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

    const allowedFilters = ["status", "payment_status", "delivery_status"];
    const filters = buildFilters(searchParams, allowedFilters);
    
    // Parse pagination parameters
    const { page, limit, offset } = parseQueryParams(searchParams);
    // Override limit to 3 for orders
    const ordersLimit = 3;
    const ordersOffset = (page - 1) * ordersLimit;

    // order either payment_status 
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_1
          )
        )
        `
      )
      .eq("user_email", user.email)
      .eq("payment_status", "completed")
      // .eq("status", "Active")
      .order("created_at", { ascending: false }) // newest orders first
      .range(ordersOffset, ordersOffset + ordersLimit - 1); // Apply pagination

    for (const [key, value] of Object.entries(filters)) {
      if (key === "status") {
        query = query.ilike("status", value);
      } else {
        query = query.eq(key, value);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Get total count for pagination
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_email", user.email)
      .eq("payment_status", "completed");

    const totalPages = Math.ceil((count || 0) / ordersLimit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit: ordersLimit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
