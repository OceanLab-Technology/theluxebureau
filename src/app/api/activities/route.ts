import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError, parseQueryParams, buildFilters } from '../utils';
import { Activity, ApiResponse } from '../types';

// List all activities with optional filtering and pagination (Admin only)
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
    
    const allowedFilters = ['type', 'entity_type', 'entity_id', 'user_id'];
    const filters = buildFilters(searchParams, allowedFilters);
    
    let query = supabase
      .from('activities')
      .select('*', { count: 'exact' })
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

// Create a new activity
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
    
    if (!body.type || !body.entity_type || !body.entity_id || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Type, entity_type, entity_id, and title are required' },
        { status: 400 }
      );
    }
    
    const activityData: Partial<Activity> = {
      type: body.type,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      title: body.title,
      description: body.description,
      user_id: body.user_id || user.id,
      metadata: body.metadata || {},
    };
    
    const { data, error } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Activity created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
