"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePersonaliseStore } from "@/store/personaliseStore";
import { useMainStore } from "@/store/mainStore";
import RecipientDetailsStep from "./RecipientDetailsStep";
import PersonalizationStep from "./PersonalisationStep";
import DeliveryDetailsStep from "./DeliveryDetailsStep";
import SummaryStep from "./SummaryStep";
import { useRouter } from "next/navigation";
import { PersonalisedAddToCartButton } from "./PersonalisedAddToCartButton";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Finish" },
];

const stepTitles = {
  1: "Recipient Details",
  2: "Personalise Your Gift",
  3: "Delivery Details",
  4: "Summary",
};

export default function PersonaliseForm({
  onCloseSheet,
  isEditMode = false,
  onSave,
}: {
  onCloseSheet?: () => void;
  isEditMode?: boolean;
  onSave?: (data: any) => void;
}) {
  const {
    currentStep,
    nextStep,
    prevStep,
    resetCheckout,
    formData,
    selectedProduct,
    isStepValid,
  } = usePersonaliseStore();
  const { addToCart } = useMainStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
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
      setIsLoading(true);
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
        isPersonalised: true,
      };

      await addToCart(selectedProduct.id!, 1, personalizationData);
      setIsLoading(false);
      setIsAdded(true);
      
      // Reset states after a delay
      setTimeout(() => {
        setIsAdded(false);
        resetCheckout();
        if (onCloseSheet) {
          onCloseSheet();
        }
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setIsAdded(false);
      toast.error("Failed to add to cart", {
        description: "Please try again.",
      });
      console.error("Failed to add personalised item to cart:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    try {
      setIsLoading(true);
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
        isPersonalised: true,
      };

      if (onSave) {
        onSave(personalizationData);
      }
      
      setIsLoading(false);
      setIsAdded(true);
      
      // Close sheet after a delay
      setTimeout(() => {
        setIsAdded(false);
        resetCheckout();
        if (onCloseSheet) {
          onCloseSheet();
        }
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setIsAdded(false);
      toast.error("Failed to save changes", {
        description: "Please try again.",
      });
      console.error("Failed to save personalised item changes:", error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    if (!isStepValid(4)) {
      toast.error("Please complete all required fields before checkout.");
      return;
    }

    try {
      setIsLoading(true);
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
        isPersonalised: true,
      };

      await addToCart(selectedProduct.id!, 1, personalizationData);
      setIsLoading(false);
      setIsAdded(true);
      resetCheckout();
      
      toast.success("Proceeding to checkout...");
      router.push("/checkout");
    } catch (error) {
      setIsLoading(false);
      setIsAdded(false);
      toast.error("Failed to add to cart", {
        description: "Please try again.",
      });
      console.error("Failed to add personalised item to cart:", error);
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  React.useEffect(() => {
    const handleGlobalClose = () => {
      if (onCloseSheet) onCloseSheet();
    };
    window.addEventListener("globalClose", handleGlobalClose);
    return () => {
      window.removeEventListener("globalClose", handleGlobalClose);
    };
  }, [onCloseSheet]);

  
  const isStepAccessible = (stepId: number) => {
    // Check if all steps 
    for (let i = 1; i < stepId; i++) {
      if (!isStepValid(i)) {
        return false;
      }
    }
    return true;
  };

  const handleStepClick = (stepId: number) => {
    // backward nav
    if (stepId < currentStep) {
      for (let i = currentStep; i > stepId; i--) {
        prevStep();
      }
      return;
    }

    //do nothing
    if (stepId === currentStep) {
      return;
    }

  
    if (stepId > currentStep) {
      if (!isStepAccessible(stepId)) {
        
        switch (stepId) {
          case 2:
            toast.error("Please complete recipient details first.");
            break;
          case 3:
            toast.error("Please complete recipient details and personalization first.");
            break;
          case 4:
            toast.error("Please complete all previous steps first.");
            break;
        }
        return;
      }

      for (let i = currentStep; i < stepId; i++) {
        nextStep();
      }
    }
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
              onClick={() => handleStepClick(s.id)}
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
                disabled={isLoading}
                className="bg-[#3B3215] hover:bg-[#3B3215]/80 text-stone-400 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BACK
              </button>
              {isEditMode ? (
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "SAVING..." : isAdded ? "SAVED!" : "SAVE"}
                </button>
              ) : (
                <>
                  <PersonalisedAddToCartButton
                    handleAddToCart={handleAddToCart}
                    isLoading={isLoading}
                    isAdded={isAdded}
                  />
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 tracking-wider text-[0.75rem] font-[400] px-[1.875rem] w-[11.56rem] md:text-sm md:py-[1.135rem] transition-colors cursor-pointer rounded-[0.25rem] leading-[119.58%] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "PROCESSING..." : "CHECKOUT"}
                  </button>
                </>
              )}
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