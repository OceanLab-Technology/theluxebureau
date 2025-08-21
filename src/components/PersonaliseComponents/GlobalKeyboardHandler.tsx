"use client";
import React from "react";

export function GlobalKeyboardHandler() {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
     
      if (e.key === "x" || e.key === "X") {
        
        const target = e.target as HTMLElement;
        const isInputField = target.tagName === "INPUT" || 
                           target.tagName === "TEXTAREA" || 
                           target.isContentEditable;
        
        if (!isInputField) {
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent("globalClose"));
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);
  
  return null;
}