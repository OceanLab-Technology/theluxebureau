"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  onCloseCartSheet?: () => void; // optional
}

export function LoginRequiredModal({
  isOpen,
  onClose,
  feature = "personalize products",
  onCloseCartSheet
}: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    onCloseCartSheet?.(); // guard optional
    // Include current path as redirect parameter
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleSignUp = () => {
    onClose();
    onCloseCartSheet?.(); // guard optional
    router.push("/auth/sign-up");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl font-[Century-Old-Style] rounded-none">
        <DialogHeader className="text-center font-[Century-Old-Style]">
          <DialogTitle className="text-[1.8rem] font-[400] text-secondary-foreground font-[Century-Old-Style]">
            LOG IN REQUIRED
          </DialogTitle>
          <DialogDescription className="text-stone-600 mt-2 text-[1rem] font-[Century-Old-Style]">
            Please log in or create an account with us to continue with your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6 font-[Century-Old-Style]">
          <Button
            onClick={handleLogin}
            className="w-full uppercase tracking-[0.08em] text-[0.75rem] font-[font-schoolbook-cond] rounded-[0.25rem] bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 !border-0 !shadow-none focus-visible:ring-0"
          >
            Login
          </Button>

          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full uppercase tracking-[0.08em] text-[0.75rem] font-[font-schoolbook-cond] rounded-[0.25rem]"
          >
            Create Account
          </Button>
        </div>

        <div className="text-center mt-4 font-[SchoolBook]">
          <button
            onClick={() => {
              onClose();
              onCloseCartSheet?.(); // guard optional
            }}
            className="text-sm text-stone-500 hover:text-stone-700 underline-offset-4 hover:underline  font-[Century-Old-Style]"
          >
            Continue browsing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
