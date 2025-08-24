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
      <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4]">
        Our gifts are sent by zero-emission, nominated-day delivery.
      </p>
      <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4] mb-8">
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
                  "w-full justify-start text-left border-0 border-b border-stone-500 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent rounded-none shadow-none text-[15px] font-[300] font-[Marfa]",
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
