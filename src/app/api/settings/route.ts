import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../utils";
import {
  SiteSetting,
  FontSetting,
} from "../types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    const settings: SiteSetting = data;

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const type = formData.get("type") as string;

    if (type === "packaging") {
      const title = formData.get("title") as string;
      const imageFile = formData.get("imageFile") as File;

      if (!title || !imageFile) {
        return NextResponse.json(
          { success: false, error: "Title and image file are required" },
          { status: 400 }
        );
      }

      const packagingId = `${Date.now()}-${title.replace(/\s+/g, "-")}`;
      const fileName = `${packagingId}-${imageFile.name.replace(/\s+/g, "-")}`;

      const { error: uploadErr } = await supabase.storage
        .from("packaging")
        .upload(fileName, imageFile, { upsert: true });

      if (uploadErr) {
        console.log("Packaging upload error:", uploadErr);
        return NextResponse.json(
          { success: false, error: "Failed to upload packaging image" },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("packaging")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        return NextResponse.json(
          { success: false, error: "Failed to get public URL for packaging" },
          { status: 500 }
        );
      }

      const { data: currentSettings } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      const newPackaging = {
        id: packagingId,
        title: title,
        image_url: publicUrlData.publicUrl,
        created_at: new Date().toISOString(),
      };

      const packaging = currentSettings?.packaging || [];
      packaging.push(newPackaging);

      const updateData = {
        packaging: packaging,
        updated_at: new Date().toISOString(),
      };

      if (currentSettings) {
        const { data, error } = await supabase
          .from("site_settings")
          .update(updateData)
          .eq("id", currentSettings.id)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({
          success: true,
          data: data,
          message: "Packaging uploaded and added successfully",
        });
      } else {
        const { data, error } = await supabase
          .from("site_settings")
          .insert({
            ...updateData,
            fonts: [],
            quotes: [],
            api_key: null,
          })
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({
          success: true,
          data: data,
          message: "Packaging uploaded and settings created successfully",
        });
      }
    }

    const fontName = formData.get("fontName") as string;
    const fontFile = formData.get("fontFile") as File;

    if (!fontName || !fontFile) {
      return NextResponse.json(
        { success: false, error: "Font name and file are required" },
        { status: 400 }
      );
    }

    const { error: uploadErr } = await supabase.storage
      .from("custom-fonts")
      .upload(`${fontName}`, fontFile, { upsert: true });

    if (uploadErr) {
      console.log("Font upload error:", uploadErr);
      return NextResponse.json(
        { success: false, error: "Failed to upload font file" },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("custom-fonts")
      .getPublicUrl(`${fontName}`);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to get public URL for font" },
        { status: 500 }
      );
    }

    const { data: currentSettings } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    const newFont: FontSetting = {
      name: fontName,
      url: publicUrlData.publicUrl,
    };

    const fonts = currentSettings?.fonts || [];
    const existingFontIndex = fonts.findIndex(
      (font: FontSetting) => font.name === fontName
    );

    if (existingFontIndex >= 0) {
      fonts[existingFontIndex] = newFont;
    } else {
      fonts.push(newFont);
    }

    const updateData = {
      fonts: fonts,
      updated_at: new Date().toISOString(),
    };

    if (currentSettings) {
      const { data, error } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", currentSettings.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data: data,
        message: "Font uploaded and added successfully",
      });
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert({
          ...updateData,
          quotes: [],
          api_key: null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data: data,
        message: "Font uploaded and settings created successfully",
      });
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fonts, quotes, packaging, api_key } = body;

    // Get current settings
    const { data: currentSettings } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    const updateData: Partial<SiteSetting> = {
      updated_at: new Date().toISOString(),
    };

    if (fonts !== undefined) updateData.fonts = fonts;
    if (quotes !== undefined) updateData.quotes = quotes;
    if (packaging !== undefined) updateData.packaging = packaging;
    if (api_key !== undefined) updateData.api_key = api_key;

    if (currentSettings) {
      const { data, error } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", currentSettings.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data: data,
        message: "Site settings updated successfully",
      });
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert({
          fonts: fonts || [],
          quotes: quotes || [],
          packaging: packaging || [],
          api_key: api_key || null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data: data,
        message: "Site settings created successfully",
      });
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const fontName = searchParams.get("fontName");
    const quoteIndex = searchParams.get("quoteIndex");
    const packagingId = searchParams.get("packagingId");

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Delete type is required (font, quote, or packaging)",
        },
        { status: 400 }
      );
    }

    // Get current settings
    const { data: currentSettings, error: fetchError } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    if (fetchError || !currentSettings) {
      return NextResponse.json(
        { success: false, error: "No settings found" },
        { status: 404 }
      );
    }

    if (type === "font" && fontName) {
      const fonts = (currentSettings.fonts || []).filter(
        (font: FontSetting) => font.name !== fontName
      );

      const { data, error } = await supabase
        .from("site_settings")
        .update({
          fonts: fonts,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentSettings.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data: data,
        message: "Font deleted successfully",
      });
    } else if (type === "quote" && quoteIndex !== null) {
      const quotes = [...(currentSettings.quotes || [])];
      const index = parseInt(quoteIndex);
      if (index >= 0 && index < quotes.length) {
        quotes.splice(index, 1);

        const { data, error } = await supabase
          .from("site_settings")
          .update({
            quotes: quotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentSettings.id)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({
          success: true,
          data: data,
          message: "Quote deleted successfully",
        });
      }
    } else if (type === "packaging" && packagingId) {
      const packaging = (currentSettings.packaging || []).filter(
        (pkg: any) => pkg.id !== packagingId
      );

      const { data, error } = await supabase
        .from("site_settings")
        .update({
          packaging: packaging,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentSettings.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data: data,
        message: "Packaging deleted successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid delete parameters" },
      { status: 400 }
    );
  } catch (error) {
    return handleError(error);
  }
}
