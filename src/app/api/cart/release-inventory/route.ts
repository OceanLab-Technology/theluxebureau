import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../../utils';
import { ApiResponse } from '../../types';

export interface ReleaseInventoryItem {
  product_id: string;
  quantity: number;
  selected_variant_name?: string;
}

export interface ReleaseInventoryResponse {
  success: boolean;
  released_items: {
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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ReleaseInventoryResponse>>> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items }: { items: ReleaseInventoryItem[] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const releasedItems: Array<{ product_id: string; variant_name: string; quantity: number }> = [];
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

        // Ensure we don't release more than what's blocked
        const releaseQuantity = Math.min(quantity, variant.qty_blocked);

        // Release the inventory: restore inventory and reduce qty_blocked
        const { error: updateError } = await supabase
          .from('product_variants')
          .update({
            inventory: variant.inventory + releaseQuantity,
            qty_blocked: Math.max(0, variant.qty_blocked - releaseQuantity),
            updated_at: new Date().toISOString(),
          })
          .eq('id', variant.id);

        if (updateError) {
          failedItems.push({
            product_id,
            variant_name: selected_variant_name,
            quantity,
            reason: 'Failed to release inventory',
          });
          continue;
        }

        releasedItems.push({
          product_id,
          variant_name: selected_variant_name,
          quantity: releaseQuantity,
        });

      } catch (error) {
        failedItems.push({
          product_id,
          variant_name: selected_variant_name,
          quantity,
          reason: 'Internal error during release',
        });
      }
    }

    const response: ReleaseInventoryResponse = {
      success: failedItems.length === 0,
      released_items: releasedItems,
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
