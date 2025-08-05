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
import { User, Lock } from "lucide-react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function LoginRequiredModal({ 
  isOpen, 
  onClose, 
  feature = "personalize products" 
}: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    // Include current path as redirect parameter
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleSignUp = () => {
    onClose();
    router.push("/auth/sign-up");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl font-century rounded-sm">
        <DialogHeader className="text-center">
          <DialogTitle className="text-[2rem] font-[400] text-secondary-foreground">
            Login Required
          </DialogTitle>
          <DialogDescription className="text-stone-600 mt-2 text-[1rem]">
            You need to be logged in to {feature}. Please login or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleLogin}
            variant="box_yellow"
            className="w-full uppercase tracking-wider text-[0.75rem] leading-[119.58%] h-[2.5rem]"
          >
            Login
          </Button>
          
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full uppercase tracking-wider text-[0.75rem]"
          >
            Create Account
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="text-sm text-stone-500 hover:text-stone-700 underline-offset-4 hover:underline"
          >
            Continue browsing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
