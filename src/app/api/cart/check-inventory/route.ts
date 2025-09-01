import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../../utils';
import { ApiResponse } from '../../types';

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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<InventoryCheckResponse>>> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items }: { items: InventoryCheckItem[] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const unavailableItems: InventoryCheckResult[] = [];
    const warnings: InventoryCheckResult[] = [];

    // Check each item's availability
    for (const item of items) {
      const { product_id, quantity, selected_variant_name = 'default' } = item;

      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          id, name,
          product_variants(id, name, inventory, threshold, qty_blocked)
        `)
        .eq('id', product_id)
        .single();

      if (productError || !product) {
        unavailableItems.push({
          product_id,
          product_name: 'Unknown Product',
          variant_name: selected_variant_name,
          requested_quantity: quantity,
          available_quantity: 0,
          is_available: false,
        });
        continue;
      }

      // Find the specific variant
      const variants = product.product_variants || [];
      const variant = variants.find(v => v.name === selected_variant_name);

      if (!variant) {
        unavailableItems.push({
          product_id,
          product_name: product.name,
          variant_name: selected_variant_name,
          requested_quantity: quantity,
          available_quantity: 0,
          is_available: false,
        });
        continue;
      }

      // Calculate available quantity (inventory - qty_blocked)
      const availableQuantity = Math.max(0, variant.inventory - variant.qty_blocked);
      const isAvailable = availableQuantity >= quantity;

      const result: InventoryCheckResult = {
        product_id,
        product_name: product.name,
        variant_name: variant.name,
        requested_quantity: quantity,
        available_quantity: availableQuantity,
        is_available: isAvailable,
      };

      if (!isAvailable) {
        unavailableItems.push(result);
      } else if (availableQuantity <= variant.threshold) {
        // Add warning if stock is low (at or below threshold)
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
