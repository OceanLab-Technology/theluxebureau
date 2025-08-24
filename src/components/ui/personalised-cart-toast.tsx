"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Heart, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface PersonalisationData {
  recipientName?: string;
  headerText?: string;
  customMessage?: string;
}

interface PersonalisedCartToastProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  productPrice?: number;
  onViewCart?: () => void;
  onContinueShopping?: () => void;
  personalisationData?: PersonalisationData;
}

export function PersonalisedCartToast({
  isVisible,
  onClose,
  productName,
  productImage,
  productPrice,
  onViewCart,
  onContinueShopping,
  personalisationData,
}: PersonalisedCartToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
          className="fixed top-25 right-4 z-50 bg-background border shadow-xl p-4 md:min-w-lg font-century max-w-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium  uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4" />
              Added to Bag
            </span>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 mb-4"
          >
            {productImage && (
              <div className="h-20 w-20 overflow-hidden flex-shrink-0 rounded-sm">
                <Image
                  src={productImage}
                  alt={productName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-stone-800 text-base mb-1">
                {productName}
              </h3>
              {productPrice && (
                <p className="text-stone-600 text-sm mb-2">
                  £{productPrice.toFixed(2)}
                </p>
              )}

              {personalisationData && (
                <div className="space-y-1">
                  {personalisationData.recipientName && (
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      For: {personalisationData.recipientName}
                    </p>
                  )}
                  {personalisationData.headerText && (
                    <p className="text-xs text-stone-500 truncate">
                      Header: "{personalisationData.headerText}"
                    </p>
                  )}
                  {personalisationData.customMessage && (
                    <p className="text-xs text-stone-500 truncate">
                      Message: "{personalisationData.customMessage}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              onClick={onViewCart}
              className="flex-1 text-xs uppercase rounded-none tracking-wider"
            >
              View Bag
            </Button>
            <Button
              onClick={onContinueShopping}
              variant="box_yellow"
              className="rounded-none flex-1 text-xs"
            >
              Continue Shopping
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
