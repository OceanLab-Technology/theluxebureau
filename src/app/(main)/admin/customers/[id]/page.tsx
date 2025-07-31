import { CustomerDetailsPage } from "@/components/DashboardComponents/CustomersDetailsPage";

export default async function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetailsPage customerId={id} />;
}
