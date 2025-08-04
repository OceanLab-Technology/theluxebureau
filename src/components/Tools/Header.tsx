"use client";
import Link from "next/link";
import React from "react";
import { CartIcon } from "../CartComponents/CartIcon";
import { Menu, User2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Header() {
  const links = [
    { href: "/products", label: "SHOP" },
    { href: "/discover", label: "DISCOVER" },
    { href: "/account", label: "ACCOUNT" },
  ];

  const shopCategories = [
    { label: "Shop All", href: "/products" },
    { label: "Literature", href: "/products?category=Literature" },
    {
      label: "Drinks & Spirits",
      href: `/products?category=${encodeURIComponent("Drinks & Spirits")}`,
    },
    { label: "Floral", href: "/products?category=Floral" },
    { label: "Home", href: "/products?category=Home" },
  ];

  const aboutLinks = [
    { label: "About Us", href: "/about" },
    { label: "The Campaign", href: "/campaign" },
  ];

  const socialLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ];

  const [extended, setExtended] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = React.useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const supabase = createClient();

  const authenticateUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("User not authenticated");
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setExtended(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      initial={false}
      animate={{
        height: extended ? "41.25rem" : "5.9375rem",
        backgroundColor: extended ? "rgba(80, 70, 45, 0.95)" : "#FBF7E5",
        y: isVisible ? 0 : -100,
      }}
      onMouseLeave={() => setExtended(false)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`font-century fixed top-0 left-0 right-0 z-[999999] w-full overflow-hidden text-background bg-background ${
        extended ? "backdrop-blur-sm" : ""
      }`}
    >
      <div className="relative py-7 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="md:hidden flex items-center space-x-2">
            {!mobileMenuOpen ? (
              <button onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer" />
              </button>
            ) : (
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer" />
              </button>
            )}
          </div>
          <Link
            href="/"
            className={`cursor-pointer md:w-auto md:scale-100 scale-75 md:h-auto flex-shrink-0 ${
              extended ? "text-background" : "text-stone-600"
            }`}
          >
            <Logo fill={extended ? "#FBF7E5" : "#50462D"} />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-16 lg:space-x-60">
          {links.map((link) => (
            <Link
              onClick={async (e) => {
                if (
                  link.href === "/account" ||
                  link.href === "/discover" ||
                  link.href === "/products"
                ) {
                  const isAuthenticated = await authenticateUser();
                  if (!isAuthenticated) {
                    e.preventDefault();
                    toast.error("Please log in to access this page.");
                    return;
                  }
                }
                setExtended(false);
              }}
              onMouseEnter={() => setExtended(true)}
              key={link.href}
              href={link.href}
              className={`text-[0.9rem] font-[400] ${
                extended
                  ? "text-background hover:text-[#FBD060]"
                  : "text-stone-700 hover:text-stone-900"
              }`}
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

          {mobileMenuOpen && (
            <>
              <Link
                href="/account"
                onClick={async (e) => {
                  const isAuthenticated = await authenticateUser();
                  if (!isAuthenticated) {
                    e.preventDefault();
                    toast.error("Please log in to access this page.");
                    return;
                  }
                  setMobileMenuOpen(false);
                }}
                className="text-background text-sm hover:text-[#FBD060] transition-colors md:hidden block"
              >
                <User2 className="h-5 w-5" />
              </Link>
              <CartIcon className="text-background hover:text-[#FBD060] md:hidden" />
            </>
          )}
        </div>
      </div>

      {extended && (
        <motion.div
          key="extended-content"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="px-6 pt-8 h-full relative"
        >
          <div className="flex items-start justify-between">
            <div className="flex-shrink-0" style={{ width: "450px" }}></div>

            <div className="flex-1 flex justify-center">
              <div className="flex space-x-16 lg:space-x-40">
                <div className="flex flex-col items-start space-y-3">
                  {shopCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="text-[2rem] leading-[1.8rem] font-light text-background hover:text-[#FBD060] transition-colors"
                      onClick={async () => {
                        const isAuthenticated = await authenticateUser();
                        if (!isAuthenticated) {
                          toast.error("Please log in to access this page.");
                          return;
                        }
                        setExtended(false);
                      }}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>

                {/* About Links - positioned under DISCOVER */}
                <div className="flex flex-col items-start space-y-3">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[2rem] leading-[1.8rem] font-light text-background hover:text-[#FBD060] transition-colors"
                      onClick={() => setExtended(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div style={{ width: "100px" }}></div>
              </div>
            </div>

            <div className="flex-shrink-0" style={{ width: "60px" }}></div>
          </div>
          <div className="absolute bottom-30 right-20 flex gap-20 text-[1rem]">
            {socialLinks.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                className="hover:text-background text-[#FBD060] transition-colors"
                onClick={() => setExtended(false)}
                {...(social.href.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {social.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999999] bg-[#50462D] px-6 py-8 text-background flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl"
                >
                  <X />
                </button>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Logo fill="#FBF7E5" />
                </Link>
              </div>
              <CartIcon className="text-background hover:text-[#FBD060]" />
            </div>

            {/* Mobile Menu Content */}
            <div className="space-y-20 text-[1.5rem] font-light w-full">
              <div className="grid grid-cols-2">
                <div className="text-xs text-[#FBD060] tracking-widest">
                  SHOP
                </div>
                <div className="space-y-2">
                  {shopCategories.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={async (e) => {
                        const isAuthenticated = await authenticateUser();
                        if (!isAuthenticated) {
                          e.preventDefault();
                          toast.error("Please log in to access this page.");
                          return;
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="block hover:text-[#FBD060] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="text-xs text-[#FBD060] tracking-widest">
                  DISCOVER
                </div>
                <div className="space-y-2">
                  {aboutLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={async (e) => {
                        if (item.href === "/discover") {
                          const isAuthenticated = await authenticateUser();
                          if (!isAuthenticated) {
                            e.preventDefault();
                            toast.error("Please log in to access this page.");
                            return;
                          }
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="block hover:text-[#FBD060] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2 flex gap-4">
                {socialLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[#FBD060] text-[1rem] hover:text-background transition-colors"
                    {...(item.href.startsWith("http")
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
