// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { handleError } from "../../utils";

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// // specific order
// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();
//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { data, error } = await supabase
//       .from("orders")
//       .select(
//         `
//         *,
//         order_items (
//           *,
//           products (
//             id,
//             name,
//             image_1,
//             image_2,
//             image_3,
//             price,
//             description,
//             category,
//             inventory,
//             why_we_chose_it,
//             about_the_maker,
//             particulars
//           )
//         )
//       `
//       )
//       .eq("id", id)
//       .single();

//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data: data,
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // Update a specific order
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();
//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();

//     const updateData: any = {
//       updated_at: new Date().toISOString(),
//     };

//     const allowedFields = [
//       "customer_name",
//       "customer_email",
//       "recipient_name",
//       "recipient_address",
//       "delivery_date",
//       "notes",
//       "status",
//       "product_details",
//       "personalization",
//     ];

//     allowedFields.forEach((field) => {
//       if (body[field] !== undefined) {
//         if (field === "total_amount") {
//           updateData[field] = parseFloat(body[field]);
//         } else {
//           updateData[field] = body[field];
//         }
//       }
//     });

//     const { data, error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data: data,
//       message: "Order updated successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// export async function PATCH(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();
//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();

//     const updateData: any = {
//       updated_at: new Date().toISOString(),
//     };

//     const allowedFields = [
//       "status",
//       "payment_status",
//       "delivery_status",
//       "notes",
//       "customer_name",
//       "customer_email",
//       "recipient_name",
//       "recipient_address",
//       "delivery_date",
//       "product_details",
//       "personalization",
//     ];

//     allowedFields.forEach((field) => {
//       if (body[field] !== undefined) {
//         if (field === "total_amount") {
//           updateData[field] = parseFloat(body[field]);
//         } else {
//           updateData[field] = body[field];
//         }
//       }
//     });

//     const { data, error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data: data,
//       message: "Order updated successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// export async function DELETE(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();
//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (!profile || profile.role !== "admin") {
//       return NextResponse.json(
//         { success: false, error: "Admin access required" },
//         { status: 403 }
//       );
//     }

//     const { error } = await supabase.from("orders").delete().eq("id", id);

//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }






// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { handleError } from "../../utils";

// type RouteParams = { params: { id: string } };

// // ─────────────────────────────────────────────────────────────
// // GET: fetch a specific order (with items and product details)
// // ─────────────────────────────────────────────────────────────
// export async function GET(_request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { data, error } = await supabase
//       .from("orders")
//       .select(
//         `
//         *,
//         order_items (
//           id,
//           order_id,
//           product_id,
//           quantity,
//           price_at_purchase,
//           custom_data,
//           selected_variant_name,
//           created_at,
//           products (
//             id,
//             name,
//             image_1,
//             image_2,
//             image_3,
//             image_4,
//             image_5,
//             price,
//             description,
//             category,
//             slug,
//             why_we_chose_it,
//             about_the_maker,
//             particulars,
//             packaging,
//             contains_alcohol,
//             variants
//           )
//         )
//       `
//       )
//       .eq("id", id)
//       .single();

//     if (error) throw error;

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // PUT: full/partial update (same as PATCH for now)
// // ─────────────────────────────────────────────────────────────
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();

//     const allowedFields = [
//       "customer_name",
//       "customer_email",
//       "recipient_name",
//       "recipient_address",
//       "delivery_date",
//       "notes",
//       "status",
//       "payment_status",
//       "delivery_status",
//       "product_details",
//       "personalization",
//       "total_amount", // ← you parse this, so allow it
//     ] as const;

//     const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

//     for (const key of allowedFields) {
//       if (key in body && body[key] !== undefined) {
//         updateData[key] =
//           key === "total_amount" ? parseFloat(body[key]) : body[key];
//       }
//     }

//     const { data, error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data,
//       message: "Order updated successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // PATCH: partial update
// // ─────────────────────────────────────────────────────────────
// export async function PATCH(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();

//     const allowedFields = [
//       "status",
//       "payment_status",
//       "delivery_status",
//       "notes",
//       "customer_name",
//       "customer_email",
//       "recipient_name",
//       "recipient_address",
//       "delivery_date",
//       "product_details",
//       "personalization",
//       "total_amount", // ← allow and parse
//     ] as const;

//     const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

//     for (const key of allowedFields) {
//       if (key in body && body[key] !== undefined) {
//         updateData[key] =
//           key === "total_amount" ? parseFloat(body[key]) : body[key];
//       }
//     }

//     const { data, error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data,
//       message: "Order updated successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // DELETE: admin-only
// // ─────────────────────────────────────────────────────────────
// export async function DELETE(_request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (!profile || profile.role !== "admin") {
//       return NextResponse.json(
//         { success: false, error: "Admin access required" },
//         { status: 403 }
//       );
//     }

//     const { error } = await supabase.from("orders").delete().eq("id", id);
//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }












// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { handleError } from "../../utils";

// type RouteParams = { params: { id: string } };

// async function getUserAndRole() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();
//   if (authError || !user) {
//     return { supabase, user: null as null, role: null as null };
//   }

//   // role can be null if profile row missing; treat as non-admin
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .maybeSingle();

//   return { supabase, user, role: profile?.role ?? null };
// }

// // ─────────────────────────────────────────────────────────────
// // GET: fetch a specific order (with items and product details)
// // ─────────────────────────────────────────────────────────────
// export async function GET(_request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
//     }

//     // Admins can view any order; others only their own
//     let query = supabase
//       .from("orders")
//       .select(
//         `
//         *,
//         order_items (
//           id,
//           order_id,
//           product_id,
//           quantity,
//           price_at_purchase,
//           custom_data,
//           selected_variant_name,
//           created_at,
//           products (
//             id,
//             name,
//             image_1,
//             image_2,
//             image_3,
//             image_4,
//             image_5,
//             price,
//             description,
//             category,
//             slug,
//             why_we_chose_it,
//             about_the_maker,
//             particulars,
//             packaging,
//             contains_alcohol,
//             variants
//           )
//         )
//       `
//       )
//       .eq("id", id);

//     if (role !== "admin") {
//       query = query.eq("user_email", user.email!);
//     }

//     const { data, error } = await query.single();
//     if (error) throw error;

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // Helpers
// function normalizeDeliveryDate(value: any): string | undefined {
//   if (!value) return undefined;
//   // Accept "YYYY-MM-DD" or full ISO, return "YYYY-MM-DD"
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return undefined;
//   return d.toISOString().slice(0, 10);
// }

// function buildUpdate(body: any) {
//   // NOTE: Removed `product_details` (not in table)
//   const allowed = new Set([
//     "customer_name",
//     "customer_email",
//     "recipient_name",
//     "recipient_address",
//     "delivery_date",
//     "notes",
//     "status",
//     "payment_status",
//     "delivery_status",
//     "personalization",
//     "total_amount",
//     "currency",
//   ]);
//   const update: Record<string, any> = { updated_at: new Date().toISOString() };

//   for (const key of Object.keys(body ?? {})) {
//     if (!allowed.has(key)) continue;

//     if (key === "total_amount") {
//       const n = Number(body.total_amount);
//       if (!Number.isNaN(n)) update.total_amount = n;
//       continue;
//     }
//     if (key === "delivery_date") {
//       const ymd = normalizeDeliveryDate(body.delivery_date);
//       if (ymd) update.delivery_date = ymd;
//       continue;
//     }

//     update[key] = body[key];
//   }

//   return update;
// }

// // ─────────────────────────────────────────────────────────────
// // PUT: full/partial update (treat as updatable subset)
// // ─────────────────────────────────────────────────────────────
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
//     const updateData = buildUpdate(body);

//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
//     }

//     let query = supabase.from("orders").update(updateData).eq("id", id).select().single();
//     if (role !== "admin") {
//       query = query.eq("user_email", user.email!);
//     }

//     const { data, error } = await query;
//     if (error) throw error;

//     return NextResponse.json({ success: true, data, message: "Order updated successfully" });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // PATCH: partial update
// // ─────────────────────────────────────────────────────────────
// export async function PATCH(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
//     const updateData = buildUpdate(body);

//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
//     }

//     let query = supabase.from("orders").update(updateData).eq("id", id).select().single();
//     if (role !== "admin") {
//       query = query.eq("user_email", user.email!);
//     }

//     const { data, error } = await query;
//     if (error) throw error;

//     return NextResponse.json({ success: true, data, message: "Order updated successfully" });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // DELETE: admin-only
// // ─────────────────────────────────────────────────────────────
// export async function DELETE(_request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
//     }
//     if (role !== "admin") {
//       return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
//     }

//     const { error } = await supabase.from("orders").delete().eq("id", id);
//     if (error) throw error;

//     return NextResponse.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     return handleError(error);
//   }
// }















// // src/app/api/orders/[id]/route.ts
// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { handleError } from "../../utils";

// // ─────────────────────────────────────────────────────────────
// // Auth helper
// // ─────────────────────────────────────────────────────────────
// async function getUserAndRole() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (authError || !user) {
//     return { supabase, user: null as null, role: null as null };
//   }

//   // role can be null if profile row missing; treat as non-admin
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .maybeSingle();

//   return { supabase, user, role: profile?.role ?? null };
// }

// // ─────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────
// function normalizeDeliveryDate(value: unknown): string | undefined {
//   if (!value) return undefined;
//   const d = new Date(value as string);
//   if (Number.isNaN(d.getTime())) return undefined;
//   return d.toISOString().slice(0, 10); // YYYY-MM-DD
// }

// function buildUpdate(body: any) {
//   const allowed = new Set([
//     "customer_name",
//     "customer_email",
//     "recipient_name",
//     "recipient_address",
//     "delivery_date",
//     "notes",
//     "status",
//     "payment_status",
//     "delivery_status",
//     "personalization",
//     "total_amount",
//     "currency",
//   ]);

//   const update: Record<string, any> = { updated_at: new Date().toISOString() };

//   for (const key of Object.keys(body ?? {})) {
//     if (!allowed.has(key)) continue;

//     if (key === "total_amount") {
//       const n = Number(body.total_amount);
//       if (!Number.isNaN(n)) update.total_amount = n;
//       continue;
//     }

//     if (key === "delivery_date") {
//       const ymd = normalizeDeliveryDate(body.delivery_date);
//       if (ymd) update.delivery_date = ymd;
//       continue;
//     }

//     update[key] = body[key];
//   }

//   return update;
// }

// // ─────────────────────────────────────────────────────────────
// // GET: fetch a specific order (with items and product details)
// // ─────────────────────────────────────────────────────────────
// export async function GET(
//   _request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Admins can view any order; others only their own
//     let query = supabase
//       .from("orders")
//       .select(
//         `
//         *,
//         order_items (
//           id,
//           order_id,
//           product_id,
//           quantity,
//           price_at_purchase,
//           custom_data,
//           selected_variant_name,
//           created_at,
//           products (
//             id,
//             name,
//             image_1,
//             image_2,
//             image_3,
//             image_4,
//             image_5,
//             price,
//             description,
//             category,
//             slug,
//             why_we_chose_it,
//             about_the_maker,
//             particulars,
//             packaging,
//             contains_alcohol,
//             variants
//           )
//         )
//       `
//       )
//       .eq("id", id);

//     if (role !== "admin") {
//       query = query.eq("user_email", user.email!);
//     }

//     const { data, error } = await query.single();
//     if (error) throw error;

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // PUT: full/partial update
// // ─────────────────────────────────────────────────────────────
// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
//     const updateData = buildUpdate(body);

//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     let query = supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (role !== "admin") {
//       query = query.eq("user_email", user.email!);
//     }

//     const { data, error } = await query;
//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data,
//       message: "Order updated successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // PATCH: partial update
// // ─────────────────────────────────────────────────────────────
// export async function PATCH(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
//     const updateData = buildUpdate(body);

//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     let query = supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (role !== "admin") {
//       query = query.eq("user_email", user.email!);
//     }

//     const { data, error } = await query;
//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       data,
//       message: "Order updated successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // DELETE: admin-only
// // ─────────────────────────────────────────────────────────────
// export async function DELETE(
//   _request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     const { supabase, user, role } = await getUserAndRole();
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }
//     if (role !== "admin") {
//       return NextResponse.json(
//         { success: false, error: "Admin access required" },
//         { status: 403 }
//       );
//     }

//     const { error } = await supabase.from("orders").delete().eq("id", id);
//     if (error) throw error;

//     return NextResponse.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }



// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "../../utils";

// ─────────────────────────────────────────────────────────────
// Auth helper
// ─────────────────────────────────────────────────────────────
async function getUserAndRole() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase, user: null as null, role: null as null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, role: profile?.role ?? null };
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function normalizeDeliveryDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function buildUpdate(body: any) {
  const allowed = new Set([
    "customer_name",
    "customer_email",
    "recipient_name",
    "recipient_address",
    "delivery_date",
    "notes",
    "status",
    "payment_status",
    "delivery_status",
    "personalization",
    "total_amount",
    "currency",
  ]);

  const update: Record<string, any> = { updated_at: new Date().toISOString() };

  for (const key of Object.keys(body ?? {})) {
    if (!allowed.has(key)) continue;

    if (key === "total_amount") {
      const n = Number(body.total_amount);
      if (!Number.isNaN(n)) update.total_amount = n;
      continue;
    }

    if (key === "delivery_date") {
      const ymd = normalizeDeliveryDate(body.delivery_date);
      if (ymd) update.delivery_date = ymd;
      continue;
    }

    update[key] = body[key];
  }

  return update;
}

// ─────────────────────────────────────────────────────────────
// GET: fetch a specific order (with items and product details)
// ─────────────────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { supabase, user, role } = await getUserAndRole();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          order_id,
          product_id,
          quantity,
          price_at_purchase,
          custom_data,
          selected_variant_name,
          created_at,
          products (
            id,
            name,
            image_1,
            image_2,
            image_3,
            image_4,
            image_5,
            price,
            description,
            category,
            slug,
            why_we_chose_it,
            about_the_maker,
            particulars,
            packaging,
            contains_alcohol,
            variants
          )
        )
      `
      )
      .eq("id", id);

    if (role !== "admin") {
      query = query.eq("user_email", user.email!);
    }

    const { data, error } = await query.single();
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleError(error);
  }
}

// ─────────────────────────────────────────────────────────────
// PUT: full/partial update
// ─────────────────────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = buildUpdate(body);

    const { supabase, user, role } = await getUserAndRole();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Build filters first → then terminate
    let updateBuilder = supabase.from("orders").update(updateData).eq("id", id);
    if (role !== "admin") {
      updateBuilder = updateBuilder.eq("user_email", user.email!);
    }

    const { data, error } = await updateBuilder.select().single();
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: "Order updated successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}

// ─────────────────────────────────────────────────────────────
// PATCH: partial update
// ─────────────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = buildUpdate(body);

    const { supabase, user, role } = await getUserAndRole();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let updateBuilder = supabase.from("orders").update(updateData).eq("id", id);
    if (role !== "admin") {
      updateBuilder = updateBuilder.eq("user_email", user.email!);
    }

    const { data, error } = await updateBuilder.select().single();
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: "Order updated successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE: admin-only
// ─────────────────────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { supabase, user, role } = await getUserAndRole();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
