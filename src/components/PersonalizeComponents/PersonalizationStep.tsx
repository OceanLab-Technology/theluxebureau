"use client";

import React, { useEffect, useState } from "react";
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

  const selectedFont = siteSettings?.fonts.find(
    (font) => font.name === formData.selectedFont
  );

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
;

  const isCustomMessage = formData.selectedQuote === "Write my own";

  const getPreviewStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontSize: "12px",
      color: "#57534e",
      fontStyle: "italic",
    };

    if (selectedFont && fontLoaded && formData.selectedFont !== "default") {
      return {
        ...baseStyle,
        fontFamily: `"${selectedFont.name}", serif`,
      };
    }

    return baseStyle;
  };

  return (
    <div>
      <p className="text-stone-700 text-sm leading-relaxed">
        Our gifts are sent with custom stationery, letter-pressed by hand at the
        Luxe Bureau atelier. In the header field, please enter your own name,
        initials, or company to create your custom letterhead. You may choose
        between two type styles below.
      </p>

      <p className="text-stone-700 mb-8 text-sm leading-relaxed">
        Your personal message will be typeset and printed in the Luxe Bureau's
        signature typewriter font. Please type your message directly onto the
        notecard. For added inspiration, select a quote from the drop down menu
        to add this to your message.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex-1">
          <label className="text-xs font-medium tracking-wider text-stone-600 mb-2 block">
            Font Family
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

        <div className="flex-1">
          <label className="text-xs font-medium tracking-wider text-stone-600 mb-2 block">
            Quotes
          </label>
          <Select
            value={formData.selectedQuote}
            onValueChange={(value) => {
              updateFormData({
                selectedQuote: value,
                customMessage: value === "Write my own" ? "" : value,
              });
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
          className="relative h-64 rounded-none overflow-hidden"
          style={{
            backgroundImage: "url(/notecard.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="p-6 max-w-xs w-full">
              <div className="text-center">
                {selectedFont && (
                  <div className="text-xs text-stone-400 text-center">
                    {fontLoaded
                      ? `Font: ${selectedFont.name}`
                      : "Loading font..."}
                  </div>
                )}
              </div>

              <div className="text-center">
                {isCustomMessage ? (
                  <textarea
                    value={formData.customMessage}
                    onChange={(e) =>
                      updateFormData({ customMessage: e.target.value })
                    }
                    placeholder="Write your message here..."
                    className="w-full text-center italic resize-none outline-none bg-transparent"
                    style={getPreviewStyle()}
                    rows={3}
                  />
                ) : (
                  <div className="text-center italic" style={getPreviewStyle()}>
                    {formData.customMessage ||
                      formData.selectedQuote ||
                      "Message"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
