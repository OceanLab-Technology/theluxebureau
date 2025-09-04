import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const {
      items,
      customerInfo,
      total,
      recipientInfo,
      deliveryDate,
      personalisation,
      notes,
    } = body;

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          images: item.image_1 ? [item.image_1] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerInfo.email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancelled`,
      metadata: {
        userId: user.id,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        totalAmount: total.toString(),
      },
    });

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: session.id,
        user_email: user.email,
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: user.email,
        recipient_name: user.user_metadata.full_name,
        recipient_address: user.user_metadata.shipping_address,
        delivery_date: deliveryDate,
        notes,
        status: "New",
        payment_status: "pending",
        total_amount: total,
        personalisation,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Order creation failed:", orderError);
    } else {
      const orderId = orderData.id;
      // Insert order items
      for (const item of items) {
        await supabase.from("order_items").insert({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          custom_data: item.customData,
          selected_variant_name: item.selected_variant_name,
        });

        const variantName = item.selected_variant_name ?? "default";

        const { data, error } = await supabase.rpc("confirm_inventory", {
          p_quantity: item.quantity,
          p_product_id: item.product_id,
          p_variant_name: variantName,
        });

        console.log(item.product_id)
        console.log(variantName)

        console.log("Updated variant:", data);

        if (error) {
          console.error(
            `Inventory confirmation error for product ${item.product_id}, variant ${variantName}:`,
            error
          );
        } else {
          console.log(
            `Inventory confirmed for product ${item.product_id}, variant ${variantName} - decreased inventory by ${item.quantity}, increased qty_blocked by ${item.quantity}`
          );
        }

      }
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
