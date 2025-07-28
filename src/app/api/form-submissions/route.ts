import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError, parseQueryParams, buildFilters } from '../utils';
import { FormSubmission, ApiResponse } from '../types';

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
    const allowedFilters = ['status', 'source', 'order_type', 'email'];
    const filters = buildFilters(searchParams, allowedFilters);
    
    let query = supabase
      .from('form_submissions')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('submitted_at', { ascending: false });
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'email') {
        query = query.ilike('email', `%${value}%`);
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

// POST /api/form-submissions - Create a new form submission (Public endpoint)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const submissionData: Partial<FormSubmission> = {
      name: body.name,
      email: body.email,
      message: body.message,
      phone: body.phone,
      company: body.company,
      form_data: body.form_data || {},
      status: body.status || 'new',
      source: body.source || 'website',
      order_type: body.order_type || 'contact',
      recipients: body.recipients,
      event_details: body.event_details,
      design_options: body.design_options,
      delivery_date: body.delivery_date,
      order_value: body.order_value ? parseFloat(body.order_value) : undefined,
    };
    
    const { data, error } = await supabase
      .from('form_submissions')
      .insert(submissionData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Form submission created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
