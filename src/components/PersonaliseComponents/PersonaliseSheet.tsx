import React, { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import PersonaliseForm from "./PersonaliseForm";

export function PersonaliseSheet({
  handleOnClick,
}: {
  handleOnClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      handleOnClick();
    }
  };

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div className="inline-flex">
          <Button
            variant="box_yellow"
            size={"lg"}
            className="text-[0.75rem] leading-[119.58%] w-[20.812rem] h-[2.5rem] tracking-[0.075rem]"
          >
            Personalise
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="md:px-6 px-4 py-8" side={isMobile ? "bottom" : "right"}>
        <PersonaliseForm onCloseSheet={closeSheet} />
      </SheetContent>
    </Sheet>
  );
}
