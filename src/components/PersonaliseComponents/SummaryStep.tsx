"use client";

import React, { useRef } from "react";
import { usePersonaliseStore } from "@/store/personaliseStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SummaryStep() {
  const { formData, selectedProduct } = usePersonaliseStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -288, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 288, behavior: "smooth" });
    }
  };
  return (
    <div>
      <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Please review or amend your gift details below.
      </p>

      <div className="md:space-y-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-b-stone-400 pb-1">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Your Name
          </label>
          <p className="text-secondary-foreground">
            {formData.yourName || "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-400">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Recipients Name
          </label>
          <p className="text-secondary-foreground">
            {formData.recipientName || "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-400">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Recipients Address
          </label>
          <p className="text-secondary-foreground">
            {formData.recipientAddress && formData.recipientCity
              ? `${formData.recipientAddress}, ${formData.recipientCity}`
              : "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-400">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Delivery Date
          </label>
          <p className="text-secondary-foreground">
            {formData.deliveryDate || "Not selected"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-400">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Delivery Time
          </label>
          <p className="text-secondary-foreground">
            {formData.preferredDeliveryTime || "Not selected"}
          </p>
        </div>

        <div className="flex md:items-center items-start md:flex-row flex-col gap-2 border-b border-b-stone-400 justify-between border-mutedftext-muted pb-1">
          <p className="text-stone-700 text-[0.93rem]">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex md:gap-6 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <input
                  readOnly
                  type="radio"
                  name="sms-updates-summary"
                  value="none"
                  checked={formData.smsUpdates === "none"}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.smsUpdates === "none"
                      ? "bg-[#40362c] border-[#40362c]"
                      : "border-stone-400"
                  }`}
                >
                  {formData.smsUpdates === "none" && (
                    <div className="w-full h-full rounded-full bg-[#40362c]"></div>
                  )}
                </div>
              </div>
              <span className="text-[0.93rem] text-stone-700">None</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <input
                  readOnly
                  type="radio"
                  name="sms-updates-summary"
                  value="send-to-me"
                  checked={formData.smsUpdates === "send-to-me"}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.smsUpdates === "send-to-me"
                      ? "bg-[#40362c] border-[#40362c]"
                      : "border-stone-400"
                  }`}
                >
                  {formData.smsUpdates === "send-to-me" && (
                    <div className="w-full h-full rounded-full bg-[#40362c]"></div>
                  )}
                </div>
              </div>
              <span className="text-[0.93rem] text-stone-700">Send to me</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <input
                  readOnly
                  type="radio"
                  name="sms-updates-summary"
                  value="send-to-recipient"
                  checked={formData.smsUpdates === "send-to-recipient"}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.smsUpdates === "send-to-recipient"
                      ? "bg-[#40362c] border-[#40362c]"
                      : "border-stone-400"
                  }`}
                >
                  {formData.smsUpdates === "send-to-recipient" && (
                    <div className="w-full h-full rounded-full bg-[#40362c]"></div>
                  )}
                </div>
              </div>
              <span className="text-[0.93rem] text-stone-700">
                Send to recipient
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative ">
            {/* <button
              onClick={scrollLeft}
              className="absolute left-2 cursor-pointer top-1/2 -translate-y-1/2 z-10"
              aria-label="Scroll left"
            >
              <img src="/arrow.svg" className="rotate-180" alt="" />
            </button> */}

            <button
              onClick={scrollRight}
              className="absolute right-2 scale-130 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
              aria-label="Scroll right"
            >
              <img src="/arrow.svg" alt="" />
            </button>

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-hidden hide-scrollbar"
            >
              <div className="flex gap-2 pb-4">
                <div className="bg-stone-300 h-[34vh] md:w-[50%] w-full rounded-none flex items-center justify-center flex-shrink-0">
                  <img
                    src={selectedProduct?.image || selectedProduct?.image_1}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="md:w-[70%] w-full flex-shrink-0">
                  <div
                    className="relative w-full h-[34vh] rounded-none overflow-hidden"
                    style={{
                      backgroundImage: "url(/notecard.jpg)",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="max-w-xs w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2">
                      <div className="text-center mb-10 absolute md:top-3 top-2 left-1/2 transform -translate-x-1/2 w-full z-30">
                        <span className="text-center md:text-[0.70rem] text-[10px]">{formData.headerText || "No header text"}</span>
                      </div>

                      <div className="text-center md:w-72 w-56 mx-auto absolute inset-0 flex items-center justify-center md:p-12">
                        <span className="font-[monospace] text-secondary-foreground md:text-[0.45rem] text-[8px]">
                          {formData.customMessage || "No custom message"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[34vh] md:w-[50%] w-full rounded-none flex items-center justify-center flex-shrink-0">
                  <img
                    src="/Bag.png"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
