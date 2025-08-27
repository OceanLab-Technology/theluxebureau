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
//   { value: "10am-1pm", label: "10:00 - 13:00" },
//   { value: "1pm-4pm", label: "13:00 - 16:00" },
//   { value: "4pm-6pm", label: "16:00 - 18:00" },
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
//     const day = inUK.getDay();
//     return day === 0 || day === 6;
//   };
//   const isSelectedDayTodayInUK = (selected: Date) =>
//     isSameDay(nowUK(), toZonedTime(selected, LONDON_TZ));
//   const isSameDayAllowedByCutoff = () => {
//     const n = nowUK();
//     return n.getHours() < 13 || (n.getHours() === 12 && n.getMinutes() <= 59);
//   };
//   const isBeforeTodayUK = (d: Date) =>
//     toZonedTime(d, LONDON_TZ) < startOfDay(nowUK());

//   const getAvailableSlotValues = (selected: Date): SlotValue[] => {
//     if (isWeekendInUK(selected)) return [];
//     if (!isSelectedDayTodayInUK(selected)) return TIME_SLOTS.map((s) => s.value);
//     if (!isSameDayAllowedByCutoff()) return [];
//     return nowUK().getHours() < 9 ? TIME_SLOTS.map((s) => s.value) : ["1pm-4pm", "4pm-6pm"];
//   };

//   const allowedSlotValues = React.useMemo(
//     () => (date ? getAvailableSlotValues(date) : []),
//     [date]
//   );

//   const calendarDisabled = (d: Date) =>
//     isBeforeTodayUK(d) ||
//     isWeekendInUK(d) ||
//     (isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff());

//   const formatDateWithOrdinal = (d: Date) => {
//     const dayName = format(d, "EEEE");
//     const day = format(d, "d");
//     const month = format(d, "MMMM");
//     const year = format(d, "yyyy");
//     const getSuffix = (n: number) =>
//       n >= 11 && n <= 13
//         ? "th"
//         : ["th", "st", "nd", "rd"][n % 10] || "th";
//     return { dayName, day, month, year, suffix: getSuffix(parseInt(day, 10)) };
//   };

//   const timeHint =
//     date && isSelectedDayTodayInUK(date)
//       ? !isSameDayAllowedByCutoff()
//         ? "Same-day closed after 13:00 UK"
//         : nowUK().getHours() < 9
//           ? "All slots available (pre 9am UK)"
//           : "Only afternoon/evening slots available"
//       : date && isWeekendInUK(date)
//         ? "Weekend delivery unavailable"
//         : undefined;

//   const handleSMSTextOrEmailChange = (value: "text-message" | "email") => {
//     updateFormData({ shippingUpdateMethod: value });
//   };

//   return (
//     <div>
//       <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4]">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4] mb-8">
//         Please add your recipient&apos;s details, and your preferred delivery day and time, below.
//       </p>

//       <form className="font-[Marfa] space-y-6">
//         <div className="grid gap-8 md:grid-cols-[320px_1fr]">
//           {/* Recipient name */}
//           <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300]">
//             Recipient&apos;s name*
//           </label>
//           <Input
//             id="recipient-name"
//             type="text"
//             value={formData.recipientName}
//             onChange={(e) => handleInputChange("recipientName", e.target.value)}
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//           />

//           {/* Address */}
//           <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300]">
//             Recipient&apos;s Address*
//           </label>
//           <Input
//             id="address"
//             type="text"
//             value={formData.recipientAddress}
//             onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none focus:ring-0 focus:border-b focus:border-stone-500 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//           />

//           {/* Delivery date */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Preferred delivery date*
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full justify-start text-left border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent rounded-none shadow-none text-[15px] font-[300] font-[Marfa]",
//                   !date && "text-stone-500"
//                 )}
//               >
//                 {date ? (
//                   <span className="flex items-baseline">
//                     {(() => {
//                       const { dayName, day, suffix, month, year } = formatDateWithOrdinal(date);
//                       return (
//                         <>
//                           {dayName}, {day}
//                           <sup className="text-xs">{suffix}</sup>&nbsp;
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
//             <PopoverContent className="w-auto p-0 font-[Marfa]" align="start">
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={handleDateSelect}
//                 disabled={calendarDisabled}
//                 initialFocus
//                 classNames={{
//                   day_selected:
//                     "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white font-[Marfa]",
//                   day_disabled: "opacity-40 cursor-not-allowed line-through",
//                   caption: "font-[Marfa] text-[15px] font-[300]",
//                   head_cell: "font-[Marfa] text-[15px] font-[300]",
//                   cell: "font-[Marfa] text-[15px] font-[300]",
//                 }}
//               />
//             </PopoverContent>
//           </Popover>

//           {/* Delivery time */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Preferred delivery time*
//           </label>
//           <div>
//             <Select
//               onValueChange={handleTimeSelect}
//               value={formData.preferredDeliveryTime || ""}
//               disabled={!date || allowedSlotValues.length === 0}
//             >
//               <SelectTrigger className="w-full border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 rounded-none shadow-none text-sm h-auto">
//                 <SelectValue
//                   placeholder={
//                     !date
//                       ? "Select a date first"
//                       : allowedSlotValues.length === 0
//                         ? timeHint || "No slots available"
//                         : "Select a time slot"
//                   }
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
//             {timeHint && <p className="mt-1 text-xs text-stone-500">{timeHint}</p>}
//           </div>

//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Who would you like to receive shipping updates?
//           </label>
//           <div className="flex gap-16 justify-end mr-4 w-[95%]">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-me"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//                 style={{
//                   fontWeight: 300,
//                   fontStyle: "light",
//                   letterSpacing: "2%",
//                 }}
//               >
//                 Send to me
//               </span>
//               <input
//                 type="radio"
//                 name="smsUpdates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={(e) => handleSMSChange(e.target.value as 'send-to-me')}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.smsUpdates === "send-to-me"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.smsUpdates === "send-to-recipient"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//                 style={{
//                   fontWeight: 300,
//                   fontStyle: "light",
//                   letterSpacing: "2%",
//                 }}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="smsUpdates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={(e) => handleSMSChange(e.target.value as 'send-to-recipient')}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.smsUpdates === "send-to-recipient"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />
//             </label>
//           </div>

//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Would you like shipping updates to be sent by text message or email?
//           </label>
//           <div className="flex gap-37 justify-end mr-4 w-[95%]">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.shippingUpdateMethod === "text-message"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//                 style={{
//                   fontWeight: 300,
//                   fontStyle: "light",
//                   letterSpacing: "2%",
//                 }}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="smsTextOrEmail"
//                 value="text-message"
//                 checked={formData.shippingUpdateMethod === "text-message"}
//                 onChange={(e) => handleSMSTextOrEmailChange(e.target.value as 'text-message')}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.shippingUpdateMethod === "text-message"
//                     ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                     : "bg-[#50462d]/50"}
//                 `}
//               />
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${formData.shippingUpdateMethod === "email"
//                   ? "text-[#50462D]"
//                   : "text-[#50462d]/50"
//                   }`}
//                 style={{
//                   fontWeight: 300,
//                   fontStyle: "light",
//                   letterSpacing: "2%",
//                 }}
//               >
//                 Email
//               </span>
//               <input
//                 type="radio"
//                 name="smsTextOrEmail"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={(e) => handleSMSTextOrEmailChange(e.target.value as 'email')}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${formData.shippingUpdateMethod === "email"
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
// import { format, isSameDay, startOfDay, addDays } from "date-fns";
// import { toZonedTime} from "date-fns-tz";
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
//   { value: "10am-1pm", label: "10:00 - 13:00" },
//   { value: "1pm-4pm", label: "13:00 - 16:00" },
//   { value: "4pm-6pm", label: "16:00 - 18:00" },
// ] as const;

// type SlotValue = typeof TIME_SLOTS[number]["value"];

// interface DeliveryDetailsStepProps {
//   /** Set true when the product category is Floral */
//   isFloral?: boolean;
// }

// export default function DeliveryDetailsStep({ isFloral = false }: DeliveryDetailsStepProps) {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [date, setDate] = React.useState<Date>();
//   const [nowTick, setNowTick] = React.useState(0); // triggers recompute each minute

//   // ---------- UK-time aware helpers ----------
//   const nowUK = () => toZonedTime(new Date(), LONDON_TZ);

//   const isWeekendInUK = (d: Date) => {
//     const inUK = toZonedTime(d, LONDON_TZ);
//     const day = inUK.getDay();
//     return day === 0 || day === 6; // Sun(0) / Sat(6)
//   };

//   const isSelectedDayTodayInUK = (selected: Date) =>
//     isSameDay(nowUK(), toZonedTime(selected, LONDON_TZ));

//   // Start-of-today in London as an instant (timezone-safe)
// const isBeforeTodayUK = (d: Date) => {
//   const ukNow = nowUK();
//   const startOfTodayUK = startOfDay(ukNow);
//   const candidateUK = toZonedTime(d, LONDON_TZ);
//   return candidateUK < startOfTodayUK;
// };

//   // Same-day allowed strictly before 13:00 UK
//   const isSameDayAllowedByCutoff = () => nowUK().getHours() < 13;

//   // Find the next eligible delivery day (skips weekends). For Floral, must be at least tomorrow.
//   const nextEligibleWeekdayUK = (start: Date) => {
//     let cursor = start;
//     while (isWeekendInUK(cursor)) {
//       cursor = addDays(cursor, 1);
//     }
//     return cursor;
//   };

//   // For Floral, compute the earliest selectable date (tomorrow/next weekday).
//   const earliestFloralDateUK = () => {
//     const todayUK = toZonedTime(new Date(), LONDON_TZ);
//     const tomorrowUK = addDays(todayUK, 1);
//     return nextEligibleWeekdayUK(tomorrowUK);
//   };

//   // ---------- Effects ----------
//   // Sync local date from store
//   React.useEffect(() => {
//     if (formData.deliveryDate) {
//       setDate(new Date(formData.deliveryDate));
//     }
//   }, [formData.deliveryDate]);

//   // Minute tick so slots/calendar react to 09:00 / 13:00 crossings
//   React.useEffect(() => {
//     const id = setInterval(() => setNowTick((t) => t + 1), 60_000);
//     return () => clearInterval(id);
//   }, []);

//   // If Floral and selected date is “today UK”, auto-bump to the earliest floral date
//   React.useEffect(() => {
//     if (!isFloral) return;
//     if (!date) return;
//     if (isSelectedDayTodayInUK(date)) {
//       const bumped = earliestFloralDateUK();
//       setDate(bumped);
//       updateFormData({ deliveryDate: format(bumped, "yyyy-MM-dd") });
//       // Clear any selected slot; user should re-pick for the bumped day
//       if (formData.preferredDeliveryTime) {
//         updateFormData({ preferredDeliveryTime: "" });
//       }
//     }
//   }, [isFloral, date]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ---------- Slot logic ----------
//   const getAvailableSlotValues = (selected: Date): SlotValue[] => {
//     // Floral: no same-day at all
//     if (isFloral && isSelectedDayTodayInUK(selected)) return [];
//     if (isWeekendInUK(selected)) return [];

//     // If not today, all slots are fine.
//     if (!isSelectedDayTodayInUK(selected)) return TIME_SLOTS.map((s) => s.value);

//     // Today:
//     if (!isSameDayAllowedByCutoff()) return []; // 13:00+ → no same-day
//     // Before 09:00 → all, else only afternoon/evening
//     return nowUK().getHours() < 9 ? TIME_SLOTS.map((s) => s.value) : ["1pm-4pm", "4pm-6pm"];
//   };

//   const allowedSlotValues = React.useMemo(
//     () => (date ? getAvailableSlotValues(date) : []),
//     [date, nowTick, isFloral]
//   );

//   // If selected slot becomes invalid as time passes, clear it
//   React.useEffect(() => {
//     if (!date) return;
//     const allowed = getAvailableSlotValues(date);
//     if (
//       formData.preferredDeliveryTime &&
//       !allowed.includes(formData.preferredDeliveryTime as SlotValue)
//     ) {
//       updateFormData({ preferredDeliveryTime: "" });
//     }
//   }, [date, nowTick, formData.preferredDeliveryTime]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ---------- Handlers ----------
//   const handleInputChange = (field: string, value: string) => {
//     updateFormData({ [field]: value });
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (!selectedDate) return;

//     // If Floral and user tried to pick today, bump to earliest floral date
//     let finalDate = selectedDate;
//     if (isFloral && isSelectedDayTodayInUK(selectedDate)) {
//       finalDate = earliestFloralDateUK();
//     }

//     setDate(finalDate);
//     updateFormData({ deliveryDate: format(finalDate, "yyyy-MM-dd") });

//     const allowed = getAvailableSlotValues(finalDate);
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

//   const handleSMSTextOrEmailChange = (value: "text-message" | "email") => {
//     updateFormData({ shippingUpdateMethod: value });
//   };

//   // ---------- Calendar disabling ----------
//   const calendarDisabled = (d: Date) => {
//     // Past
//     if (isBeforeTodayUK(d)) return true;
//     // Weekends
//     if (isWeekendInUK(d)) return true;
//     // Floral: block today entirely
//     if (isFloral && isSelectedDayTodayInUK(d)) return true;
//     // Non-floral: block today after cutoff
//     if (!isFloral && isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff()) return true;
//     return false;
//   };

//   // ---------- UI helpers ----------
//   const formatDateWithOrdinal = (d: Date) => {
//     const dayName = format(d, "EEEE");
//     const day = format(d, "d");
//     const month = format(d, "MMMM");
//     const year = format(d, "yyyy");
//     const getSuffix = (n: number) =>
//       n >= 11 && n <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] || "th");
//     return { dayName, day, month, year, suffix: getSuffix(parseInt(day, 10)) };
//   };

//   const timeHint =
//     date && isSelectedDayTodayInUK(date)
//       ? isFloral
//         ? "Flowers are next-day only"
//         : !isSameDayAllowedByCutoff()
//           ? "Same-day closed after 13:00 UK"
//           : nowUK().getHours() < 9
//             ? "All slots available (pre 09:00 UK)"
//             : "Only afternoon/evening slots available"
//       : date && isWeekendInUK(date)
//         ? "Weekend delivery unavailable"
//         : isFloral && !date
//           ? "Flowers are next-day only"
//           : undefined;

//   return (
//     <div>
//       <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4]">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4] mb-8">
//         Please add your recipient&apos;s details, and your preferred delivery day and time, below.
//       </p>

//       <form className="font-[Marfa] space-y-6">
//         <div className="grid gap-8 md:grid-cols-[320px_1fr]">
//           {/* Recipient name */}
//           <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300]">
//             Recipient&apos;s name*
//           </label>
//           <Input
//             id="recipient-name"
//             type="text"
//             value={formData.recipientName}
//             onChange={(e) => handleInputChange("recipientName", e.target.value)}
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none"
//           />

//           {/* Address */}
//           <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300]">
//             Recipient&apos;s Address*
//           </label>
//           <Input
//             id="address"
//             type="text"
//             value={formData.recipientAddress}
//             onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none"
//           />

//           {/* Delivery date */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Preferred delivery date*
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full justify-start text-left border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent rounded-none shadow-none text-[15px] font-[300] font-[Marfa]",
//                   !date && "text-stone-500"
//                 )}
//               >
//                 {date ? (
//                   <span className="flex items-baseline">
//                     {(() => {
//                       const { dayName, day, suffix, month, year } = formatDateWithOrdinal(date);
//                       return (
//                         <>
//                           {dayName}, {day}
//                           <sup className="text-xs">{suffix}</sup>&nbsp;
//                           {month} {year}
//                         </>
//                       );
//                     })()}
//                   </span>
//                 ) : (
//                   <span>{isFloral ? "Select next eligible day" : "Select a date"}</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0 font-[Marfa]" align="start">
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={handleDateSelect}
//                 disabled={calendarDisabled}
//                 initialFocus
//                 classNames={{
//                   day_selected:
//                     "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white font-[Marfa]",
//                   day_disabled: "opacity-40 cursor-not-allowed line-through",
//                   caption: "font-[Marfa] text-[15px] font-[300]",
//                   head_cell: "font-[Marfa] text-[15px] font-[300]",
//                   cell: "font-[Marfa] text-[15px] font-[300]",
//                 }}
//               />
//             </PopoverContent>
//           </Popover>

//           {/* Delivery time */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Preferred delivery time*
//           </label>
//           <div>
//             <Select
//               onValueChange={handleTimeSelect}
//               value={formData.preferredDeliveryTime || ""}
//               disabled={!date || allowedSlotValues.length === 0}
//             >
//               <SelectTrigger className="w-full border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 rounded-none shadow-none text-sm h-auto">
//                 <SelectValue
//                   placeholder={
//                     !date
//                       ? isFloral ? "Select next eligible day" : "Select a date first"
//                       : allowedSlotValues.length === 0
//                         ? timeHint || "No slots available"
//                         : "Select a time slot"
//                   }
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
//             {timeHint && <p className="mt-1 text-xs text-stone-500">{timeHint}</p>}
//           </div>

//           {/* Who receives updates */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Who would you like to receive shipping updates?
//           </label>
//           <div className="flex gap-16 justify-end mr-4 w-[95%]">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-me" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Send to me
//               </span>
//               <input
//                 type="radio"
//                 name="smsUpdates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={(e) => handleSMSChange(e.target.value as "send-to-me")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-me"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-recipient" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="smsUpdates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={(e) => handleSMSChange(e.target.value as "send-to-recipient")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-recipient"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//           </div>

//           {/* Update method */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Would you like shipping updates to be sent by text message or email?
//           </label>
//           <div className="flex gap-37 justify-end mr-4 w-[95%]">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "text-message" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="smsTextOrEmail"
//                 value="text-message"
//                 checked={formData.shippingUpdateMethod === "text-message"}
//                 onChange={(e) => handleSMSTextOrEmailChange(e.target.value as "text-message")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "text-message"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "email" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Email
//               </span>
//               <input
//                 type="radio"
//                 name="smsTextOrEmail"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={(e) => handleSMSTextOrEmailChange(e.target.value as "email")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "email"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// -----------------------------------

// "use client";

// import React from "react";
// import { format, isSameDay, startOfDay, addDays } from "date-fns";
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
//   { value: "10am-1pm", label: "10:00 - 13:00" },
//   { value: "1pm-4pm", label: "13:00 - 16:00" },
//   { value: "4pm-6pm", label: "16:00 - 18:00" },
// ] as const;

// type SlotValue = typeof TIME_SLOTS[number]["value"];

// interface DeliveryDetailsStepProps {
//   /** Set true when the product category is Floral */
//   isFloral?: boolean;
// }

// export default function DeliveryDetailsStep({ isFloral = false }: DeliveryDetailsStepProps) {
//   const { formData, updateFormData } = usePersonaliseStore();
//   const [date, setDate] = React.useState<Date>();
//   const [nowTick, setNowTick] = React.useState(0); // triggers recompute each minute

//   // ---------- UK-time aware helpers ----------
//   const nowUK = () => toZonedTime(new Date(), LONDON_TZ);

//   const isWeekendInUK = (d: Date) => {
//     const inUK = toZonedTime(d, LONDON_TZ);
//     const day = inUK.getDay();
//     return day === 0 || day === 6; // Sun(0) / Sat(6)
//   };

//   const isSelectedDayTodayInUK = (selected: Date) =>
//     isSameDay(nowUK(), toZonedTime(selected, LONDON_TZ));

//   // Past-day guard in UK wall time
//   const isBeforeTodayUK = (d: Date) => {
//     const ukNow = nowUK();
//     const startOfTodayUK = startOfDay(ukNow);
//     const candidateUK = toZonedTime(d, LONDON_TZ);
//     return candidateUK < startOfTodayUK;
//   };

//   // Same-day allowed strictly before 13:00 UK
//   const isSameDayAllowedByCutoff = () => nowUK().getHours() < 13;

//   // Find the next eligible weekday (skip weekends)
//   const nextEligibleWeekdayUK = (start: Date) => {
//     let cursor = start;
//     while (isWeekendInUK(cursor)) {
//       cursor = addDays(cursor, 1);
//     }
//     return cursor;
//   };

//   // For Floral, the earliest selectable date (tomorrow/next weekday)
//   const earliestFloralDateUK = () => {
//     const todayUK = toZonedTime(new Date(), LONDON_TZ);
//     const tomorrowUK = addDays(todayUK, 1);
//     return nextEligibleWeekdayUK(tomorrowUK);
//   };

//   // ---------- Effects ----------
//   // Sync local date from store
//   React.useEffect(() => {
//     if (formData.deliveryDate) {
//       setDate(new Date(formData.deliveryDate));
//     }
//   }, [formData.deliveryDate]);

//   // Minute tick so slots/calendar react to 09:00 / 13:00 crossings
//   React.useEffect(() => {
//     const id = setInterval(() => setNowTick((t) => t + 1), 60_000);
//     return () => clearInterval(id);
//   }, []);

//   // (A) Floral: preselect earliest valid date if none chosen yet
//   React.useEffect(() => {
//     if (!isFloral) return;
//     if (formData.deliveryDate) return; // user already picked something
//     const earliest = earliestFloralDateUK();
//     setDate(earliest);
//     updateFormData({ deliveryDate: format(earliest, "yyyy-MM-dd") });
//   }, [isFloral]); // eslint-disable-line react-hooks/exhaustive-deps
//   React.useEffect(() => {
//     if (!isFloral || !date) return;
//     if (isSelectedDayTodayInUK(date)) {
//       const bumped = earliestFloralDateUK();
//       setDate(bumped);
//       updateFormData({ deliveryDate: format(bumped, "yyyy-MM-dd") });
//       if (formData.preferredDeliveryTime) {
//         updateFormData({ preferredDeliveryTime: "" });
//       }
//     }
//   }, [isFloral, date]); // eslint-disable-line react-hooks/exhaustive-deps

//   // (C) Non-floral: if today is selected and cutoff passes (>=13:00 UK), clear today so user must pick a future weekday
//   React.useEffect(() => {
//     if (isFloral || !date) return;
//     if (isSelectedDayTodayInUK(date) && !isSameDayAllowedByCutoff()) {
//       setDate(undefined);
//       updateFormData({ deliveryDate: "", preferredDeliveryTime: "" });
//     }
//   }, [nowTick, isFloral, date]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ---------- Slot logic ----------
//   const getAvailableSlotValues = (selected: Date): SlotValue[] => {
//     // Floral: no same-day at all
//     if (isFloral && isSelectedDayTodayInUK(selected)) return [];
//     if (isWeekendInUK(selected)) return [];

//     // If not today, all slots are fine.
//     if (!isSelectedDayTodayInUK(selected)) return TIME_SLOTS.map((s) => s.value);

//     // Today:
//     if (!isSameDayAllowedByCutoff()) return []; // 13:00+ → no same-day
//     // Before 09:00 → all, else only afternoon/evening
//     return nowUK().getHours() < 9 ? TIME_SLOTS.map((s) => s.value) : ["1pm-4pm", "4pm-6pm"];
//   };

//   const allowedSlotValues = React.useMemo(
//     () => (date ? getAvailableSlotValues(date) : []),
//     [date, nowTick, isFloral]
//   );

//   // If selected slot becomes invalid as time passes, clear it
//   React.useEffect(() => {
//     if (!date) return;
//     const allowed = getAvailableSlotValues(date);
//     if (
//       formData.preferredDeliveryTime &&
//       !allowed.includes(formData.preferredDeliveryTime as SlotValue)
//     ) {
//       updateFormData({ preferredDeliveryTime: "" });
//     }
//   }, [date, nowTick, formData.preferredDeliveryTime]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ---------- Handlers ----------
//   const handleInputChange = (field: string, value: string) => {
//     updateFormData({ [field]: value });
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (!selectedDate) return;

//     // If Floral and user tried to pick today, bump to earliest floral date
//     let finalDate = selectedDate;
//     if (isFloral && isSelectedDayTodayInUK(selectedDate)) {
//       finalDate = earliestFloralDateUK();
//     }

//     setDate(finalDate);
//     updateFormData({ deliveryDate: format(finalDate, "yyyy-MM-dd") });

//     const allowed = getAvailableSlotValues(finalDate);
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

//   const handleSMSTextOrEmailChange = (value: "text-message" | "email") => {
//     updateFormData({ shippingUpdateMethod: value });
//   };

//   // ---------- Calendar disabling ----------
//   const calendarDisabled = (d: Date) => {
//     if (isBeforeTodayUK(d)) return true; // Past
//     if (isWeekendInUK(d)) return true;   // Weekends
//     if (isFloral && isSelectedDayTodayInUK(d)) return true; // Floral: block today entirely
//     if (!isFloral && isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff()) return true; // Non-floral: after 13:00
//     return false;
//   };

//   // ---------- UI helpers ----------
//   const formatDateWithOrdinal = (d: Date) => {
//     const dayName = format(d, "EEEE");
//     const day = format(d, "d");
//     const month = format(d, "MMMM");
//     const year = format(d, "yyyy");
//     const getSuffix = (n: number) =>
//       n >= 11 && n <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] || "th");
//     return { dayName, day, month, year, suffix: getSuffix(parseInt(day, 10)) };
//   };

//   const timeHint =
//     date && isSelectedDayTodayInUK(date)
//       ? isFloral
//         ? "Flowers are next-day only"
//         : !isSameDayAllowedByCutoff()
//           ? "Same-day closed after 13:00 UK"
//           : nowUK().getHours() < 9
//             ? "All slots available (pre 09:00 UK)"
//             : "Only afternoon/evening slots available"
//       : date && isWeekendInUK(date)
//         ? "Weekend delivery unavailable"
//         : isFloral && !date
//           ? "Flowers are next-day only"
//           : undefined;

//   return (
//     <div>
//       <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4]">
//         Our gifts are sent by zero-emission, nominated-day delivery.
//       </p>
//       <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4] mb-8">
//         Please add your recipient&apos;s details, and your preferred delivery day and time, below.
//       </p>

//       <form className="font-[Marfa] space-y-6">
//         <div className="grid gap-8 md:grid-cols-[320px_1fr]">
//           {/* Recipient name */}
//           <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300]">
//             Recipient&apos;s name*
//           </label>
//           <Input
//             id="recipient-name"
//             type="text"
//             value={formData.recipientName}
//             onChange={(e) => handleInputChange("recipientName", e.target.value)}
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none"
//           />

//           {/* Address */}
//           <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300]">
//             Recipient&apos;s Address*
//           </label>
//           <Input
//             id="address"
//             type="text"
//             value={formData.recipientAddress}
//             onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
//             className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none"
//           />

//           {/* Delivery date */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Preferred delivery date*
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "w-full justify-start text-left border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent rounded-none shadow-none text-[15px] font-[300] font-[Marfa]",
//                   !date && "text-stone-500"
//                 )}
//               >
//                 {date ? (
//                   <span className="flex items-baseline">
//                     {(() => {
//                       const { dayName, day, suffix, month, year } = formatDateWithOrdinal(date);
//                       return (
//                         <>
//                           {dayName}, {day}
//                           <sup className="text-xs">{suffix}</sup>&nbsp;
//                           {month} {year}
//                         </>
//                       );
//                     })()}
//                   </span>
//                 ) : (
//                   <span>{isFloral ? "Select next eligible day" : "Select a date"}</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0 font-[Marfa]" align="start">
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={handleDateSelect}
//                 disabled={calendarDisabled}
//                 initialFocus
//                 classNames={{
//                   day_selected:
//                     "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white font-[Marfa]",
//                   day_disabled: "opacity-40 cursor-not-allowed line-through",
//                   caption: "font-[Marfa] text-[15px] font-[300]",
//                   head_cell: "font-[Marfa] text-[15px] font-[300]",
//                   cell: "font-[Marfa] text-[15px] font-[300]",
//                 }}
//               />
//             </PopoverContent>
//           </Popover>

//           {/* Delivery time */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Preferred delivery time*
//           </label>
//           <div>
//             <Select
//               onValueChange={handleTimeSelect}
//               value={formData.preferredDeliveryTime || ""}
//               disabled={!date || allowedSlotValues.length === 0}
//             >
//               <SelectTrigger className="w-full border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 rounded-none shadow-none text-sm h-auto">
//                 <SelectValue
//                   placeholder={
//                     !date
//                       ? isFloral ? "Select next eligible day" : "Select a date first"
//                       : allowedSlotValues.length === 0
//                         ? timeHint || "No slots available"
//                         : "Select a time slot"
//                   }
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
//             {timeHint && <p className="mt-1 text-xs text-stone-500">{timeHint}</p>}
//           </div>

//           {/* Who receives updates */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Who would you like to receive shipping updates?
//           </label>
//           <div className="flex gap-16 justify-end mr-4 w-[95%]">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-me" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Send to me
//               </span>
//               <input
//                 type="radio"
//                 name="smsUpdates"
//                 value="send-to-me"
//                 checked={formData.smsUpdates === "send-to-me"}
//                 onChange={(e) => handleSMSChange(e.target.value as "send-to-me")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-me"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.smsUpdates === "send-to-recipient" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Send to recipient
//               </span>
//               <input
//                 type="radio"
//                 name="smsUpdates"
//                 value="send-to-recipient"
//                 checked={formData.smsUpdates === "send-to-recipient"}
//                 onChange={(e) => handleSMSChange(e.target.value as "send-to-recipient")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.smsUpdates === "send-to-recipient"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//           </div>

//           {/* Update method */}
//           <label className="text-stone-700 text-[0.9375rem] font-[300]">
//             Would you like shipping updates to be sent by text message or email?
//           </label>
//           <div className="flex gap-37 justify-end mr-4 w-[95%]">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "text-message" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Text Message
//               </span>
//               <input
//                 type="radio"
//                 name="smsTextOrEmail"
//                 value="text-message"
//                 checked={formData.shippingUpdateMethod === "text-message"}
//                 onChange={(e) => handleSMSTextOrEmailChange(e.target.value as "text-message")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "text-message"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
//               />
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <span
//                 className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
//                   formData.shippingUpdateMethod === "email" ? "text-[#50462D]" : "text-[#50462d]/50"
//                 }`}
//               >
//                 Email
//               </span>
//               <input
//                 type="radio"
//                 name="smsTextOrEmail"
//                 value="email"
//                 checked={formData.shippingUpdateMethod === "email"}
//                 onChange={(e) => handleSMSTextOrEmailChange(e.target.value as "email")}
//                 className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
//                   ${
//                     formData.shippingUpdateMethod === "email"
//                       ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
//                       : "bg-[#50462d]/50"
//                   }`}
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
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
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
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LONDON_TZ = "Europe/London";

const TIME_SLOTS = [
  { value: "10am-1pm", label: "10:00 - 13:00" },
  { value: "1pm-4pm", label: "13:00 - 16:00" },
  { value: "4pm-6pm", label: "16:00 - 18:00" },
] as const;

type SlotValue = (typeof TIME_SLOTS)[number]["value"];

interface DeliveryDetailsStepProps {
  /** Set true when the product category is Floral */
  isFloral?: boolean;
}

/* --------------------- UK date/time helpers (string-based) --------------------- */

// Current instant; we only derive UK calendar fields from it
const nowInstant = () => new Date();

// Compare two instants by their UK *calendar date* (yyyy-MM-dd)
const sameDayInUK = (a: Date, b: Date) =>
  formatInTimeZone(a, LONDON_TZ, "yyyy-MM-dd") ===
  formatInTimeZone(b, LONDON_TZ, "yyyy-MM-dd");

// Is the selected date "today" in UK calendar terms?
const isSelectedDayTodayInUK = (selected: Date) =>
  sameDayInUK(selected, nowInstant());

// Weekend check by UK weekday number (ISO 1=Mon ... 7=Sun)
const isWeekendInUK = (d: Date) => {
  const dayIso = Number(formatInTimeZone(d, LONDON_TZ, "i"));
  return dayIso === 6 || dayIso === 7; // Sat/Sun
};

// Past-day guard via UK date strings
const isBeforeTodayUK = (d: Date) => {
  const cand = formatInTimeZone(d, LONDON_TZ, "yyyy-MM-dd");
  const today = formatInTimeZone(nowInstant(), LONDON_TZ, "yyyy-MM-dd");
  return cand < today;
};

// Same-day allowed strictly before 13:00 UK
const isSameDayAllowedByCutoff = () => {
  const hour = Number(formatInTimeZone(nowInstant(), LONDON_TZ, "H"));
  return hour < 13;
};

// Pre-09:00 UK?
const isPre9UK = () => {
  const hour = Number(formatInTimeZone(nowInstant(), LONDON_TZ, "H"));
  return hour < 9;
};

export default function DeliveryDetailsStep({
  isFloral = false,
}: DeliveryDetailsStepProps) {
  const { formData, updateFormData } = usePersonaliseStore();
  const [date, setDate] = React.useState<Date | undefined>();
  const [nowTick, setNowTick] = React.useState(0); // triggers recompute each minute

  /* --------------------- Effects --------------------- */

  // Hydrate local date from store (store holds yyyy-MM-dd string ideally)
  React.useEffect(() => {
    if (formData.deliveryDate) {
      // Construct a Date from the stored string; comparisons are UK-string based anyway
      setDate(new Date(formData.deliveryDate));
    } else {
      setDate(undefined);
    }
  }, [formData.deliveryDate]);

  // Tick every minute so UI reacts to 09:00 / 13:00 boundaries
  React.useEffect(() => {
    const id = setInterval(() => setNowTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Non-floral: if today is selected and cutoff passes (>=13:00 UK), clear today
  React.useEffect(() => {
    if (isFloral || !date) return;
    if (isSelectedDayTodayInUK(date) && !isSameDayAllowedByCutoff()) {
      setDate(undefined);
      updateFormData({ deliveryDate: "", preferredDeliveryTime: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowTick, isFloral, date]);

  /* --------------------- Slot logic --------------------- */

  const getAvailableSlotValues = (selected: Date): SlotValue[] => {
    if (isWeekendInUK(selected)) return [];
    if (isFloral && isSelectedDayTodayInUK(selected)) return []; // Floral: no same-day at all

    if (!isSelectedDayTodayInUK(selected)) {
      return TIME_SLOTS.map((s) => s.value); // future weekday: all slots
    }

    // Today (non-floral):
    if (!isSameDayAllowedByCutoff()) return []; // 13:00+ UK → no same-day
    return isPre9UK() ? TIME_SLOTS.map((s) => s.value) : ["1pm-4pm", "4pm-6pm"];
  };

  const allowedSlotValues = React.useMemo(
    () => (date ? getAvailableSlotValues(date) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, nowTick, isFloral]
  );

  // If selected slot becomes invalid as time passes, clear it
  React.useEffect(() => {
    if (!date) return;
    const allowed = getAvailableSlotValues(date);
    if (
      formData.preferredDeliveryTime &&
      !allowed.includes(formData.preferredDeliveryTime as SlotValue)
    ) {
      updateFormData({ preferredDeliveryTime: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, nowTick, formData.preferredDeliveryTime]);

  /* --------------------- Handlers --------------------- */

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // No auto-bumping for Floral; invalid days are already disabled
    setDate(selectedDate);

    // Store UK calendar date string to avoid ambiguity on rehydrate
    updateFormData({
      deliveryDate: formatInTimeZone(selectedDate, LONDON_TZ, "yyyy-MM-dd"),
    });

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

  const handleSMSTextOrEmailChange = (value: "text-message" | "email") => {
    updateFormData({ shippingUpdateMethod: value });
  };

  /* --------------------- Calendar disabling --------------------- */

  const calendarDisabled = (d: Date) => {
    if (isBeforeTodayUK(d)) return true; // Past
    if (isWeekendInUK(d)) return true; // Weekends
    if (isFloral && isSelectedDayTodayInUK(d)) return true; // Floral: block UK-today entirely
    if (!isFloral && isSelectedDayTodayInUK(d) && !isSameDayAllowedByCutoff())
      return true; // Non-floral: after 13:00 UK
    return false;
  };

  /* --------------------- UI helpers --------------------- */

  const formatDateWithOrdinal = (d: Date) => {
    const dayName = format(d, "EEEE");
    const day = format(d, "d");
    const month = format(d, "MMMM");
    const year = format(d, "yyyy");
    const getSuffix = (n: number) =>
      n >= 11 && n <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th";
    return { dayName, day, month, year, suffix: getSuffix(parseInt(day, 10)) };
  };

  const timeHint =
    date && isSelectedDayTodayInUK(date)
      ? isFloral
        ? "Flowers are next-day only"
        : !isSameDayAllowedByCutoff()
        ? "Same-day closed after 13:00 UK"
        : isPre9UK()
        ? "All slots available (pre 09:00 UK)"
        : "Only afternoon/evening slots available"
      : date && isWeekendInUK(date)
      ? "Weekend delivery unavailable"
      : isFloral && !date
      ? "Flowers are next-day only"
      : undefined;

  /* --------------------- Render --------------------- */

  return (
    <div>
      <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4]">
        Our gifts are sent by zero-emission, nominated-day delivery.
      </p>
      <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4] mb-8">
        Please add your recipient&apos;s details, and your preferred delivery
        day and time, below.
      </p>

      <form className="font-[Marfa] space-y-6">
        <div className="grid gap-8 md:grid-cols-[320px_1fr]">
          {/* Recipient name */}
          <label
            htmlFor="recipient-name"
            className="text-stone-700 text-[0.9375rem] font-[300]"
          >
            Recipient&apos;s name*
          </label>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none"
          />

          {/* Address */}
          <label
            htmlFor="address"
            className="text-stone-700 text-[0.9375rem] font-[300]"
          >
            Recipient&apos;s Address*
          </label>
          <Input
            id="address"
            type="text"
            value={formData.recipientAddress}
            onChange={(e) =>
              handleInputChange("recipientAddress", e.target.value)
            }
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none text-[0.9375rem] font-[300] w-full focus:outline-none"
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
                  "w-full justify-start text-left border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent rounded-none shadow-none text-[15px] font-[300] font-[Marfa]",
                  !date && "text-stone-500"
                )}
              >
                {date ? (
                  <span className="flex items-baseline">
                    {(() => {
                      const { dayName, day, suffix, month, year } =
                        formatDateWithOrdinal(date);
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
                  <span>
                    {isFloral ? "Select next eligible day" : "Select a date"}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 font-[Marfa]" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={calendarDisabled}
                initialFocus
                classNames={{
                  day_selected:
                    "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white font-[Marfa]",
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
                      ? isFloral
                        ? "Select next eligible day"
                        : "Select a date first"
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
            {timeHint && (
              <p className="mt-1 text-xs text-stone-500">{timeHint}</p>
            )}
          </div>

          {/* Who receives updates */}
          <div className="">
            <label className="text-stone-700 text-[0.9375rem] font-[300] flex">
              <span> Who would you like to receive shipping updates? </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-stone-500" />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-[340px] bg-[#50462D] text-white p-3 text-sm"
                  // sideOffset={5}
                >
                  <div className="space-y-2 w-full">
                    <p className="w-full">
                      To keep your gift a surprise, we can send delivery updates
                      to you instead of the recipient. If sent to them, they'll
                      receive:
                    </p>
                    <ul className="space-y-1 ml-2">
                      <li>
                        • A confirmation with a link to reschedule (at no charge
                        if requested at least 2 hours before delivery)
                      </li>
                      <li>
                        • A message when we're on our way, plus a call 15
                        minutes before arrival
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </label>
          </div>
          <div className="flex gap-16 justify-end mr-4 w-[95%]">
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.smsUpdates === "send-to-me"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                }`}
              >
                Send to me
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                onChange={(e) =>
                  handleSMSChange(e.target.value as "send-to-me")
                }
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${
                    formData.smsUpdates === "send-to-me"
                      ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                      : "bg-[#50462d]/50"
                  }`}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.smsUpdates === "send-to-recipient"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                }`}
              >
                Send to recipient
              </span>
              <input
                type="radio"
                name="smsUpdates"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                onChange={(e) =>
                  handleSMSChange(e.target.value as "send-to-recipient")
                }
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${
                    formData.smsUpdates === "send-to-recipient"
                      ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                      : "bg-[#50462d]/50"
                  }`}
              />
            </label>
          </div>

          {/* Update method */}
          <label className="text-stone-700 text-[0.9375rem] font-[300]">
            Would you like shipping updates to be sent by text message or email?
          </label>
          <div className="flex gap-37 justify-end mr-4 w-[95%]">
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.shippingUpdateMethod === "text-message"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                }`}
              >
                Text Message
              </span>
              <input
                type="radio"
                name="smsTextOrEmail"
                value="text-message"
                checked={formData.shippingUpdateMethod === "text-message"}
                onChange={(e) =>
                  handleSMSTextOrEmailChange(e.target.value as "text-message")
                }
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${
                    formData.shippingUpdateMethod === "text-message"
                      ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                      : "bg-[#50462d]/50"
                  }`}
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.shippingUpdateMethod === "email"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                }`}
              >
                Email
              </span>
              <input
                type="radio"
                name="smsTextOrEmail"
                value="email"
                checked={formData.shippingUpdateMethod === "email"}
                onChange={(e) =>
                  handleSMSTextOrEmailChange(e.target.value as "email")
                }
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${
                    formData.shippingUpdateMethod === "email"
                      ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                      : "bg-[#50462d]/50"
                  }`}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
