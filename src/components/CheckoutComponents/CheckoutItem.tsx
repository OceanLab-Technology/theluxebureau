import React from "react";
import { Product } from "@/app/api/types";

interface CheckoutItemProps {
  product: Product;
  index: number;
}

export const CheckoutItem: React.FC<CheckoutItemProps> = ({
  product,
  index,
}) => {
  return (
    <div key={product.id}>
      <h2 className="my-6 text-[0.93rem] pb-2 border-b">
        Item {String(index + 1).padStart(2, "0")}
      </h2>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-6">
          <div className="bg-muted/20 h-60  md:h-[17.93rem] md:w-[18.62rem] overflow-hidden">
            <img
              src={product.image_1 || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full text-[1.5rem] justify-center space-y-1">
            <h1 className="font-medium">{product.name}</h1>
            <p className="mt-2">
              for {product.customData?.recipientName || "recipient"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {product.customData && Object.keys(product.customData).length > 0 && (
            <div className="md:space-y-6 space-y-3">
              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Your Name
                </h3>
                <p className="text-stone-600">{product.customData.yourName}</p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Recipients Name
                </h3>
                <p className="text-stone-600">
                  {product.customData.recipientName}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Recipients Address
                </h3>
                <p className="text-stone-600">
                  {product.customData.recipientAddress &&
                  product.customData.recipientCity
                    ? `${product.customData.recipientAddress}, ${product.customData.recipientCity}`
                    : "Not provided"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Delivery Date
                </h3>
                <p className="text-stone-600">
                  {product.customData.deliveryDate || "Not selected"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Delivery Time
                </h3>
                <p className="text-stone-600">
                  {product.customData.preferredDeliveryTime || "Not selected"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <span className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  SMS Updates
                </span>
                <span className="text-stone-600">
                  {product.customData.smsUpdates === "send-to-me"
                    ? `You`
                    : product.customData.smsUpdates === "send-to-recipient"
                    ? `Recipient`
                    : "none"}
                </span>
              </div>
              <div className="flex items-center gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Custom Letterhead
                </h3>
                <p className="text-stone-600">
                  {product.customData.headerText}
                </p>
              </div>
              <div className="flex flex-col gap-2 border-b border-b-stone-300">
                <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Personal Message
                </h3>
                <p className="text-stone-600">
                  {product.customData.customMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
