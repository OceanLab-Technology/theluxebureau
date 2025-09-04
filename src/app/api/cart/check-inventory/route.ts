import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../../utils";
import { ApiResponse } from "../../types";

export interface InventoryCheckItem {
  product_id: string;
  quantity: number;
  selected_variant_name?: string;
}

export interface InventoryCheckResult {
  product_id: string;
  product_name: string;
  variant_name: string;
  requested_quantity: number;
  available_quantity: number;
  is_available: boolean;
}

export interface InventoryCheckResponse {
  all_available: boolean;
  unavailable_items: InventoryCheckResult[];
  warnings: InventoryCheckResult[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<InventoryCheckResponse>>> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items }: { items: InventoryCheckItem[] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Items array is required" },
        { status: 400 }
      );
    }

    const unavailableItems: InventoryCheckResult[] = [];
    const warnings: InventoryCheckResult[] = [];

    for (const item of items) {
      const { product_id, quantity, selected_variant_name = "default" } = item;

      console.log(`Checking inventory for product: ${product_id}, variant: "${selected_variant_name}", quantity: ${quantity}`);

      const normalizedVariantName = selected_variant_name.toLowerCase();

      const { data: variant, error: variantError } = await supabase
        .from("product_variants")
        .select(`
          id, name, inventory, threshold, qty_blocked,
          products(id, name)
        `)
        .eq("product_id", product_id)
        .eq("name", normalizedVariantName)
        .single();

      console.log("variant found:", variant);

      if (variantError || !variant) {
        console.log(`Variant "${normalizedVariantName}" not found for product ${product_id}`);
        
        // Get all variants for this product to show available options
        const { data: allVariants } = await supabase
          .from("product_variants")
          .select("name")
          .eq("product_id", product_id);

        console.log(`Available variants for product ${product_id}:`, allVariants?.map(v => v.name));
        
        unavailableItems.push({
          product_id,
          product_name: "Unknown Product",
          variant_name: selected_variant_name,
          requested_quantity: quantity,
          available_quantity: 0,
          is_available: false,
        });
        continue;
      }

      const availableQuantity = Math.max(
        0,
        variant.inventory - variant.qty_blocked
      );
      const isAvailable = availableQuantity >= quantity;

      const result: InventoryCheckResult = {
        product_id,
        product_name: (variant.products as any)?.name || "Unknown Product",
        variant_name: variant.name,
        requested_quantity: quantity,
        available_quantity: availableQuantity,
        is_available: isAvailable,
      };

      if (!isAvailable) {
        unavailableItems.push(result);
      } else if (availableQuantity <= variant.threshold) {
        warnings.push(result);
      }
    }

    const response: InventoryCheckResponse = {
      all_available: unavailableItems.length === 0,
      unavailable_items: unavailableItems,
      warnings: warnings,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    return handleError(error);
  }
}
