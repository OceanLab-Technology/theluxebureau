import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAdminAuth, handleError, buildFilters } from '../utils';
import { Product, ApiResponse } from '../types';

// List all products with optional filtering

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const allowedFilters = ["category", "name", "slug"];
    const filters = buildFilters(searchParams, allowedFilters);

    let query = supabase
      .from("products")
      .select("id, name,item, description, price, category, image_1, image_2, contains_alcohol, female_founded, variants", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "name") query = query.ilike("name", `%${value}%`);
      else query = query.eq(key, value);
    });

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return handleError(error);
  }
}

// export const POST = withAdminAuth(
//   async (request: NextRequest, user: any): Promise<NextResponse<ApiResponse<Product>>> => {
//     try {
//       const supabase = await createClient();
//       const formData = await request.formData();

//       const name = formData.get('name') as string;
//       const price = parseFloat(formData.get('price') as string);
//       const inventory = parseInt(formData.get('inventory') as string);
//       const category = formData.get('category') as string;
    
//       const description = formData.get('description') as string || null;
//       const title = formData.get('title') as string || null;
//       const packaging = formData.get('packaging') as string || null;
//       const why_we_chose_it = formData.get('why_we_chose_it') as string || null;
//       const about_the_maker = formData.get('about_the_maker') as string || null;
//       const particulars = formData.get('particulars') as string || null;
//       const slug = formData.get('slug') as string;
//       const least_inventory_trigger = formData.get('least_inventory_trigger') 
//         ? parseInt(formData.get('least_inventory_trigger') as string) 
//         : null;


//       if (!name || isNaN(price) || isNaN(inventory) || !category || !slug) {
//         return NextResponse.json(
//           { success: false, error: 'Missing required fields' },
//           { status: 400 }
//         );
//       }

//       // 1. Insert product without images
//       const { data: created, error: insertErr } = await supabase
//         .from('products')
//         .insert({ 
//           name, 
//           price, 
//           inventory, 
//           category, 
//           description, 
//           title, 
//           packaging,
//           why_we_chose_it, 
//           about_the_maker, 
//           particulars, 
//           slug,
//           least_inventory_trigger
//         })
//         .select()
//         .single();

//       if (insertErr || !created) throw insertErr;

//       const productId = created.id;
//       const uploadedUrls: string[] = [];

//       // 2. Upload up to 5 images
//       for (let i = 1; i <= 5; i++) {
//         const file = formData.get(`image_${i}`) as File | null;
//         if (!file) continue;

//         const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
//         const filePath = `${productId}/${fileName}`;

//         const { error: uploadErr } = await supabase.storage
//           .from('product-images')
//           .upload(filePath, file);

//         if (uploadErr) continue;

//         const { data: publicUrlData } = supabase.storage
//           .from('product-images')
//           .getPublicUrl(filePath);

//         if (publicUrlData?.publicUrl) {
//           uploadedUrls.push(publicUrlData.publicUrl);
//         }
//       }

//       // 3. Update product with image URLs
//       const imagePayload: Record<string, string | null> = {};
//       for (let i = 0; i < 5; i++) {
//         imagePayload[`image_${i + 1}`] = uploadedUrls[i] || null;
//       }

//       const { data: finalProduct, error: updateErr } = await supabase
//         .from('products')
//         .update(imagePayload)
//         .eq('id', productId)
//         .select()
//         .single();

//       if (updateErr) throw updateErr;

//       return NextResponse.json({
//         success: true,
//         data: finalProduct,
//         message: 'Product created with images',
//       });
//     } catch (error) {
//       return await handleError(error); // if handleError is async
//     }
//   }
// );


// app/api/products/route.ts

function n(x: any, f = 0) {
  if (typeof x === "number" && !Number.isNaN(x)) return x;
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x))) return Number(x);
  return f;
}
function normalizeVariant(v: any) {
  return {
    name: String(v?.name ?? "default"),
    inventory: n(v?.inventory, 0),
    threshold: n(v?.threshold, 0),
    qty_blocked: n(v?.qty_blocked, 0),
  };
}

export const POST = withAdminAuth(
  async (request: NextRequest): Promise<NextResponse<ApiResponse<any>>> => {
    try {
      const supabase = await createClient();
      const formData = await request.formData();

      // required fields
      const name = (formData.get("name") as string) || "";
      const slug = (formData.get("slug") as string) || "";
      const category = (formData.get("category") as string) || "";
      const price = n(formData.get("price"));
      const item = (formData.get("item") as string) || "";

      // optional fields
      const description = (formData.get("description") as string) || null;
      const title = (formData.get("title") as string) || null;
      const packaging = (formData.get("packaging") as string) || null;
      const why_we_chose_it = (formData.get("why_we_chose_it") as string) || null;
      const about_the_maker = (formData.get("about_the_maker") as string) || null;
      const particulars = (formData.get("particulars") as string) || null;
      const contains_alcohol = (formData.get("contains_alcohol") as string) || null;
      const female_founded = (formData.get("female_founded") as string) === "true";

      if (!name || !slug || !category || Number.isNaN(price)) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      // variants (required)
      let variants: any[] = [];
      try {
        const raw = formData.get("variants");
        variants = Array.isArray(raw) ? raw : JSON.parse(String(raw ?? "[]"));
        variants = (variants || []).map(normalizeVariant);
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid variants JSON" },
          { status: 400 }
        );
      }
      if (!Array.isArray(variants) || variants.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one variant is required" },
          { status: 400 }
        );
      }


      // 1) Create base product
      const { data: created, error: insertErr } = await supabase
        .from("products")
        .insert({
          name,
          price,
          item,
          category,
          description,
          title,
          packaging,
          why_we_chose_it,
          about_the_maker,
          particulars,
          slug,
          variants, // ✅ jsonb
          contains_alcohol,
          female_founded,
        })
        .select()
        .single();
      if (insertErr || !created) throw insertErr;

      const productId = created.id;
      const uploaded: string[] = [];

      // 2) Upload up to 5 images
      for (let i = 1; i <= 5; i++) {
        const file = formData.get(`image_${i}`) as File | null;
        if (!file) continue;

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = `${productId}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);
        if (uploadErr) continue;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) uploaded.push(publicUrlData.publicUrl);
      }

      // 3) Update product with image URLs
      const imagePayload: Record<string, string | null> = {};
      for (let i = 0; i < 5; i++) {
        imagePayload[`image_${i + 1}`] = uploaded[i] || null;
      }

      const { data: finalProduct, error: updateErr } = await supabase
        .from("products")
        .update(imagePayload)
        .eq("id", productId)
        .select()
        .single();
      if (updateErr) throw updateErr;

      return NextResponse.json({
        success: true,
        data: finalProduct,
        message: "Product created",
      });
    } catch (error) {
      return handleError(error);
    }
  }
);
