"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  options,
  value,
  onValueChange,
  placeholder = "SELECT A SCENT",
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleOptionClick = (optionValue: string, disabled?: boolean) => {
    if (!disabled) {
      onValueChange(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div 
      className={cn(
        "relative", 
        // Dynamic width based on selection state
        selectedOption ? "w-fit min-w-fit" : "w-80", // 20rem when no selection, fit-content when selected
        className
      )} 
      ref={selectRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "border rounded-b-none" : "border"} border-foreground w-full bg-transparent focus:outline-none rounded-sm uppercase`}
      >
        <div className="flex items-center justify-between py-3 px-4 gap-4">
          <span className="small-text whitespace-nowrap">{displayText}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-black transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full z-50 border rounded-b-sm border-t-0 border-foreground bg-white">
          {options.map((option, index) => {
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value, option.disabled)}
                disabled={option.disabled}
                className={cn(
                  "w-full px-6 py-4 text-center small-text uppercase text-foreground whitespace-nowrap",
                  "border-b border-foreground last:border-b-0",
                  "transition-opacity duration-150 bg-[#fbd060]",
                  option.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-80 cursor-pointer"
                )}
              >
                {option.label}
                {option.disabled && " — Out of stock"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
