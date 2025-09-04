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
  TooltipProvider,
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

// Compare two dates by their calendar date (yyyy-MM-dd) - timezone-agnostic
const sameDayCalendar = (a: Date, b: Date) => {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
};

// Is the selected date "today" in UK calendar terms?
const isSelectedDayTodayInUK = (selected: Date) => {
  const today = new Date();
  const todayUK = new Date(formatInTimeZone(today, LONDON_TZ, "yyyy-MM-dd"));
  return sameDayCalendar(selected, todayUK);
};

// Weekend check by day of week
const isWeekendInUK = (d: Date) => {
  const dayOfWeek = d.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sun(0) / Sat(6)
};

// Past-day guard via date comparison
const isBeforeTodayUK = (d: Date) => {
  const today = new Date();
  const todayUK = new Date(formatInTimeZone(today, LONDON_TZ, "yyyy-MM-dd"));
  return d < todayUK;
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
      // Parse the date string properly to avoid timezone issues
      const parts = formData.deliveryDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        setDate(new Date(year, month, day));
      }
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

    const normalizedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    setDate(normalizedDate);

    updateFormData({
      deliveryDate: format(normalizedDate, "yyyy-MM-dd"),
    });

    const allowed = getAvailableSlotValues(normalizedDate);
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
        Our gifts are sent by zero-emission, nominated-day delivery. Please add
        your recipient's details, and your preferred delivery day and time,
        below.
      </p>
      <br />
      <p className="text-secondary-foreground font-[Century-Old-Style] text-[1rem] leading-[1.4] mb-8">
        We hand-deliver every gift to ensure it arrives in perfect condition.
        Please choose a date and time when the recipient will be at home. Our
        agents can't leave gifts unattended, so a redelivery fee may apply if no
        one is available.
      </p>

      <form className="font-[Marfa] space-y-4 text-[13px]">
        <div className="grid gap-4 md:grid-cols-[320px_1fr]">
          {/* Recipient name */}
          <label
            htmlFor="recipient-name"
            className="text-stone-700 font-[300]"
          >
            Recipient&apos;s name*
          </label>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none font-[300] w-full focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus:ring-0"
          />

          {/* Address */}
          <label
            htmlFor="address"
            className="text-stone-700 font-[300]"
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
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 rounded-none shadow-none font-[300] w-full focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus:ring-0"
          />

          {/* Delivery date */}
          <label className="text-stone-700 font-[300]">
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
          <label className="text-stone-700 font-[300]">
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
            <label className="text-stone-700 font-[300] flex">
              <span> Who would you like to receive shipping updates? </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 mt-0.5 ml-2   text-stone-500" />
                </TooltipTrigger>
                <TooltipContent
                  style={{
                    width: "490px",
                  }}
                  side="bottom"
                  className=" bg-[#50462D] text-background p-3 text-sm"
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
                        - A confirmation with a link to reschedule (at no charge
                        if requested at least 2 hours before delivery)
                      </li>
                      <li>
                        - A message when we're on our way, plus a call 15
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
                className={`w-4 h-4 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
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
                className={`w-4 h-4 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${
                    formData.smsUpdates === "send-to-recipient"
                      ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                      : "bg-[#50462d]/50"
                  }`}
              />
            </label>
          </div>

          {/* Update method */}
          <label className="text-stone-700 font-[300]">
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
                Text message
              </span>
              <input
                type="radio"
                name="smsTextOrEmail"
                value="text-message"
                checked={formData.shippingUpdateMethod === "text-message"}
                onChange={(e) =>
                  handleSMSTextOrEmailChange(e.target.value as "text-message")
                }
                className={`w-4 h-4 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
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
                className={`w-4 h-4 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
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
