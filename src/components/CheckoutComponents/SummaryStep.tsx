"use client";

import React from "react";
import { useCheckoutStore } from "@/store/checkout";

export default function SummaryStep() {
  const { formData, updateFormData } = useCheckoutStore();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleSMSChange = (value: 'send-to-me' | 'send-to-recipient') => {
    updateFormData({ smsUpdates: value });
  };

  return (
    <div>
      <p className="text-stone-700 mb-6 font-semibold text-xl">
        Please review or amend your gift details below.
      </p>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Your Name
          </h3>
          <p className="text-stone-600">{formData.recipientName || "Garrett Duncan"}</p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Recipients Name
          </h3>
          <p className="text-stone-600">{formData.recipientName || "Luke Fenech"}</p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Recipients Address
          </h3>
          <p className="text-stone-600">
            {formData.recipientAddress || "13 Great James Street, London WC1N 3DN"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Delivery Date
          </h3>
          <p className="text-stone-600">{formData.deliveryDate || "01/08/25"}</p>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-stone-700 font-medium text-sm tracking-wider">
            Recipients Address
          </h3>
          <p className="text-stone-600">{formData.preferredDeliveryTime || "8am - 1pm"}</p>
        </div>

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
