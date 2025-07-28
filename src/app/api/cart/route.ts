import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../utils';
import { CartItem, ApiResponse } from '../types';

// Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    return handleError(error);
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    if (!body.product_id || !body.quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', body.product_id)
      .single();
    
    if (existingItem) {
      // Update existing item
      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + parseInt(body.quantity),
          custom_data: body.custom_data || existingItem.custom_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        data: data,
        message: 'Cart item updated successfully'
      });
    } else {
      // Create new item
      const cartData: Partial<CartItem> = {
        user_id: user.id,
        product_id: body.product_id,
        quantity: parseInt(body.quantity),
        custom_data: body.custom_data || {},
      };
      
      const { data, error } = await supabase
        .from('cart_items')
        .insert(cartData)
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        data: data,
        message: 'Item added to cart successfully'
      });
    }
  } catch (error) {
    return handleError(error);
  }
}

// Clear user's cart
export async function DELETE(request: NextRequest) {
  try {
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
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
