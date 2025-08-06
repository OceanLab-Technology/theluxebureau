"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePersonalizeStore } from "@/store/personalizeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

interface FontSetting {
  name: string;
  url: string;
}

interface SiteSettings {
  fonts: FontSetting[];
  quotes: string[];
  api_key: string;
}

export default function PersonalizationStep() {
  const { formData, updateFormData } = usePersonalizeStore();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedFont = siteSettings?.fonts.find(
    (font) => font.name === formData.selectedFont
  );

  const getHeaderStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontSize: "16px",
      color: "#57534e",
      fontWeight: "bold",
      marginBottom: "12px",
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
    if (!formData.headerText && formData.headerText !== "") {
      updateFormData({
        headerText: "Header",
        selectedFont: "default",
      });
    }
  }, []);

  // Load the selected font if available
  useEffect(() => {
    if (siteSettings?.quotes?.length && !formData.selectedQuote) {
      updateFormData({
        selectedQuote: siteSettings.quotes[0],
        customMessage: siteSettings.quotes[0],
      });
    }
  }, [siteSettings, formData.selectedQuote, updateFormData]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const quotes = siteSettings?.quotes.length
    ? [...siteSettings.quotes, "Write my own"]
    : ["Write my own"];

  const getMessageStyle = () => {
    return {
      fontSize: "12px",
      color: "#57534e",
      fontFamily: "monospace",
    };
  };

  return (
    <div className="font-century">
      <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Our gifts are sent with custom stationery, letter-pressed by hand at the
        Luxe Bureau atelier. In the header field, please enter your own name,
        initials, or company to create your custom letterhead. You may choose
        between two type styles below.
      </p>
      <br />
      <p className="text-secondary-foreground mb-8 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Your personal message will be typeset and printed in the Luxe Bureau's
        signature typewriter font. Please type your message directly onto the
        notecard. For added inspiration, select a quote from the drop down menu
        to add this to your message.
      </p>

      <div className="flex gap-4 mb-8">
        <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Header type style*
          </label>
          <Select
            value={formData.selectedFont}
            onValueChange={(value) => updateFormData({ selectedFont: value })}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={loading ? "Loading fonts..." : "Select font"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Font</SelectItem>
              {siteSettings?.fonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fontError && (
            <p className="text-xs text-red-600 mt-1">{fontError}</p>
          )}
        </div>

        <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Quotes*
          </label>
          <Select
            value={formData.selectedQuote}
            onValueChange={(value) => {
              updateFormData({
                selectedQuote: value,
                customMessage:
                  value === "Write my own"
                    ? formData.customMessage || ""
                    : value,
              });

              // Focus on textarea when "Write my own" is selected
              if (value === "Write my own") {
                setTimeout(() => {
                  textareaRef.current?.focus();
                }, 100);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {quotes.map((quote, index) => (
                <SelectItem key={index} value={quote}>
                  {quote.length > 50 ? `${quote.substring(0, 50)}...` : quote}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <div
          className="relative md:h-[30rem] h-[50vh] w-full flex items-center justify-center rounded-none overflow-hidden"
          style={{
            backgroundImage: "url(/notecard.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-sm w-full h-1/2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute inset-0">
            <div className="text-center mb-10 absolute md:top-5 top-4 left-1/2 transform -translate-x-1/2 w-full z-30">
              <input
                type="text"
                value={formData.headerText || ""}
                onChange={(e) => updateFormData({ headerText: e.target.value })}
                placeholder="Enter header text*"
                className="w-full text-center text-[0.75rem] bg-transparent border-none outline-none pointer-events-auto focus:outline-none"
                style={{
                  ...getHeaderStyle(),
                  position: "relative",
                  zIndex: 50,
                }}
                tabIndex={0}
              />
            </div>

            <div className="text-center md:w-96 mx-auto absolute inset-0 flex items-center justify-center md:mt-10 mt-4 px-8">
              <textarea
                ref={textareaRef}
                value={formData.customMessage || ""}
                onChange={(e) => {
                  const newMessage = e.target.value;
                  updateFormData({
                    customMessage: newMessage,
                    selectedQuote:
                      newMessage.length > 0
                        ? "Write my own"
                        : siteSettings?.quotes?.[0] || "Write my own",
                  });
                }}
                placeholder="Your message will appear here..."
                className={`w-full ${
                  formData.customMessage.length > 150 ? "h-[70%]" : ""
                } text-center md:text-[0.065rem] text-[8px] bg-transparent border-none outline-none resize-none`}
                style={getMessageStyle()}
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
