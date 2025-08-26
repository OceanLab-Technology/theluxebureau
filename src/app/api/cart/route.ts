import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../utils";
import { CartItem, ApiResponse } from "../types";

// Get user's cart items
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

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return handleError(error);
  }
}

// Add item to cart
// export async function POST(request: NextRequest) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();
//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     if (!body.product_id || !body.quantity) {
//       return NextResponse.json(
//         { success: false, error: "Product ID and quantity are required" },
//         { status: 400 }
//       );
//     }

//     // Check if item already exists in cart
//     const { data: existingItem } = await supabase
//       .from("cart_items")
//       .select("*")
//       .eq("user_id", user.id)
//       .eq("product_id", body.product_id)
//       .single();

//     if (existingItem) {
    
//       // if existing item has custom data, create a new item with custom data
//       if (existingItem && body.custom_data) {
//         const newItemWithCustomData = await supabase
//           .from("cart_items")
//           .insert({
//             user_id: user.id,
//             product_id: body.product_id,
//             quantity: body.quantity,
//             custom_data: body.custom_data,
//             selected_variant_name: body.selected_variant_name
//           })
//           .select()
//           .single();

//         if (newItemWithCustomData.error) {
//           throw newItemWithCustomData.error;
//         }

//         return NextResponse.json({
//           success: true,
//           data: newItemWithCustomData.data,
//           message: "Item added to cart with custom data",
//         });

//         // Update existing item if no custom data is provided
//       } else {
//         const { data, error } = await supabase
//           .from("cart_items")
//           .update({
//             quantity: existingItem.quantity + parseInt(body.quantity),
//             updated_at: new Date().toISOString(),
//           })
//           .eq("id", existingItem.id)
//           .select()
//           .single();

//         if (error) throw error;

//         return NextResponse.json({
//           success: true,
//           data: data,
//           message: "Cart item updated successfully",
//         });
//       }
//     } else {
//       // Create new item
//       const cartData: Partial<CartItem> = {
//         user_id: user.id,
//         product_id: body.product_id,
//         quantity: parseInt(body.quantity),
//         custom_data: body.custom_data || {},
//         selected_variant_name: body.selected_variant_name
//       };

//       const { data, error } = await supabase
//         .from("cart_items")
//         .insert(cartData)
//         .select()
//         .single();

//       if (error) throw error;

//       return NextResponse.json({
//         success: true,
//         data: data,
//         message: "Item added to cart successfully",
//       });
//     }
//   } catch (error) {
//     return handleError(error);
//   }
// }

// Add item to cart
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
    const productId = body.product_id;
    const quantity  = parseInt(body.quantity);
    const custom    = body.custom_data ?? null; // <- null means “no personalization”
    const variant   = body.selected_variant_name ?? null;

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // If item has custom data, ALWAYS create a new row (don’t merge).
    if (custom !== null) {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
          custom_data: custom,
          selected_variant_name: variant,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: "Item added to cart with custom data",
      });
    }

    // No custom data: try to merge with an existing “plain” item of the same variant.
    // IMPORTANT: match on variant (including NULL vs string).
    let query = supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .is("custom_data", null);

    if (variant === null) {
      query = query.is("selected_variant_name", null);
    } else {
      query = query.eq("selected_variant_name", variant);
    }

    // maybeSingle avoids 0-row errors
    const { data: existingItem, error: existingErr } = await query.maybeSingle();
    if (existingErr) throw existingErr;

    if (existingItem) {
      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: "Cart item updated successfully",
      });
    }

    // Create new plain item (no custom)
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        custom_data: null,                 // <- use null, not {}
        selected_variant_name: variant,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}


// Clear user's cart
export async function DELETE(request: NextRequest) {
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

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
