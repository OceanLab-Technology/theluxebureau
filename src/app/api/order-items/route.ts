import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError, parseQueryParams, buildFilters } from '../utils';
import { OrderItem, ApiResponse } from '../types';

// List order items with optional filtering (Admin only)
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parseQueryParams(searchParams);
    
    const allowedFilters = ['order_id', 'product_id'];
    const filters = buildFilters(searchParams, allowedFilters);
    
    let query = supabase
      .from('order_items')
      .select('*, orders(*), products(*)', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.order_id || !body.product_id || !body.quantity || !body.unit_price) {
      return NextResponse.json(
        { success: false, error: 'Order ID, product ID, quantity, and unit price are required' },
        { status: 400 }
      );
    }
    
    const quantity = parseInt(body.quantity);
    const unitPrice = parseFloat(body.unit_price);
    
    const orderItemData: Partial<OrderItem> = {
      order_id: body.order_id,
      product_id: body.product_id,
      quantity: quantity,
      unit_price: unitPrice,
      total_price: quantity * unitPrice,
    };
    
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItemData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Order item created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
