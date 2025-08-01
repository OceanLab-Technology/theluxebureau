"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 py-10 md:px-12 font-century"
    >
      {/* Left: Image and thumbnails */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        {/* Main Image */}
        <motion.div variants={fadeInItem}>
          <Skeleton className="w-full h-[500px] md:aspect-square bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-xl animate-pulse" />
        </motion.div>

        {/* Thumbnails */}
        <motion.div
          variants={fadeInItem}
          className="grid grid-cols-4 gap-4 md:px-8"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-[100px] aspect-square bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 rounded-lg animate-pulse"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Right: Details */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6 md:p-10"
      >
        <motion.div variants={fadeInItem}>
          <Skeleton className="h-4 w-24 bg-muted rounded" />
        </motion.div>

        <motion.div variants={fadeInItem}>
          <Skeleton className="h-10 w-3/4 bg-muted rounded-lg" />
        </motion.div>

        <motion.div variants={fadeInItem}>
          <Skeleton className="h-8 w-1/3 bg-muted rounded-md" />
        </motion.div>

        <motion.div variants={fadeInItem} className="space-y-2">
          <Skeleton className="h-4 w-full bg-muted/70 rounded" />
          <Skeleton className="h-4 w-5/6 bg-muted/60 rounded" />
          <Skeleton className="h-4 w-3/4 bg-muted/50 rounded" />
        </motion.div>

        {/* Buttons */}
        <motion.div variants={fadeInItem} className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12 w-full rounded-lg bg-muted/80" />
          <Skeleton className="h-12 w-full rounded-lg bg-muted/60" />
        </motion.div>

        {/* Tags */}
        <motion.div variants={fadeInItem} className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full bg-muted/70" />
          ))}
        </motion.div>

        {/* Accordions */}
        <motion.div variants={fadeInItem} className="space-y-4 pt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-muted/60 rounded" />
              <Skeleton className="h-4 w-full bg-muted/40 rounded" />
              <Skeleton className="h-4 w-5/6 bg-muted/30 rounded" />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Framer Motion Animations
const fadeInItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};
