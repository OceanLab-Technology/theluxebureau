"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function useAuthenticatedNavigation() {
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [featureName, setFeatureName] = useState<string>("access this feature");

  const navigateWithAuth = useCallback((
    path: string, 
    feature: string = "access this feature"
  ) => {
    if (user) {
      // User is authenticated, navigate immediately
      router.push(path);
    } else {
      // User is not authenticated, show modal first
      setPendingNavigation(path);
      setFeatureName(feature);
      setShowLoginModal(true);
    }
  }, [user, router]);

  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
    setPendingNavigation(null);
    setFeatureName("access this feature");
  }, []);

  return {
    navigateWithAuth,
    showLoginModal,
    handleCloseModal,
    featureName,
    isShowingModal: showLoginModal,
  };
}
