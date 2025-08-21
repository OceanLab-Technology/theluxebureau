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

  return (
    <div className="">
      <p className="text-secondary-foreground  font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Our gifts are sent by zero-emission, nominated-day delivery.
      </p>
      <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Please add your recipient's details, and your preferred delivery day and time, below.
      </p>

      <form className="space-y-4 font-[Marfa]">
      
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <label htmlFor="recipient-name" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
            Recipients name*
          </label>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientName", e.target.value)
            }
            placeholder=""
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
          />
        </div>

     
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <label htmlFor="address" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
            Recipients Address*
          </label>
          <Input
            id="address"
            type="text"
            value={formData.recipientAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientAddress", e.target.value)
            }
            placeholder=""
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875] w-full md:w-[30rem] transition-all duration-300"
          />
        </div>

     
        <div className="flex flex-col mt-6 md:flex-row md:items-center md:justify-between">
          <label htmlFor="delivery-date" className="text-stone-700 text-[0.9375rem] font-[300] mb-2 md:mb-0">
            Delivery 
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full md:w-[30rem] justify-start text-left font-normal border-0 bg-transparent px-0 py-2 sm:py-3 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300",
                  !date && "text-stone-500"
                )}
              >
                {date ? format(date, "PPP") : <span></span>}
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
            <SelectTrigger className="w-full md:w-[30rem] border-0 bg-transparent px-0 py-2 sm:py-3 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto transition-all duration-300">
              <SelectValue
                placeholder=""
                className="text-stone-500"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8am-1pm">10:00 – 13:00</SelectItem>
              <SelectItem value="1pm-6pm">13:00 – 16:00</SelectItem>
              <SelectItem value="6pm-11pm">16:00 – 18:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 flex flex-col md:flex-row md:items-center items-start pb-1 justify-between transition-all duration-300">
          <p className="text-stone-700 text-sm mb-3 md:mb-0">
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
      </form>
    </div>
  );
}