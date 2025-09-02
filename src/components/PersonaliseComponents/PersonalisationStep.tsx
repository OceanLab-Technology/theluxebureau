// "use client";

// import React, { useEffect, useState } from "react";
// import { usePersonaliseStore } from "@/store/personaliseStore";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import axios from "axios";
// import { ChevronDown } from "lucide-react";

// interface FontSetting {
//   name: string;
//   url: string;
// }

// interface QuoteSetting {
//   text: string;
//   author: string;
// }

// interface SiteSettings {
//   fonts: FontSetting[];
//   quotes: QuoteSetting[];
//   api_key: string;
// }

// const DEFAULT_FONT_LABEL = "Garamond";

// export default function PersonalisationStep() {
//   const { formData, updateFormData } = usePersonaliseStore();

//   const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [fontLoaded, setFontLoaded] = useState(false);

//   // Persist user's custom quote even when switching away
//   const [customDraft, setCustomDraft] = useState("");

//   // ------- Derived helpers -------
//   const isDefaultGaramond = (formData.selectedFont || DEFAULT_FONT_LABEL) === DEFAULT_FONT_LABEL;

//   // If user picked a non-default font, find it from API for loading
//   const selectedFontFromApi = !isDefaultGaramond
//     ? siteSettings?.fonts.find((f) => f.name === formData.selectedFont)
//     : undefined;

//   // De-dupe: filter out any API font named "Garamond" (case-insensitive),
//   // since we render a virtual Garamond option at the top.
//   const apiFontsWithoutGaramond =
//     siteSettings?.fonts.filter((f) => f.name.toLowerCase() !== DEFAULT_FONT_LABEL.toLowerCase()) || [];

//   // ------- Styles -------
//   const getHeaderStyle = (): React.CSSProperties => {
//     const base: React.CSSProperties = {
//       fontSize: "16px",
//       color: "#57534e",
//       marginBottom: "12px",
//     };

//     if (selectedFontFromApi && fontLoaded) {
//       return { ...base, fontFamily: `"${selectedFontFromApi.name}", serif` };
//     }

//     // Built-in default
//     return { ...base, fontFamily: DEFAULT_FONT_LABEL };
//   };

//   const getQuoteStyle = (): React.CSSProperties => ({
//     fontSize: "12px",
//     color: "#57534e",
//     fontFamily: "monospace",
//   });

//   // ------- Effects -------
//   // Initialize defaults (show Garamond selected, header placeholder, no quote yet)
//   useEffect(() => {
//     // Only set once when mounting or when store has nothing yet
//     if (!formData.headerText && !formData.selectedFont && !formData.selectedQuote) {
//       updateFormData({
//         headerText: "Header",
//         selectedFont: "Garamond", // always visible as selected
//         selectedQuote: "select",
//         customMessage: "",
//       });
//       setCustomDraft("");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Load selected font (skip built-in Garamond)
//   useEffect(() => {
//     const loadFont = async () => {
//       if (!selectedFontFromApi) {
//         setFontLoaded(false);
//         return;
//       }
//       try {
//         const fontFace = new FontFace(selectedFontFromApi.name, `url(${selectedFontFromApi.url})`);
//         await fontFace.load();
//         document.fonts.add(fontFace);
//         setFontLoaded(true);
//       } catch {
//         setFontLoaded(false);
//       }
//     };

//     loadFont();
//   }, [selectedFontFromApi]);

//   // Fetch settings
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await axios.get("/api/settings");
//         if (response.data.success) {
//           setSiteSettings(response.data.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch site settings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   useEffect(() => {
//     if (!formData.selectedFont) {
//       updateFormData({ selectedFont: "Garamond" });
//     }
//   }, []);

//   // ------- Utils -------
//   const getQuoteByAuthor = (authorName: string) => {
//     if (!siteSettings?.quotes?.length || authorName === "select") return "";
//     const q = siteSettings.quotes.find((it) => it.author === authorName);
//     return q ? `${q.text}\n— ${q.author}` : "";
//   };

//   // ------- Render -------
//   return (
//     <div className="font-[Century-Old-Style]">
//       <div className="max-w-2xl w-full">
//         <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-1 break-words">
//           Our gifts arrive with custom stationery, letterpressed by hand at the Luxe Bureau atelier, in Noir ink on GF Smith Mohawk White card.
//         </p>

//         <p className="text-secondary-foreground mt-4 font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-4 break-words">
//           Please click on the card below to personalise your message. In the header, add your name, initials, or company to create your bespoke letterhead. You may choose from type styles below.
//         </p>

//         <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-1 break-words">
//           Your personal message will be set in our signature typewriter font. For inspiration, you can select a quote from the dropdown, or write your own.
//         </p>
//       </div>

//       <br />

//       <div className="flex md:gap-12 gap-4 mb-8">
//         {/* Header Font Selector */}
//         <div className="w-40 font-[Marfa]">
//           <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
//             Header type style*
//           </label>

//           <Select
//               value={
//                 formData.selectedFont === "default" || !formData.selectedFont
//                   ? "Garamond"
//                   : formData.selectedFont
//               }

//             onValueChange={(value) => {
//               updateFormData({ selectedFont: value })
//             }}
//             disabled={loading}
//           >
//             <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent rounded-[0.3rem] py-0 focus:ring-0 relative px-2">
//               <SelectValue />
//               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
//             </SelectTrigger>

//             <SelectContent className="rounded-[0.3rem]">
//               <SelectItem value="Garamond">Garamond</SelectItem>

//               {apiFontsWithoutGaramond.map((font) => (
//                 <SelectItem key={font.name} value={font.name}>
//                   {font.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//         </div>

//         {/* Quote Selector */}
//         <div className="w-40 font-[Marfa]">
//           <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
//             Quotes
//           </label>

//           <Select
//             value={formData.selectedQuote || "select"}
//             onValueChange={(authorName) => {
//               if (authorName === "custom") {
//                 updateFormData({
//                   selectedQuote: "custom",
//                   customMessage: customDraft, // restore previous draft
//                 });
//               } else if (authorName === "select") {
//                 updateFormData({ selectedQuote: "select", customMessage: "" });
//               } else {
//                 const quoteText = getQuoteByAuthor(authorName);
//                 updateFormData({
//                   selectedQuote: authorName,
//                   customMessage: quoteText,
//                 });
//               }
//             }}
//           >
//             <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent rounded-[0.3rem] py-0 focus:ring-0 relative px-2">
//               <SelectValue placeholder="Select a quote" />
//               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
//             </SelectTrigger>

//             <SelectContent className="rounded-[0.3rem]">
//               <SelectItem value="select">Select a quote</SelectItem>
//               {siteSettings?.quotes?.map((quote, idx) => (
//                 <SelectItem key={idx} value={quote.author}>
//                   {quote.author}
//                 </SelectItem>
//               ))}
//               <SelectItem value="custom">Write my own</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="mb-8">
//         <div
//           className="relative md:h-[30rem] h-[50vh] w-full flex items-center justify-center rounded-none overflow-hidden"
//           style={{
//             backgroundImage: "url(/notecard.jpg)",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <div className="max-w-sm w-full h-3.5/7 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute inset-0">
//             {/* Header Input */}
//             <div className="text-center mb-10 absolute md:top-4 top-4 left-1/2 transform -translate-x-1/2 w-full z-30">
//               <input
//                 type="text"
//                 value={formData.headerText || ""}
//                 onChange={(e) => updateFormData({ headerText: e.target.value })}
//                 placeholder="Enter header text*"
//                 maxLength={25}
//                 className="w-full text-center bg-transparent border-none outline-none pointer-events-auto focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
//                 style={{ ...getHeaderStyle(), position: "relative", zIndex: 50 }}
//                 tabIndex={50}
//               />
//             </div>

//             {/* Quote Textarea */}
//             <div className="text-center md:w-96 mx-auto absolute inset-0 flex items-center justify-center md:mt-2 mt-4 px-8">
//               <textarea
//                 readOnly={formData.selectedQuote !== "custom"}
//                 value={
//                   formData.selectedQuote === "custom"
//                     ? customDraft
//                     : formData.customMessage || ""
//                 }
//                 onChange={(e) => {
//                   if (formData.selectedQuote === "custom") {
//                     const next = e.target.value;
//                     setCustomDraft(next);
//                     updateFormData({ customMessage: next });
//                   }
//                 }}
//                 placeholder="Select a quote or write your own"
//                 maxLength={formData.selectedQuote === "custom" ? 300 : undefined}
//                 className="w-full text-center md:text-[0.8rem] text-[10px] bg-transparent border-none outline-none resize-none scrollbar-hide pointer-events-auto focus:outline-none overflow-hidden"
//                 style={{ ...getQuoteStyle(), minHeight: "8rem" }}
//                 rows={6}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { usePersonaliseStore } from "@/store/personaliseStore";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import axios from "axios";
// import { ChevronDown } from "lucide-react";

// interface FontSetting {
//   name: string;
//   url: string;
// }

// interface QuoteSetting {
//   text: string;
//   author: string;
// }

// interface SiteSettings {
//   fonts: FontSetting[];
//   quotes: QuoteSetting[];
//   api_key: string;
// }

// const DEFAULT_FONT_LABEL = "Garamond";

// export default function PersonalisationStep() {
//   const { formData, updateFormData } = usePersonaliseStore();

//   const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [fontLoaded, setFontLoaded] = useState(false);

//   // Persist user's custom quote even when switching away
//   const [customDraft, setCustomDraft] = useState("");

//   // When typing while a preset quote is selected, collect draft until user confirms
//   const [pendingDraft, setPendingDraft] = useState("");
//   const [showSwitchPrompt, setShowSwitchPrompt] = useState(false);

//   // ------- Derived helpers -------
//   const isDefaultGaramond =
//     (formData.selectedFont || DEFAULT_FONT_LABEL) === DEFAULT_FONT_LABEL;

//   const selectedFontFromApi = !isDefaultGaramond
//     ? siteSettings?.fonts.find((f) => f.name === formData.selectedFont)
//     : undefined;

//   const apiFontsWithoutGaramond =
//     siteSettings?.fonts.filter(
//       (f) => f.name.toLowerCase() !== DEFAULT_FONT_LABEL.toLowerCase()
//     ) || [];

//   // ------- Styles -------
//   const getHeaderStyle = (): React.CSSProperties => {
//     const base: React.CSSProperties = {
//       fontSize: "16px",
//       color: "#57534e",
//       marginBottom: "12px",
//     };

//     if (selectedFontFromApi && fontLoaded) {
//       return { ...base, fontFamily: `"${selectedFontFromApi.name}", serif` };
//     }

//     return { ...base, fontFamily: DEFAULT_FONT_LABEL };
//   };

//   const getQuoteStyle = (): React.CSSProperties => ({
//     fontSize: "12px",
//     color: "#57534e",
//     fontFamily: "monospace",
//   });

//   // ------- Effects -------
//   useEffect(() => {
//     if (!formData.headerText && !formData.selectedFont && !formData.selectedQuote) {
//       updateFormData({
//         headerText: "Header",
//         selectedFont: DEFAULT_FONT_LABEL,
//         selectedQuote: "select",
//         customMessage: "",
//       });
//       setCustomDraft("");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Load selected font (skip built-in Garamond)
//   useEffect(() => {
//     const loadFont = async () => {
//       if (!selectedFontFromApi) {
//         setFontLoaded(false);
//         return;
//       }
//       try {
//         const fontFace = new FontFace(
//           selectedFontFromApi.name,
//           `url(${selectedFontFromApi.url})`
//         );
//         await fontFace.load();
//         document.fonts.add(fontFace);
//         setFontLoaded(true);
//       } catch {
//         setFontLoaded(false);
//       }
//     };

//     loadFont();
//   }, [selectedFontFromApi]);

//   // Fetch settings
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await axios.get("/api/settings");
//         if (response.data.success) {
//           setSiteSettings(response.data.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch site settings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   // Ensure a default font value
//   useEffect(() => {
//     if (!formData.selectedFont) {
//       updateFormData({ selectedFont: DEFAULT_FONT_LABEL });
//     }
//   }, [formData.selectedFont, updateFormData]);

//   // ------- Utils -------
//   const getQuoteByAuthor = (authorName: string) => {
//     if (!siteSettings?.quotes?.length || authorName === "select") return "";
//     const q = siteSettings.quotes.find((it) => it.author === authorName);
//     return q ? `${q.text}\n— ${q.author}` : "";
//   };

//   const applyCustom = (text: string) => {
//     setCustomDraft(text);
//     updateFormData({
//       selectedQuote: "custom",
//       customMessage: text,
//     });
//   };

//   // ------- Handlers for free-typing with confirmation -------
//   const handleQuoteInput = (next: string) => {
//     // If nothing is selected yet (or "select"), allow typing and switch to custom automatically
//     if (!formData.selectedQuote || formData.selectedQuote === "select") {
//       applyCustom(next);
//       return;
//     }

//     // If already in custom mode, just update
//     if (formData.selectedQuote === "custom") {
//       setCustomDraft(next);
//       updateFormData({ customMessage: next });
//       return;
//     }

//     // A preset author is selected; ask for confirmation before switching
//     setPendingDraft(next);
//     setShowSwitchPrompt(true);
//   };

//   const confirmSwitchToCustom = () => {
//     applyCustom(pendingDraft);
//     setPendingDraft("");
//     setShowSwitchPrompt(false);
//   };

//   const keepSelectedQuote = () => {
//     setPendingDraft("");
//     setShowSwitchPrompt(false);
//   };

//   // ------- Render -------
//   return (
//     <div className="font-[Century-Old-Style]">
//       <div className="max-w-2xl w-full">
//         <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-1 break-words">
//           Our gifts arrive with custom stationery, letterpressed by hand at the Luxe Bureau atelier, in Noir ink on GF Smith Mohawk White card.
//         </p>

//         <p className="text-secondary-foreground mt-4 font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-4 break-words">
//           Please click on the card below to personalise your message. In the header, add your name, initials, or company to create your bespoke letterhead. You may choose from type styles below.
//         </p>

//         <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-1 break-words">
//           Your personal message will be set in our signature typewriter font. For inspiration, you can select a quote from the dropdown, or write your own.
//         </p>
//       </div>

//       <br />

//       <div className="flex md:gap-12 gap-4 mb-8">
//         {/* Header Font Selector */}
//         <div className="w-40 font-[Marfa]">
//           <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
//             Header type style*
//           </label>

//           <Select
//             value={
//               formData.selectedFont === "default" || !formData.selectedFont
//                 ? DEFAULT_FONT_LABEL
//                 : formData.selectedFont
//             }
//             onValueChange={(value) => {
//               updateFormData({ selectedFont: value });
//             }}
//             disabled={loading}
//           >
//             <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent rounded-[0.3rem] py-0 focus:ring-0 relative px-2">
//               <SelectValue />
//               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
//             </SelectTrigger>

//             <SelectContent className="rounded-[0.3rem]">
//               <SelectItem value={DEFAULT_FONT_LABEL}>{DEFAULT_FONT_LABEL}</SelectItem>
//               {apiFontsWithoutGaramond.map((font) => (
//                 <SelectItem key={font.name} value={font.name}>
//                   {font.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Quote Selector */}
//         <div className="w-40 font-[Marfa]">
//           <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
//             Quotes
//           </label>

//           <Select
//             value={formData.selectedQuote || "select"}
//             onValueChange={(authorName) => {
//               if (authorName === "custom") {
//                 updateFormData({
//                   selectedQuote: "custom",
//                   customMessage: customDraft, // restore previous draft
//                 });
//               } else if (authorName === "select") {
//                 updateFormData({ selectedQuote: "select", customMessage: "" });
//               } else {
//                 const quoteText = getQuoteByAuthor(authorName);
//                 updateFormData({
//                   selectedQuote: authorName,
//                   customMessage: quoteText,
//                 });
//               }
//               // Clear any pending switch prompt when user explicitly chooses
//               setShowSwitchPrompt(false);
//               setPendingDraft("");
//             }}
//           >
//             <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent rounded-[0.3rem] py-0 focus:ring-0 relative px-2">
//               <SelectValue placeholder="Select a quote" />
//               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
//             </SelectTrigger>

//             <SelectContent className="rounded-[0.3rem]">
//               <SelectItem value="select">Select a quote</SelectItem>
//               {siteSettings?.quotes?.map((quote, idx) => (
//                 <SelectItem key={idx} value={quote.author}>
//                   {quote.author}
//                 </SelectItem>
//               ))}
//               <SelectItem value="custom">Write my own</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="mb-8">
//         <div
//           className="relative md:h-[30rem] h-[50vh] w-full flex items-center justify-center rounded-none overflow-hidden"
//           style={{
//             backgroundImage: "url(/notecard.jpg)",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <div className="max-w-sm w-full h-3.5/7 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute inset-0">
//             {/* Header Input */}
//             <div className="text-center mb-10 absolute md:top-4 top-4 left-1/2 transform -translate-x-1/2 w-full z-30">
//               <input
//                 type="text"
//                 value={formData.headerText || ""}
//                 onChange={(e) => updateFormData({ headerText: e.target.value })}
//                 placeholder="Enter header text*"
//                 maxLength={25}
//                 className="w-full text-center bg-transparent border-none outline-none pointer-events-auto focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
//                 style={{ ...getHeaderStyle(), position: "relative", zIndex: 50 }}
//                 tabIndex={50}
//               />
//             </div>

//             {/* Quote Textarea */}
//             <div className="text-center md:w-96 mx-auto absolute inset-0 flex items-center justify-center md:mt-2 mt-4 px-8">
//               <textarea
//                 // Always let the user type; we'll confirm if switching is needed
//                 value={
//                   formData.selectedQuote === "custom"
//                     ? customDraft
//                     : formData.customMessage || ""
//                 }
//                 onChange={(e) => {
//                   const next = e.target.value;
//                   handleQuoteInput(next);
//                 }}
//                 onPaste={(e) => {
//                   const next = (e.clipboardData.getData("text") || "").toString();
//                   if (!next) return;
//                   e.preventDefault();
//                   handleQuoteInput(
//                     // merge paste into current content for better UX
//                     (formData.selectedQuote === "custom"
//                       ? customDraft
//                       : formData.customMessage || "") + next
//                   );
//                 }}
//                 placeholder="Select a quote or write your own"
//                 maxLength={formData.selectedQuote === "custom" ? 300 : undefined}
//                 className="w-full text-center md:text-[0.8rem] text-[10px] bg-transparent border-none outline-none resize-none scrollbar-hide pointer-events-auto focus:outline-none overflow-hidden"
//                 style={{ ...getQuoteStyle(), minHeight: "8rem" }}
//                 rows={6}
//               />
//             </div>

//             {/* Switch confirm bar */}
//             {showSwitchPrompt && (
//               <div
//                 className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[90%] md:w-[26rem] rounded-md border border-stone-300 bg-white/90 backdrop-blur p-3 shadow-sm"
//                 role="alert"
//                 aria-live="assertive"
//               >
//                 <div className="text-[0.85rem] text-stone-700 mb-2">
//                   You’re editing a selected quote. Switch to <b>Write my own</b>?
//                 </div>
//                 <div className="flex gap-2 justify-end">
//                   <button
//                     type="button"
//                     onClick={keepSelectedQuote}
//                     className="px-3 py-1 rounded border border-stone-300 text-stone-700 hover:bg-stone-100"
//                   >
//                     Keep Selected
//                   </button>
//                   <button
//                     type="button"
//                     onClick={confirmSwitchToCustom}
//                     className="px-3 py-1 rounded bg-stone-900 text-white hover:bg-black"
//                   >
//                     Switch to Custom
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { usePersonaliseStore } from "@/store/personaliseStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { ChevronDown } from "lucide-react";

interface FontSetting {
  name: string;
  url: string;
}
interface QuoteSetting {
  text: string;
  author: string;
}
interface SiteSettings {
  fonts: FontSetting[];
  quotes: QuoteSetting[];
  api_key: string;
}

const DEFAULT_FONT_LABEL = "Garamond";

export default function PersonalisationStep() {
  const { formData, updateFormData } = usePersonaliseStore();

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [customDraft, setCustomDraft] = useState("");

  const isDefaultGaramond =
    (formData.selectedFont || DEFAULT_FONT_LABEL) === DEFAULT_FONT_LABEL;

  const selectedFontFromApi = !isDefaultGaramond
    ? siteSettings?.fonts.find((f) => f.name === formData.selectedFont)
    : undefined;

  const apiFontsWithoutGaramond =
    siteSettings?.fonts.filter(
      (f) => f.name.toLowerCase() !== DEFAULT_FONT_LABEL.toLowerCase()
    ) || [];

  const getHeaderStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontSize: "16px",
      color: "#57534e",
      marginBottom: "12px",
    };
    if (selectedFontFromApi && fontLoaded) {
      return { ...base, fontFamily: `"${selectedFontFromApi.name}", serif` };
    }
    return { ...base, fontFamily: DEFAULT_FONT_LABEL };
  };

  // Put near the top of your component/file
  const MAX_CHARS = 300;
  const MAX_LINES = 7; // tweak as you like
  const MAX_CONSEC_NEWLINES = 1; // no more than one blank line in a row

  const clampMessage = (raw: string) => {
    // collapse > MAX_CONSEC_NEWLINES consecutive newlines
    const collapsed = raw.replace(
      new RegExp(`\\n{${MAX_CONSEC_NEWLINES + 1},}`, "g"),
      "\n".repeat(MAX_CONSEC_NEWLINES)
    );

    // hard char cap first so split isn't huge
    let s = collapsed.slice(0, MAX_CHARS);

    // enforce max lines
    const lines = s.split("\n");
    if (lines.length > MAX_LINES) {
      s = lines.slice(0, MAX_LINES).join("\n");
    }
    return s;
  };

  const countLines = (s: string) => s.split("\n").length;

  useEffect(() => {
    if (formData.selectedQuote === "custom") {
      setCustomDraft(formData.customMessage || "");
    }
  }, [formData.selectedQuote, formData.customMessage]);

  const getQuoteStyle = (): React.CSSProperties => ({
    color: "#57534e",
    fontFamily: "Courier",
  });

  useEffect(() => {
    if (
      !formData.headerText &&
      !formData.selectedFont &&
      !formData.selectedQuote
    ) {
      updateFormData({
        headerText: "Header",
        selectedFont: DEFAULT_FONT_LABEL,
        selectedQuote: "select",
        customMessage: "",
      });
      setCustomDraft("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadFont = async () => {
      if (!selectedFontFromApi) {
        setFontLoaded(false);
        return;
      }
      try {
        const fontFace = new FontFace(
          selectedFontFromApi.name,
          `url(${selectedFontFromApi.url})`
        );
        await fontFace.load();
        document.fonts.add(fontFace);
        setFontLoaded(true);
      } catch {
        setFontLoaded(false);
      }
    };
    loadFont();
  }, [selectedFontFromApi]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings");
        if (response.data.success) setSiteSettings(response.data.data);
      } catch (e) {
        console.error("Failed to fetch site settings:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!formData.selectedFont) {
      updateFormData({ selectedFont: DEFAULT_FONT_LABEL });
    }
  }, [formData.selectedFont, updateFormData]);

  const getQuoteByAuthor = (authorName: string) => {
    if (!siteSettings?.quotes?.length || authorName === "select") return "";
    const q = siteSettings.quotes.find((it) => it.author === authorName);
    return q ? `${q.text}\n— ${q.author}` : "";
    // You can drop the em-dash if you want plain text only.
  };

  // >>> DIRECT SWITCH TO CUSTOM ON TYPE / PASTE <<<
  const handleQuoteInput = (next: string) => {
    setCustomDraft(next);
    updateFormData({
      selectedQuote: "custom",
      customMessage: next,
    });
  };

  return (
    <div className="font-[Century-Old-Style]">
      <div className="w-full">
        <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-1 break-words">
          Our gifts arrive with custom stationery, letterpressed by hand at the
          Luxe Bureau atelier, in Noir ink on GF Smith Mohawk White card.
        </p>

        <p className="text-secondary-foreground mt-4 font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-4 break-words">
          Please click on the card below to personalise your message. In the
          header, add your name, initials, or company to create your bespoke
          letterhead. You may choose from type styles below.
        </p>

        <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-[Century-Old-Style] mb-1 break-words">
          Your personal message will be typeset in our signature typewriter font. For inspiration, you can select a quote from the dropdown or compose your own.
        </p>
      </div>

      <br />

      <div className="flex md:gap-12 gap-4 mb-8">
        {/* Header Font Selector */}
        <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Header type style*
          </label>

          <Select
            value={
              formData.selectedFont === "default" || !formData.selectedFont
                ? DEFAULT_FONT_LABEL
                : formData.selectedFont
            }
            onValueChange={(value) => updateFormData({ selectedFont: value })}
            disabled={loading}
          >
            <SelectTrigger style={{ fontFamily: DEFAULT_FONT_LABEL }} className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent rounded-[0.3rem] py-0 focus:ring-0 relative px-2">
              <SelectValue  />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
            </SelectTrigger>

            <SelectContent className="rounded-[0.3rem]">
              <SelectItem
                value={DEFAULT_FONT_LABEL}
                style={{ fontFamily: DEFAULT_FONT_LABEL }}
              >
                {DEFAULT_FONT_LABEL}
              </SelectItem>
              {apiFontsWithoutGaramond.map((font) => (
                <SelectItem
                  key={font.name}
                  value={font.name}
                  style={{
                    fontFamily:
                      fontLoaded && selectedFontFromApi?.name === font.name
                        ? `"${font.name}", serif`
                        : font.name,
                  }}
                >
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quote Selector */}
        <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Quotes
          </label>

          <Select
            value={formData.selectedQuote || "select"}
            onValueChange={(authorName) => {
              if (authorName === "custom") {
                updateFormData({
                  selectedQuote: "custom",
                  customMessage: customDraft, 
                });
              } else if (authorName === "select") {
                updateFormData({ selectedQuote: "select", customMessage: "" });
              } else {
                const quoteText = getQuoteByAuthor(authorName);
                updateFormData({
                  selectedQuote: authorName,
                  customMessage: quoteText,
                });
              }
            }}
          >
            <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent rounded-[0.3rem] py-0 focus:ring-0 relative px-2">
              <SelectValue placeholder="Select a quote" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
            </SelectTrigger>

            <SelectContent className="rounded-[0.3rem]">
              <SelectItem value="select">Select a quote</SelectItem>
              {siteSettings?.quotes?.map((quote, idx) => (
                <SelectItem
                  key={idx}
                  value={quote.author}
                  style={{ fontFamily: "monospace" }}
                >
                  {quote.author}
                </SelectItem>
              ))}
              <SelectItem value="custom" style={{ fontFamily: "monospace" }}>
                Write my own
              </SelectItem>
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
          <div className="max-w-sm w-full h-3.5/7 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute inset-0">
            {/* Header Input */}
            <div className="text-center mb-10 absolute md:top-4 top-4 left-1/2 transform -translate-x-1/2 w-full z-30">
              <input
                type="text"
                value={formData.headerText || ""}
                onChange={(e) => updateFormData({ headerText: e.target.value })}
                onFocus={(e) =>
                  e.target.value === "Header" &&
                  updateFormData({ headerText: "" })
                }
                placeholder="Enter header text*"
                maxLength={25}
                className="w-full text-center bg-transparent border-none outline-none pointer-events-auto focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  ...getHeaderStyle(),
                  position: "relative",
                  zIndex: 50,
                }}
                tabIndex={50}
              />
            </div>

            {/* Quote Textarea */}
            <div className="text-center md:w-96 w-60 mx-auto absolute inset-0 flex items-center justify-center md:mt-2 mt-4 md:px-8">
              <textarea
                value={
                  formData.selectedQuote === "custom"
                    ? customDraft
                    : formData.customMessage || ""
                }
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 300) {
                    handleQuoteInput(newValue);
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text") || "";
                  const current =
                    formData.selectedQuote === "custom"
                      ? customDraft
                      : formData.customMessage || "";
                  const combined = current + pasted;

                  if (combined.length <= 300) {
                    e.preventDefault();
                    handleQuoteInput(combined);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const current =
                      formData.selectedQuote === "custom"
                        ? customDraft
                        : formData.customMessage || "";
                    if (countLines(current) >= MAX_LINES) {
                      e.preventDefault(); // block extra newlines
                    }
                  }
                }}
                placeholder="Select a quote or write your own"
                maxLength={300}
                className={`w-full text-center md:text-[0.8rem] text-[8px] h-full mt-4 bg-transparent border-none outline-none resize-none scrollbar-hide pointer-events-auto focus:outline-none overflow-hidden ${
                  customDraft.length > 300
                    ? "md:pt-[2rem] pt-[1rem]"
                    : customDraft.length > 100
                    ? "pt-[2rem]"
                    : "pt-[3rem]"
                }`}
                style={{
                  ...getQuoteStyle(),
                  minHeight: "8rem",
                }}
                rows={6}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
