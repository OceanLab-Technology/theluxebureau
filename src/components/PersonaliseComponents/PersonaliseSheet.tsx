import React, { useState } from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import PersonaliseForm from "./PersonaliseForm";
import { useAuth } from "@/hooks/use-auth";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";

export function PersonaliseSheet({
  handleOnClick,
}: {
  handleOnClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleButtonClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setOpen(true);
    handleOnClick();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && user) {
      handleOnClick();
    }
  };

  const closeSheet = () => {
    setOpen(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className="inline-flex">
        <Button
          variant="box_yellow"
          size={"lg"}
          className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem]"
          onClick={handleButtonClick}
        >
          Personalise
        </Button>
      </div>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent className="md:px-6 px-4 py-8" side={isMobile ? "bottom" : "right"}>
          <PersonaliseForm onCloseSheet={closeSheet} />
        </SheetContent>
      </Sheet>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        feature="personalise products"
      />
    </>
  );
}
