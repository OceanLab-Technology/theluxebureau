// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { usePersonaliseStore } from "@/store/personaliseStore";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import axios from "axios";

// interface FontSetting {
//   name: string;
//   url: string;
// }

// interface SiteSettings {
//   fonts: FontSetting[];
//   quotes: {
//     text: string;
//     author: string;
//   }[];
//   api_key: string;
// }

// export default function PersonalizationStep() {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [fontLoaded, setFontLoaded] = useState(false);
//   const [fontError, setFontError] = useState<string | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const selectedFont = siteSettings?.fonts.find(
//     (font) => font.name === formData.selectedFont
//   );

//   const getHeaderStyle = () => {
//     const baseStyle: React.CSSProperties = {
//       fontSize: "16px",
//       color: "#57534e",
//       marginBottom: "12px",
//     };

//     if (selectedFont && fontLoaded && formData.selectedFont !== "default") {
//       return {
//         ...baseStyle,
//         fontFamily: `"${selectedFont.name}", serif`,
//       };
//     }

//     return {
//       ...baseStyle,
//       fontFamily: "serif",
//     };
//   };

//   useEffect(() => {
//     if (!formData.headerText && formData.headerText !== "") {
//       updateFormData({
//         headerText: "Header",
//         selectedFont: "default",
//       });
//     }
//   }, []);

//   // Load the selected font if available
//   useEffect(() => {
//     if (siteSettings?.quotes?.length && !formData.selectedQuote) {
//       const firstQuote = siteSettings.quotes[0];
//       const authorName = typeof firstQuote === 'string' ? firstQuote : firstQuote.author || "Unknown Author";
//       const quoteText = getQuoteByAuthor(authorName);
//       updateFormData({
//         selectedQuote: authorName,
//         customMessage: quoteText,
//       });
//     }
//   }, [siteSettings, formData.selectedQuote, updateFormData]);

//   useEffect(() => {
//     const loadFont = async () => {
//       if (!selectedFont || formData.selectedFont === "default") {
//         setFontLoaded(false);
//         return;
//       }

//       try {
//         const fontFace = new FontFace(
//           selectedFont.name,
//           `url(${selectedFont.url})`
//         );
//         await fontFace.load();
//         document.fonts.add(fontFace);
//         setFontLoaded(true);
//       } catch (err) {
//         console.error("Error loading font:", err);
//         setFontLoaded(false);
//       }
//     };

//     loadFont();
//   }, [selectedFont, formData.selectedFont]);

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

//   // Create array of author names for the select dropdown
//   const quoteAuthors = siteSettings?.quotes.length
//     ? [
//       ...siteSettings.quotes.map(quote =>
//         typeof quote === 'string' ? quote : quote.author || "Unknown Author"
//       ),
//       "Write my own"
//     ]
//     : ["Write my own"];

//   // Helper function to get quote text by author
//   const getQuoteByAuthor = (authorName: string) => {
//     if (authorName === "Write my own" || !siteSettings?.quotes.length) {
//       return "";
//     }

//     const quote = siteSettings.quotes.find(q =>
//       typeof q === 'string' ? q === authorName : q.author === authorName
//     );

//     if (typeof quote === 'string') {
//       return quote;
//     } else if (quote) {
//       return `${quote.text}\n— ${quote.author}`;
//     }

//     return "";
//   };

//   // const getMessageStyle = () => {
//   //   return {
//   //     fontSize: "12px",
//   //     color: "#57534e",
//   //     fontFamily: "monospace",
//   //   };
//   // };

//   const getMessageStyle = (): React.CSSProperties => {
//     const baseStyle: React.CSSProperties = {
//       fontSize: "12px",
//       color: "#57534e",
//     };

//     if (selectedFont && fontLoaded && formData.selectedFont !== "default") {
//       return {
//         ...baseStyle,
//         fontFamily: `"${selectedFont.name}", serif`,
//       };
//     }

//     return {
//       ...baseStyle,
//       fontFamily: "serif", // or your default fallback
//     };
//   };


//   return (
//     <div className="font-century">
//       <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Our gifts arrive with custom stationery, letterpressed by hand at the Luxe Bureau atelier, in Noir ink on GF Smith Mohawk White paper.
//       </p>
//       <br />
//       <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         In the header, add your name, initials, or company to create your bespoke letterhead. You may choose from two type styles below.
//       </p>
//       <br />
//       <p className="text-secondary-foreground mb-8 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Your personal message will be set in our signature typewriter font. For inspiration, you can select a quote from the dropdown—or compose your own.
//       </p>

//       <div className="flex gap-4 mb-8">
//         <div className="w-40 font-[Marfa]">
//           <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
//             Header type style*
//           </label>
//           <Select
//             value={formData.selectedFont}
//             onValueChange={(value) => updateFormData({ selectedFont: value })}
//             disabled={loading}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue
//                 placeholder={loading ? "Loading fonts..." : "Select font"}
//               />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="default">Default Font</SelectItem>
//               {siteSettings?.fonts.map((font) => (
//                 <SelectItem key={font.name} value={font.name}>
//                   {font.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {fontError && (
//             <p className="text-xs text-red-600 mt-1">{fontError}</p>
//           )}
//         </div>

//         <div className="w-40 font-[Marfa]">
//           <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
//             Quotes*
//           </label>
//           <Select
//             value={formData.selectedQuote}
//             onValueChange={(authorName) => {
//               const quoteText = getQuoteByAuthor(authorName);
//               updateFormData({
//                 selectedQuote: authorName,
//                 customMessage:
//                   authorName === "Write my own"
//                     ? formData.customMessage || ""
//                     : quoteText,
//               });

//               // Focus on textarea when "Write my own" is selected
//               if (authorName === "Write my own") {
//                 setTimeout(() => {
//                   textareaRef.current?.focus();
//                 }, 100);
//               }
//             }}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select" />
//             </SelectTrigger>
//             <SelectContent>
//               {quoteAuthors.map((author, index) => (
//                 <SelectItem key={index} value={author}>
//                   {author}
//                 </SelectItem>
//               ))}
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
//             <div className="text-center mb-10 absolute md:top-5 top-4 left-1/2 transform -translate-x-1/2 w-full z-30">
//               {/* <input
//                 type="text"
//                 // readOnly
//                 value={formData.headerText || ""}
//                 onChange={(e) => updateFormData({ headerText: e.target.value })}
//                 placeholder="Enter header text*"
//                 className="w-full text-center text-[0.75rem] bg-transparent border-none outline-none pointer-events-auto focus:outline-none"
//                 style={{
//                   ...getHeaderStyle(),
//                   position: "relative",
//                   zIndex: 50,
//                 }}
//                 // tabIndex={-1}
//                 tabIndex={50}
//               /> */}
//               <input
//                 type="text"
//                 value={formData.headerText || ""}
//                 onChange={(e) => updateFormData({ headerText: e.target.value })}
//                 placeholder="Enter header text*"
//                 className="w-full text-center bg-transparent border-none outline-none pointer-events-auto focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
//                 style={{
//                   ...getHeaderStyle(),
//                   position: "relative",
//                   zIndex: 50,
//                 }}
//                 tabIndex={50}
//               />

//             </div>

//             <div className="text-center md:w-96 mx-auto absolute inset-0 flex items-center justify-center md:mt-10 mt-4 px-8">
//               <textarea
//                 readOnly
//                 ref={textareaRef}
//                 value={formData.customMessage || ""}
//                 onChange={(e) => {
//                   const newMessage = e.target.value;
//                   updateFormData({
//                     customMessage: newMessage,
//                     selectedQuote:
//                       newMessage.length > 0
//                         ? "select a quote"
//                         : quoteAuthors[0] || "select a quote",
//                   });
//                 }}
//                 placeholder="Your message will appear here..."
//                 className={`w-full font-[Monospace] ${formData.customMessage.length > 150 ? "h-[70%]" : ""
//                   } text-center md:text-[0.65rem] text-[8px] bg-transparent border-none outline-none resize-none scrollbar-hide pointer-events-auto focus:outline-none`}
//                 // style={getMessageStyle()}
//                 rows={4}
//               />
//             </div>
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

export default function PersonalizationStep() {
  const { formData, updateFormData } = usePersonaliseStore();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);

  const selectedFont = siteSettings?.fonts.find(
    (font) => font.name === formData.selectedFont
  );

  // Header style with dynamic font
  const getHeaderStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontSize: "16px",
      color: "#57534e",
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
      fontFamily: "Garamond",
    };
  };

  const getQuoteStyle = (): React.CSSProperties => {
    return {
      fontSize: "12px",
      color: "#57534e",
      fontFamily: "monospace", 
    };
  };

  // Default values on mount
  // useEffect(() => {
  //   if (!formData.headerText) {
  //     updateFormData({
  //       headerText: "Header",
  //       selectedFont: "default",
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (!formData.headerText) {
      updateFormData({
        headerText: "Header",
        selectedFont: "",   // no default font
      });
    }
  }, []);


  // Load selected font for header
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
      } catch {
        setFontLoaded(false);
      }
    };

    loadFont();
  }, [selectedFont, formData.selectedFont]);

  // Fetch settings
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


  const getQuoteByAuthor = (authorName: string) => {
    if (!siteSettings?.quotes?.length || authorName === "select") return "";

    const quote = siteSettings.quotes.find((q) => q.author === authorName);
    return quote ? `${quote.text}\n— ${quote.author}` : "";
  };

  return (
    <div className="font-century mt-4">
  <div className="max-w-2xl w-full">
    <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-century mb-1 break-words">
      Our gifts are sent with custom stationery, letter-pressed by hand at the Luxe Bureau atelier. In the header field, please enter your own name, initials, or company to create your custom letterhead. You may choose between two type styles below.
    </p>
    <br/>
    <p className="text-secondary-foreground font-extralight leading-[1.25rem] tracking-[0.01rem] text-[15px] font-century mb-4 break-words">
      Your personal message will be typeset and printed in the Luxe Bureau's signature typewriter font. Please type your message directly onto the notecard. For added inspiration, select a quote from the drop down menu to add this to your message.
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
            value={formData.selectedFont}
            onValueChange={(value) => updateFormData({ selectedFont: value })}
            disabled={loading}
          >
            <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent py-0 focus:ring-0">
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
        </div>

        {/* Header Font Selector */}
        {/* <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Header type style*
          </label>
          <Select
            value={formData.selectedFont || "Select Font"}
            onValueChange={(value) => updateFormData({ selectedFont: value })}
            disabled={loading}
          >
            <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent py-0 focus:ring-0">
              <SelectValue
                placeholder={loading ? "Loading fonts..." : "Select font"}
              />
            </SelectTrigger>
            <SelectContent>
              {siteSettings?.fonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        {/* Header Font Selector */}
        {/* <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Header type style*
          </label>
          <Select
            value={formData.selectedFont || ""}
            onValueChange={(value) => updateFormData({ selectedFont: value })}
            disabled={loading}
          >
            <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent py-0 focus:ring-0">
              <SelectValue placeholder={loading ? "Loading fonts..." : "Select a font"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" disabled className="text-black">
                Select a font
              </SelectItem>

              {siteSettings?.fonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}



        {/* Quote Selector */}
        <div className="w-40 font-[Marfa]">
          <label className="text-[1rem] font-[300] tracking-[0.01875] text-secondary-foreground mb-1 block">
            Quotes*
          </label>
          <Select
            value={formData.selectedQuote || "select"}
            onValueChange={(authorName) => {
              const quoteText = getQuoteByAuthor(authorName);
              updateFormData({
                selectedQuote: authorName,
                customMessage: quoteText,
              });
            }}
          >
            <SelectTrigger className="w-[150px] h-6 md:w-[200px] text-[15px] border-stone-300 hover:bg-secondary bg-transparent py-0 focus:ring-0">
              <SelectValue placeholder="Select a quote" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select a quote</SelectItem>
              {siteSettings?.quotes.map((quote, index) => (
                <SelectItem key={index} value={quote.author}>
                  {quote.author}
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
          <div className="max-w-sm w-full h-3.5/7 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute inset-0">
            <div className="text-center mb-10 absolute md:top-4 top-4 left-1/2 transform -translate-x-1/2 w-full z-30">
              <input
                type="text"
                value={formData.headerText || ""}
                onChange={(e) => updateFormData({ headerText: e.target.value })}
                placeholder="Enter header text*"
                className="w-full text-center bg-transparent border-none outline-none pointer-events-auto focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  ...getHeaderStyle(),
                  position: "relative",
                  zIndex: 50,
                }}
                tabIndex={50}
              />
            </div>

            <div className="text-center md:w-96 mx-auto absolute inset-0 flex items-center justify-center md:mt-2 mt-4 px-8">
              <textarea
                readOnly
                value={formData.customMessage || ""}
                placeholder="Select a quote"
                className="w-full text-center md:text-[0.65rem] text-[8px] bg-transparent border-none outline-none resize-none scrollbar-hide pointer-events-auto focus:outline-none"
                style={getQuoteStyle()}
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
