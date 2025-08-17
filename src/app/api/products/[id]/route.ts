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

export const PUT = withAdminAuth(
  async (req: NextRequest): Promise<NextResponse<ApiResponse<any>>> => {
    const supabase = await createClient();

    try {
      // Extract product ID from URL
      const url = new URL(req.url);
      const id = url.pathname.split("/").pop();
      if (!id) {
        return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
      }

      const contentType = req.headers.get("content-type");

      if (contentType?.includes("multipart/form-data")) {
        const formData = await req.formData();
        const updates: Record<string, any> = {};

        // Standard fields
        const fields = [
          "name", "price", "inventory", "category", "description",
          "title", "packaging", "why_we_chose_it", "about_the_maker",
          "particulars", "slug", "least_inventory_trigger"
        ];

        for (const key of fields) {
          const value = formData.get(key);
          if (value !== null) updates[key] = value;
        }

        // 1. Fetch existing product
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError || !product) {
          return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        // 2. Handle removed images
        const removedImages = formData.getAll("removedImages[]") as string[];
        for (const url of removedImages) {
          if (!url) continue;

          const parts = url.split("/");
          const key = parts.slice(parts.length - 2).join("/"); // productId/filename
          await supabase.storage.from("product-images").remove([key]);

          // Clear DB fields corresponding to removed images
          for (let i = 1; i <= 5; i++) {
            if (product[`image_${i}` as keyof typeof product] === url) {
              updates[`image_${i}`] = null;
            }
          }
        }

        // 3. Handle new image uploads
        for (let i = 1; i <= 5; i++) {
          const fileOrUrl = formData.get(`image_${i}`);
          if (fileOrUrl instanceof File && fileOrUrl.size > 0) {
            const fileName = `${Date.now()}-${fileOrUrl.name.replace(/\s+/g, "-")}`;
            const filePath = `${id}/${fileName}`;

            const { error: uploadErr } = await supabase.storage
              .from("product-images")
              .upload(filePath, fileOrUrl, { upsert: true });
            if (uploadErr) continue;

            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) updates[`image_${i}`] = publicUrlData.publicUrl;
          }
        }

        // 4. Apply updates
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
    } catch (err: any) {
      console.error("Product update error:", err);
      return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
    }
  }
);


// DELETE /api/products/[id]
export const DELETE = withAdminAuth(
  async (req: NextRequest, user: any): Promise<NextResponse<ApiResponse<null>>> => {
    const supabase = await createClient();

    try {
      const url = new URL(req.url);
      const id = url.pathname.split("/").pop();

      if (!id) {
        return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
      }

      // 1. Fetch product first to get image paths
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      // 2. Collect all image paths from public URLs
      const imageKeysToDelete: string[] = [];
      for (let i = 1; i <= 5; i++) {
        const url = product[`image_${i}` as keyof typeof product] as string | undefined;
        if (url) {
          const parts = url.split("/");
          const key = parts.slice(parts.length - 2).join("/"); // e.g., "productId/filename.jpg"
          imageKeysToDelete.push(key);
        }
      }

      // 3. Delete all images from storage
      if (imageKeysToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from("product-images")
          .remove(imageKeysToDelete);
        if (deleteError) {
          console.warn("Failed to delete some images:", deleteError.message);
        }
      }

      // 4. Delete the product from the DB
      const { error: deleteProductError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteProductError) throw deleteProductError;

      return NextResponse.json({ success: true, data: null });
    } catch (err: any) {
      console.error("Product deletion error:", err.message);
      return NextResponse.json(
        { success: false, error: "Failed to delete product" },
        { status: 500 }
      );
    }
  }
);
