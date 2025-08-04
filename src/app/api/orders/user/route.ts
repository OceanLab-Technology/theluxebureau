import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError, buildFilters } from "../../utils";

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
      .order("created_at", { ascending: false });

    for (const [key, value] of Object.entries(filters)) {
      if (key === "status") {
        query = query.ilike("status", value);
      } else {
        query = query.eq(key, value);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(error);
  }
}
