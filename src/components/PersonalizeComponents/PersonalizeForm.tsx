"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePersonalizeStore } from "@/store/personalizeStore";
import { useMainStore } from "@/store/mainStore";
import RecipientDetailsStep from "./RecipientDetailsStep";
import PersonalizationStep from "./PersonalizationStep";
import DeliveryDetailsStep from "./DeliveryDetailsStep";
import SummaryStep from "./SummaryStep";
import { useRouter } from "next/navigation";
import { PersonalizedAddToCartButton } from "./PersonalizedAddToCartButton";
import { toast } from "sonner";

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

export default function PersonalizeForm({ onCloseSheet }: { onCloseSheet?: () => void }) {
  const {
    currentStep,
    nextStep,
    prevStep,
    resetCheckout,
    formData,
    selectedProduct,
    isStepValid,
  } = usePersonalizeStore();
  const { addToCart } = useMainStore();
  const router = useRouter();

  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      switch (currentStep) {
        case 1:
          toast.error(
            "Please fill in all required recipient details to continue."
          );
          break;
        case 2:
          toast.error(
            "Please complete the personalization (header text, font, and message) to continue."
          );
          break;
        case 3:
          toast.error("Please select delivery date and time to continue.");
          break;
        default:
          toast.error("Please complete all required fields to continue.");
      }
      return;
    }
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
    if (onCloseSheet) {
      onCloseSheet();
    } else {
      window.history.back();
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      const personalizationData = {
        yourName: formData.yourName,
        recipientName: formData.recipientName,
        recipientAddress: formData.recipientAddress,
        recipientCity: formData.recipientCity,
        recipientEmail: formData.recipientEmail,
        deliveryDate: formData.deliveryDate,
        preferredDeliveryTime: formData.preferredDeliveryTime,
        headerText: formData.headerText,
        selectedQuote: formData.selectedQuote,
        customMessage: formData.customMessage,
        smsUpdates: formData.smsUpdates,
        isPersonalized: true,
      };

      await addToCart(selectedProduct.id!, 1, personalizationData);
      resetCheckout();
      router.push("/cart");
    } catch (error) {
      console.error("Failed to add personalized item to cart:", error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    if (!isStepValid(4)) {
      toast.error("Please complete all required fields before checkout.");
      return;
    }

    try {
      const personalizationData = {
        yourName: formData.yourName,
        recipientName: formData.recipientName,
        recipientAddress: formData.recipientAddress,
        recipientCity: formData.recipientCity,
        recipientEmail: formData.recipientEmail,
        deliveryDate: formData.deliveryDate,
        preferredDeliveryTime: formData.preferredDeliveryTime,
        headerText: formData.headerText,
        selectedQuote: formData.selectedQuote,
        customMessage: formData.customMessage,
        smsUpdates: formData.smsUpdates,
        isPersonalized: true,
      };

      await addToCart(selectedProduct.id!, 1, personalizationData);
      resetCheckout();
      router.push("/checkout");
    } catch (error) {
      console.error("Failed to add personalized item to cart:", error);
    }
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
    <section className="flex flex-col min-h-[calc(100vh-2rem)] md:pt-20 pt-15">
      <div className="mb-6 md:mb-10">
        <div className="mb-4 flex md:items-center items-start justify-between md:flex-row flex-col">
          <h1 className="md:text-[2rem] text-secondary-foreground font-century text-[1.5rem] md:mb-4 font-medium">
            {stepTitles[currentStep as keyof typeof stepTitles]}
          </h1>
          <button
            onClick={handleBackToStore}
            className="text-xs font-medium cursor-pointer small-text tracking-wider mb-4 hover:text-stone-600 transition-colors"
          >
            BACK TO STORE
          </button>
        </div>
        <div className="grid grid-cols-4 justify-around uppercase text-stone-600 font-century">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`text-[0.93rem] tracking-wider small-text cursor-pointer ${
                currentStep === s.id
                  ? "text-secondary-foreground"
                  : "text-stone-500"
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

      <div className="flex-1 overflow-y-auto pb-6 hide-scrollbar">
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

      <div className="flex-shrink-0 bg-background pt-4 pb-4 font-century">
        <div className="flex md:gap-3 gap-1 justify-end">
          {currentStep === 4 ? (
            <>
              <button
                onClick={handleBack}
                className="bg-[#3B3215] hover:bg-[#3B3215]/80 text-stone-400 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%]"
              >
                BACK
              </button>
              <PersonalizedAddToCartButton />
              <button
                onClick={handleCheckout}
                className="bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%]"
              >
                CHECKOUT
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="bg-[#3B3215] hover:bg-[#3B3215]/80 text-stone-400 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%]"
              >
                BACK
              </button>
              <button
                onClick={handleNext}
                className="bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 ftracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%]"
              >
                {getButtonText()}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
