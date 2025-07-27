import { OrderDetailsPage } from "@/components/DashboardComponents/OrderDetailsPage";

export default async function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailsPage orderId={id} />;
}
