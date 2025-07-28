"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type props = {
  productId: string;
  price: string;
  description: string;
};

export const CheckoutButton = ({ productId, price, description }: props) => {
  const router = useRouter();
  const handleSubmit = async () => {
    router.push(`/checkout/${productId}`);
  };

  return (
    <Button variant={"box_yellow"} className="px-20" onClick={handleSubmit}>
      Add to Cart
    </Button>
  );
};
