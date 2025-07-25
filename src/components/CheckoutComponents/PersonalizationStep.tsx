"use client";

import React from "react";
import { useCheckoutStore } from "@/store/checkout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PersonalizationStep() {
  const { formData, updateFormData } = useCheckoutStore();

  const quotes = [
    "Pablo Picasso",
    "Quote Name 1", 
    "Quote Name 2",
    "Quote Name 3",
    "Quote Name 4",
    "Quote Name 5",
    "Quote Name 6",
    "Quote Name 7",
    "Write my own",
  ];

  return (
    <div>
      <p className="text-stone-700 font-semibold text-sm leading-relaxed">
        Our gifts are sent with custom stationery, letter-pressed by
        hand at the Luxe Bureau atelier. In the header field, please
        enter your own name, initials, or company to create your custom
        letterhead. You may choose between two type styles below.
      </p>

      <p className="text-stone-700 mb-8 font-semibold text-sm leading-relaxed">
        Your personal message will be typeset and printed in the Luxe
        Bureau's signature typewriter font. Please type your message
        directly onto the notecard. For added inspiration, select a
        quote from the drop down menu to add this to your message.
      </p>

      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <label className="text-xs font-medium tracking-wider text-stone-600 mb-2 block">
            Header type style*
          </label>
          <Select 
            value={formData.headerStyle} 
            onValueChange={(value) => updateFormData({ headerStyle: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="style1">Style 1</SelectItem>
              <SelectItem value="style2">Style 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium tracking-wider text-stone-600 mb-2 block">
            Quotes
          </label>
          <Select
            value={formData.selectedQuote}
            onValueChange={(value) => updateFormData({ selectedQuote: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {quotes.map((quote, index) => (
                <SelectItem
                  key={index}
                  value={quote}
                  className={
                    quote === "Quote Name 2" ? "bg-amber-100" : ""
                  }
                >
                  {quote}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <div
          className="relative h-64 rounded-none overflow-hidden"
          style={{
            backgroundColor: "#3B3215",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="bg-stone-50 p-6 shadow-lg max-w-xs w-full">
              <div className="text-center mb-4">
                <div className="text-xs font-medium tracking-wider text-stone-600 mb-2">
                  {formData.headerStyle ? formData.headerStyle.toUpperCase() : "HEADER"}
                </div>
                <div className="h-px bg-stone-300 w-16 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="text-xs text-stone-500 italic">
                  {formData.customMessage || formData.selectedQuote || "Message"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
