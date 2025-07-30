"use client";

import React from "react";
import { usePersonalizeStore } from "@/store/personalizeStore";
import Image from "next/image";

export default function SummaryStep() {
  const { formData, selectedProduct, updateFormData } = usePersonalizeStore();

  const handleSMSChange = (value: 'send-to-me' | 'send-to-recipient') => {
    updateFormData({ smsUpdates: value });
  };

  return (
    <div>
      <p className="text-stone-700 mb-6 font-semibold text-xl">
        Please review or amend your gift details below.
      </p>

      {selectedProduct && (
        <div className="mb-6 p-4 bg-stone-50 rounded-lg">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider mb-2">
            SELECTED PRODUCT
          </h3>
          <div className="flex items-center gap-4">
            {selectedProduct.image_1 && (
              <div className="relative w-16 h-16">
                <Image
                  src={selectedProduct.image_1}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-stone-800">{selectedProduct.name}</p>
              <p className="text-stone-600">£{selectedProduct.price?.toLocaleString()}.00</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Your Name
          </h3>
          <p className="text-stone-600">{formData.yourName || "Not provided"}</p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Recipients Name
          </h3>
          <p className="text-stone-600">{formData.recipientName || "Not provided"}</p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Recipients Address
          </h3>
          <p className="text-stone-600">
            {formData.recipientAddress && formData.recipientCity 
              ? `${formData.recipientAddress}, ${formData.recipientCity}`
              : "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Delivery Date
          </h3>
          <p className="text-stone-600">{formData.deliveryDate || "Not selected"}</p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Delivery Time
          </h3>
          <p className="text-stone-600">{formData.preferredDeliveryTime || "Not selected"}</p>
        </div>

        {formData.customMessage && (
          <div className="flex items-start gap-2">
            <h3 className="text-stone-700 font-medium text-sm tracking-wider">
              Custom Message
            </h3>
            <p className="text-stone-600">"{formData.customMessage}"</p>
          </div>
        )}

        {formData.selectedQuote && (
          <div className="flex items-start gap-2">
            <h3 className="text-stone-700 font-medium text-sm tracking-wider">
              Selected Quote
            </h3>
            <p className="text-stone-600">{formData.selectedQuote}</p>
          </div>
        )}

        <div className="flex items-center gap-2 justify-between border-b border-stone-700">
          <p className="text-stone-700 text-sm">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sms-updates-summary"
                value="send-to-me"
                checked={formData.smsUpdates === 'send-to-me'}
                onChange={() => handleSMSChange('send-to-me')}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
              <span className="text-sm text-stone-700">Send to me</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sms-updates-summary"
                value="send-to-recipient"
                checked={formData.smsUpdates === 'send-to-recipient'}
                onChange={() => handleSMSChange('send-to-recipient')}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
              />
              <span className="text-sm text-stone-700">Send to recipient</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-[#3B3215] h-32 rounded-none flex items-center justify-center">
            <div className="bg-stone-50 p-4 shadow-lg max-w-24 w-full h-20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-medium tracking-wider text-stone-600 mb-1">
                  G L L D
                </div>
                <div className="text-xs text-stone-500 italic">
                  Message preview
                </div>
              </div>
            </div>
          </div>
          <div className="bg-stone-300 h-32 rounded-none flex items-center justify-center">
            <div className="w-16 h-24 bg-green-800 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
