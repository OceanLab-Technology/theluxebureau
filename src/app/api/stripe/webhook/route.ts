// import { headers } from "next/headers";
// import Stripe from "stripe";
// import { createClient } from "@supabase/supabase-js";
// import axios from "axios";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// // Service-role Supabase client (bypass RLS)
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );
// type OrderItemRow = {
//   product_id: string;
//   quantity: number;
//   selected_variant_name: string | null;
//   price_at_purchase: number | null;
//   product: { id: string; name: string; image_1: string | null } | null;
// };


// export async function POST(request: Request) {
//   const headerList = await headers();
//   const signature = headerList.get("stripe-signature");

//   const body = await request.text();

//   try {
//     const event = stripe.webhooks.constructEvent(
//       body,
//       signature!,
//       process.env.STRIPE_SECRET_WEBHOOK_KEY!
//     );

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       // ✅ Update order on payment success
//       const { data: orderData, error: updateError } = await supabase
//         .from("orders")
//         .update({
//           stripe_payment_intent_id: session.payment_intent as string,
//           stripe_customer_id: session.customer as string,
//           stripe_payment_status: session.payment_status,
//           stripe_payment_method: session.payment_method_types?.[0],
//           status: "Active",
//           payment_status: "completed",
//           updated_at: new Date().toISOString(),
//         })
//         .eq("stripe_session_id", session.id)
//         .select("id") // fetch the order ID for inventory updates
//         .single();

//       if (updateError) {
//         console.error("Order Update Error:", updateError);
//       }

//       console.log(
//         `Order ${orderData?.id}`
//       )
//       // ✅ Decrease product inventory based on order_items table
//       if (orderData?.id) {
//         // const { data: orderItems, error: itemsError } = await supabase
//         //   .from("order_items")
//         //   .select("product_id, quantity, selected_variant_name")
//         //   .eq("order_id", orderData.id);

//         const { data: orderItems, error: itemsError } = await supabase
//           .from("order_items")
//           .select(`
//     product_id,
//     quantity,
//     selected_variant_name,
//     price_at_purchase,
//     product:products (
//       id, name, image_1
//     )
//   `)
//           .eq("order_id", orderData.id);



//         if (itemsError) {
//           console.error("Order Items Fetch Error:", itemsError);
//         } else if (orderItems?.length) {
//           if (orderItems && orderItems.length) {
//             for (const item of orderItems as OrderItemRow[]) {
//               const variantName = item.selected_variant_name ?? "default";

//               const { error: inventoryError } = await supabase.rpc(
//                 "decrement_variant_inventory",
//                 {
//                   p_product_id: item.product_id,
//                   p_variant_name: variantName,
//                   p_quantity: item.quantity,
//                 }
//               );

//               if (inventoryError) {
//                 console.error(
//                   `Inventory Update Error for product ${item.product_id}, variant ${variantName}:`,
//                   inventoryError
//                 );
//               } else {
//                 console.log(
//                   `Inventory decreased for product ${item.product_id}, variant ${variantName} by ${item.quantity}`
//                 );
//               }
//             }
//           }
//         }
//         // take all product_id from orderItems and then fetch data and do this maildrill worksm

//         // const mandrillItems =
//         //   orderItems?.map((item, i) => ({
//         //     gift_label: `GIFT ${String(i + 1).padStart(2, "0")}`,
//         //     title: item.products[0].name ?? "Product",
//         //     variant: item.selected_variant_name ?? "Default",
//         //     qty: item.quantity,
//         //     price: (item.price_at_purchase ?? 0).toFixed(2),
//         //     image_url: item.products[0].image_1 ?? "https://placehold.co/600x400",
//         //     url: `https://yourstore.com/products/${item.product_id}`,
//         //     date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//         //     time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//         //     right_image: false,
//         //   })) ?? [];

//         // Build Mandrill items safely
//         const mandrillItems = (orderItems ?? []).map((item, i) => {
//           const product = Array.isArray(item.products) ? item.products[0] : item.products ?? null;
//           return {
//             gift_label: `GIFT ${String(i + 1).padStart(2, "0")}`,
//             title: product?.name ?? "Product",
//             variant: item.selected_variant_name ?? "Default",
//             qty: item.quantity,
//             price: Number(item.price_at_purchase ?? 0).toFixed(2),
//             image_url: product?.image_1 ?? "https://placehold.co/600x400",
//             url: `https://yourstore.com/products/${item.product_id}`,
//             date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//             time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//             right_image: false,
//           };
//         });



//         const orderTotal = session.amount_total ? session.amount_total / 100 : 0;

//         try {
//           const res = await axios.post("https://mandrillapp.com/api/1.0/messages/send-template.json", {
//             key: process.env.MANDRILL_API_KEY,
//             template_name: "order-confirmation-external",
//             template_content: [],
//             message: {
//               from_email: "no-reply@theluxebureau.com",
//               from_name: "The Luxe Bureau",
//               to: [
//                 {
//                   email: session.customer_details?.email,
//                   name: session.customer_details?.name ?? "",
//                   type: "to",
//                 },
//               ],
//               subject: "Your Luxe Bureau order is confirmed",
//               merge: true,
//               merge_language: "handlebars",
//               global_merge_vars: [
//                 { name: "first_name", content: session.customer_details?.name?.split(" ")?.[0] ?? "" },
//                 { name: "preheader_text", content: "Your order is confirmed and being prepared with care." },
//                 { name: "order_number", content: orderData.id },
//                 { name: "Recipient", content: session.customer_details?.name ?? "" },
//                 { name: "order_total", content: orderTotal.toFixed(2) },
//                 { name: "items", content: mandrillItems },
//               ],
//             },
//           });

//           console.log("Mandrill response:", res.data);
//         } catch (e: any) {
//           console.error("Mandrill axios error:", e.response?.data || e.message);
//         }

//       }

//       // Add data in client
//       // ✅ Add/Update customer after order success
//       if (orderData?.id) {
//         const customerEmail = session.customer_details?.email;
//         const orderTotal = session.amount_total ? session.amount_total / 100 : 0;

//         // Check if customer exists
//         const { data: existingCustomer } = await supabase
//           .from("customers")
//           .select("*")
//           .eq("email", customerEmail)
//           .single();

//         if (existingCustomer) {
//           // ✅ Update existing customer
//           await supabase
//             .from("customers")
//             .update({
//               total_spent: (existingCustomer.total_spent || 0) + orderTotal,
//               order_count: (existingCustomer.order_count || 0) + 1,
//               status: "Active",
//               last_order_date: new Date().toISOString().split("T")[0],
//               updated_at: new Date().toISOString(),
//             })
//             .eq("id", existingCustomer.id);
//         }
//       }


//       // ✅ Clear cart after successful payment
//       const { error: cartError } = await supabase
//         .from("cart_items")
//         .delete()
//         .eq("user_id", session.metadata?.userId);


//       if (cartError) {
//         console.error("Cart Clear Error:", cartError);
//       }



//       // Send order confirmation email to external user
//       // using maidrill API, templayte: 
//       // Order Confirme
//       // Slug : order-confirmation-external

//       // Mappings : 
//       // Dear {{ first_name }}
//       // Order Number: {{ order_number }}

//       // Recipient: {{ Recipient }}

//       // Date: {{ delivery_date }}
//       // Time: {{ delivery_time }}

//       // Items: {{ item_list }}

//       // Total: {{ order_total }}
//       //       // 
//       // \


//       // try {
//       //   const res = await fetch("https://mandrillapp.com/api/1.0/messages/send-template.json", {
//       //     method: "POST",
//       //     headers: { "Content-Type": "application/json" },
//       //     body: JSON.stringify({
//       //       key: process.env.MANDRILL_API_KEY,
//       //       template_name: "order-confirmation-external",
//       //       template_content: [],
//       //       message: {
//       //         from_email: "info@luxebureau.com",
//       //         to: [{ email: customer_email, type: "to" }],
//       //         merge: true,
//       //         global_merge_vars: [
//       //           { name: "first_name", content: session.customer_details?.name?.split(" ")?.[0] ?? "" },
//       //           { name: "order_number", content: orderData?.id ?? "" },
//       //           { name: "Recipient", content: session.customer_details?.name ?? "" },
//       //           { name: "delivery_date", content: "" },
//       //           { name: "delivery_time", content: "" },
//       //           { name: "item_list", content: "" }, // You can build from order_items join if needed
//       //           { name: "order_total", content: orderTotal.toFixed(2) },
//       //         ],
//       //       },
//       //     }),
//       //   });
//       //   if (!res.ok) {
//       //     const txt = await res.text();
//       //     console.error("Mandrill error:", res.status, txt);
//       //   }
//       // } catch (e) {
//       //   console.error("Mandrill fetch failed:", e);
//       // }



//     }

//     if (event.type === "payment_intent.payment_failed") {
//       const intent = event.data.object as Stripe.PaymentIntent;

//       // ✅ Update payment status to failed
//       const { error: failError } = await supabase
//         .from("orders")
//         .update({
//           payment_status: "failed",
//         })
//         .eq("stripe_payment_intent_id", intent.id);

//       if (failError) {
//         console.error("Payment Failed Update Error:", failError);
//       }
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err: any) {
//     console.error("Stripe Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }













// import { headers } from "next/headers";
// import Stripe from "stripe";
// import { createClient } from "@supabase/supabase-js";
// import axios from "axios";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// // Service-role Supabase client (bypass RLS)
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // Shape we want to work with after normalization
// type OrderItemRow = {
//   product_id: string;
//   quantity: number;
//   selected_variant_name: string | null;
//   price_at_purchase: number | null;
//   product: { id: string; name: string; image_1: string | null } | null;
// };

// // Raw DB shape (Supabase might send product as an array or a single object)
// type OrderItemRowDB = {
//   product_id: string;
//   quantity: number;
//   selected_variant_name: string | null;
//   price_at_purchase: number | null;
//   product:
//     | { id: string; name: string; image_1: string | null }
//     | { id: string; name: string; image_1: string | null }[]
//     | null;
// };

// export async function POST(request: Request) {
//   const headerList = await headers();
//   const signature = headerList.get("stripe-signature");
//   const body = await request.text();

//   try {
//     const event = stripe.webhooks.constructEvent(
//       body,
//       signature!,
//       process.env.STRIPE_SECRET_WEBHOOK_KEY!
//     );

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       // 1) Load the order so we can guard idempotently
//       const { data: existingOrder, error: fetchOrderError } = await supabase
//         .from("orders")
//         .select("id, payment_status, inventory_processed, stripe_session_id")
//         .eq("stripe_session_id", session.id)
//         .single();

//       if (fetchOrderError || !existingOrder) {
//         console.error("Order fetch error or not found:", fetchOrderError);
//         return new Response("Order not found for session", { status: 200 });
//       }

//       // Skip duplicate processing
//       if (
//         existingOrder.payment_status === "completed" &&
//         existingOrder.inventory_processed === true
//       ) {
//         console.log(`Order ${existingOrder.id} already processed. Skipping.`);
//         return new Response("OK (already processed)", { status: 200 });
//       }

//       // 2) Update order payment info (do NOT mark inventory yet)
//       const { data: orderData, error: updateError } = await supabase
//         .from("orders")
//         .update({
//           stripe_payment_intent_id: session.payment_intent as string,
//           stripe_customer_id: session.customer as string,
//           stripe_payment_status: session.payment_status,
//           stripe_payment_method: session.payment_method_types?.[0],
//           status: "Active",
//           payment_status: "completed",
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", existingOrder.id)
//         .select("id, inventory_processed")
//         .single();

//       if (updateError) {
//         console.error("Order Update Error:", updateError);
//         return new Response("Update error", { status: 200 });
//       }

//       console.log(`Order ${orderData?.id}`);

//       // 3) Fetch order items (product relation may come back as array OR object)
//       const { data: orderItemsRaw, error: itemsError } = await supabase
//         .from("order_items")
//         .select(
//           `
//             product_id,
//             quantity,
//             selected_variant_name,
//             price_at_purchase,
//             product:products (
//               id, name, image_1
//             )
//           `
//         )
//         .eq("order_id", existingOrder.id);

//       if (itemsError) {
//         console.error("Order Items Fetch Error:", itemsError);
//         return new Response("Items fetch error", { status: 200 });
//       }

//       // 4) Normalize into a single product object (first element if array)
//       const orderItems: OrderItemRow[] = (orderItemsRaw as OrderItemRowDB[]).map(
//         ({ product, ...rest }) => ({
//           ...rest,
//           product: Array.isArray(product) ? product[0] ?? null : product,
//         })
//       );

//       // If inventory already marked processed (race condition), skip decrement
//       if (orderData?.inventory_processed === true) {
//         console.log(
//           `Order ${orderData.id} inventory already processed post-update.`
//         );
//       } else {
//         // 5) Decrement inventory exactly once
//         if (orderItems?.length) {
//           for (const item of orderItems) {
//             const variantName = item.selected_variant_name ?? "default";
//             const { error: inventoryError } = await supabase.rpc(
//               "decrement_variant_inventory",
//               {
//                 p_product_id: item.product_id,
//                 p_variant_name: variantName,
//                 p_quantity: item.quantity,
//               }
//             );

//             if (inventoryError) {
//               console.error(
//                 `Inventory Update Error for product ${item.product_id}, variant ${variantName}:`,
//                 inventoryError
//               );
//             } else {
//               console.log(
//                 `Inventory decreased for product ${item.product_id}, variant ${variantName} by ${item.quantity}`
//               );
//             }
//           }
//         }

//         // 6) Mark inventory processed (prevents double-decrement on retries)
//         const { error: markProcessedError } = await supabase
//           .from("orders")
//           .update({
//             inventory_processed: true,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("id", existingOrder.id);

//         if (markProcessedError) {
//           console.error(
//             "Failed to mark inventory_processed:",
//             markProcessedError
//           );
//         }
//       }

//       // 7) Build Mandrill items safely
//       const mandrillItems =
//         (orderItems ?? []).map((item, i) => {
//           const product = item.product;
//           return {
//             gift_label: `GIFT ${String(i + 1).padStart(2, "0")}`,
//             title: product?.name ?? "Product",
//             variant: item.selected_variant_name ?? "Default",
//             qty: item.quantity,
//             price: Number(item.price_at_purchase ?? 0).toFixed(2),
//             image_url: product?.image_1 ?? "https://placehold.co/600x400.png",
//             url: `https://yourstore.com/products/${item.product_id}`,
//             date: new Date().toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//             }),
//             time: new Date().toLocaleTimeString("en-US", {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             right_image: false,
//           };
//         }) ?? [];

//       const orderTotal = session.amount_total ? session.amount_total / 100 : 0;

//       // 8) Send Mandrill email (log errors; don’t fail webhook)
//       try {
//         const res = await axios.post(
//           "https://mandrillapp.com/api/1.0/messages/send-template.json",
//           {
//             key: process.env.MANDRILL_API_KEY,
//             template_name: "order-confirmation-external",
//             template_content: [],
//             message: {
//               from_email: "no-reply@theluxebureau.com",
//               from_name: "The Luxe Bureau",
//               to: [
//                 {
//                   email: session.customer_details?.email,
//                   name: session.customer_details?.name ?? "",
//                   type: "to",
//                 },
//               ],
//               subject: "Your Luxe Bureau order is confirmed",
//               merge: true,
//               merge_language: "handlebars",
//               global_merge_vars: [
//                 {
//                   name: "first_name",
//                   content:
//                     session.customer_details?.name?.split(" ")?.[0] ?? "",
//                 },
//                 {
//                   name: "preheader_text",
//                   content:
//                     "Your order is confirmed and being prepared with care.",
//                 },
//                 { name: "order_number", content: existingOrder.id },
//                 {
//                   name: "Recipient",
//                   content: session.customer_details?.name ?? "",
//                 },
//                 { name: "order_total", content: orderTotal.toFixed(2) },
//                 { name: "items", content: mandrillItems },
//               ],
//             },
//           }
//         );
//         console.log("Mandrill response:", res.data);
//       } catch (e: any) {
//         console.error("Mandrill axios error:", e?.response?.data || e?.message);
//       }

//       // 9) Update customer aggregates (best-effort)
//       if (existingOrder.id) {
//         const customerEmail = session.customer_details?.email ?? null;
//         if (customerEmail) {
//           const { data: existingCustomer } = await supabase
//             .from("customers")
//             .select("*")
//             .eq("email", customerEmail)
//             .single();

//           if (existingCustomer) {
//             await supabase
//               .from("customers")
//               .update({
//                 total_spent: (existingCustomer.total_spent || 0) + orderTotal,
//                 order_count: (existingCustomer.order_count || 0) + 1,
//                 status: "Active",
//                 last_order_date: new Date().toISOString().split("T")[0],
//                 updated_at: new Date().toISOString(),
//               })
//               .eq("id", existingCustomer.id);
//           }
//         }
//       }

//       // 10) Clear cart if metadata has userId
//       if (session.metadata?.userId) {
//         const { error: cartError } = await supabase
//           .from("cart_items")
//           .delete()
//           .eq("user_id", session.metadata.userId);

//         if (cartError) {
//           console.error("Cart Clear Error:", cartError);
//         }
//       }
//     }

//     if (event.type === "payment_intent.payment_failed") {
//       const intent = event.data.object as Stripe.PaymentIntent;
//       const { error: failError } = await supabase
//         .from("orders")
//         .update({
//           payment_status: "failed",
//           updated_at: new Date().toISOString(),
//         })
//         .eq("stripe_payment_intent_id", intent.id);

//       if (failError) {
//         console.error("Payment Failed Update Error:", failError);
//       }
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err: any) {
//     console.error("Stripe Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }










import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Service-role Supabase client (bypass RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Normalized shape we want to use everywhere */
type OrderItemRow = {
  product_id: string;
  quantity: number;
  selected_variant_name: string | null;
  price_at_purchase: number | null;
  product: { id: string; name: string; image_1: string | null } | null;
  custom_data: string | null;
};

/** Raw DB shape (Supabase might return product as object or array) */
type OrderItemRowDB = {
  product_id: string;
  quantity: number;
  selected_variant_name: string | null;
  price_at_purchase: number | null;
  product:
  | { id: string; name: string; image_1: string | null }
  | { id: string; name: string; image_1: string | null }[]
  | null;
  custom_data: string | null;
};

/** Utility: event-level dedupe; returns true if this event was already processed */
async function alreadyProcessedEvent(eventId: string) {
  // Try to insert; if PK conflict, we've processed this event before.
  const { error } = await supabase
    .from("stripe_events")
    .insert({ event_id: eventId });

  // Unique violation -> already processed
  if (error && /duplicate key|unique|already exists|23505/i.test(error.message)) {
    return true;
  }

  // Other errors: log but don't block; let order-level guard handle safety
  if (error) {
    console.error("stripe_events insert error:", error);
  }
  return false;
}

export async function POST(request: Request) {
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");
  const rawBody = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!
    );

    // Event-level idempotency
    if (await alreadyProcessedEvent(event.id)) {
      return new Response("OK (event already processed)", { status: 200 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // 1) Locate the order (we rely on stripe_session_id set during session creation)
      const { data: existingOrder, error: fetchOrderError } = await supabase
        .from("orders")
        .select("id, payment_status, inventory_processed, stripe_session_id")
        .eq("stripe_session_id", session.id)
        .single();

      if (fetchOrderError || !existingOrder) {
        console.error("Order fetch error or not found:", fetchOrderError);
        return new Response("No order for session", { status: 200 });
      }

      if (
        existingOrder.payment_status === "completed" &&
        existingOrder.inventory_processed === true
      ) {
        console.log(`Order ${existingOrder.id} already processed. Skipping.`);
        return new Response("OK (order already processed)", { status: 200 });
      }

      const { data: orderData, error: updateError } = await supabase
        .from("orders")
        .update({
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_customer_id: session.customer as string,
          stripe_payment_status: session.payment_status,
          stripe_payment_method: session.payment_method_types?.[0],
          status: "Active",
          payment_status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingOrder.id)
        .select("id, inventory_processed")
        .single();

      if (updateError) {
        console.error("Order Update Error:", updateError);
        return new Response("Update error", { status: 200 });
      }

      console.log(`Order ${orderData?.id}`);

      // 4) Fetch order items with joined product
      const { data: orderItemsRaw, error: itemsError } = await supabase
        .from("order_items")
        .select(
          `
            product_id,
            quantity,
            selected_variant_name,
            custom_data,
            price_at_purchase,
            product:products (
              id, name, image_1
            )
          `
        )
        .eq("order_id", existingOrder.id);

      if (itemsError) {
        console.error("Order Items Fetch Error:", itemsError);
        return new Response("Items fetch error", { status: 200 });
      }

      const orderItems: OrderItemRow[] = (orderItemsRaw as OrderItemRowDB[]).map(
        ({ product, ...rest }) => ({
          ...rest,
          product: Array.isArray(product) ? product[0] ?? null : product,
        })
      );

      if (orderData?.inventory_processed === true) {
        console.log(`Order ${orderData.id} inventory already processed.`);
      } else {
        for (const item of orderItems) {
          const variantName = item.selected_variant_name ?? "default";

          try {
            const { data: currentVariant } = await supabase
              .from('product_variants')
              .select('qty_blocked')
              .eq('product_id', item.product_id)
              .eq('name', variantName)
              .single();

            if (currentVariant) {
              const { error: confirmError } = await supabase
                .from('product_variants')
                .update({
                  qty_blocked: Math.max(0, currentVariant.qty_blocked - item.quantity),
                  updated_at: new Date().toISOString(),
                })
                .eq('product_id', item.product_id)
                .eq('name', variantName);

              if (confirmError) {
                console.error(
                  `Inventory confirmation error for product ${item.product_id}, variant ${variantName}:`,
                  confirmError
                );
              } else {
                console.log(
                  `Inventory confirmed for product ${item.product_id}, variant ${variantName} - reduced qty_blocked by ${item.quantity}`
                );
              }
            }
          } catch (error) {
            console.error('Error confirming inventory:', error);
          }
        }

        const { error: markProcessedError } = await supabase
          .from("orders")
          .update({
            inventory_processed: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingOrder.id);

        if (markProcessedError) {
          console.error("Failed to mark inventory_processed:", markProcessedError);
        }
      }

      const mandrillItems = orderItems.map((item) => {
        const product = item.product;

        const customData = typeof item.custom_data === "string"
          ? JSON.parse(item.custom_data)
          : item.custom_data;


        console.log(customData.recipientName);
        return {
          title: product?.name ?? "Product",
          order_number: String(orderData?.id ?? ""),
          recipient: customData.recipientName ?? "Customer",
          delivery_date: customData.deliveryDate,
          delivery_time: customData.preferredDeliveryTime,
          items: `${item.selected_variant_name ?? "Default"} x ${item.quantity}`,
          total: (item.price_at_purchase ?? 0).toFixed(2),
          image_url: product?.image_1 ?? "https://placehold.co/600x400.png",
          account_url: process.env.NEXT_PUBLIC_ACCOUNT_URL ?? "https://theluxebureau.netlify.app/account",
        };
      });


      // 7) Build Mandrill items safely
      // const mandrillItems = orderItems.map((item, i) => {
      //   const product = item.product;
      //   console.log(product);
      //   return {
      //     title: product?.name ?? "Product",
      //     order_number: orderData?.id ?? "",
      //     recipient: item?.customData?.recipientName ?? "Customer",
      //     delivery_date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      //     delivery_time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      //     items: `${item.selected_variant_name ?? "Default"} x ${item.quantity}`,
      //     total: Number(item.price_at_purchase ?? 0).toFixed(2),
      //     image_url: product?.image_1 ?? "https://placehold.co/600x400.png",
      //     account_url: `https://theluxebureau.netlify.app/account`,
      //   };
      // });

      const orderTotal = session.amount_total ? session.amount_total / 100 : 0;

      // 8) Send Mandrill email (best-effort; do not fail webhook)
      try {
        if (session.customer_details?.email) {
          const res = await axios.post(
            "https://mandrillapp.com/api/1.0/messages/send-template.json",
            {
              key: "md-BfHmKxZ95KI6BiaR4dwUJQ",
              template_name: "order-confirmation-external",
              template_content: [],
              message: {
                from_email: "orders@theluxebureau.com",
                from_name: "the Luxe Bureau",
                to: [
                  {
                    email: session.customer_details.email,
                    name: session.metadata?.customerName,
                    type: "to",
                  },
                ],
                subject: "Your Luxe Bureau order is confirmed",
                merge: true,
                merge_language: "handlebars",
                global_merge_vars: [
                  {
                    name: "first_name",
                    content: session.metadata?.customerName,
                  },
                  {
                    name: "subject",
                    content: "Your order is confirmed and being prepared with care.",
                  },
                  // { name: "order_number", content: existingOrder.id },
                  // { name: "Recipient", content: session.customer_details?.name ?? "" },
                  // { name: "order_total", content: orderTotal.toFixed(2) },
                  { name: "gifts", content: mandrillItems },
                ],
              },
            }
          );
          console.log("Mandrill response:", res.data);
        } else {
          console.warn("No customer email on session; skipping Mandrill send.");
        }
      } catch (e: any) {
        console.error("Mandrill axios error:", e?.response?.data || e?.message);
      }


      const mandrillItemsForInternal = orderItems.map((item) => {
        const product = item.product;

        const customData = typeof item.custom_data === "string"
          ? JSON.parse(item.custom_data)
          : item.custom_data;


        console.log(customData.recipientName);
        console.log(customData.yourName);
        return {
          title: product?.name ?? "Product",
          order_number: String(orderData?.id ?? ""),
          sender_name: customData.yourName ?? "Customer",
          variant: item.selected_variant_name,
          qty: item.quantity,
          price: (item.price_at_purchase ?? 0).toFixed(2),
          image_url: product?.image_1 ?? "https://placehold.co/600x400.png",
          gift_label: product?.name ?? "Product",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          order_total: orderTotal.toFixed(2),
          url: "https://theluxebureau.netlify.app/account",
        };
      });
      const TodayDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? "theluxebureau";
      // Send mail to internal team    
      try {
        if (session.customer_details?.email) {
          const res = await axios.post(
            "https://mandrillapp.com/api/1.0/messages/send-template.json",
            {
              key: "md-BfHmKxZ95KI6BiaR4dwUJQ",
              template_name: "new-order-internal",
              template_content: [],
              message: {
                from_email: "orders@theluxebureau.com",
                from_name: "the Luxe Bureau",
                to: [
                  {
                    email: "remotevansh@gmail.com",
                    type: "to",
                  },
                ],
                subject: "You have a new order",
                merge: true,
                merge_language: "handlebars",
                global_merge_vars: [
                  { name: "first_name", content: session.metadata?.customerName },
                  {
                    name: "preheader_text",
                    content: "You have a new order",
                  },
                  { name: "items", content: mandrillItemsForInternal },
                ],
              },
            }
          );
          console.log("Mandrill response:", res.data);
        } else {
          console.warn("No customer email on session; skipping Mandrill send.");
        }
      } catch (e: any) {
        console.error("Mandrill axios error:", e?.response?.data || e?.message);
      }

      // 9) Update customer aggregates (best-effort)
      if (session.customer_details?.email) {
        const customerEmail = session.customer_details.email;
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("*")
          .eq("email", customerEmail)
          .single();

        if (existingCustomer) {
          await supabase
            .from("customers")
            .update({
              total_spent: (existingCustomer.total_spent || 0) + orderTotal,
              order_count: (existingCustomer.order_count || 0) + 1,
              status: "Active",
              last_order_date: new Date().toISOString().split("T")[0],
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingCustomer.id);
        }
      }

      const metadata =
        typeof session.metadata === "string"
          ? JSON.parse(session.metadata)
          : session.metadata;

      // Get userId safely
      const userId = metadata?.userId;

      if (userId) {
        console.log("im in clear cart");
        const { error: cartError } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId);

        if (cartError) {
          console.error("Cart Clear Error:", cartError);
        }
      }
    }


    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;

      // Update order status
      const { data: orderData, error: failError } = await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_payment_intent_id", intent.id)
        .select("id, customer_name, customer_email, recipient_name, total_amount")
        .single();

      if (failError) {
        console.error("Payment Failed Update Error:", failError);
        return new Response("Payment failed update error", { status: 200 });
      }

      let mandrillItems: any[] = [];

      if (orderData?.id) {
        try {
          // Fetch order items with product details
          const { data: orderItemsRaw, error: itemsError } = await supabase
            .from("order_items")
            .select(`
          product_id,
          quantity,
          selected_variant_name,
          price_at_purchase,
          product:products (
            id, name, image_1
          )
        `)
            .eq("order_id", orderData.id);

          if (itemsError) {
            console.error("Order Items Fetch Error (failed payment):", itemsError);
          }

          const orderItems: OrderItemRow[] = (orderItemsRaw as OrderItemRowDB[]).map(
            ({ product, ...rest }) => ({
              ...rest,
              product: Array.isArray(product) ? product[0] ?? null : product,
            })
          );

          // Release inventory
          for (const item of orderItems) {
            const variantName = item.selected_variant_name ?? "default";

            const { data: currentVariant } = await supabase
              .from("product_variants")
              .select("inventory, qty_blocked")
              .eq("product_id", item.product_id)
              .eq("name", variantName)
              .single();

            if (currentVariant) {
              await supabase
                .from("product_variants")
                .update({
                  qty_blocked: Math.max(0, currentVariant.qty_blocked - item.quantity),
                  updated_at: new Date().toISOString(),
                })
                .eq("product_id", item.product_id)
                .eq("name", variantName);

              console.log(
                `Inventory released for failed payment - product ${item.product_id}, variant ${variantName}: +${item.quantity} inventory, -${item.quantity} qty_blocked`
              );
            }
          }

          // Build gifts for cancellation email
          mandrillItems = orderItems.map((item, i) => {
            const product = item.product;
            return {
              gift_label: `GIFT ${String(i + 1).padStart(2, "0")}`,
              title: product?.name ?? "Product",
              variant: item.selected_variant_name ?? "Default",
              qty: item.quantity,
              price: Number(item.price_at_purchase ?? 0).toFixed(2),
              image_url: product?.image_1 ?? "https://placehold.co/500x800.png",
              url: `https://theluxebureau.com/products/${item.product_id}`,
              order_date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
            };
          });
        } catch (inventoryError) {
          console.error("Error releasing inventory for failed payment:", inventoryError);
        }
      }

      // Send cancellation email if order found and has customer email
      try {
        if (orderData?.customer_email) {
          const res = await axios.post(
            "https://mandrillapp.com/api/1.0/messages/send-template.json",
            {
              key: "md-BfHmKxZ95KI6BiaR4dwUJQ", // move to ENV in production
              template_name: "order-cancelled-external",
              template_content: [],
              message: {
                from_email: "orders@theluxebureau.com",
                from_name: "the Luxe Bureau",
                to: [
                  {
                    email: orderData.customer_email,
                    type: "to",
                  },
                ],
                subject: "Your order has been cancelled",
                merge: true,
                merge_language: "handlebars",
                global_merge_vars: [
                  {
                    name: "preheader_text",
                    content:
                      "We're sorry to let you know that your Luxe Bureau order has been cancelled due to payment failure.",
                  },
                  { name: "first_name", content: intent.metadata?.customerName},
                  { name: "order_number", content: orderData.id },
                  { name: "Recipient", content: orderData.recipient_name },
                  { name: "account_url", content: "https://theluxebureau.com/account" },
                  { name: "order_total", content: orderData.total_amount },
                  { name: "gifts", content: mandrillItems }, // ✅ now real DB items
                ],
              },
            }
          );
          console.log("Cancellation email sent:", res.data);
        } else {
          console.warn("No customer email found for order; skipping cancellation email.");
        }
      } catch (e: any) {
        console.error("Mandrill cancellation email error:", e?.response?.data || e?.message);
      }
    }


    // // Payment failed handler
    // if (event.type === "payment_intent.payment_failed") {
    //   const intent = event.data.object as Stripe.PaymentIntent;

    //   // Update order status
    //   const { data: orderData, error: failError } = await supabase
    //     .from("orders")
    //     .update({
    //       payment_status: "failed",
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("stripe_payment_intent_id", intent.id)
    //     .select("id, customer_name, customer_email, recipient_name, total_amount")
    //     .single();

    //   if (failError) {
    //     console.error("Payment Failed Update Error:", failError);
    //     return new Response("Payment failed update error", { status: 200 });
    //   }

    //   if (orderData?.id) {
    //     try {
    //       const { data: orderItems } = await supabase
    //         .from("order_items")
    //         .select("product_id, quantity, selected_variant_name")
    //         .eq("order_id", orderData.id);

    //       if (orderItems && orderItems.length > 0) {
    //         for (const item of orderItems) {
    //           const variantName = item.selected_variant_name ?? "default";

    //           const { data: currentVariant } = await supabase
    //             .from('product_variants')
    //             .select('inventory, qty_blocked')
    //             .eq('product_id', item.product_id)
    //             .eq('name', variantName)
    //             .single();

    //           if (currentVariant) {
    //             await supabase
    //               .from('product_variants')
    //               .update({
    //                 inventory: currentVariant.inventory + item.quantity,
    //                 qty_blocked: Math.max(0, currentVariant.qty_blocked - item.quantity),
    //                 updated_at: new Date().toISOString(),
    //               })
    //               .eq('product_id', item.product_id)
    //               .eq('name', variantName);

    //             console.log(
    //               `Inventory released for failed payment - product ${item.product_id}, variant ${variantName}: +${item.quantity} inventory, -${item.quantity} qty_blocked`
    //             );
    //           }

    //         }

    //       }
    //     } catch (inventoryError) {
    //       console.error('Error releasing inventory for failed payment:', inventoryError);
    //     }
    //   }




    //   // Send cancellation email if order found and has customer email
    //   try {
    //     if (orderData?.customer_email) {
    //       const res = await axios.post(
    //         "https://mandrillapp.com/api/1.0/messages/send-template.json",
    //         {
    //           key: "md-BfHmKxZ95KI6BiaR4dwUJQ", // move to ENV in production
    //           template_name: "order-cancelled-external",
    //           template_content: [],
    //           message: {
    //             from_email: "orders@theluxebureau.com",
    //             from_name: "the Luxe Bureau",
    //             to: [
    //               {
    //                 email: orderData.customer_email,
    //                 type: "to",
    //               },
    //             ],
    //             subject: "Your order has been cancelled",
    //             merge: true,
    //             merge_language: "handlebars",
    //             global_merge_vars: [
    //               {
    //                 name: "preheader_text",
    //                 content:
    //                   "We're sorry to let you know that your Luxe Bureau order has been cancelled due to payment failure.",
    //               },
    //               { name: "first_name", content: orderData.customer_name?.split(" ")?.[0] ?? "" },
    //               { name: "order_number", content: orderData.customer_name?.split(" ")?.[0] ?? "" },
    //               { name: "order_number", content: orderData.id },
    //               { name: "Recipient", content: orderData.recipient_name },
    //               { name: "account_url", content: "https://theluxebureau.com/account" },
    //               { name: "order_total", content: orderData.total_amount },
    //               { name: "gifts", content: mandrillItems },
    //             ],
    //           },
    //         }
    //       );
    //       console.log("Cancellation email sent:", res.data);
    //     } else {
    //       console.warn(
    //         "No customer email found for order; skipping cancellation email."
    //       );
    //     }
    //   } catch (e: any) {
    //     console.error("Mandrill cancellation email error:", e?.response?.data || e?.message);
    //   }
    // }

    return new Response("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("Stripe Webhook Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
