import { Link } from 'next-view-transitions';
import React from "react";
import { CartIcon } from "./CartComponents/CartIcon";
import { CartDrawer } from "./CartComponents/CartDrawer";
import { User2 } from "lucide-react";

export default function Header() {
  const links = [
    { href: "/products", label: "SHOP" },
    { href: "/discover", label: "DISCOVER" },
    { href: "/account", label: "ACCOUNT" },
  ];
  return (
    <header className="border-b border-b-stone-400/30 font-century">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-light tracking-wider text-stone-600 flex items-center gap-2 cursor-pointer">
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
              className="text-stone-700 text-sm hover:text-stone-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <CartIcon />
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
    </header>
  );
}
