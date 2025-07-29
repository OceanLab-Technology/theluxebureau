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
    const { items } = body;
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * (item.quantity || 1),
      0
    );

    const finalTotal = Math.round(subtotal * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalTotal,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerFirstName: user.email?.split("@")[0] || "",
        customerEmail: user.email || "",
        userId: user.id,
        orderItems: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
          }))
        ),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Stripe PaymentIntent Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
