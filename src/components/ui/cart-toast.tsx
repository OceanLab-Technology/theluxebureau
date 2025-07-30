"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface CartToastProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  productPrice?: number;
  onViewCart?: () => void;
  onCheckout?: () => void;
}

export function CartToast({
  isVisible,
  onClose,
  productName,
  productImage,
  productPrice,
  onViewCart,
  onCheckout,
}: CartToastProps) {
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
          className="fixed top-16 right-0 z-50 bg-background border border-stone-300  p-4 min-w-xl font-century"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Added to Cart
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
              <div className="h-35 overflow-hidden flex-shrink-0">
                <Image
                  src={productImage}
                  alt={productName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-stone-800 text-xl w-30">
                {productName}
              </h3>
              {productPrice && (
                <p className="text-stone-600 text-sm">
                  £{productPrice.toFixed(2)}
                </p>
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
              className="flex-1 text-xs w-full uppercase rounded-none tracking-wider border-stone-300 text-stone-600 hover:bg-stone-50"
            >
              View Cart
            </Button>
            <Button
              onClick={onCheckout}
              variant={"box_yellow"}
              className="rounded-none w-full flex-1"
            >
              Checkout
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
