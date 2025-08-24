// "use client";

// import React from "react";
// import { format } from "date-fns";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { usePersonaliseStore } from "@/store/personaliseStore";

// export default function DeliveryDetailsStep() {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [date, setDate] = React.useState<Date>();

//   React.useEffect(() => {
//     if (formData.deliveryDate) {
//       setDate(new Date(formData.deliveryDate));
//     }
//   }, [formData.deliveryDate]);

//   const handleInputChange = (field: string, value: string) => {
//     updateFormData({ [field]: value });
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (selectedDate) {
//       setDate(selectedDate);
//       updateFormData({ deliveryDate: format(selectedDate, "yyyy-MM-dd") });
//     }
//   };

//   const handleTimeSelect = (time: string) => {
//     updateFormData({ preferredDeliveryTime: time });
//   };

//   const handleSMSChange = (
//     value: "send-to-me" | "send-to-recipient"
//   ) => {
//     updateFormData({ smsUpdates: value });
//   };


// const formatDateWithOrdinal = (date:any) => {
//   const dayName = format(date, "EEEE");
//   const day = format(date, "d");
//   const month = format(date, "MMMM");
//   const year = format(date, "yyyy");


//   const getOrdinalSuffix = (day :any) => {
//     const dayNum = parseInt(day);
//     if (dayNum >= 11 && dayNum <= 13) return "th";
//     switch (dayNum % 10) {
//       case 1: return "st";
//       case 2: return "nd";
//       case 3: return "rd";
//       default: return "th";
//     }
//   };

//   const ordinalSuffix = getOrdinalSuffix(day);

//   return { dayName, day, ordinalSuffix, month, year };
// };


//   return (
//     <div className="">
//       <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Please add your recipient's details, and your preferred delivery day and time, below.
//       </p>

//       <form className="space-y-4 font-[Marfa]">

//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Recipient's name*
//           </label>
//           <Input
//             id="recipient-name"
//             type="text"
//             value={formData.recipientName}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               handleInputChange("recipientName", e.target.value)
//             }
//             placeholder=""
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
//           />
//         </div>
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//              Recipient's Address*
//           </label>
//           <Input
//             id="address"
//             type="text"
//             value={formData.recipientAddress}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               handleInputChange("recipientAddress", e.target.value)
//             }
//             placeholder=""
//             className="border-0 border-b border-stone-500 bg-transparent px-0 py-0.5 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
//           />
//         </div>


//          <div className="flex flex-col mt-6 md:flex-row md:items-center md:justify-between">
//           <label htmlFor="delivery-date" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Preferred delivery date*
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full md:w-[30rem] justify-start mt-1 text-left font-[Marfa] border-0 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-[15px] tracking-[0.02em] font-[300] h-auto transition-all duration-300",
//                   !date && "text-stone-500"
//                 )}
//               >
//                 {date ? (
//                   <span className="flex items-baseline">
//                     {(() => {
//                       const { dayName, day, ordinalSuffix, month, year } = formatDateWithOrdinal(date);
//                       return (
//                         <>
//                         {dayName}, {day} <sup className="text-xs">{ordinalSuffix}</sup>{" "} {" "}  {month} {" "} {year}
//                         </>
//                       );
//                     })()}
//                   </span>
//                 ) : (
//                   <span></span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 style={{
//                   borderRadius: "1.375rem",
//                 }}
//                 mode="single"
//                 selected={date}
//                 onSelect={handleDateSelect}
//                 disabled={(date) =>
//                   date < new Date() || date < new Date("1900-01-01")
//                 }
//                 initialFocus
//                 classNames={{
//                   day_selected: "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white focus:bg-[#50462D] !border-0",
//                   caption: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   nav_button_previous: "text-[#50462D]",
//                   nav_button_next: "text-[#50462D]",
//                   head_cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   table: "w-full border-collapse",
//                 }}
//               />
//             </PopoverContent>
//           </Popover>
//         </div>


//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label htmlFor="delivery-time" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Preferred delivery time*
//           </label>
//           <Select
//             onValueChange={handleTimeSelect}
//             value={formData.preferredDeliveryTime}
//           >
//             <SelectTrigger className="w-full md:w-[30rem] border-0 bg-transparent px-0 py-1 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300">
//               <SelectValue
//                 placeholder=""
//                 className="text-stone-500"
//               />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="10am-1pm">10:00 – 13:00</SelectItem>
//               <SelectItem value="1pm-4pm">13:00 – 16:00</SelectItem>
//               <SelectItem value="4pm-6pm">16:00 – 18:00</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//       <div className="pt-4 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
//           <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
//             Would you like shipping updates to be sent by text message or email?
//           </p>
//           <div className="flex flex-row gap-16 -ml-2 md:gap-18 justify-center md:w-[52%] w-full transition-all duration-150">
//             <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "text"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="text"
//                 checked={formData.shippingUpdateMethod === "text"}
//                 onChange={() => updateFormData({ shippingUpdateMethod: "text" })}
//                 className={`w-5 h-5 flex-shrink-0 border  md:mr-6 border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.shippingUpdateMethod === "text"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />
//             </label>


//             {/* email  */}
//             <label className="flex items-center gap-3 -mr-14 md:-mr-11 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "email"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Email
//               </span>

//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={() => updateFormData({ shippingUpdateMethod: "email" })}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.shippingUpdateMethod === "email"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />


//             </label>
//           </div>
//         </div>


//         {/* Existing SMS section */}
//         <div className="pt-1 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
//           <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
//             Would you like shipping updates via SMS?
//           </p>
//           <div className="flex flex-row gap-8 justify-center md:w-[52%] w-full transition-all duration-150">
//             <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-me"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Send to me
//               </span>


//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={() => handleSMSChange("send-to-me")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.smsUpdates === "send-to-me"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />


//             </label>
//             <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-recipient"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={() => handleSMSChange("send-to-recipient")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.smsUpdates === "send-to-recipient"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />
//             </label>


//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }














// "use client";

// import React from "react";
// import { format, isSameDay, startOfDay } from "date-fns";
// import { toZonedTime } from "date-fns-tz"; // v3
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { usePersonaliseStore } from "@/store/personaliseStore";

// const LONDON_TZ = "Europe/London";

// const TIME_SLOTS = [
//   { value: "10am-1pm", label: "10:00 – 13:00" },
//   { value: "1pm-4pm", label: "13:00 – 16:00" },
//   { value: "4pm-6pm", label: "16:00 – 18:00" },
// ] as const;

// export default function DeliveryDetailsStep() {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [date, setDate] = React.useState<Date>();

//   // keep local date state in sync if store already has a date
//   React.useEffect(() => {
//     if (formData.deliveryDate) {
//       setDate(new Date(formData.deliveryDate));
//     }
//   }, [formData.deliveryDate]);

//   const handleInputChange = (field: string, value: string) => {
//     updateFormData({ [field]: value });
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (!selectedDate) return;
//     setDate(selectedDate);
//     updateFormData({ deliveryDate: format(selectedDate, "yyyy-MM-dd") });

//     // If current preferred time is no longer valid for this date, clear it.
//     const allowed = getAvailableSlotValues(selectedDate);
//     if (formData.preferredDeliveryTime && !allowed.includes(formData.preferredDeliveryTime as any)) {
//       updateFormData({ preferredDeliveryTime: "" });
//     }
//   };

//   const handleTimeSelect = (time: string) => {
//     updateFormData({ preferredDeliveryTime: time });
//   };

//   const handleSMSChange = (value: "send-to-me" | "send-to-recipient") => {
//     updateFormData({ smsUpdates: value });
//   };

//   // ---------- Business Rules Helpers (UK-time aware) ----------

//   /** True if the given JS Date (local) falls on Sat/Sun in UK */
//   const isWeekendInUK = (d: Date) => {
//     const inUK = utcToZonedTime(d, LONDON_TZ);
//     const day = inUK.getDay(); // 0 Sun .. 6 Sat
//     return day === 0 || day === 6;
//   };

//   /** True if selected date is "today" in UK */
//   const isSelectedDayTodayInUK = (selected: Date) => {
//     const nowUK = utcToZonedTime(new Date(), LONDON_TZ);
//     const selUK = utcToZonedTime(selected, LONDON_TZ);
//     return isSameDay(nowUK, selUK);
//   };

//   /** Same-day allowed before 13:00 UK; after 13:00, same-day must be disabled */
//   const isSameDayAllowedByCutoff = () => {
//     const nowUK = utcToZonedTime(new Date(), LONDON_TZ);
//     const hour = nowUK.getHours();
//     const minutes = nowUK.getMinutes();
//     // allow if strictly before 13:00
//     return hour < 13 || (hour === 12 && minutes <= 59);
//   };

//   /** For same-day: slot availability depends on current UK time */
//   const getAvailableSlotValues = (selected: Date) => {
//     // Weekend: no slots at all
//     if (isWeekendInUK(selected)) return [] as string[];

//     // Future (not today in UK): all slots available
//     if (!isSelectedDayTodayInUK(selected)) {
//       return TIME_SLOTS.map(s => s.value);
//     }

//     // Today in UK:
//     if (!isSameDayAllowedByCutoff()) {
//       // Same-day not allowed after 13:00 UK
//       return [];
//     }

//     // Before 13:00 UK: we need to differentiate pre-9am vs 9am–12:59
//     const nowUK = utcToZonedTime(new Date(), LONDON_TZ);
//     const hour = nowUK.getHours();

//     if (hour < 9) {
//       // Pre 9am → all slots available
//       return TIME_SLOTS.map(s => s.value);
//     } else {
//       // 09:00–12:59 → only afternoon/evening
//       return ["1pm-4pm", "4pm-6pm"];
//     }
//   };

//   // Precompute allowed slots for current selected date
//   const allowedSlotValues = React.useMemo(
//     () => (date ? getAvailableSlotValues(date) : []),
//     [date]
//   );

//   // Calendar disabled rules:
//   // - Past dates
//   // - Weekends (in UK)
//   // - If today in UK and now >= 13:00, disable selecting today
//   const calendarDisabled = (d: Date) => {
//     // before today (at user's local) -> blocked
//     if (d < startOfDay(new Date())) return true;
//     // weekends in UK -> blocked
//     if (isWeekendInUK(d)) return true;
//     // same-day blocked after 13:00 UK
//     if (isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff()) return true;
//     return false;
//   };

//   // Display helper for the nice ordinal date label you had
//   const formatDateWithOrdinal = (d: any) => {
//     const dayName = format(d, "EEEE");
//     const day = format(d, "d");
//     const month = format(d, "MMMM");
//     const year = format(d, "yyyy");

//     const getOrdinalSuffix = (dd: any) => {
//       const n = parseInt(dd, 10);
//       if (n >= 11 && n <= 13) return "th";
//       switch (n % 10) {
//         case 1:
//           return "st";
//         case 2:
//           return "nd";
//         case 3:
//           return "rd";
//         default:
//           return "th";
//       }
//     };

//     return { dayName, day, ordinalSuffix: getOrdinalSuffix(day), month, year };
//   };

//   // A tiny helper to show a contextual hint for the time dropdown
//   const timeHint =
//     date && isSelectedDayTodayInUK(date)
//       ? !isSameDayAllowedByCutoff()
//         ? "Same-day closed after 13:00 UK"
//         : utcToZonedTime(new Date(), LONDON_TZ).getHours() < 9
//           ? "All slots available (pre 9am UK)"
//           : "Only afternoon/evening slots available (09:00–12:59 UK)"
//       : date && isWeekendInUK(date)
//         ? "Weekend delivery is unavailable"
//         : undefined;

//   return (
//     <div className="">
//       <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Please add your recipient's details, and your preferred delivery day and time, below.
//       </p>

//       <form className="space-y-4 font-[Marfa]">
//         {/* Recipient name */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Recipient&apos;s name*
//           </label>
//           <Input
//             id="recipient-name"
//             type="text"
//             value={formData.recipientName}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               handleInputChange("recipientName", e.target.value)
//             }
//             placeholder=""
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
//           />
//         </div>

//         {/* Address */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Recipient&apos;s Address*
//           </label>
//           <Input
//             id="address"
//             type="text"
//             value={formData.recipientAddress}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               handleInputChange("recipientAddress", e.target.value)
//             }
//             placeholder=""
//             className="border-0 border-b border-stone-500 bg-transparent px-0 py-0.5 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
//           />
//         </div>

//         {/* Preferred delivery date */}
//         <div className="flex flex-col mt-6 md:flex-row md:items-center md:justify-between">
//           <label htmlFor="delivery-date" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Preferred delivery date*
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full md:w-[30rem] justify-start mt-1 text-left font-[Marfa] border-0 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-[15px] tracking-[0.02em] font-[300] h-auto transition-all duration-300",
//                   !date && "text-stone-500"
//                 )}
//               >
//                 {date ? (
//                   <span className="flex items-baseline">
//                     {(() => {
//                       const { dayName, day, ordinalSuffix, month, year } = formatDateWithOrdinal(date);
//                       return (
//                         <>
//                           {dayName}, {day}
//                           <sup className="text-xs">{ordinalSuffix}</sup>&nbsp;{month} {year}
//                         </>
//                       );
//                     })()}
//                   </span>
//                 ) : (
//                   <span>Select a date</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 style={{ borderRadius: "1.375rem" }}
//                 mode="single"
//                 selected={date}
//                 onSelect={handleDateSelect}
//                 disabled={calendarDisabled}
//                 initialFocus
//                 classNames={{
//                   day_selected:
//                     "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white focus:bg-[#50462D] !border-0",
//                   day_disabled:
//                     "opacity-40 cursor-not-allowed line-through",
//                   caption: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   nav_button_previous: "text-[#50462D]",
//                   nav_button_next: "text-[#50462D]",
//                   head_cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   table: "w-full border-collapse",
//                 }}
//               />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Preferred delivery time */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label htmlFor="delivery-time" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
//             Preferred delivery time*
//           </label>
//           <div className="w-full md:w-[30rem]">
//             <Select
//               onValueChange={handleTimeSelect}
//               value={formData.preferredDeliveryTime || ""}
//               disabled={!date || allowedSlotValues.length === 0}
//             >
//               <SelectTrigger className="w-full border-0 bg-transparent px-0 py-1 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300">
//                 <SelectValue
//                   placeholder={
//                     !date
//                       ? "Select a date first"
//                       : allowedSlotValues.length === 0
//                         ? isWeekendInUK(date)
//                           ? "Weekend delivery unavailable"
//                           : isSelectedDayTodayInUK(date) && !isSameDayAllowedByCutoff()
//                             ? "Same-day closed after 13:00 UK"
//                             : "No slots available"
//                         : "Select a time slot"
//                   }
//                   className="text-stone-500"
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {TIME_SLOTS.map((slot) => (
//                   <SelectItem
//                     key={slot.value}
//                     value={slot.value}
//                     disabled={!allowedSlotValues.includes(slot.value)}
//                   >
//                     {slot.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {timeHint && (
//               <p className="mt-1 text-xs text-stone-500">{timeHint}</p>
//             )}
//           </div>
//         </div>

//         {/* Updates method */}
//         <div className="pt-4 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
//           <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
//             Would you like shipping updates to be sent by text message or email?
//           </p>
//           <div className="flex flex-row gap-16 -ml-2 md:gap-18 justify-center md:w-[52%] w-full transition-all duration-150">
//             <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "text" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="text"
//                 checked={formData.shippingUpdateMethod === "text"}
//                 onChange={() => updateFormData({ shippingUpdateMethod: "text" })}
//                 className={`w-5 h-5 flex-shrink-0 border  md:mr-6 border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "text"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>

//             <label className="flex items-center gap-3 -mr-14 md:-mr-11 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "email" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Email
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={() => updateFormData({ shippingUpdateMethod: "email" })}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "email"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>
//           </div>
//         </div>

//         {/* SMS updates */}
//         <div className="pt-1 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
//           <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
//             Would you like shipping updates via SMS?
//           </p>
//           <div className="flex flex-row gap-8 justify-center md:w-[52%] w-full transition-all duration-150">
//             <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-me" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Send to me
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={() => handleSMSChange("send-to-me")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-me"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>

//             <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
//               <span
//                 className={`font/[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-recipient" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={() => handleSMSChange("send-to-recipient")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-recipient"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }










// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// ======= =================================================Final======================================================================
// "use client";

// import React from "react";
// import { format, isSameDay, startOfDay } from "date-fns";
// import { toZonedTime } from "date-fns-tz";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { usePersonaliseStore } from "@/store/personaliseStore";

// const LONDON_TZ = "Europe/London";

// const TIME_SLOTS = [
//   { value: "10am-1pm", label: "10:00 – 13:00" },
//   { value: "1pm-4pm", label: "13:00 – 16:00" },
//   { value: "4pm-6pm", label: "16:00 – 18:00" },
// ] as const;

// type SlotValue = typeof TIME_SLOTS[number]["value"];

// export default function DeliveryDetailsStep() {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [date, setDate] = React.useState<Date>();

//   React.useEffect(() => {
//     if (formData.deliveryDate) {
//       setDate(new Date(formData.deliveryDate));
//     }
//   }, [formData.deliveryDate]);

//   const handleInputChange = (field: string, value: string) => {
//     updateFormData({ [field]: value });
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (!selectedDate) return;
//     setDate(selectedDate);
//     updateFormData({ deliveryDate: format(selectedDate, "yyyy-MM-dd") });

//     // Clear invalid time if switching dates makes it unavailable
//     const allowed = getAvailableSlotValues(selectedDate);
//     if (
//       formData.preferredDeliveryTime &&
//       !allowed.includes(formData.preferredDeliveryTime as SlotValue)
//     ) {
//       updateFormData({ preferredDeliveryTime: "" });
//     }
//   };

//   const handleTimeSelect = (time: string) => {
//     updateFormData({ preferredDeliveryTime: time });
//   };

//   const handleSMSChange = (value: "send-to-me" | "send-to-recipient") => {
//     updateFormData({ smsUpdates: value });
//   };

//   // ---------- UK-time aware helpers ----------

//   const nowUK = () => toZonedTime(new Date(), LONDON_TZ);

//   const isWeekendInUK = (d: Date) => {
//     const inUK = toZonedTime(d, LONDON_TZ);
//     const day = inUK.getDay(); // 0 Sun .. 6 Sat
//     return day === 0 || day === 6;
//   };

//   const isSelectedDayTodayInUK = (selected: Date) => {
//     const selUK = toZonedTime(selected, LONDON_TZ);
//     return isSameDay(nowUK(), selUK);
//   };

//   // same-day allowed strictly before 13:00 UK
//   const isSameDayAllowedByCutoff = () => {
//     const n = nowUK();
//     const h = n.getHours();
//     const m = n.getMinutes();
//     return h < 13 || (h === 12 && m <= 59);
//   };

//   // compare against UK midnight
//   const isBeforeTodayUK = (d: Date) => {
//     const n = nowUK();
//     const startOfTodayUK = startOfDay(n);
//     const dUK = toZonedTime(d, LONDON_TZ);
//     return dUK < startOfTodayUK;
//   };

//   const getAvailableSlotValues = (selected: Date): SlotValue[] => {
//     if (isWeekendInUK(selected)) return [];
//     if (!isSelectedDayTodayInUK(selected)) {
//       return TIME_SLOTS.map((s) => s.value);
//     }
//     // today in UK:
//     if (!isSameDayAllowedByCutoff()) return [];
//     const h = nowUK().getHours();
//     if (h < 9) {
//       // pre 9am → all slots
//       return TIME_SLOTS.map((s) => s.value);
//     }
//     // 09:00–12:59 → only afternoon/evening
//     return ["1pm-4pm", "4pm-6pm"];
//   };

//   const allowedSlotValues = React.useMemo(
//     () => (date ? getAvailableSlotValues(date) : []),
//     [date]
//   );

//   const calendarDisabled = (d: Date) => {
//     if (isBeforeTodayUK(d)) return true;
//     if (isWeekendInUK(d)) return true;
//     if (isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff()) return true;
//     return false;
//   };

//   const formatDateWithOrdinal = (d: Date) => {
//     const dayName = format(d, "EEEE");
//     const day = format(d, "d");
//     const month = format(d, "MMMM");
//     const year = format(d, "yyyy");
//     const getOrdinalSuffix = (dd: string) => {
//       const n = parseInt(dd, 10);
//       if (n >= 11 && n <= 13) return "th";
//       switch (n % 10) {
//         case 1:
//           return "st";
//         case 2:
//           return "nd";
//         case 3:
//           return "rd";
//         default:
//           return "th";
//       }
//     };
//     return { dayName, day, ordinalSuffix: getOrdinalSuffix(day), month, year };
//   };

//   const timeHint =
//     date && isSelectedDayTodayInUK(date)
//       ? !isSameDayAllowedByCutoff()
//         ? "Same-day closed after 13:00 UK"
//         : nowUK().getHours() < 9
//           ? "All slots available (pre 9am UK)"
//           : "Only afternoon/evening slots available (09:00–12:59 UK)"
//       : date && isWeekendInUK(date)
//         ? "Weekend delivery is unavailable"
//         : undefined;

//   return (
//     <div className="">
//       <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Please add your recipient&apos;s details, and your preferred delivery day and time, below.
//       </p>

//       <form className="space-y-4 font-[Marfa]">
//         {/* Recipient name */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label
//             htmlFor="recipient-name"
//             className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0"
//           >
//             Recipient&apos;s name*
//           </label>
//           <Input
//             id="recipient-name"
//             type="text"
//             value={formData.recipientName}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               handleInputChange("recipientName", e.target.value)
//             }
//             placeholder=""
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
//           />
//         </div>

//         {/* Address */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label
//             htmlFor="address"
//             className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0"
//           >
//             Recipient&apos;s Address*
//           </label>
//           <Input
//             id="address"
//             type="text"
//             value={formData.recipientAddress}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               handleInputChange("recipientAddress", e.target.value)
//             }
//             placeholder=""
//             className="border-0 border-b border-stone-500 bg-transparent px-0 py-0.5 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
//           />
//         </div>

//         {/* Preferred delivery date */}
//         <div className="flex flex-col mt-6 md:flex-row md:items-center md:justify-between">
//           <label
//             htmlFor="delivery-date"
//             className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0"
//           >
//             Preferred delivery date*
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full md:w-[30rem] justify-start mt-1 text-left font-[Marfa] border-0 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-[15px] tracking-[0.02em] font-[300] h-auto transition-all duration-300",
//                   !date && "text-stone-500"
//                 )}
//               >
//                 {date ? (
//                   <span className="flex items-baseline">
//                     {(() => {
//                       const { dayName, day, ordinalSuffix, month, year } =
//                         formatDateWithOrdinal(date);
//                       return (
//                         <>
//                           {dayName}, {day}
//                           <sup className="text-xs">{ordinalSuffix}</sup>&nbsp;
//                           {month} {year}
//                         </>
//                       );
//                     })()}
//                   </span>
//                 ) : (
//                   <span>Select a date</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 style={{ borderRadius: "1.375rem" }}
//                 mode="single"
//                 selected={date}
//                 onSelect={handleDateSelect}
//                 disabled={calendarDisabled}
//                 initialFocus
//                 classNames={{
//                   day_selected:
//                     "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white focus:bg-[#50462D] !border-0",
//                   day_disabled: "opacity-40 cursor-not-allowed line-through",
//                   caption:
//                     "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   nav_button_previous: "text-[#50462D]",
//                   nav_button_next: "text-[#50462D]",
//                   head_cell:
//                     "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                   table: "w-full border-collapse",
//                 }}
//               />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Preferred delivery time */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <label
//             htmlFor="delivery-time"
//             className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0"
//           >
//             Preferred delivery time*
//           </label>
//           <div className="w-full md:w-[30rem]">
//             <Select
//               onValueChange={handleTimeSelect}
//               value={formData.preferredDeliveryTime || ""}
//               disabled={!date || allowedSlotValues.length === 0}
//             >
//               <SelectTrigger className="w-full border-0 bg-transparent px-0 py-1 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300">
//                 <SelectValue
//                   placeholder={
//                     !date
//                       ? "Select a date first"
//                       : allowedSlotValues.length === 0
//                         ? isWeekendInUK(date)
//                           ? "Weekend delivery unavailable"
//                           : isSelectedDayTodayInUK(date) &&
//                             !isSameDayAllowedByCutoff()
//                             ? "Same-day closed after 13:00 UK"
//                             : "No slots available"
//                         : "Select a time slot"
//                   }
//                   className="text-stone-500"
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {TIME_SLOTS.map((slot) => (
//                   <SelectItem
//                     key={slot.value}
//                     value={slot.value}
//                     disabled={!allowedSlotValues.includes(slot.value)}
//                   >
//                     {slot.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {timeHint && (
//               <p className="mt-1 text-xs text-stone-500">{timeHint}</p>
//             )}
//           </div>
//         </div>

//         {/* Updates method */}
//         <div className="pt-4 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
//           <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
//             Would you like shipping updates to be sent by text message or email?
//           </p>
//           <div className="flex flex-row gap-16 -ml-2 md:gap-18 justify-center md:w-[52%] w-full transition-all duration-150">
//             <label className="flex items-center gap-3 cursor-pointer justify-center w/full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "text"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="text"
//                 checked={formData.shippingUpdateMethod === "text"}
//                 onChange={() =>
//                   updateFormData({ shippingUpdateMethod: "text" })
//                 }
//                 className={`w-5 h-5 flex-shrink-0 border  md:mr-6 border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "text"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>

//             <label className="flex items-center gap-3 -mr-14 md:-mr-11 cursor-pointer justify-center w/full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "email"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Email
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={() =>
//                   updateFormData({ shippingUpdateMethod: "email" })
//                 }
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "email"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>
//           </div>
//         </div>

//         {/* SMS updates */}
//         <div className="pt-1 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
//           <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
//             Would you like shipping updates via SMS?
//           </p>
//           <div className="flex flex-row gap-8 justify-center md:w-[52%] w-full transition-all duration-150">
//             <label className="flex items-center gap-3 cursor-pointer justify-center w/full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-me"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Send to me
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={() => handleSMSChange("send-to-me")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-me"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>

//             <label className="flex items-center gap-3 cursor-pointer justify-center w/full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-recipient"
//                     ? "text-[#50462D]"
//                     : "text-[#50462d]/50"
//                 } font-light tracking-[0.02em]`}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={() => handleSMSChange("send-to-recipient")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-recipient"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }
//                 `}
//               />
//             </label>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }








// "use client";

// import React from "react";
// import { format, isSameDay, startOfDay } from "date-fns";
// import { toZonedTime } from "date-fns-tz";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { usePersonaliseStore } from "@/store/personaliseStore";

// const LONDON_TZ = "Europe/London";

// const TIME_SLOTS = [
//   { value: "10am-1pm", label: "10:00 – 13:00" },
//   { value: "1pm-4pm", label: "13:00 – 16:00" },
//   { value: "4pm-6pm", label: "16:00 – 18:00" },
// ] as const;

// type SlotValue = typeof TIME_SLOTS[number]["value"];

// export default function DeliveryDetailsStep() {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [date, setDate] = React.useState<Date>();

//   React.useEffect(() => {
//     if (formData.deliveryDate) {
//       setDate(new Date(formData.deliveryDate));
//     }
//   }, [formData.deliveryDate]);

//   const handleInputChange = (field: string, value: string) => {
//     updateFormData({ [field]: value });
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (!selectedDate) return;
//     setDate(selectedDate);
//     updateFormData({ deliveryDate: format(selectedDate, "yyyy-MM-dd") });

//     const allowed = getAvailableSlotValues(selectedDate);
//     if (
//       formData.preferredDeliveryTime &&
//       !allowed.includes(formData.preferredDeliveryTime as SlotValue)
//     ) {
//       updateFormData({ preferredDeliveryTime: "" });
//     }
//   };

//   const handleTimeSelect = (time: string) => {
//     updateFormData({ preferredDeliveryTime: time });
//   };

//   const handleSMSChange = (value: "send-to-me" | "send-to-recipient") => {
//     updateFormData({ smsUpdates: value });
//   };

//   // ---------- UK-time aware helpers ----------
//   const nowUK = () => toZonedTime(new Date(), LONDON_TZ);

//   const isWeekendInUK = (d: Date) => {
//     const inUK = toZonedTime(d, LONDON_TZ);
//     const day = inUK.getDay(); // 0 Sun .. 6 Sat
//     return day === 0 || day === 6;
//   };

//   const isSelectedDayTodayInUK = (selected: Date) => {
//     const selUK = toZonedTime(selected, LONDON_TZ);
//     return isSameDay(nowUK(), selUK);
//   };

//   // same-day allowed strictly before 13:00 UK
//   const isSameDayAllowedByCutoff = () => {
//     const n = nowUK();
//     const h = n.getHours();
//     const m = n.getMinutes();
//     return h < 13 || (h === 12 && m <= 59);
//   };

//   // compare against UK midnight
//   const isBeforeTodayUK = (d: Date) => {
//     const n = nowUK();
//     const startOfTodayUK = startOfDay(n);
//     const dUK = toZonedTime(d, LONDON_TZ);
//     return dUK < startOfTodayUK;
//   };

//   const getAvailableSlotValues = (selected: Date): SlotValue[] => {
//     if (isWeekendInUK(selected)) return [];
//     if (!isSelectedDayTodayInUK(selected)) {
//       return TIME_SLOTS.map((s) => s.value);
//     }
//     // today in UK:
//     if (!isSameDayAllowedByCutoff()) return [];
//     const h = nowUK().getHours();
//     if (h < 9) {
//       // pre 9am → all slots
//       return TIME_SLOTS.map((s) => s.value);
//     }
//     // 09:00–12:59 → only afternoon/evening
//     return ["1pm-4pm", "4pm-6pm"];
//   };

//   const allowedSlotValues = React.useMemo(
//     () => (date ? getAvailableSlotValues(date) : []),
//     [date]
//   );

//   const calendarDisabled = (d: Date) => {
//     if (isBeforeTodayUK(d)) return true;
//     if (isWeekendInUK(d)) return true;
//     if (isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff()) return true;
//     return false;
//   };

//   const formatDateWithOrdinal = (d: Date) => {
//     const dayName = format(d, "EEEE");
//     const day = format(d, "d");
//     const month = format(d, "MMMM");
//     const year = format(d, "yyyy");
//     const getOrdinalSuffix = (dd: string) => {
//       const n = parseInt(dd, 10);
//       if (n >= 11 && n <= 13) return "th";
//       switch (n % 10) {
//         case 1:
//           return "st";
//         case 2:
//           return "nd";
//         case 3:
//           return "rd";
//         default:
//           return "th";
//       }
//     };
//     return { dayName, day, ordinalSuffix: getOrdinalSuffix(day), month, year };
//   };

//   const timeHint =
//     date && isSelectedDayTodayInUK(date)
//       ? !isSameDayAllowedByCutoff()
//         ? "Same-day closed after 13:00 UK"
//         : nowUK().getHours() < 9
//           ? "All slots available (pre 9am UK)"
//           : "Only afternoon/evening slots available (09:00–12:59 UK)"
//       : date && isWeekendInUK(date)
//         ? "Weekend delivery is unavailable"
//         : undefined;

//   return (
//     <div>
//       <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground mb-6 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
//         Please add your recipient&apos;s details, and your preferred delivery day and time, below.
//       </p>

//       {/* GRID LAYOUT */}
//       <form className="space-y-4 font-[Marfa] transition-all duration-300">
//         {/* Recipient name */}
//         <div className="hidden md:grid md:grid-cols-[320px_1fr] gap-6 items-center">
//           <label
//             htmlFor="recipient-name"
//             className="text-stone-700 text-[0.9375rem] font-[300] self-center"
//           >
//             Recipient&apos;s name*
//           </label>
//           <div className="flex flex-col">
//             <Input
//               id="recipient-name"
//               type="text"
//               value={formData.recipientName}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 handleInputChange("recipientName", e.target.value)
//               }
//               placeholder=""
//               className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-[32rem] transition-all duration-300"
//             />
//           </div>

//           {/* Address */}
//           <label
//             htmlFor="address"
//             className="text-stone-700 text-[0.9375rem] font-[300] self-center"
//           >
//             Recipient&apos;s Address*
//           </label>
//           <div className="flex flex-col">
//             <Input
//               id="address"
//               type="text"
//               value={formData.recipientAddress}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 handleInputChange("recipientAddress", e.target.value)
//               }
//               placeholder=""
//               className="border-0 border-b border-stone-500 bg-transparent px-0 py-2 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] transition-all duration-300 w-full"
//             />
//           </div>

//           {/* Preferred delivery date */}
//           <label
//             htmlFor="delivery-date"
//             className="text-stone-700 text-[0.9375rem] font-[300] self-center"
//           >
//             Preferred delivery date*
//           </label>
//           <div>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className={cn(
//                     "w-full md:w-[50rem] justify-start text-left font-[Marfa] border-0 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-[15px] tracking-[0.02em] font-[300] h-auto transition-all duration-300",
//                     !date && "text-stone-500"
//                   )}
//                 >
//                   {date ? (
//                     <span className="flex items-baseline">
//                       {(() => {
//                         const { dayName, day, ordinalSuffix, month, year } =
//                           formatDateWithOrdinal(date);
//                         return (
//                           <>
//                             {dayName}, {day}
//                             <sup className="text-xs">{ordinalSuffix}</sup>&nbsp;
//                             {month} {year}
//                           </>
//                         );
//                       })()}
//                     </span>
//                   ) : (
//                     <span>Select a date</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   style={{ borderRadius: "1.375rem" }}
//                   mode="single"
//                   selected={date}
//                   onSelect={handleDateSelect}
//                   disabled={calendarDisabled}
//                   initialFocus
//                   classNames={{
//                     day_selected:
//                       "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white focus:bg-[#50462D] !border-0",
//                     day_disabled: "opacity-40 cursor-not-allowed line-through",
//                     caption:
//                       "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                     nav_button_previous: "text-[#50462D]",
//                     nav_button_next: "text-[#50462D]",
//                     head_cell:
//                       "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                     cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
//                     table: "w-full border-collapse",
//                   }}
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {/* Preferred delivery time */}
//           <label
//             htmlFor="delivery-time"
//             className="text-stone-700 text-[0.9375rem] font-[300] self-center"
//           >
//             Preferred delivery time*
//           </label>
//           <div className="w-full md:w-[50rem]">
//             <Select
//               onValueChange={handleTimeSelect}
//               value={formData.preferredDeliveryTime || ""}
//               disabled={!date || allowedSlotValues.length === 0}
//             >
//               <SelectTrigger className="w-full border-0 bg-transparent px-0 py-1 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300">
//                 <SelectValue
//                   placeholder={
//                     !date
//                       ? "Select a date first"
//                       : allowedSlotValues.length === 0
//                         ? isWeekendInUK(date)
//                           ? "Weekend delivery unavailable"
//                           : isSelectedDayTodayInUK(date) &&
//                             !isSameDayAllowedByCutoff()
//                             ? "Same-day closed after 13:00 UK"
//                             : "No slots available"
//                         : "Select a time slot"
//                   }
//                   className="text-stone-500"
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {TIME_SLOTS.map((slot) => (
//                   <SelectItem
//                     key={slot.value}
//                     value={slot.value}
//                     disabled={!allowedSlotValues.includes(slot.value)}
//                   >
//                     {slot.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {timeHint && (
//               <p className="mt-1 text-xs text-stone-500">{timeHint}</p>
//             )}
//           </div>

//           {/* Updates method */}
//           <p className="text-stone-700 text-[0.9375rem] font-[300] self-center">
//             Shipping updates via
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <label className="flex items-center justify-between gap-3 cursor-pointer w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.shippingUpdateMethod === "text"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="text"
//                 checked={formData.shippingUpdateMethod === "text"}
//                 onChange={() => updateFormData({ shippingUpdateMethod: "text" })}
//                 className={`w-5 h-5 border border-stone-300 appearance-none rounded-full cursor-pointer
//         ${formData.shippingUpdateMethod === "text"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/20"
//                   }
//       `}
//               />
//             </label>

//             <label className="flex items-center justify-between gap-3 cursor-pointer w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.shippingUpdateMethod === "email"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//               >
//                 Email
//               </span>
//               <input
//                 type="radio"
//                 name="shipping-update-method"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={() => updateFormData({ shippingUpdateMethod: "email" })}
//                 className={`w-5 h-5 border border-stone-300 appearance-none rounded-full cursor-pointer
//         ${formData.shippingUpdateMethod === "email"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/20"
//                   }
//       `}
//               />
//             </label>
//           </div>

//           {/* SMS updates */}
//           <p className="text-stone-700 text-[0.9375rem] font-[300] self-center">
//             Would you like shipping updates via SMS?
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <label className="flex items-center justify-between gap-3 cursor-pointer w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-me"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//               >
//                 Send to me
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={() => handleSMSChange("send-to-me")}
//                 className={`w-5 h-5 border border-stone-300 appearance-none rounded-full cursor-pointer
//         ${formData.smsUpdates === "send-to-me"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/20"
//                   }
//       `}
//               />
//             </label>

//             <label className="flex items-center justify-between gap-3 cursor-pointer w-full">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-recipient"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="sms-updates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={() => handleSMSChange("send-to-recipient")}
//                 className={`w-5 h-5 border border-stone-300 appearance-none rounded-full cursor-pointer
//         ${formData.smsUpdates === "send-to-recipient"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/20"
//                   }
//       `}
//               />
//             </label>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }


"use client";

import React from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePersonaliseStore } from "@/store/personaliseStore";

const LONDON_TZ = "Europe/London";

const TIME_SLOTS = [
  { value: "10am-1pm", label: "10:00 - 13:00" },
  { value: "1pm-4pm", label: "13:00 - 16:00" },
  { value: "4pm-6pm", label: "16:00 - 18:00" },
] as const;

type SlotValue = typeof TIME_SLOTS[number]["value"];

export default function DeliveryDetailsStep() {
  const { formData, updateFormData } = usePersonaliseStore();
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    if (formData.deliveryDate) {
      setDate(new Date(formData.deliveryDate));
    }
  }, [formData.deliveryDate]);

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    updateFormData({ deliveryDate: format(selectedDate, "yyyy-MM-dd") });

    const allowed = getAvailableSlotValues(selectedDate);
    if (
      formData.preferredDeliveryTime &&
      !allowed.includes(formData.preferredDeliveryTime as SlotValue)
    ) {
      updateFormData({ preferredDeliveryTime: "" });
    }
  };

  const handleTimeSelect = (time: string) => {
    updateFormData({ preferredDeliveryTime: time });
  };

  const handleSMSChange = (value: "send-to-me" | "send-to-recipient") => {
    updateFormData({ smsUpdates: value });
  };

  // ---------- UK-time aware helpers ----------
  const nowUK = () => toZonedTime(new Date(), LONDON_TZ);
  const isWeekendInUK = (d: Date) => {
    const inUK = toZonedTime(d, LONDON_TZ);
    const day = inUK.getDay();
    return day === 0 || day === 6;
  };
  const isSelectedDayTodayInUK = (selected: Date) =>
    isSameDay(nowUK(), toZonedTime(selected, LONDON_TZ));
  const isSameDayAllowedByCutoff = () => {
    const n = nowUK();
    return n.getHours() < 13 || (n.getHours() === 12 && n.getMinutes() <= 59);
  };
  const isBeforeTodayUK = (d: Date) =>
    toZonedTime(d, LONDON_TZ) < startOfDay(nowUK());

  const getAvailableSlotValues = (selected: Date): SlotValue[] => {
    if (isWeekendInUK(selected)) return [];
    if (!isSelectedDayTodayInUK(selected)) return TIME_SLOTS.map((s) => s.value);
    if (!isSameDayAllowedByCutoff()) return [];
    return nowUK().getHours() < 9 ? TIME_SLOTS.map((s) => s.value) : ["1pm-4pm", "4pm-6pm"];
  };

  const allowedSlotValues = React.useMemo(
    () => (date ? getAvailableSlotValues(date) : []),
    [date]
  );

  const calendarDisabled = (d: Date) =>
    isBeforeTodayUK(d) ||
    isWeekendInUK(d) ||
    (isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff());

  const formatDateWithOrdinal = (d: Date) => {
    const dayName = format(d, "EEEE");
    const day = format(d, "d");
    const month = format(d, "MMMM");
    const year = format(d, "yyyy");
    const getSuffix = (n: number) =>
      n >= 11 && n <= 13
        ? "th"
        : ["th", "st", "nd", "rd"][n % 10] || "th";
    return { dayName, day, month, year, suffix: getSuffix(parseInt(day, 10)) };
  };

  const timeHint =
    date && isSelectedDayTodayInUK(date)
      ? !isSameDayAllowedByCutoff()
        ? "Same-day closed after 13:00 UK"
        : nowUK().getHours() < 9
          ? "All slots available (pre 9am UK)"
          : "Only afternoon/evening slots available"
      : date && isWeekendInUK(date)
        ? "Weekend delivery unavailable"
        : undefined;


  const handleSMSTextOrEmailChange = (value: "text-message" | "email") => {
    updateFormData({ shippingUpdateMethod: value });
  };

  return (
    <div>
      <p className="text-secondary-foreground font-century text-[1rem] leading-[1.4]">
        Our gifts are sent by zero-emission, nominated-day delivery.
      </p>
      <p className="text-secondary-foreground font-century text-[1rem] leading-[1.4] mb-8">
        Please add your recipient&apos;s details, and your preferred delivery day and time, below.
      </p>

      <form className="font-[Marfa] space-y-6">
        <div className="grid gap-8 md:grid-cols-[320px_1fr]">
          {/* Recipient name */}
          <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300]">
            Recipient&apos;s name*
          </label>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Address */}
          <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300]">
            Recipient&apos;s Address*
          </label>
          <Input
            id="address"
            type="text"
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Delivery date */}
          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Preferred delivery date*
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent rounded-none shadow-none text-[15px] font-[300]",
                  !date && "text-stone-500"
                )}
              >
                {date ? (
                  <span className="flex items-baseline">
                    {(() => {
                      const { dayName, day, suffix, month, year } = formatDateWithOrdinal(date);
                      return (
                        <>
                          {dayName}, {day}
                          <sup className="text-xs">{suffix}</sup>&nbsp;
                          {month} {year}
                        </>
                      );
                    })()}
                  </span>
                ) : (
                  <span>Select a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={calendarDisabled}
                initialFocus
                classNames={{
                  day_selected:
                    "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white",
                  day_disabled: "opacity-40 cursor-not-allowed line-through",
                  caption: "font-[Marfa] text-[15px] font-[300]",
                  head_cell: "font-[Marfa] text-[15px] font-[300]",
                  cell: "font-[Marfa] text-[15px] font-[300]",
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Delivery time */}
          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Preferred delivery time*
          </label>
          <div>
            <Select
              onValueChange={handleTimeSelect}
              value={formData.preferredDeliveryTime || ""}
              disabled={!date || allowedSlotValues.length === 0}
            >
              <SelectTrigger className="w-full border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 rounded-none shadow-none text-sm h-auto">
                <SelectValue
                  placeholder={
                    !date
                      ? "Select a date first"
                      : allowedSlotValues.length === 0
                        ? timeHint || "No slots available"
                        : "Select a time slot"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem
                    key={slot.value}
                    value={slot.value}
                    disabled={!allowedSlotValues.includes(slot.value)}
                  >
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {timeHint && <p className="mt-1 text-xs text-stone-500">{timeHint}</p>}
          </div>
          

          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Who would you like to receive shipping updates?
          </label>
          <div className="flex gap-16 justify-end mr-4 w-[95%]">
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-me"
                  ? "text-[#50462D]"
                  : "text-[#50462d]/50"
                  }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Send to me
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                onChange={(e) => handleSMSChange(e.target.value as 'send-to-me')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-me"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-recipient"
                  ? "text-[#50462D]"
                  : "text-[#50462d]/50"
                  }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Send to recipient
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                onChange={(e) => handleSMSChange(e.target.value as 'send-to-recipient')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-recipient"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
          </div>

          
          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Would you like shipping updates to be sent by text message or email?
          </label>
          <div className="flex gap-37 justify-end mr-4 w-[95%]">
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.shippingUpdateMethod === "text-message"
                  ? "text-[#50462D]"
                  : "text-[#50462d]/50"
                  }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Text Message
              </span>
              <input
                type="radio"
                name="smsTextOrEmail"
                value="text-message"
                checked={formData.shippingUpdateMethod === "text-message"}
                onChange={(e) => handleSMSTextOrEmailChange(e.target.value as 'text-message')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.shippingUpdateMethod === "text-message"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.shippingUpdateMethod === "email"
                  ? "text-[#50462D]"
                  : "text-[#50462d]/50"
                  }`}
                style={{
                  fontWeight: 300,
                  fontStyle: "light",
                  letterSpacing: "2%",
                }}
              >
                Email
              </span>
              <input
                type="radio"
                name="smsTextOrEmail"
                value="email"
                checked={formData.shippingUpdateMethod === "email"}
                onChange={(e) => handleSMSTextOrEmailChange(e.target.value as 'email')}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.shippingUpdateMethod === "email"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
