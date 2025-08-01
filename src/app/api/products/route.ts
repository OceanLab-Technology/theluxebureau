import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAdminAuth, handleError, buildFilters } from '../utils';
import { Product, ApiResponse } from '../types';

// List all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const allowedFilters = ['category', 'name', 'slug'];
    const filters = buildFilters(searchParams, allowedFilters);
    
    let query = supabase
      .from('products')
      .select('id, name, description, price, inventory, category, image_1, image_2')
      .order('created_at', { ascending: false });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'name') {
        query = query.ilike('name', `%${value}%`);
      } else {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withAdminAuth(
  async (request: NextRequest, user: any): Promise<NextResponse<ApiResponse<Product>>> => {
    try {
      const supabase = await createClient();
      const formData = await request.formData();

      const name = formData.get('name') as string;
      const price = parseFloat(formData.get('price') as string);
      const inventory = parseInt(formData.get('inventory') as string);
      const category = formData.get('category') as string;
    
      const description = formData.get('category') as string || null;
      const title = formData.get('title') as string || null;
      const why_we_chose_it = formData.get('why_we_chose_it') as string || null;
      const about_the_maker = formData.get('about_the_maker') as string || null;
      const particulars = formData.get('particulars') as string || null;
      const slug = formData.get('category') as string;


      if (!name || isNaN(price) || isNaN(inventory) || !category) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // 1. Insert product without images
      const { data: created, error: insertErr } = await supabase
        .from('products')
        .insert({ name, price, inventory, category, description, title, why_we_chose_it, about_the_maker, particulars, slug })
        .select()
        .single();

      if (insertErr || !created) throw insertErr;

      const productId = created.id;
      const uploadedUrls: string[] = [];

      // 2. Upload up to 5 images
      for (let i = 1; i <= 5; i++) {
        const file = formData.get(`image_${i}`) as File | null;
        if (!file) continue;

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = `${productId}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadErr) continue;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      // 3. Update product with image URLs
      const imagePayload: Record<string, string | null> = {};
      for (let i = 0; i < 5; i++) {
        imagePayload[`image_${i + 1}`] = uploadedUrls[i] || null;
      }

      const { data: finalProduct, error: updateErr } = await supabase
        .from('products')
        .update(imagePayload)
        .eq('id', productId)
        .select()
        .single();

      if (updateErr) throw updateErr;

      return NextResponse.json({
        success: true,
        data: finalProduct,
        message: 'Product created with images',
      });
    } catch (error) {
      return await handleError(error); // if handleError is async
    }
  }
);
