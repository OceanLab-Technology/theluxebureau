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
    value: "send-to-me" | "send-to-recipient" | "none"
  ) => {
    updateFormData({ smsUpdates: value });
  };

  return (
    <div className="">
      <p className="text-secondary-foreground mb-4 font-[400] leading-[1.25rem] tracking-[0.02rem] text-[1rem] font-century">
        Our gifts are sent by zero-emission, nominated-day delivery. Please add
        your recipient's details, and your preferred delivery day and time,
        below.
      </p>

      <form className="space-y-4 font-[Marfa]">
        <div>
          <Input
            id="recipient-name"
            type="text"
            value={formData.recipientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientName", e.target.value)
            }
            placeholder="Recipients name*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
          />
        </div>

        <div>
          <Input
            id="address"
            type="text"
            value={formData.recipientAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("recipientAddress", e.target.value)
            }
            placeholder="Recipients Address*"
            className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 border-b focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-[0.9375rem] font-[300] tracking-[0.01875]"
          />
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal border-0 bg-transparent px-0 py-2 sm:py-3 text-stone-800 hover:bg-transparent border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto",
                  !date && "text-stone-500"
                )}
              >
                {date ? format(date, "PPP") : <span>Delivery date*</span>}
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

        <div>
          <Select
            onValueChange={handleTimeSelect}
            value={formData.preferredDeliveryTime}
          >
            <SelectTrigger className="w-full border-0 bg-transparent px-0 py-2 sm:py-3 text-stone-800 border-b border-stone-500 focus:border-stone-600 rounded-none shadow-none text-sm h-auto">
              <SelectValue
                placeholder="Preferred delivery time*"
                className="text-stone-500"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8am-1pm">8 AM to 1 PM</SelectItem>
              <SelectItem value="1pm-6pm">1 PM to 6 PM</SelectItem>
              <SelectItem value="6pm-11pm">6 PM to 11 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 flex md:items-center items-start md:flex-row flex-col pb-1 justify-between border-b border-stone-500">
          <p className="text-stone-700 text-sm mb-3">
            Would you like shipping updates via SMS?
          </p>
          <div className="flex md:gap-6 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-stone-700">None</span>
              <div className="relative">
                <input
                  type="radio"
                  name="sms-updates"
                  value="none"
                  checked={formData.smsUpdates === "none"}
                  onChange={() => handleSMSChange("none")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.smsUpdates === "none"
                      ? "bg-[#40362c] border-[#40362c]"
                      : "border-stone-400"
                  }`}
                >
                  {formData.smsUpdates === "none" && (
                    <div className="w-full h-full rounded-full bg-[#40362c]"></div>
                  )}
                </div>
              </div>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-stone-700">Send to me</span>
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
                      : "border-stone-400"
                  }`}
                >
                  {formData.smsUpdates === "send-to-me" && (
                    <div className="w-full h-full rounded-full bg-[#40362c]"></div>
                  )}
                </div>
              </div>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-stone-700">Send to recipient</span>
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
                      : "border-stone-400"
                  }`}
                >
                  {formData.smsUpdates === "send-to-recipient" && (
                    <div className="w-full h-full rounded-full bg-[#40362c]"></div>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
