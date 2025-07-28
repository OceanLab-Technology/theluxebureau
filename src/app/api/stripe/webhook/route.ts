import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type METADATA = {
  userId: string;
  priceId: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  orderItems?: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const header = await headers();
  const sig = header.get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  const supabase = await createClient();
  const eventType = event.type;

  try {
    switch (eventType) {
      // Handle Stripe Checkout Sessions (original flow)
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        const sessionData = event.data.object as Stripe.Checkout.Session;
        const sessionMetadata = sessionData.metadata as METADATA;
        
        const sessionTransactionDetails = {
          userId: sessionMetadata.userId,
          priceId: sessionMetadata.priceId,
          created: sessionData.created,
          currency: sessionData.currency,
          customerDetails: sessionData.customer_details,
          amount: sessionData.amount_total,
        };

        // Handle checkout session completion
        console.log("Checkout session completed:", sessionTransactionDetails);
        break;

      // Handle Payment Intents (Stripe Elements flow)
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;
        
        // Extract order items if they exist
        const orderItems = metadata.orderItems ? JSON.parse(metadata.orderItems) : [];

        // Create order record
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: metadata.userId,
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            status: "completed",
            customer_email: metadata.customerEmail,
            customer_first_name: metadata.customerFirstName,
            customer_last_name: metadata.customerLastName,
            shipping_address: paymentIntent.shipping?.address ? {
              line1: paymentIntent.shipping.address.line1,
              city: paymentIntent.shipping.address.city,
              postal_code: paymentIntent.shipping.address.postal_code,
              country: paymentIntent.shipping.address.country,
            } : null,
          })
          .select()
          .single();

        if (orderError) {
          console.error("Error creating order:", orderError);
          throw orderError;
        }

        // Create order items if they exist
        if (orderItems.length > 0 && order) {
          const orderItemsData = orderItems.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItemsData);

          if (itemsError) {
            console.error("Error creating order items:", itemsError);
            throw itemsError;
          }
        }

        console.log("Payment intent succeeded, order created:", order.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", failedPayment.id);
        
        // Optionally log failed payments
        const { error: failedOrderError } = await supabase
          .from("orders")
          .insert({
            user_id: failedPayment.metadata.userId || null,
            stripe_payment_intent_id: failedPayment.id,
            amount: failedPayment.amount / 100,
            currency: failedPayment.currency,
            status: "failed",
            customer_email: failedPayment.metadata.customerEmail || null,
          });

        if (failedOrderError) {
          console.error("Error logging failed payment:", failedOrderError);
        }
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
        return new Response("Unhandled event type", { status: 400 });
    }

    return NextResponse.json({
      status: 200,
      received: true,
    });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({
      status: 500,
      error: "Server error",
    });
  }
}
