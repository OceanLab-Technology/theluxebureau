"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useRouter } from "next/navigation";
import { CartSheet } from "../CartComponents";

export default function Header() {
  const [extended, setExtended] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();

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
    { label: "About Us", href: "https://www.theluxebureau.com/about-draft" },
    { label: "The Campaign", href: "https://www.theluxebureau.com/campaign-draft" },
  ];

  const socialLinks = [
    { label: "Contact", href: "https://www.theluxebureau.com/contact" },
    { label: "Instagram", href: "https://www.instagram.com/theluxebureau/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/the-luxebureau" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        // height: extended ? "41.25rem" : (isMobile ? "3.9375rem" : "5.9375rem"),
        height: extended ? "41.25rem" : undefined,
        backgroundColor: extended ? "rgba(80, 70, 45, 0.95)" : "#FBF7E5",
      }}
      onMouseLeave={() => setExtended(false)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`font-[Century-Old-Style] fixed top-0 left-0 right-0 z-[99999] h-[3.9375rem] md:h-[5.9375rem] md:py-0 py-5 w-full overflow-hidden text-background bg-background ${extended ? "backdrop-blur-sm" : ""
        }`}
    >
      <div className="relative md:py-8.5 flex items-center justify-between px-6">
        <div className="flex items-center gap-x-1 md:gap-x-20 lg:gap-x-36">
          <div className="flex items-center space-x-2">
            <div className="md:hidden flex items-center space-x-2">
              {!mobileMenuOpen ? (
                <button
                  className="flex flex-col space-y-1"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="block w-5 h-0.5 bg-stone-700 rounded-[2px]"></span>
                  <span className="block w-5 h-0.5 bg-stone-700 rounded-[2px]"></span>
                </button>
              ) : (
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer" />
                </button>
              )}
            </div>
            <Link
              href="https://www.theluxebureau.com/home-full"
              className={`md:relative absolute left-1/2 -translate-x-1/2 cursor-pointer md:w-auto md:scale-100 scale-55 md:h-auto flex-shrink-0 ${extended ? "text-background" : "text-stone-600"
                }`}
            >
              <Logo fill={extended ? "#FBF7E5" : "#50462D"} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center md:space-x-20 space-x-32 lg:space-x-56">
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
                    className={`text-[15px] leading-[18px] font-schoolbook-cond font-[400]  cursor-pointer ${extended
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
                  className={`text-[15px] leading-[18px] font-schoolbook-cond font-[400]  ${extended
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

        <div className="flex items-center space-x-2 mr-2">
          <div className="hidden md:block">
            <CartSheet
              className={`${extended
                ? "text-background hover:text-[#FBD060]"
                : "text-stone-700 hover:text-stone-900"
                }`}
            />
          </div>
          <div className="md:hidden flex gap-2 justify-center items-center">
            <svg
              onClick={(e) => {
                if (
                  handleProtectedRoute(e, "/account", "access your account")
                ) {
                  router.push("/account");
                }
                setMobileMenuOpen(false);
              }}
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2437_16208)">
                <path
                  d="M14.8278 16.006C14.8278 16.2303 14.6316 16.4138 14.3917 16.4138C14.1519 16.4138 13.9556 16.2303 13.9556 16.006C13.9556 12.6298 11.025 9.88966 7.41404 9.88966C3.80308 9.88966 0.872455 12.6298 0.872455 16.006C0.872455 16.2303 0.676208 16.4138 0.43635 16.4138C0.196492 16.4138 0.000244141 16.2303 0.000244141 16.006C0.000244141 12.1772 3.31901 9.07414 7.41404 9.07414C11.5091 9.07414 14.8278 12.1772 14.8278 16.006ZM7.41404 8.25863C5.00674 8.25863 3.05298 6.43187 3.05298 4.18104C3.05298 1.93021 5.00674 0.103455 7.41404 0.103455C9.82134 0.103455 11.7751 1.93021 11.7751 4.18104C11.7751 6.43187 9.82134 8.25863 7.41404 8.25863ZM7.41404 7.44311C9.34162 7.44311 10.9029 5.98333 10.9029 4.18104C10.9029 2.37875 9.34162 0.918972 7.41404 0.918972C5.48645 0.918972 3.92519 2.37875 3.92519 4.18104C3.92519 5.98333 5.48645 7.44311 7.41404 7.44311Z"
                  fill="#1e1204"
                />
              </g>
              <defs>
                <clipPath id="clip0_2437_16208">
                  <rect
                    width="14.8276"
                    height="16.3103"
                    fill="white"
                    transform="translate(0.000244141 0.103455)"
                  />
                </clipPath>
              </defs>
            </svg>

            <div className="pl-2 flex justify-center items-center">
              <CartSheet
                className={`${extended
                  ? "text-background hover:text-[#FBD060]"
                  : "text-stone-700 hover:text-stone-900"
                  }`}
              />
            </div>
          </div>
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
            <div
              className="flex-shrink-0 md:w-[365px] lg:w-[425px]"
              style={{ width: "" }}
            ></div>

            <div className="flex items-start space-x-16 lg:space-x-10">
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
            className="fixed inset-0 z-[9998] bg-secondary-foreground px- py-4 text-background flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center relative justify-between mb-6 px-4">
              <div className="flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl"
                >
                  <X />
                </button>
              </div>
              <h2 className="absolute left-1/2 transform -translate-x-1/2 text-[.9rem] font-[Century-Old-Style] flex items-center gap-1 font-[100] text-background">
                <span className="tracking-widest">the</span>
                <span className="uppercase italic tracking-[5px]">luxe</span>
                <span className="uppercase tracking-[5px]">BUreau</span>
              </h2>
              <div className="flex gap-6">
                <img
                  onClick={(e) => {
                    if (
                      handleProtectedRoute(e, "/account", "access your account")
                    ) {
                      router.push("/account");
                    }
                    setMobileMenuOpen(false);
                  }}
                  src="/user.svg"
                  alt=""
                />
                <div>
                  {/* <CartSheet /> */}
                  <CartSheet
                    className={`${extended
                      ? "text-background hover:text-[#FBD060]"
                      : "text-stone-700 hover:text-stone-900"
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div className="space-y-10 py-10 text-[1.5rem] px-6 font-light w-full">
              <div className="grid grid-cols-3">
                <div className="text-xs font-schoolbook-cond tracking-widest">
                  HOME
                </div>
                <div className="space-y-2"></div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-xs col-span-1 font-schoolbook-cond tracking-widest">
                  SHOP
                </div>
                <div className="col-span-2">
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

              <div className="grid grid-cols-3">
                <div className="text-xs font-schoolbook-cond tracking-widest col-span-1">
                  DISCOVER
                </div>
                <div className="col-span-2">
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

              <div className="space-y-4 pt-4 gap-4">
                {socialLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[#FBD060] font-[100] font-[Century-Old-Style] text-[1rem] uppercase hover:text-background transition-colors"
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
