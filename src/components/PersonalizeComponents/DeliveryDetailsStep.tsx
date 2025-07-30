"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { usePersonalizeStore } from "@/store/personalizeStore";

export default function DeliveryDetailsStep() {
  const { formData, updateFormData } = usePersonalizeStore();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleSMSChange = (value: "send-to-me" | "send-to-recipient") => {
    updateFormData({ smsUpdates: value });
  };

  return (
    <div>
      <p className="text-stone-700 mb-4 font-medium md:text-xl">
        Our gifts are sent by zero-emission, nominated-day delivery. Please add
        your recipient's details, and your preferred delivery day and time,
        below.
      </p>

      <form className="space-y-4">
        <div>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientName", e.target.value)
            }
            placeholder="Recipients name*"
            className="border-0 border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 text-sm focus:ring-0 outline-none rounded-none"
          />
        </div>

        <div>
          <Input
            id="address"
            type="text"
            value={formData.recipientAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientAddress", e.target.value)
            }
            placeholder="Recipients Address*"
            className="border-0 border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 text-sm focus:ring-0 outline-none rounded-none"
          />
        </div>

        <div>
          <Input
            id="delivery-date"
            type="text"
            value={formData.deliveryDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("deliveryDate", e.target.value)
            }
            placeholder="Delivery date"
            className="border-0 border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 text-sm focus:ring-0 outline-none rounded-none"
          />
        </div>

        <div>
          <Input
            id="delivery-time"
            type="text"
            value={formData.preferredDeliveryTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("preferredDeliveryTime", e.target.value)
            }
            placeholder="Preferred delivery time"
            className="border-0 border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 text-sm focus:ring-0 outline-none rounded-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-between border-b border-stone-700">
          <p className="text-stone-700 text-sm mb-3">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-stone-700">Send to me</span>
              <input
                type="radio"
                name="sms-updates"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                onChange={() => handleSMSChange("send-to-me")}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-stone-700">Send to recipient</span>
              <input
                type="radio"
                name="sms-updates"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                onChange={() => handleSMSChange("send-to-recipient")}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
