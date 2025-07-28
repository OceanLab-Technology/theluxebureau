import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../../utils';
import { CartItem, ApiResponse } from '../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Update cart item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (body.quantity !== undefined) {
      updateData.quantity = parseInt(body.quantity);
    }
    if (body.custom_data !== undefined) {
      updateData.custom_data = body.custom_data;
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own items
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); 
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
