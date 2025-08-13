// import { headers } from "next/headers";
// import Stripe from "stripe";
// import { createClient } from "@/lib/supabase/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(request: Request) {
//   const head = await headers();
//   const sign = head.get("stripe-signature");
//   const body = await request.text();

//   try {
//     const event = stripe.webhooks.constructEvent(
//       body,
//       sign!,
//       process.env.STRIPE_SECRET_WEBHOOK_KEY!
//     );
//     const supabase = await createClient();

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       const { error: updateError } = await supabase
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
//         .eq("stripe_session_id", session.id);

//       // Clear the cart after successful payment
//       const { error: cartError } = await supabase
//         .from("carts")
//         .delete()
//         .eq("user_email", session.customer_email);

//       if (cartError) {
//         console.error("Cart Clear Error:", cartError);
//       }

//       if (updateError) {
//         console.error("Webhook Update Error:", updateError);
//       }
//     } else if (event.type === "payment_intent.payment_failed") {
//       const intent = event.data.object as Stripe.PaymentIntent;
//       await supabase
//         .from("orders")
//         .update({
//           payment_status: "failed",
//         })
//         .eq("stripe_payment_intent_id", intent.id);
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err: any) {
//     console.error("Stripe Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }


// // /app/api/stripe/webhook/route.ts
// import { headers } from "next/headers";
// import Stripe from "stripe";
// import { createClient } from "@/lib/supabase/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

//     const supabase = await createClient();

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       // ✅ Update order on payment success
//       const { error: updateError } = await supabase
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
//         .eq("stripe_session_id", session.id);

//       if (updateError) {
//         console.error("Order Update Error:", updateError);
//       }

//       // ✅ Clear cart after successful payment
//       const { error: cartError } = await supabase
//         .from("cart_items")
//         .delete()
//         .eq("user_id", session.metadata?.userId);

//       if (cartError) {
//         console.error("Cart Clear Error:", cartError);
//       }
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
//     else{
//       console.log(event);
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err: any) {
//     console.error("Stripe Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }


// // /app/api/stripe/webhook/route.ts
// import { headers } from "next/headers";
// import Stripe from "stripe";
// import { createClient } from "@/lib/supabase/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

//     const supabase = await createClient();

//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;

//         // ✅ Update order on payment success
//         const { error: updateError } = await supabase
//           .from("orders")
//           .update({
//             stripe_payment_intent_id: session.payment_intent as string,
//             stripe_customer_id: (session.customer as string) || null,
//             stripe_payment_status: session.payment_status,
//             stripe_payment_method: session.payment_method_types?.[0] || null,
//             status: "Active",
//             payment_status: "completed",
//             updated_at: new Date().toISOString(),
//           })
//           .eq("stripe_session_id", session.id);

//         if (updateError) {
//           console.error("Order Update Error:", updateError);
//         }

//         // ✅ Clear cart only if userId is present
//         if (session.metadata?.userId) {
//           const { error: cartError } = await supabase
//             .from("cart_items")
//             .delete()
//             .eq("user_id", session.metadata.userId);

//           if (cartError) {
//             console.error("Cart Clear Error:", cartError);
//           }
//         } else {
//           console.warn("No userId in session metadata — cart not cleared");
//         }

//         break;
//       }

//       case "payment_intent.payment_failed": {
//         const intent = event.data.object as Stripe.PaymentIntent;

//         // ✅ Update payment status to failed
//         const { error: failError } = await supabase
//           .from("orders")
//           .update({
//             payment_status: "failed",
//           })
//           .eq("stripe_payment_intent_id", intent.id);

//         if (failError) {
//           console.error("Payment Failed Update Error:", failError);
//         }

//         break;
//       }

//       default:
//         // Log other events for debugging
//         console.log(`Unhandled event type: ${event.type}`);
//         break;
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err: any) {
//     console.error("Stripe Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }


// /app/api/stripe/webhook/route.ts
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  console.log("=== Stripe Webhook Received ===");

  const headerList = await headers();
  console.log("📦 Raw Headers:", Object.fromEntries(headerList.entries()));

  const signature = headerList.get("stripe-signature");
  console.log("🔑 Stripe Signature:", signature);

  const body = await request.text();
  console.log("📦 Raw Body:", body);

  try {
    console.log("🔄 Constructing Stripe Event...");
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!
    );
    console.log("✅ Stripe Event Constructed:", JSON.stringify(event, null, 2));

    const supabase = await createClient();
    console.log("✅ Supabase client created");

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("💳 Handling checkout.session.completed event");
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("📄 Session Object:", JSON.stringify(session, null, 2));

        // const { error: updateError, data: updateData } = await supabase
        //   .from("orders")
        //   .update({
        //     stripe_payment_intent_id: session.payment_intent as string,
        //     stripe_customer_id: (session.customer as string) || null,
        //     stripe_payment_status: session.payment_status,
        //     stripe_payment_method: session.payment_method_types?.[0] || null,
        //     status: "Active",
        //     payment_status: "completed",
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq("stripe_session_id", session.id)
        //   .select();

        // if (updateError) {
        //   console.error("❌ Order Update Error:", updateError);
        // } else {
        //   console.log("✅ Order Updated:", updateData);
        // }

        const { data, error } = await supabase.from("orders").select("*").limit(1);
        console.log("📦 Orders:", data, error);


        if (session.metadata?.userId) {
          console.log("🛒 Clearing cart for userId:", session.metadata.userId);
          const { error: cartError, data: cartData } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", session.metadata.userId)
            .select();

          if (cartError) {
            console.error("❌ Cart Clear Error:", cartError);
          } else {
            console.log("✅ Cart Cleared:", cartData);
          }
        } else {
          console.warn("⚠️ No userId in session metadata — cart not cleared");
        }

        break;
      }

      case "payment_intent.payment_failed": {
        console.log("💳 Handling payment_intent.payment_failed event");
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("📄 PaymentIntent Object:", JSON.stringify(intent, null, 2));

        const { error: failError, data: failData } = await supabase
          .from("orders")
          .update({
            payment_status: "failed",
          })
          .eq("stripe_payment_intent_id", intent.id)
          .select();

        if (failError) {
          console.error("❌ Payment Failed Update Error:", failError);
        } else {
          console.log("✅ Payment Failure Recorded:", failData);
        }

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        break;
    }

    console.log("=== Webhook Processing Completed ===");
    return new Response("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("❌ Stripe Webhook Error:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
