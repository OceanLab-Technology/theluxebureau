"use client";

import Link from "next/link";
import React from "react";
import { CartIcon } from "../CartComponents/CartIcon";
import { CartDrawer } from "../CartComponents/CartDrawer";
import { User2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const links = [
    { href: "/products", label: "SHOP" },
    { href: "/discover", label: "DISCOVER" },
    { href: "/account", label: "ACCOUNT" },
  ];

  const [extended, setExtended] = React.useState<boolean>(false);

  return (
    <motion.div
      initial={false}
      animate={{
        height: extended ? "60vh" : "4rem",
        backgroundColor: extended ? "#50462DF2" : "#FBF7E5",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`font-century fixed top-0 left-0 right-0 z-[999999] w-full overflow-hidden text-background  border-b bg-background ${
        extended ? "border-none backdrop-blur-sm" : "border-b-stone-400/30"
      }`}
      onMouseEnter={() => setExtended(true)}
      onMouseLeave={() => setExtended(false)}
    >
      <div className="relative mx-auto flex h-16 max-w-8xl items-center justify-between px-6">
        <Link
          href="/"
          className={`text-sm font-light tracking-wider flex items-center gap-2 cursor-pointer ${
            extended ? "text-background" : "text-stone-600"
          }`}
        >
          the{" "}
          <span className="font-[200] text-xl tracking-widest">
            <span className="italic">LUXE</span> BUREAU
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-40">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                extended
                  ? "text-background hover:text-[#FBD060]"
                  : "text-stone-700 hover:text-stone-900"
              } text-sm transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <CartIcon
              className={`${
                extended
                  ? "text-background hover:text-[#FBD060]"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            />
          </div>
          <div className="md:hidden">
            <CartDrawer />
          </div>
          <Link
            href="/account"
            className="text-stone-700 text-sm hover:text-stone-900 transition-colors md:hidden block"
          >
            <User2 className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {extended && (
          <motion.div
            key="extended-content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center px-6 pt-8"
          >
            <div className="text-[32px]">
              <div className="grid grid-cols-2 gap-16">
                <div className="flex flex-col items-start space-y-2">
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    Shop All
                  </button>
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    Literature
                  </button>
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    Drinks & Spirits
                  </button>
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    Floral
                  </button>
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    Home
                  </button>
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    About Us
                  </button>
                  <button className="hover:text-[#FBD060] cursor-pointer transition-colors">
                    The Campaign
                  </button>
                </div>
              </div>
              <div className="flex gap-16 pt-10 justify-end items-start text-[15px] text-[#FBD060] space-y-2">
                <button className="hover:text-stone-300 cursor-pointer transition-colors">
                  Instagram
                </button>
                <button className="hover:text-stone-300 cursor-pointer transition-colors">
                  LinkedIn
                </button>
                <button className="hover:text-stone-300 cursor-pointer transition-colors">
                  Email
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
