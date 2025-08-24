import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../../utils';
import { Customer, ApiResponse } from '../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get a specific customer (Admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    return handleError(error);
  }
}

// Update a specific customer (Admin only)
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
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    // Only update provided fields
    const allowedFields = [
      'name', 'email', 'phone', 'address', 'status', 'total_spent', 'order_count', 'last_order_date', 'notes'
    ];
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'total_spent') {
          updateData[field] = parseFloat(body[field]);
        } else if (field === 'order_count') {
          updateData[field] = parseInt(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    });
    
    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}

// Delete a specific customer (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Check authentication and admin role
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
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
