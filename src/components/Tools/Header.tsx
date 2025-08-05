"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CartIcon } from "../CartComponents/CartIcon";
import { Menu, ShoppingCartIcon, User2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useRouter } from "next/navigation";

export default function Header() {
  const [extended, setExtended] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check authentication state
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Handle protected route clicks
  const handleProtectedRoute = (
    e: React.MouseEvent,
    route: string,
    feature: string
  ) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

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

  return (
    <motion.div
      initial={false}
      animate={{
        height: extended ? "41.25rem" : "5.9375rem",
        backgroundColor: extended ? "rgba(80, 70, 45, 0.95)" : "#FBF7E5",
      }}
      onMouseLeave={() => setExtended(false)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`font-century fixed top-0 left-0 right-0 z-[9] w-full overflow-hidden text-background bg-background ${
        extended ? "backdrop-blur-sm" : ""
      }`}
    >
      <div className="relative py-7.5 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4 md:space-x-35">
          <div className="flex items-center space-x-2">
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

          <nav className="hidden md:flex items-center space-x-16 lg:space-x-50">
            {links.map((link) => {
              const isProtectedRoute = link.href === "/account";

              if (isProtectedRoute) {
                return (
                  <button
                    key={link.href}
                    onClick={(e) => {
                      if (
                        handleProtectedRoute(
                          e,
                          link.href,
                          "access your account"
                        )
                      ) {
                        router.push(link.href);
                      }
                      setExtended(false);
                    }}
                    onMouseEnter={() => setExtended(true)}
                    className={`text-[15px] leading-[18px] font-schoolbook-cond font-[400]  cursor-pointer ${
                      extended
                        ? "text-background hover:text-[#FBD060]"
                        : "text-stone-700 hover:text-stone-900"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  onClick={() => {
                    setExtended(false);
                  }}
                  onMouseEnter={() => setExtended(true)}
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] leading-[18px] font-schoolbook-cond font-[400]  ${
                    extended
                      ? "text-background hover:text-[#FBD060]"
                      : "text-stone-700 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

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
              <button
                onClick={(e) => {
                  if (
                    handleProtectedRoute(e, "/account", "access your account")
                  ) {
                    router.push("/account");
                  }
                  setMobileMenuOpen(false);
                }}
                className="text-background text-sm hover:text-[#FBD060] transition-colors md:hidden block"
              >
                <User2 className="h-5 w-5" />
              </button>
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
          <div className="flex items-start">
            <div className="flex-shrink-0" style={{ width: "425px" }}></div>
            
            <div className="flex items-start space-x-16 lg:space-x-4">
              <div className="flex flex-col items-start space-y-3">
                {shopCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="text-[2rem] leading-[1.8rem] font-light text-background hover:text-[#FBD060] transition-colors"
                    onClick={() => {
                      setExtended(false);
                    }}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>

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

              <div></div>
            </div>
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
              <div className="flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl"
                >
                  <X />
                </button>
                <Link
                  className="scale-50"
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Logo fill="#FBF7E5" />
                </Link>
              </div>
              {/* <CartIcon className="text-background hover:text-[#FBD060]" /> */}
              <button
                onClick={(e) => {
                  if (handleProtectedRoute(e, "/cart", "access your cart")) {
                    router.push("/cart");
                  }
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingCartIcon className="text-background hover:text-[#FBD060] h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="space-y-20 text-[1.5rem] font-light w-full">
              <div className="grid grid-cols-2">
                <div className="text-xs font-schoolbook-cond text-[#FBD060] tracking-widest">
                  SHOP
                </div>
                <div className="space-y-2">
                  {shopCategories.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
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
                <div className="text-xs text-[#FBD060] font-schoolbook-cond tracking-widest">
                  DISCOVER
                </div>
                <div className="space-y-2">
                  {aboutLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
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
                    className="block text-[#FBD060] font-schoolbook-cond text-[1rem] hover:text-background transition-colors"
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

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        feature="access your account"
      />
    </motion.div>
  );
}
