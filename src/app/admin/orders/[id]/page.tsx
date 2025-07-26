import { OrderDetailsPage } from "@/components/DashboardComponents/OrderDetailsPage"

export default function OrderDetails({ params }: { params: { id: string } }) {
  return <OrderDetailsPage orderId={params.id} />
}
