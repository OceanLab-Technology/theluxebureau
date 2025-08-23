"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { usePersonaliseStore } from "@/store/personaliseStore";

export default function RecipientDetailsStep() {
  const { formData, updateFormData } = usePersonaliseStore();
  const [touched, setTouched] = useState({ phone: false, email: false });

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
    if (field === "recipientPhone") setTouched((t) => ({ ...t, phone: true }));
    if (field === "recipientEmail") setTouched((t) => ({ ...t, email: true }));
  };

  const handleSmsUpdatesChange = (value: 'send-to-me' | 'send-to-recipient') => {
    updateFormData({ smsUpdates: value });
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) =>
    /^\+?\d{5,15}$/.test(phone.replace(/\s/g, ""));

  return (
    <div>
      <p className="text-secondary-foreground mb-12 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1.3rem] font-century">
        Please enter the recipient's contact details
      </p>

      <form className="space-y-4 font-[Marfa] transition-all duration-300">
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-[320px_1fr] gap-6 items-center">
          <label htmlFor="your-name" className="text-stone-700 text-[0.9375rem] font-[300]">
            Your name*
          </label>
          <div className="flex flex-col">
            <Input
              id="your-name"
              type="text"
              value={formData.yourName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("yourName", e.target.value)
              }
              className="border-0 border-b border-stone-500 px-0 py-2 text-stone-800 placeholder:text-stone-500 outline-none rounded-none w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
          </div>

          <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300]">
            Recipient's Name*
          </label>
          <div className="flex flex-col">
            <Input
              id="recipient-name"
              type="text"
              value={formData.recipientName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("recipientName", e.target.value)
              }
              className="border-0 border-b border-stone-500 px-0 py-2 rounded-none w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
          </div>

          <label
            htmlFor="phone"
            className="text-stone-700 text-[0.9375rem] font-[300]"
          >
            Recipient&apos;s phone number*
          </label>

          <div className="relative border-b border-stone-500">
            <Input
              id="phone"
              type="tel"
              value={formData.recipientPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("recipientPhone", e.target.value)
              }
              className="border-0 bg-transparent px-0 py-2 text-stone-800 placeholder:text-stone-500 outline-none rounded-none w-full focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />

            {touched.phone && !isValidPhone(formData.recipientPhone) && (
              <span
                className="absolute left-0 bottom-0 translate-y-full text-[#50462D] text-xs font-normal"
                aria-live="polite"
              >
                Enter a valid phone number
              </span>
            )}
          </div>

          <label
            htmlFor="email"
            className="text-stone-700 text-[0.9375rem] font-[300]"
          >
            Recipient&apos;s e-mail
          </label>

          <div className="relative border-b border-stone-500">
            <Input
              id="email"
              type="email"
              value={formData.recipientEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("recipientEmail", e.target.value)
              }
              className="border-0 bg-transparent px-0 py-2 text-stone-800 placeholder:text-stone-500 outline-none rounded-none w-full focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />

            {touched.email && !isValidEmail(formData.recipientEmail) && (
              <span
                className="absolute left-0 bottom-0 translate-y-full text-[#50462D] text-xs font-normal"
                aria-live="polite"
              >
                Enter a valid email address
              </span>
            )}
          </div>


          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Would you like shipping updates via SMS?
          </label>
          <div className="flex gap-16 justify-end mr-4 w-[95%]">
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-me"
                  ? "text-[#50462D]"
                  : "text-[#50462d]/50"
                  }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Send to me
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                onChange={(e) => handleSmsUpdatesChange(e.target.value as 'send-to-me')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-me"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-recipient"
                  ? "text-[#50462D]"
                  : "text-[#50462d]/50"
                  }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Send to recipient
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                onChange={(e) => handleSmsUpdatesChange(e.target.value as 'send-to-recipient')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-recipient"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
          </div>
        </div>

        {/* Mobile Stack Layout */}
        <div className="md:hidden space-y-6 transition-all duration-300">
          <div className="flex flex-col space-y-2">
            <label htmlFor="your-name-mobile" className="text-stone-700 text-[0.9375rem] font-[300]">
              Your name*
            </label>
            <Input
              id="your-name-mobile"
              type="text"
              value={formData.yourName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("yourName", e.target.value)
              }
              className="border-0 border-b border-stone-500 px-0 py-2 text-stone-800 placeholder:text-stone-500 outline-none rounded-none w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="recipient-name-mobile" className="text-stone-700 text-[0.9375rem] font-[300]">
              Recipient's Name*
            </label>
            <Input
              id="recipient-name-mobile"
              type="text"
              value={formData.recipientName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("recipientName", e.target.value)
              }
              className="border-0 border-b border-stone-500 px-0 py-2 rounded-none w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
          </div>


          <div className="flex flex-col space-y-1">
            <label htmlFor="phone-mobile" className="text-stone-700 text-[0.9375rem] font-[300]">
              Recipient's phone number*
            </label>
            <Input
              id="phone-mobile"
              type="tel"
              value={formData.recipientPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("recipientPhone", e.target.value)
              }
              className="border-0 border-b border-stone-500 bg-transparent px-0 py-2 text-stone-800 placeholder:text-stone-500 outline-none rounded-none w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
            {touched.phone && !isValidPhone(formData.recipientPhone) && (
              <span className="text-[#50462D]  font-semibold text-xs">Enter a valid phone number</span>
            )}
          </div>


          <div className="flex flex-col space-y-1">
            <label htmlFor="email-mobile" className="text-stone-700 text-[0.9375rem] font-[300]">
              Recipient's e-mail*
            </label>
            <Input
              id="email-mobile"
              type="email"
              value={formData.recipientEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("recipientEmail", e.target.value)
              }
              className="border-0 border-b border-stone-500 bg-transparent px-0 py-2 text-stone-800 placeholder:text-stone-500 outline-none rounded-none w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
            />
            {touched.email && !isValidEmail(formData.recipientEmail) && (
              <span className="text-[#50462D]  font-semibold text-xs">Enter a valid email address</span>
            )}
          </div>


          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Would you like shipping updates via SMS?
          </label>
          <div className="flex gap-8 mt-1 justify-start w-full">
            <label className="flex items-center gap-3 cursor-pointer">
              <span className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-me"
                ? "text-[#50462D]"
                : "text-[#50462d]/50"
                }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Send to me
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                onChange={(e) => handleSmsUpdatesChange(e.target.value as 'send-to-me')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-me"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-recipient"
                ? "text-[#50462D]"
                : "text-[#50462d]/50"
                }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Send to recipient
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                onChange={(e) => handleSmsUpdatesChange(e.target.value as 'send-to-recipient')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-recipient"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}