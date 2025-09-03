import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../../utils';
import { ApiResponse } from '../../types';

export interface ReserveInventoryItem {
  product_id: string;
  quantity: number;
  selected_variant_name?: string;
}

export interface ReserveInventoryResponse {
  success: boolean;
  reserved_items: {
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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ReserveInventoryResponse>>> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { items }: { items: ReserveInventoryItem[] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const reservedItems: Array<{ product_id: string; variant_name: string; quantity: number }> = [];
    const failedItems: Array<{ product_id: string; variant_name: string; quantity: number; reason: string }> = [];

    for (const item of items) {
      const { product_id, quantity, selected_variant_name = 'default' } = item;

      try {
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

        const availableQuantity = Math.max(0, variant.inventory - variant.qty_blocked);
        
        if (availableQuantity < quantity) {
          failedItems.push({
            product_id,
            variant_name: selected_variant_name,
            quantity,
            reason: `Only ${availableQuantity} items available`,
          });
          continue;
        }

        // Reserve the inventory: reduce inventory and increase qty_blocked
        const { error: updateError } = await supabase
          .from('product_variants')
          .update({
            inventory: variant.inventory - quantity,
            qty_blocked: variant.qty_blocked + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', variant.id);

        if (updateError) {
          failedItems.push({
            product_id,
            variant_name: selected_variant_name,
            quantity,
            reason: 'Failed to reserve inventory',
          });
          continue;
        }

        reservedItems.push({
          product_id,
          variant_name: selected_variant_name,
          quantity,
        });

      } catch (error) {
        failedItems.push({
          product_id,
          variant_name: selected_variant_name,
          quantity,
          reason: 'Internal error during reservation',
        });
      }
    }

    const response: ReserveInventoryResponse = {
      success: failedItems.length === 0,
      reserved_items: reservedItems,
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
