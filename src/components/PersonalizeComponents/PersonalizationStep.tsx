"use client";

import React from "react";
import { usePersonalizeStore } from "@/store/personalizeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PersonalizationStep() {
  const { formData, updateFormData } = usePersonalizeStore();

  const quotes = [
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Life is what happens to you while you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "The only impossible journey is the one you never begin. - Tony Robbins",
    "In the end, we will remember not the words of our enemies, but the silence of our friends. - Martin Luther King Jr.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Write my own",
  ];

  const isCustomMessage = formData.selectedQuote === "Write my own";

  return (
    <div>
      <p className="text-stone-700 text-sm leading-relaxed">
        Our gifts are sent with custom stationery, letter-pressed by hand at the
        Luxe Bureau atelier. In the header field, please enter your own name,
        initials, or company to create your custom letterhead. You may choose
        between two type styles below.
      </p>

      <p className="text-stone-700 mb-8 text-sm leading-relaxed">
        Your personal message will be typeset and printed in the Luxe Bureau's
        signature typewriter font. Please type your message directly onto the
        notecard. For added inspiration, select a quote from the drop down menu
        to add this to your message.
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
            onValueChange={(value) => {
              updateFormData({
                selectedQuote: value,
                customMessage: value === "Write my own" ? "" : "",
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {quotes.map((quote, index) => (
                <SelectItem key={index} value={quote}>
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
            backgroundImage: "url(/notecard.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="p-6 max-w-xs w-full">
              <div className="text-center mb-4">
                <div className="text-xs font-medium tracking-wider text-stone-600 mb-2">
                  {formData.headerStyle
                    ? formData.headerStyle.toUpperCase()
                    : "HEADER"}
                </div>
                <div className="h-px bg-stone-300 w-16 mx-auto"></div>
              </div>

              <div className="text-center">
                {isCustomMessage ? (
                  <textarea
                    value={formData.customMessage}
                    onChange={(e) =>
                      updateFormData({ customMessage: e.target.value })
                    }
                    placeholder="Write your message here..."
                    className="w-full text-xs text-stone-700 bg-transparent text-center italic resize-none outline-none"
                    rows={3}
                  />
                ) : (
                  <div className="text-xs text-stone-500 italic">
                    {formData.customMessage ||
                      formData.selectedQuote ||
                      "Message"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
