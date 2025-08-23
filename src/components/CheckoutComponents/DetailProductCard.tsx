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
      <h2 className="my-6 small-text pb-2 border-b">
        Item {String(index + 1).padStart(2, "0")}
      </h2>
      <div className={`${isOrder ? "md:flex-row flex-col md:gap-18 gap-4" : "flex-col gap-6"} flex `}>
        <div className={`flex items-start gap-6`}>
          <div
            className={` ${isOrder ? "md:h-full w-full" : ""} bg-muted/20 h-60 md:h-[17.93rem] md:w-[18.62rem] overflow-hidden`}
          >
            <img
              src={product.image_1 || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {!isOrder && (
            <div className="flex flex-col w-full text-[1.5rem] justify-center space-y-1 font-century">
              <h1 className="font-medium">{product.name}</h1>
              <p className="mt-2">
                for {product.customData?.recipientName || "recipient"}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-8 mt-4 w-full">
          {product.customData && Object.keys(product.customData).length > 0 && (
            <div className="md:space-y-6 space-y-3 w-full">
              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Your Name
                </label>
                <p className="text-stone-600">{product.customData.yourName}</p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Recipients Name
                </label>
                <p className="text-stone-600">
                  {product.customData.recipientName}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Recipients Address
                </label>
                <p className="text-stone-600">
                  {product.customData.recipientAddress &&
                  product.customData.recipientCity
                    ? `${product.customData.recipientAddress}, ${product.customData.recipientCity}`
                    : "Not provided"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
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

              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Delivery Time
                </label>
                <p className="text-stone-600">
                  {product.customData.preferredDeliveryTime === "10am-1pm" && "10:00 – 13:00"}
                  {product.customData.preferredDeliveryTime === "1pm-4pm" && "13:00 – 16:00"}
                  {product.customData.preferredDeliveryTime === "4pm-6pm" && "16:00 – 18:00"}
                  {!["10am-1pm", "1pm-4pm", "4pm-6pm"].includes(product.customData.preferredDeliveryTime) && "Not selected"}
                </p>
              </div>

              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <span className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
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

              <div className="flex items-center gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
                  Custom Letterhead
                </label>
                <p className="text-stone-600">
                  {product.customData.headerText}
                </p>
              </div>
              <div className="flex flex-col gap-2 border-b border-b-stone-300 pb-1">
                <label className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
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
