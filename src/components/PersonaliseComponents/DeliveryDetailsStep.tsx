"use client";

import React from "react";
import { format } from "date-fns";
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
    if (selectedDate) {
      setDate(selectedDate);
      updateFormData({ deliveryDate: format(selectedDate, "yyyy-MM-dd") });
    }
  };

  const handleTimeSelect = (time: string) => {
    updateFormData({ preferredDeliveryTime: time });
  };

  const handleSMSChange = (
    value: "send-to-me" | "send-to-recipient"
  ) => {
    updateFormData({ smsUpdates: value });
  };

     
const formatDateWithOrdinal = (date:any) => {
  const dayName = format(date, "EEEE");
  const day = format(date, "d");
  const month = format(date, "MMMM");
  const year = format(date, "yyyy");
  

  const getOrdinalSuffix = (day :any) => {
    const dayNum = parseInt(day);
    if (dayNum >= 11 && dayNum <= 13) return "th";
    switch (dayNum % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  
  const ordinalSuffix = getOrdinalSuffix(day);
  
  return { dayName, day, ordinalSuffix, month, year };
};


  return (
    <div className="">
      <p className="text-secondary-foreground font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Our gifts are sent by zero-emission, nominated-day delivery.
      </p>
      <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Please add your recipient's details, and your preferred delivery day and time, below.
      </p>

      <form className="space-y-4 font-[Marfa]">
      
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
            Recipient's name*
          </label>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientName", e.target.value)
            }
            placeholder=""
            className="border-0 border-b border-stone-500 bg-transparent px-0 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
             Recipient's Details*
          </label>
          <Input
            id="address"
            type="text"
            value={formData.recipientAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientAddress", e.target.value)
            }
            placeholder=""
            className="border-0 border-b border-stone-500 bg-transparent px-0 py-0.5 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
          />
        </div>


         <div className="flex flex-col mt-6 md:flex-row md:items-center md:justify-between">
          <label htmlFor="delivery-date" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
            Preferred delivery date*
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full md:w-[30rem] justify-start mt-1 text-left font-[Marfa] border-0 bg-transparent px-0 py-1 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-[15px] tracking-[0.02em] font-[300] h-auto transition-all duration-300",
                  !date && "text-stone-500"
                )}
              >
                {date ? (
                  <span className="flex items-baseline">
                    {(() => {
                      const { dayName, day, ordinalSuffix, month, year } = formatDateWithOrdinal(date);
                      return (
                        <>
                        {dayName}, {day} <sup className="text-xs">{ordinalSuffix}</sup>{" "} {" "}  {month} {" "} {year}
                        </>
                      );
                    })()}
                  </span>
                ) : (
                  <span></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                style={{
                  borderRadius: "1.375rem",
                }}
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                classNames={{
                  day_selected: "bg-[#50462D] text-white hover:bg-[#50462D] hover:text-white focus:bg-[#50462D] !border-0",
                  caption: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
                  nav_button_previous: "text-[#50462D]",
                  nav_button_next: "text-[#50462D]",
                  head_cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
                  cell: "font-[Marfa] text-[15px] tracking-[0.02em] font-[300]",
                  table: "w-full border-collapse",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>


        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <label htmlFor="delivery-time" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
            Preferred delivery time*
          </label>
          <Select
            onValueChange={handleTimeSelect}
            value={formData.preferredDeliveryTime}
          >
            <SelectTrigger className="w-full md:w-[30rem] border-0 bg-transparent px-0 py-1 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300">
              <SelectValue
                placeholder=""
                className="text-stone-500"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10am-1pm">10:00 – 13:00</SelectItem>
              <SelectItem value="1pm-4pm">13:00 – 16:00</SelectItem>
              <SelectItem value="4pm-6pm">16:00 – 18:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <div className="pt-4 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
          <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
            Would you like shipping updates to be sent by text message or email?
          </p>
          <div className="flex flex-row gap-16 -ml-2 md:gap-18 justify-center md:w-[52%] w-full transition-all duration-150">
            <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.shippingUpdateMethod === "text"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                } font-light tracking-[0.02em]`}
              >
                Text Message
              </span>
              <input
                type="radio"
                name="shipping-update-method"
                value="text"
                checked={formData.shippingUpdateMethod === "text"}
                onChange={() => updateFormData({ shippingUpdateMethod: "text" })}
                className={`w-5 h-5 flex-shrink-0 border  md:mr-6 border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.shippingUpdateMethod === "text"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />
            </label>


            {/* email  */}
            <label className="flex items-center gap-3 -mr-14 md:-mr-11 cursor-pointer justify-center w-full">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.shippingUpdateMethod === "email"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                } font-light tracking-[0.02em]`}
              >
                Email
              </span>

              <input
                type="radio"
                name="shipping-update-method"
                value="email"
                checked={formData.shippingUpdateMethod === "email"}
                onChange={() => updateFormData({ shippingUpdateMethod: "email" })}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.shippingUpdateMethod === "email"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />


            </label>
          </div>
        </div>


        {/* Existing SMS section */}
        <div className="pt-1 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
          <p className="text-stone-700 text-sm mb-3 md:mb-0 md:w-[36%] w-full leading-tight md:leading-normal">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex flex-row gap-8 justify-center md:w-[52%] w-full transition-all duration-150">
            <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.smsUpdates === "send-to-me"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                } font-light tracking-[0.02em]`}
              >
                Send to me
              </span>


              <input
                type="radio"
                name="sms-updates"
                value="send-to-me"
                checked={formData.smsUpdates === "send-to-me"}
                onChange={() => handleSMSChange("send-to-me")}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-me"
                    ? "bg-[#50462D] checked:bg-[#50462D] checked:border-[#50462D]"
                    : "bg-[#50462d]/50"}
                `}
              />


            </label>
            <label className="flex items-center gap-3 cursor-pointer justify-center w-full">
              <span
                className={`font-[Marfa] font-[300] text-[15px] tracking-[0.02em] ${
                  formData.smsUpdates === "send-to-recipient"
                    ? "text-[#50462D]"
                    : "text-[#50462d]/50"
                } font-light tracking-[0.02em]`}
              >
                Send to recipient
              </span>
              <input
                type="radio"
                name="sms-updates"
                value="send-to-recipient"
                checked={formData.smsUpdates === "send-to-recipient"}
                onChange={() => handleSMSChange("send-to-recipient")}
                className={`w-5 h-5 flex-shrink-0 border border-stone-300 appearance-none rounded-full focus:outline-none
                  ${formData.smsUpdates === "send-to-recipient"
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