import CheckoutForm from "@/components/CheckoutComponents/CheckoutForm";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <div className="h-screen bg-[#FDF6E4]">
      <div className="bg-[#FDF6E4] text-stone-600">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4.07em)]">
          <div className="relative h-full">
            <Image
              src="/image.png"
              alt="Luxury products"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8 ">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  );
}
