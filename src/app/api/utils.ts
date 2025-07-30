import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from './types';

export async function withAuth<T>(
  handler: (request: NextRequest, user: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (request: NextRequest) => {
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      return handler(request, user);
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

export function withAdminAuth<T>(
  handler: (request: NextRequest, user: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (request: NextRequest) => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Check if user is admin
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

      return handler(request, user);
    } catch (error) {
      console.error('Admin auth error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

export function handleError(error: any): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  
  if (error.code === 'PGRST116') {
    return NextResponse.json(
      { success: false, error: 'Resource not found' },
      { status: 404 }
    );
  }
  
  if (error.code === '23505') {
    return NextResponse.json(
      { success: false, error: 'Duplicate entry' },
      { status: 409 }
    );
  }
  
  return NextResponse.json(
    { success: false, error: error.message || 'Internal server error' },
    { status: 500 }
  );
}

export function parseQueryParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

export function buildFilters(searchParams: URLSearchParams, allowedFilters: string[]) {
  const filters: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (allowedFilters.includes(key) && value) {
      filters[key] = value;
    }
  }
  
  return filters;
}
