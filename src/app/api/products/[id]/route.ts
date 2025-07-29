import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError, withAdminAuth } from '../../utils';
import { ApiResponse } from '../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Get a specific product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products')
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

// // Update a specific product (Admin only)
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const supabase = await createClient();
    
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const { data: profile } = await supabase
//       .from('profiles')
//       .select('role')
//       .eq('id', user.id)
//       .single();

//     if (!profile || profile.role !== 'admin') {
//       return NextResponse.json(
//         { success: false, error: 'Admin access required' },
//         { status: 403 }
//       );
//     }
    
//     const body = await request.json();
    
//     const updateData: any = {
//       updated_at: new Date().toISOString(),
//     };
    
//     const allowedFields = [
//       'name', 'description', 'price', 'inventory', 'category', 'slug', 'title',
//       'image_1', 'image_2', 'image_3', 'image_4', 'image_5',
//       'why_we_chose_it', 'about_the_maker', 'particulars'
//     ];
    
//     allowedFields.forEach(field => {
//       if (body[field] !== undefined) {
//         if (field === 'price') {
//           updateData[field] = parseFloat(body[field]);
//         } else if (field === 'inventory') {
//           updateData[field] = parseInt(body[field]);
//         } else {
//           updateData[field] = body[field];
//         }
//       }
//     });
    
//     const { data, error } = await supabase
//       .from('products')
//       .update(updateData)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
    
//     return NextResponse.json({
//       success: true,
//       data: data,
//       message: 'Product updated successfully'
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

export const PUT = withAdminAuth(
  async (req: NextRequest, user: any): Promise<NextResponse<ApiResponse<any>>> => {
    const supabase = await createClient();

    try {
      // ✅ Extract ID from URL manually
      const url = new URL(req.url);
      const id = url.pathname.split("/").pop(); // Assumes /api/products/[id]

      if (!id) {
        return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
      }

      const contentType = req.headers.get("content-type");

      if (contentType?.includes("multipart/form-data")) {
        const formData = await req.formData();
        const updates: Record<string, any> = {};

        const fields = [
          "name", "price", "inventory", "category", "description",
          "title", "why_we_chose_it", "about_the_maker", "particulars", "slug"
        ];

        for (const key of fields) {
          const value = formData.get(key);
          if (value !== null) updates[key] = value;
        }

        for (let i = 1; i <= 5; i++) {
          const file = formData.get(`image_${i}`) as File | null;
          if (file) {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
            const filePath = `${id}/${fileName}`;

            const { error: uploadErr } = await supabase.storage
              .from("product-images")
              .upload(filePath, file, { upsert: true });

            if (uploadErr) continue;

            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              updates[`image_${i}`] = publicUrlData.publicUrl;
            }
          }
        }

        const { data: updated, error: updateErr } = await supabase
          .from("products")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (updateErr) throw updateErr;

        return NextResponse.json({ success: true, data: updated });
      }

      // Handle JSON payload
      const json = await req.json();

      const { data: updated, error: updateErr } = await supabase
        .from("products")
        .update(json)
        .eq("id", id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      return NextResponse.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { success: false, error: "Failed to update product" },
        { status: 500 }
      );
    }
  }
);
