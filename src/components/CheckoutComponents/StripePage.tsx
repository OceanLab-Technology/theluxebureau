"use client";
import { useCheckoutStore } from "@/store/checkout";
import Image from "next/image";
import React, { useState } from "react";

const countries = [
  "United Kingdom",
  "United States",
  "France",
  "Germany",
  "Italy",
  "Spain",
];

export function StripePaymentPage() {
  const { formData } = useCheckoutStore();
  const [form, setForm] = useState({
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
    country: "United Kingdom",
    postCode: "",
    phone: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  const required = [
    "email",
    "cardNumber",
    "expiry",
    "cvc",
    "cardName",
    "country",
    "postCode",
  ];
  const isValid = required.every((k) => form[k as keyof typeof form]?.trim());

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    alert("Payment submitted!");
  }

  return (
    <div className="min-h-screen font-sans bg-background flex flex-col items-center py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-semibold font-heading mb-6">Check-out</h2>
          <div className="mb-6">
            <div className="text-xs mb-2">ITEM 01</div>
            <div className="flex gap-4 items-start">
             <div>
                <Image
                  src="/product.jpg"
                  alt="Product Image"
                  width={218}
                  height={287}
                  className="w-40 object-cover"
                />
             </div>
              <div>
                <div className="font-medium">
                  Dom Pérignon
                  <br />
                  Plénitude 2 2004
                </div>
                <div className="mt-2 text-sm">for Luke Fenech</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-stone-500 space-y-2">
            <div>
              Your name{" "}
              <span className="font-medium text-stone-800">
                {formData.recipientName}
              </span>
            </div>
            <div>
              Recipients name{" "}
              <span className="font-medium text-stone-800">
                {formData.recipientName}
              </span>
            </div>
            <div>
              Recipients address{" "}
              <span className="font-medium text-stone-800">
                {formData.recipientAddress}
              </span>
            </div>
            <div>
              Delivery Date{" "}
              <span className="font-medium text-stone-800">
                {formData.deliveryDate}
              </span>
            </div>
            <div>
              SMS Updates{" "}
              <span className="font-medium text-stone-800">
                {formData.smsUpdates === "send-to-me"
                  ? "Send to me"
                  : "Send to recipient"}
              </span>
            </div>
            <div>
              Custom Letterhead{" "}
              <span className="font-medium text-stone-800">G.L.L.D</span>
            </div>
            <div>
              Personal Message{" "}
              <span className="font-medium text-stone-800">
                The meaning of life is to find your gift. The purpose of life is
                to give it away.
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-base font-semibold mb-2">PAYMENT</h3>
          <div>
            <label className="block text-xs mb-1">Email</label>
            <input
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {submitted && !form.email && (
              <div className="text-xs text-red-500 mt-1">Required</div>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1">Card Information</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-stone-300 rounded px-3 py-2 text-sm"
                type="text"
                name="cardNumber"
                placeholder="1234 1234 1234 1234"
                value={form.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={19}
              />
              <input
                className="w-24 border border-stone-300 rounded px-3 py-2 text-sm"
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={5}
              />
              <input
                className="w-16 border border-stone-300 rounded px-3 py-2 text-sm"
                type="text"
                name="cvc"
                placeholder="CVC"
                value={form.cvc}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={4}
              />
            </div>
            {submitted && (!form.cardNumber || !form.expiry || !form.cvc) && (
              <div className="text-xs text-red-500 mt-1">
                All fields required
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1">Cardholder name</label>
            <input
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
              type="text"
              name="cardName"
              value={form.cardName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {submitted && !form.cardName && (
              <div className="text-xs text-red-500 mt-1">Required</div>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1">Country or Region</label>
            <select
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
              name="country"
              value={form.country}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Post Code</label>
            <input
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
              type="text"
              name="postCode"
              value={form.postCode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {submitted && !form.postCode && (
              <div className="text-xs text-red-500 mt-1">Required</div>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1">Phone (optional)</label>
            <input
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-stone-800 font-semibold py-2 rounded mt-4 disabled:opacity-60"
            disabled={!isValid}
          >
            PAY NOW
          </button>
        </form>
      </div>
    </div>
  );
}
