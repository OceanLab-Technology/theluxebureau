import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrderDetailPage from "./OrderDetailPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // Fetch the specific order
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          image_1,
          price
        )
      )
    `)
    .eq("id", params.id)
    .eq("user_email", user.email)
    .single();

  if (error || !order) {
    redirect("/account");
  }

  return <OrderDetailPage order={order} user={user} />;
}
