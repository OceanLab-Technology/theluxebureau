import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../utils';
import { SiteSetting, ApiResponse } from '../types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    let query = supabase.from('site_settings').select('*');
    
    if (key) {
      query = query.eq('setting_key', key);
      const { data, error } = await query.single();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        data: data
      });
    } else {
      const { data, error } = await query.order('setting_key');
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        data: data
      });
    }
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
    if (!body.setting_key) {
      return NextResponse.json(
        { success: false, error: 'Setting key is required' },
        { status: 400 }
      );
    }
    
    const settingData: Partial<SiteSetting> = {
      setting_key: body.setting_key,
      setting_value: body.setting_value,
    };
    
    const { data, error } = await supabase
      .from('site_settings')
      .insert(settingData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Site setting created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Setting key is required in query params' },
        { status: 400 }
      );
    }
    
    const updateData = {
      setting_value: body.setting_value,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('setting_key', key)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Site setting updated successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
