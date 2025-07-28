import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError, parseQueryParams, buildFilters } from '../utils';
import { Customer, ApiResponse } from '../types';

// List all customers with optional filtering and pagination (Admin only)
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
    
    // Build filters
    const allowedFilters = ['status', 'email', 'name'];
    const filters = buildFilters(searchParams, allowedFilters);
    
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'email' || key === 'name') {
        query = query.ilike(key, `%${value}%`);
      } else {
        query = query.eq(key, value);
      }
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

// Create a new customer (Admin only)
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
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const customerData: Partial<Customer> = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      status: body.status || 'Active',
      total_spent: parseFloat(body.total_spent || '0'),
      order_count: parseInt(body.order_count || '0'),
    };
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Customer created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
