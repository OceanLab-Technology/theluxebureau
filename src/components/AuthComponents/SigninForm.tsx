"use client";

import React from "react";
import Input from "./input";
import { AnimatePresence, motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const steps = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Finish" },
];

export default function StepForm() {
  const [step, setStep] = React.useState(1);
  const [selectedQuote, setSelectedQuote] = React.useState("");
  const [headerStyle, setHeaderStyle] = React.useState("");

  const quotes = [
    "Pablo Picasso",
    "Quote Name 1",
    "Quote Name 2",
    "Quote Name 3",
    "Quote Name 4",
    "Quote Name 5",
    "Quote Name 6",
    "Quote Name 7",
    "Write my own",
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <section className="flex flex-col justify-between h-full font-heading">
      <div>
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl  mb-4 font-bold">
              {step === 1 ? "Recipient Details" : "Personalize Your Gift"}
            </h1>
            <button className="text-xs font-medium tracking-wider mb-4">
              BACK TO STORE
            </button>
          </div>
          <div className="grid grid-cols-4 justify-around uppercase text-black">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`text-xs font-semibold tracking-wider ${
                  step === s.id ? "text-stone-700" : "text-stone-500"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
          <div className="mt-2 w-full bg-stone-500">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="mt-2 w-full h-1 bg-[#FAD15D]"
            ></motion.div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, filter: "blur(20px)", x: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(20px)", x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="">
                <p className="text-stone-700 mb-4 font-semibold text-xl">
                  Please enter your recipients contact details
                </p>

                <form className="space-y-2">
                  <div>
                    <Input
                      id="recipient-name"
                      type="text"
                      className=""
                      placeholder="Recipient Name*"
                    />
                  </div>

                  <div>
                    <Input
                      id="address"
                      type="text"
                      className=""
                      placeholder="Recipient Address*"
                    />
                  </div>

                  <div>
                    <Input
                      id="city"
                      type="text"
                      className=""
                      placeholder="Recipient City*"
                    />
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="email"
                      className=""
                      placeholder="Recipient Email*"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, filter: "blur(20px)", x: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(20px)", x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-stone-700 font-semibold text-sm leading-relaxed">
                Our gifts are sent with custom stationery, letter-pressed by
                hand at the Luxe Bureau atelier. In the header field, please
                enter your own name, initials, or company to create your custom
                letterhead. You may choose between two type styles below.
              </p>

              <p className="text-stone-700 mb-8 font-semibold text-sm leading-relaxed">
                Your personal message will be typeset and printed in the Luxe
                Bureau's signature typewriter font. Please type your message
                directly onto the notecard. For added inspiration, select a
                quote from the drop down menu to add this to your message.
              </p>

              <div className="flex gap-4 mb-8">
                <div>
                  <label className="text-xs font-medium tracking-wider text-stone-600 mb-2 block">
                    Header type style*
                  </label>
                  <Select value={headerStyle} onValueChange={setHeaderStyle}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="style1">Style 1</SelectItem>
                      <SelectItem value="style2">Style 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium tracking-wider text-stone-600 mb-2 block">
                    Quotes
                  </label>
                  <Select
                    value={selectedQuote}
                    onValueChange={setSelectedQuote}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {quotes.map((quote, index) => (
                        <SelectItem
                          key={index}
                          value={quote}
                          className={
                            quote === "Quote Name 2" ? "bg-amber-100" : ""
                          }
                        >
                          {quote}
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
                    backgroundColor: "#3B3215",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="bg-stone-50 p-6 shadow-lg max-w-xs w-full">
                      <div className="text-center mb-4">
                        <div className="text-xs font-medium tracking-wider text-stone-600 mb-2">
                          HEADER
                        </div>
                        <div className="h-px bg-stone-300 w-16 mx-auto"></div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-stone-500 italic">
                          Message
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, filter: "blur(20px)", x: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(20px)", x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="">
                <p className="text-stone-700 mb-4 font-semibold text-xl">
                  Our gifts are sent by zero-emission, nominated-day delivery.
                  Please add your recipient’s details, and your preferred
                  delivery day and time, below.
                </p>

                <form className="space-y-2">
                  <div>
                    <Input
                      id="recipient-name"
                      type="text"
                      className=""
                      placeholder="Recipient Name*"
                    />
                  </div>

                  <div>
                    <Input
                      id="address"
                      type="text"
                      className=""
                      placeholder="Recipient Address*"
                    />
                  </div>

                  <div>
                    <Input
                      id="city"
                      type="text"
                      className=""
                      placeholder="Recipient City*"
                    />
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="email"
                      className=""
                      placeholder="Recipient Email*"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, filter: "blur(20px)", x: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(20px)", x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="">
                <p className="text-stone-700 mb-4 font-semibold text-xl">
                  Please review or amend your gift details below.
                </p>

                <form className="space-y-2">
                  <div>
                    <Input
                      id="recipient-name"
                      type="text"
                      className=""
                      placeholder="Recipient Name*"
                    />
                  </div>

                  <div>
                    <Input
                      id="address"
                      type="text"
                      className=""
                      placeholder="Recipient Address*"
                    />
                  </div>

                  <div>
                    <Input
                      id="city"
                      type="text"
                      className=""
                      placeholder="Recipient City*"
                    />
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="email"
                      className=""
                      placeholder="Recipient Email*"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleBack}
          className="bg-[#3B3215] px-5 hover:bg-[#3B3215]/80 font-medium text-stone-400 tracking-wider text-sm py-2.5 rounded-none"
        >
          BACK
        </button>
        <button
          onClick={handleNext}
          className="bg-[#FDCF5F] px-5 hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider text-sm py-2.5 rounded-none"
        >
          NEXT
        </button>
      </div>
    </section>
  );
}
