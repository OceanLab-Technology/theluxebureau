import React from "react";
import { Product } from "@/app/api/types";

interface CheckoutItemProps {
  product: Product;
  index: number;
  isOrder?: boolean;
}

export const NonUnderlineProductCard: React.FC<CheckoutItemProps> = ({
  product,
  isOrder,
  index,
}) => {
  return (
    <div key={product.id} className="w-full font-[ABC Marfa]">
      <div className={`${isOrder ? "md:flex-row   flex-col md:gap-18 gap-12" : "flex-col gap-12"} flex`}>
        <div className={`flex items-start gap-10`}>
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
            <div className="flex flex-col w-full text-[1.5rem] justify-center space-y-6 font-[ABC Marfa]">
              <h1 className="font-medium">{product.name}</h1>
              <p className="mt-2">
                for {product.customData?.recipientName || "recipient"}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4 w-full">
          {product.customData && Object.keys(product.customData).length > 0 && (
            <div className="md:space-y-3 space-y-4 w-full">
              <div className="flex items-center gap-16">
                <label className="text-muted-foreground font-[ABC Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Recipients name
                </label>
                <p className="text-stone-600 font-[ABC Marfa]">{product.customData.recipientName}</p>
              </div>

              <div className="flex items-center gap-16">
                <label className="text-muted-foreground font-[ABC Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Recipients address
                </label>
                <p className="text-stone-600 font-[ABC Marfa]">
                  {product.customData.recipientAddress}
                </p>
              </div>

              <div className="flex items-center gap-16">
                <label className="text-muted-foreground font-[ABC Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Delivery Date
                </label>
                <p className="text-stone-600 font-[ABC Marfa]">
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
                            {dayName},{" "}
                            {day}
                            <sup className="text-xs">{ordinalSuffix}</sup>{" "}
                            {month} {year}
                          </>
                        );
                      })()
                    : "Not selected"}
                </p>
              </div>

              <div className="flex items-center gap-16">
                <span className="text-muted-foreground font-[ABC Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  {/* SMS Updates */}
                   Delivery Updates
                </span>
                <span className="text-stone-600 font-[ABC Marfa]">
                  {product.customData.smsUpdates === "send-to-me"
                    ? `Just you`
                    : product.customData.smsUpdates === "send-to-recipient"
                    ? `Just the recipient`
                    : "none"}
                </span>
              </div>
              <div className="flex items-center gap-16">
                <label className="text-muted-foreground font-[ABC Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Custom Letterhead
                </label>
                <p className="text-stone-600 font-[ABC Marfa]">{product.customData.headerText}</p>
              </div>
              <div className="flex items-center gap-16">
                <label className="text-muted-foreground font-[ABC Marfa] font-medium text-sm tracking-wider min-w-[140px]">
                  Personal Message
                </label>
                <p className="text-stone-600 max-w-[500px] font-[ABC Marfa]">
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

