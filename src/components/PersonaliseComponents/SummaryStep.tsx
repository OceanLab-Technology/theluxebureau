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
  const selectedFont = siteSettings?.fonts.find(
    (font) => font.name === formData.selectedFont
  );

  const handleSMSChange = (
    value: "send-to-me" | "send-to-recipient" 
  ) => {
    updateFormData({ smsUpdates: value });
  };

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
      <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Please review or amend your gift details below.
      </p>
      <div className="md:space-y-4 space-y-3">
        <div className="flex items-center gap-2 pb-1">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Your Name
          </label>
          <p className="text-secondary-foreground">
            {formData.yourName || "Not provided"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Recipients Name
          </label>
          <p className="text-secondary-foreground">
            {formData.recipientName || "Not provided"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Recipient's Address
          </label>
          <p className="text-secondary-foreground">
            {formData.recipientAddress
              ? formData.recipientAddress
              : "Not provided"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Delivery Date
          </label>
          <p className="text-secondary-foreground">
            {formData.deliveryDate || "Not selected"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-muted font-[300] text-[0.93rem] tracking-[0.01875rem]">
            Delivery Time
          </label>
          <p className="text-secondary-foreground">
            {formData.preferredDeliveryTime || "Not selected"}
          </p>
        </div>

       <div className=" flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
          <p className="text-stone-700 text-sl mb-3 md:mb-0">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex flex-row gap-6 justify-center md:w-1/2 w-full transition-all duration-150">
            <label className="flex flex-row items-center cursor-pointer justify-center w-full">
              <span className={`text-sm mr-4 md:mr-6 ${formData.smsUpdates === "send-to-me" ? "text-[#40362c] font-bold" : "text-[#9ca3af]"}`}>
                Send to me
              </span>
              <div className="relative">
                <input
                  type="radio"
                  name="sms-updates"
                  value="send-to-me"
                  checked={formData.smsUpdates === "send-to-me"}
                  onChange={() => handleSMSChange("send-to-me")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.smsUpdates === "send-to-me"
                      ? "bg-[#40362c] border-[#40362c]"
                      : "bg-[#9ca3af] border-[#9ca3af]"
                  }`}
                />
              </div>
            </label>
            <label className="flex flex-row items-center cursor-pointer justify-center w-full">
              <span className={`text-sm mr-4 md:mr-8 ${formData.smsUpdates === "send-to-recipient" ? "text-[#40362c] font-bold" : "text-[#9ca3af]"}`}>
                Send to recipient
              </span>
              <div className="relative">
                <input
                  type="radio"
                  name="sms-updates"
                  value="send-to-recipient"
                  checked={formData.smsUpdates === "send-to-recipient"}
                  onChange={() => handleSMSChange("send-to-recipient")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.smsUpdates === "send-to-recipient"
                      ? "bg-[#40362c] border-[#40362c]"
                      : "bg-[#9ca3af] border-[#9ca3af]"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>
        <div className="mt-8">
          <div className="relative ">
            {/* <button
              onClick={scrollLeft}
              className="absolute left-2 cursor-pointer top-1/2 -translate-y-1/2 z-10"
              aria-label="Scroll left"
            >
              <img src="/arrow.svg" className="rotate-180" alt="" />
            </button> */}
            <button
              onClick={scrollRight}
              className="absolute right-2 scale-130 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
              aria-label="Scroll right"
            >
              <img src="/arrow.svg" alt="" />
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
    </div>
  );
}