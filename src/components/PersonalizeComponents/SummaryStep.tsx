"use client";

import React from "react";
import { usePersonalizeStore } from "@/store/personalizeStore";

export default function SummaryStep() {
  const { formData, selectedProduct } = usePersonalizeStore();
  return (
    <div>
      <p className="text-stone-700 mb-6 font-medium md:text-[16px]">
        Please review or amend your gift details below.
      </p>

      <div className="md:space-y-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-b-stone-600">
          <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
            Your Name
          </h3>
          <p className="text-stone-600">
            {formData.yourName || "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-600">
          <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
            Recipients Name
          </h3>
          <p className="text-stone-600">
            {formData.recipientName || "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-600">
          <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
            Recipients Address
          </h3>
          <p className="text-stone-600">
            {formData.recipientAddress && formData.recipientCity
              ? `${formData.recipientAddress}, ${formData.recipientCity}`
              : "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-600">
          <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
            Delivery Date
          </h3>
          <p className="text-stone-600">
            {formData.deliveryDate || "Not selected"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-600">
          <h3 className="text-muted-foreground font-[Marfa] font-medium text-sm tracking-wider">
            Delivery Time
          </h3>
          <p className="text-stone-600">
            {formData.preferredDeliveryTime || "Not selected"}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-b-stone-600 justify-between border-mutedftext-muted-foreground font-[Marfa]">
          <p className="text-stone-700 text-sm">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sms-updates-summary"
                value="none"
                checked={formData.smsUpdates === "none"}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
              <span className="text-sm text-stone-700">None</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sms-updates-summary"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
              <span className="text-sm text-stone-700">Send to me</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sms-updates-summary"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
              <span className="text-sm text-stone-700">Send to recipient</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-8">
          <div className="bg-stone-300 h-64 rounded-none flex items-center justify-center">
            <img
              src={selectedProduct?.image || selectedProduct?.image_1}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="">
            <div
              className="relative h-64 rounded-none overflow-hidden"
              style={{
                backgroundImage: "url(/notecard.jpg)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="p-4 max-w-xs w-full">
                  <div className="text-center mb-1">
                    <div className="text-xs font-medium tracking-wider text-stone-600 mb-2">
                      {formData.headerText}
                    </div>
                    <div className="h-px bg-stone-300 w-16 mx-auto"></div>
                  </div>

                  <div className="text-center flex items-center justify-center">
                    <div className="text-[8px] w-42 text-stone-500 font-[monospace]">
                      {formData.customMessage ||
                        formData.selectedQuote ||
                        "Message"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
