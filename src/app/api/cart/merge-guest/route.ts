import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../../utils";
import { GuestCartItem } from "@/store/guestCartStore";

// Merge guest cart items with user cart
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { guestItems }: { guestItems: GuestCartItem[] } = body;

    if (!guestItems || !Array.isArray(guestItems)) {
      return NextResponse.json(
        { success: false, error: "Guest items are required" },
        { status: 400 }
      );
    }

    // Process each guest cart item
    for (const guestItem of guestItems) {
      // Check if item already exists in user's cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", guestItem.product_id)
        .single();

      if (existingItem && !guestItem.custom_data) {
        // Update existing item quantity if no custom data
        await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + guestItem.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);
      } else {
        // Create new item (either doesn't exist or has custom data)
        await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: guestItem.product_id,
            quantity: guestItem.quantity,
            custom_data: guestItem.custom_data || {},
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Guest cart merged successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
