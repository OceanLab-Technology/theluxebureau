"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

const containerVariants = {
  hidden: { opacity: 0, y: -80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      mass: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -60,
    scale: 0.95,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.4 },
  }),
};

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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-16 right-0 z-50 bg-background border border-stone-300 p-4 md:min-w-xl font-century shadow-xl"
        >
          <motion.div
            variants={childVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between mb-3"
          >
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Added to Cart
            </span>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            variants={childVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            className="flex gap-3 mb-4"
          >
            {productImage && (
              <div className="md:h-35 h-20 overflow-hidden flex-shrink-0">
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
              <h3 className="font-medium text-stone-800 md:text-xl w-30">
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
            variants={childVariants}
            custom={2}
            initial="hidden"
            animate="visible"
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
