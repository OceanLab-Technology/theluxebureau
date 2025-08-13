import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Service-role Supabase client (bypass RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function POST(request: Request) {
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ Update order on payment success
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
        .eq("stripe_session_id", session.id)
        .select("id") // fetch the order ID for inventory updates
        .single();
        
      if (updateError) {
        console.error("Order Update Error:", updateError);
      }

      // ✅ Decrease product inventory based on order_items table
      if (orderData?.id) {
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderData.id);

        if (itemsError) {
          console.error("Order Items Fetch Error:", itemsError);
        } else if (orderItems?.length) {
          for (const item of orderItems) {
            const { error: inventoryError } = await supabase.rpc(
              "decrement_inventory",
              {
                product_id: item.product_id,
                quantity: item.quantity,
              }
            );
            if (inventoryError) {
              console.error(
                `Inventory Update Error for product ${item.product_id}:`,
                inventoryError
              );
            } else {
              console.log(
                `Inventory decreased for product ${item.product_id} by ${item.quantity}`
              );
            }
          }
        }
      }


      // ✅ Clear cart after successful payment
      const { error: cartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", session.metadata?.userId);


      if (cartError) {
        console.error("Cart Clear Error:", cartError);
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;

      // ✅ Update payment status to failed
      const { error: failError } = await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("stripe_payment_intent_id", intent.id);

      if (failError) {
        console.error("Payment Failed Update Error:", failError);
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("Stripe Webhook Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}