"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCheckoutStore } from "@/store/checkout";
import RecipientDetailsStep from "./RecipientDetailsStep";
import PersonalizationStep from "./PersonalizationStep";
import DeliveryDetailsStep from "./DeliveryDetailsStep";
import SummaryStep from "./SummaryStep";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Finish" },
];

const stepTitles = {
  1: "Recipient Details",
  2: "Personalize Your Gift",
  3: "Delivery Details",
  4: "Summary",
};

export default function CheckoutForm() {
  const { currentStep, nextStep, prevStep, resetCheckout } = useCheckoutStore();
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length) {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleBackToStore = () => {
    resetCheckout();
    // Navigate back to store - you can implement this based on your routing
    window.history.back();
  };

  const handleCheckout = () => {
    // Handle final checkout logic here
    console.log("Proceeding to checkout...");
    router.push("/checkout/payment");
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RecipientDetailsStep />;
      case 2:
        return <PersonalizationStep />;
      case 3:
        return <DeliveryDetailsStep />;
      case 4:
        return <SummaryStep />;
      default:
        return <RecipientDetailsStep />;
    }
  };

  const getButtonText = () => {
    if (currentStep === 4) {
      return "CHECKOUT";
    }
    return "NEXT";
  };

  return (
    <section className="flex flex-col justify-between h-full font-heading">
      <div>
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl mb-4 font-bold">
              {stepTitles[currentStep as keyof typeof stepTitles]}
            </h1>
            <button
              onClick={handleBackToStore}
              className="text-xs font-medium tracking-wider mb-4 hover:text-stone-600 transition-colors"
            >
              BACK TO STORE
            </button>
          </div>
          <div className="grid grid-cols-4 justify-around uppercase text-black">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`text-xs font-semibold tracking-wider ${
                  currentStep === s.id ? "text-stone-700" : "text-stone-500"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
          <div className="mt-2 w-full bg-stone-500">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="mt-2 w-full h-1 bg-[#FAD15D]"
            ></motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, filter: "blur(20px)", x: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            exit={{ opacity: 0, filter: "blur(20px)", x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 justify-end mt-8">
        {currentStep === 4 ? (
          <>
            <button
              onClick={handleBack}
              className="bg-[#3B3215] px-5 hover:bg-[#3B3215]/80 font-medium text-stone-400 tracking-wider text-sm py-2.5 rounded-none transition-colors"
            >
              BACK
            </button>
            <button
              onClick={handleNext}
              className="bg-[#FDCF5F] px-5 hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider text-sm py-2.5 rounded-none transition-colors"
            >
              ADD TO CART
            </button>
            <button
                onClick={handleCheckout}
              className="bg-[#FDCF5F] px-5 hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider text-sm py-2.5 rounded-none transition-colors"
            >
              CHECKOUT
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="bg-[#3B3215] px-5 hover:bg-[#3B3215]/80 font-medium text-stone-400 tracking-wider text-sm py-2.5 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              BACK
            </button>
            <button
              onClick={handleNext}
              className="bg-[#FDCF5F] px-5 hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider text-sm py-2.5 rounded-none transition-colors"
            >
              {getButtonText()}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
