"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { usePersonalizeStore } from "@/store/personalizeStore";

export default function RecipientDetailsStep() {
  const { formData, updateFormData } = usePersonalizeStore();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div>
      <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Please enter your recipient's contact details
      </p>

      <form className="space-y-4 font-[Marfa]">
        <div>
          <Input
            id="your-name"
            type="text"
            value={formData.yourName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("yourName", e.target.value)
            }
            placeholder="Your Name*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
          />
        </div>

        <div>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientName", e.target.value)
            }
            placeholder="Recipients name*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
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
            placeholder="Recipient address*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
          />
        </div>

        <div>
          <Input
            id="city"
            type="text"
            value={formData.recipientCity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientCity", e.target.value)
            }
            placeholder="Recipient phone number (only used for delivery issues)*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
          />
        </div>

        <div>
          <Input
            id="email"
            type="email"
            value={formData.recipientEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientEmail", e.target.value)
            }
            placeholder="Recipient e-mail(only used for delivery issues)*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
          />
        </div>
      </form>
    </div>
  );
}
