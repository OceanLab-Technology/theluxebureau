import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/app/api/types";
import { personaliseFormData, usePersonaliseStore } from "@/store/personaliseStore";
import PersonaliseForm from "./PersonaliseForm";

interface EditPersonaliseSheetProps {
  children: React.ReactNode;
  product: Product;
  existingData: personaliseFormData;
  onSave?: (data: personaliseFormData) => void;
}

export function EditPersonaliseSheet({
  children,
  product,
  existingData,
  onSave,
}: EditPersonaliseSheetProps) {
  const [open, setOpen] = useState(false);
  const { loadExistingData } = usePersonaliseStore();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      loadExistingData(existingData, product);
    }
  };

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="md:px-6 px-4 py-8" side={isMobile ? "bottom" : "right"}>
        <PersonaliseForm onCloseSheet={closeSheet} isEditMode={true} onSave={onSave} />
      </SheetContent>
    </Sheet>
  );
}
