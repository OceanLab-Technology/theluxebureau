import React from "react";
import { Product } from "@/app/api/types";

interface CheckoutItemProps {
  product: Product;
  index: number;
  isOrder?: boolean;
}

export const DetailProductCard: React.FC<CheckoutItemProps> = ({
  product,
  isOrder,
  index,
}) => {
  return (
    <div key={product.id} className="w-full font-[Marfa]">
      <h2 className="text-[18px] font-normal font-[SchoolBook] tracking-wide pb-3 border-b border-b-stone-300 mb-8">
        ITEM {String(index + 1).padStart(2, "0")}
      </h2>
      <div className={`${isOrder ? "md:flex-row flex-col md:gap-18 gap-8" : "flex-col gap-8"} flex`}>
        <div className={`flex items-start gap-10`}>
         <div
  className="bg-muted/20 h-60 md:h-[20rem] md:w-[28rem] w-full overflow-hidden "
>
  <img
    src={product.image_1 || "/placeholder.jpg"}
    alt={product.name}
    className="w-full h-full object-cover"
  />
</div>
          {!isOrder && (
            <div className="flex flex-col w-[90%] text-[1.5rem] justify-center space-y-8 font-[Century-Old-Style]">
              <h1 className="font-medium">{product.name}</h1>
              <p className="mt-2">
                for {product.customData?.recipientName || "recipient"}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-8 mt-8 w-full">
          {product.customData && Object.keys(product.customData).length > 0 && (
            <div className="md:space-y-8 space-y-8 w-full">
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Your Name
                </label>
                <p className="text-stone-600">{product.customData.yourName}</p>
              </div>
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Recipients Name
                </label>
                <p className="text-stone-600">{product.customData.recipientName}</p>
              </div>
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Recipients Address
                </label>
                <p className="text-stone-600">
                  {product.customData.recipientAddress &&
                  product.customData.recipientCity
                    ? `${product.customData.recipientAddress}, ${product.customData.recipientCity}`
                    : "Not provided"}
                </p>
              </div>
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Delivery Date
                </label>
                <p className="text-stone-600">
                  {product.customData.deliveryDate
                    ? (() => {
                        const date = new Date(product.customData.deliveryDate);
                        const dayName = date.toLocaleDateString("en-GB", {
                          weekday: "long",
                        });
                        const day = date.getDate();
                        const month = date.toLocaleDateString("en-GB", {
                          month: "long",
                        });
                        const year = date.getFullYear();
                        const getOrdinalSuffix = (d: number) => {
                          if (d >= 11 && d <= 13) return "th";
                          switch (d % 10) {
                            case 1:
                              return "st";
                            case 2:
                              return "nd";
                            case 3:
                              return "rd";
                            default:
                              return "th";
                          }
                        };
                        const ordinalSuffix = getOrdinalSuffix(day);
                        return (
                          <>
                            {dayName},{" "} {day}
                            <sup className="text-xs">{ordinalSuffix}</sup>{" "}
                            {month} {year}
                          </>
                        );
                      })()
                    : "Not selected"}
                </p>
              </div>
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Delivery Time
                </label>
                <p className="text-stone-600">
                  {product.customData.preferredDeliveryTime === "10am-1pm" && "10:00 – 13:00"}
                  {product.customData.preferredDeliveryTime === "1pm-4pm" && "13:00 – 16:00"}
                  {product.customData.preferredDeliveryTime === "4pm-6pm" && "16:00 – 18:00"}
                  {!["10am-1pm", "1pm-4pm", "4pm-6pm"].includes(product.customData.preferredDeliveryTime) && "Not selected"}
                </p>
              </div>
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <span className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                   Delivery Updates
                </span>
                <span className="text-stone-600">
                  {product.customData.smsUpdates === "send-to-me"
                    ? `You`
                    : product.customData.smsUpdates === "send-to-recipient"
                    ? `Recipient`
                    : "none"}
                </span>
              </div>
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Custom Letterhead
                </label>
                <p className="text-stone-600">
                  {product.customData.headerText}
                </p>
              </div>
              <div className="flex flex-row items-start gap-4 md:gap-8">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Personal Message
                </label>
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
