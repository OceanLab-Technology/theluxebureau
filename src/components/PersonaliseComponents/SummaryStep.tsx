"use client";
import React, { useRef, useEffect, useState } from "react";
import { usePersonaliseStore } from "@/store/personaliseStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useMainStore } from "@/store/mainStore";

interface FontSetting {
  name: string;
  url: string;
}

interface SiteSettings {
  fonts: FontSetting[];
  quotes: {
    text: string;
    author: string;
  }[];
  api_key: string;
}

export default function SummaryStep() {
  const { formData, selectedProduct, updateFormData } = usePersonaliseStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { currentProduct } = useMainStore();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showBackArrow, setShowBackArrow] = useState(false);
  
  const selectedFont = siteSettings?.fonts.find(
    (font) => font.name === formData.selectedFont
  );

  const getHeaderStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontSize: "0.70rem",
      color: "#57534e",
    };
    if (selectedFont && fontLoaded && formData.selectedFont !== "default") {
      return {
        ...baseStyle,
        fontFamily: `"${selectedFont.name}", serif`,
      };
    }
    return {
      ...baseStyle,
      fontFamily: "serif",
    };
  };

  const getMessageStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontSize: "0.45rem",
      color: "#57534e",
    };
    if (selectedFont && fontLoaded && formData.selectedFont !== "default") {
      return {
        ...baseStyle,
        fontFamily: `"${selectedFont.name}", serif`,
      };
    }
    return {
      ...baseStyle,
      fontFamily: "serif",
    };
  };

  useEffect(() => {
    const loadFont = async () => {
      if (!selectedFont || formData.selectedFont === "default") {
        setFontLoaded(false);
        return;
      }
      try {
        const fontFace = new FontFace(
          selectedFont.name,
          `url(${selectedFont.url})`
        );
        await fontFace.load();
        document.fonts.add(fontFace);
        setFontLoaded(true);
      } catch (err) {
        console.error("Error loading font:", err);
        setFontLoaded(false);
      }
    };
    loadFont();
  }, [selectedFont, formData.selectedFont]);
  

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings");
        if (response.data.success) {
          setSiteSettings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Track scroll position to show/hide back arrow
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        // Only show back arrow if not at the far left
        setShowBackArrow(scrollContainerRef.current.scrollLeft > 5);
      }
    };
    const ref = scrollContainerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      // Initial check to hide arrow on mount
      setShowBackArrow(ref.scrollLeft > 5);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -288, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 288, behavior: "smooth" });
    }
  };

  return (
    <div>
      <p className="text-secondary-foreground font-[ABC Marfa]  mb-12 mt-8 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Please review your gift details below. Press back to make changes.
      </p>
      
      <div className="flex flex-col gap-6 mt-8">
        <div className="flex items-center gap-8">
          <label className="font-[ABC Marfa] text-[15px]  text-[#50462d]/60 font-light min-w-[160px]">
            Your name
          </label>
          <p className="font-[ABC Marfa] text-[15px] tracking-[0.04rem]  text-[#3a2f1a] font-[120%]">
            {formData.yourName || "Not provided"}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <label className="font-[ABC Marfa] text-[15px] text-[#50462d]/60 font-light min-w-[160px]">
            Recipients name
          </label>
          <p className="font-[ABC Marfa] text-[15px] tracking-[0.04rem]  text-[#3a2f1a] font-[120%]">
            {formData.recipientName || "Not provided"}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <label className="font-[ABC Marfa] text-[15px] text-[#50462d]/60 font-light min-w-[160px]">
            Recipients address
          </label>
          <p className="font-[ABC Marfa] text-[15px] tracking-[0.04rem]  text-[#3a2f1a] font-[120%]">
            {formData.recipientAddress || "Not provided"}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <label className="font-[ABC Marfa] text-[15px] text-[#50462d]/60 font-light min-w-[160px]">
            Delivery Date
          </label>
          <p className="font-[ABC Marfa] text-[15px] text-[#3a2f1a] font-[120%]">
            {formData.deliveryDate || "Not selected"}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <label className="font-[ABC Marfa] text-[15px] text-[#50462d]/60 font-light min-w-[160px]">
            Delivery Time
          </label>
          <p className="font-[ABC Marfa] text-[15px] text-[#3a2f1a] font-[120%]">
            {formData.preferredDeliveryTime === "8am-1pm" ? "10:00 – 13:00" : 
             formData.preferredDeliveryTime === "1pm-6pm" ? "13:00 – 16:00" : 
             formData.preferredDeliveryTime === "6pm-11pm" ? "16:00 – 18:00" : 
             formData.preferredDeliveryTime || "Not selected"}
          </p>
        </div>
        <div className="flex items-start gap-8">
          <label className="font-[ABC Marfa] text-[15px] text-[#50462d]/60 font-light min-w-[160px]">
            Personal Message
          </label>
          <div className="font-[ABC Marfa]  tracking-[0.04rem]  text-[15px] text-[#3a2f1a] font-[120%] whitespace-pre-line">
            {formData.customMessage || "No personal message"}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative">
          {showBackArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-2 cursor-pointer top-1/2 -translate-y-1/2 z-10"
              aria-label="Scroll left"
              style={{ width: 32, height: 32 }}
            >
              <img src="/arrow.svg" className="rotate-180 w-8 h-8" alt="" />
            </button>
          )}
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
            aria-label="Scroll right"
            style={{ width: 32, height: 32 }}
          >
            <img src="/arrow.svg" className="w-8 h-8" alt="" />
          </button>
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden hide-scrollbar"
          >
            <div className="flex gap-2 pb-4">
              <div className="bg-stone-300 h-[34vh] md:w-[50%] w-full rounded-none flex items-center justify-center flex-shrink-0">
                <img
                  src={selectedProduct?.image || selectedProduct?.image_1}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:w-[70%] w-full flex-shrink-0">
                <div
                  className="relative w-full h-[34vh] rounded-none overflow-hidden"
                  style={{
                    backgroundImage: "url(/notecard.jpg)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="max-w-xs w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2">
                    <div className="text-center mb-10 absolute md:top-3 top-2 left-1/2 transform -translate-x-1/2 w-full z-30">
                      <span
                        className="text-center md:text-[0.70rem] text-[10px]"
                        style={getHeaderStyle()}
                      >
                        {formData.headerText || "No header text"}
                      </span>
                    </div>
                    <div className="text-center font-[Monospace] md:w-72 w-56 mx-auto absolute inset-0 flex items-center justify-center md:p-12 flex-col">
                      <span className="text-secondary-foreground md:text-[0.45rem] text-[8px] flex flex-col">
                        {formData.customMessage.split("\n")[0] ||
                          "No custom message"}
                      </span>
                      <span className="text-secondary-foreground md:text-[0.45rem] text-[8px] flex flex-col">
                        {formData.customMessage.split("\n")[1] || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[34vh] md:w-[50%] w-full rounded-none flex items-center justify-center flex-shrink-0">
                <img
                  src={currentProduct?.packaging!}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}