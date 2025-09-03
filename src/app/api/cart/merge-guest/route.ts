import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../../utils";
import { GuestCartItem } from "@/store/guestCartStore";

// // Merge guest cart items with user cart
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
//     const { guestItems }: { guestItems: GuestCartItem[] } = body;

//     if (!guestItems || !Array.isArray(guestItems)) {
//       return NextResponse.json(
//         { success: false, error: "Guest items are required" },
//         { status: 400 }
//       );
//     }

//     // Process each guest cart item
//     for (const guestItem of guestItems) {
//       // Check if item already exists in user's cart
//       const { data: existingItem } = await supabase
//         .from("cart_items")
//         .select("*")
//         .eq("user_id", user.id)
//         .eq("product_id", guestItem.product_id)
//         .single();

//       if (existingItem && !guestItem.custom_data) {
//         // Update existing item quantity if no custom data
//         await supabase
//           .from("cart_items")
//           .update({
//             quantity: existingItem.quantity + guestItem.quantity,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("id", existingItem.id);
//       } else {
//         // Create new item (either doesn't exist or has custom data)
//         await supabase
//           .from("cart_items")
//           .insert({
//             user_id: user.id,
//             product_id: guestItem.product_id,
//             quantity: guestItem.quantity,
//             custom_data: guestItem.custom_data || {},
//           });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Guest cart merged successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }


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

    if (guestItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items to migrate",
        migratedCount: 0,
      });
    }

    let migratedCount = 0;
    let errors: string[] = [];

    for (const guestItem of guestItems) {
      try {
        const variant = guestItem.selected_variant_name ?? null;
        const hasCustom = !!guestItem.custom_data;

        // Validate guest item
        if (!guestItem.product_id || !guestItem.quantity || guestItem.quantity <= 0) {
          errors.push(`Invalid item: ${guestItem.product_id || 'unknown'}`);
          continue;
        }

        if (hasCustom) {
          // Always insert personalised items
          const { error } = await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: guestItem.product_id,
            quantity: guestItem.quantity,
            custom_data: guestItem.custom_data,
            selected_variant_name: variant,
          });
          
          if (error) {
            errors.push(`Failed to migrate custom item ${guestItem.product_id}: ${error.message}`);
          } else {
            migratedCount++;
          }
          continue;
        }

        // Merge plain items by variant
        let q = supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", guestItem.product_id)
          .is("custom_data", null);

        if (variant === null) q = q.is("selected_variant_name", null);
        else q = q.eq("selected_variant_name", variant);

        const { data: existingItem, error: exErr } = await q.maybeSingle();
        if (exErr) throw exErr;

        if (existingItem) {
          const { error } = await supabase
            .from("cart_items")
            .update({
              quantity: existingItem.quantity + guestItem.quantity,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingItem.id);
            
          if (error) {
            errors.push(`Failed to update item ${guestItem.product_id}: ${error.message}`);
          } else {
            migratedCount++;
          }
        } else {
          const { error } = await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: guestItem.product_id,
            quantity: guestItem.quantity,
            custom_data: null, // normalize
            selected_variant_name: variant,
          });
          
          if (error) {
            errors.push(`Failed to create item ${guestItem.product_id}: ${error.message}`);
          } else {
            migratedCount++;
          }
        }
      } catch (itemError) {
        errors.push(`Error processing item ${guestItem.product_id}: ${itemError instanceof Error ? itemError.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: errors.length > 0 
        ? `Migrated ${migratedCount} items with ${errors.length} errors`
        : `Successfully migrated ${migratedCount} items`,
      migratedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return handleError(error);
  }
}
