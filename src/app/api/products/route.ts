import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAdminAuth, handleError, parseQueryParams, buildFilters } from '../utils';
import { Product, ApiResponse } from '../types';

// List all products with optional filtering and pagination
// TODO: add image support
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parseQueryParams(searchParams);
    
    const allowedFilters = ['category', 'name', 'slug'];
    const filters = buildFilters(searchParams, allowedFilters);
    
    let query = supabase
      .from('products')
      .select('id, name, description, price, inventory, category, image_1, image_2', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'name') {
        query = query.ilike('name', `%${value}%`);
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

// Create a new product (Admin only)
export const POST = withAdminAuth(async (request: NextRequest, user: any): Promise<NextResponse<ApiResponse<Product>>> => {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    if (!body.name || !body.price || body.inventory === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and inventory are required' },
        { status: 400 }
      );
    }
    
    const productData: Partial<Product> = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      inventory: parseInt(body.inventory),
      category: body.category,
      slug: body.slug,
      title: body.title,
      image_1: body.image_1,
      image_2: body.image_2,
      image_3: body.image_3,
      image_4: body.image_4,
      image_5: body.image_5,
      why_we_chose_it: body.why_we_chose_it,
      about_the_maker: body.about_the_maker,
      particulars: body.particulars,
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data,
      message: 'Product created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
});
