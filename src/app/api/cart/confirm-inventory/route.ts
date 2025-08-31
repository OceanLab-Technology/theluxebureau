import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../../utils';
import { ApiResponse } from '../../types';

export interface ConfirmInventoryItem {
  product_id: string;
  quantity: number;
  selected_variant_name?: string;
}

export interface ConfirmInventoryResponse {
  success: boolean;
  confirmed_items: {
    product_id: string;
    variant_name: string;
    quantity: number;
  }[];
  failed_items: {
    product_id: string;
    variant_name: string;
    quantity: number;
    reason: string;
  }[];
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ConfirmInventoryResponse>>> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items }: { items: ConfirmInventoryItem[] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const confirmedItems: Array<{ product_id: string; variant_name: string; quantity: number }> = [];
    const failedItems: Array<{ product_id: string; variant_name: string; quantity: number; reason: string }> = [];

    // Process each item
    for (const item of items) {
      const { product_id, quantity, selected_variant_name = 'default' } = item;

      try {
        // Get current variant state
        const { data: variant, error: variantError } = await supabase
          .from('product_variants')
          .select('id, name, inventory, qty_blocked')
          .eq('product_id', product_id)
          .eq('name', selected_variant_name)
          .single();

        if (variantError || !variant) {
          failedItems.push({
            product_id,
            variant_name: selected_variant_name,
            quantity,
            reason: 'Variant not found',
          });
          continue;
        }

        // Ensure we don't confirm more than what's blocked
        const confirmQuantity = Math.min(quantity, variant.qty_blocked);

        // Confirm the sale: reduce qty_blocked (inventory was already reduced during reservation)
        const { error: updateError } = await supabase
          .from('product_variants')
          .update({
            qty_blocked: Math.max(0, variant.qty_blocked - confirmQuantity),
            updated_at: new Date().toISOString(),
          })
          .eq('id', variant.id);

        if (updateError) {
          failedItems.push({
            product_id,
            variant_name: selected_variant_name,
            quantity,
            reason: 'Failed to confirm inventory',
          });
          continue;
        }

        confirmedItems.push({
          product_id,
          variant_name: selected_variant_name,
          quantity: confirmQuantity,
        });

      } catch (error) {
        failedItems.push({
          product_id,
          variant_name: selected_variant_name,
          quantity,
          reason: 'Internal error during confirmation',
        });
      }
    }

    const response: ConfirmInventoryResponse = {
      success: failedItems.length === 0,
      confirmed_items: confirmedItems,
      failed_items: failedItems,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {
    return handleError(error);
  }
}
