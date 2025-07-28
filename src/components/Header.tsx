import Link from "next/link";
import React from "react";

export default function Header() {
  const links = [
    { href: "/products", label: "SHOP" },
    { href: "/discover", label: "DISCOVER" },
    { href: "/account", label: "ACCOUNT" },
  ];
  return (
    <header className="border-b border-b-stone-400/40 font-century">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-6">
        <div className="text-sm font-light tracking-wider text-stone-600 flex items-center gap-2">
          the{" "}
          <span className="font-[200] text-xl tracking-widest">
            <span className="italic">LUXE</span> BUREAU
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-40 font-semibold">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-700 hover:text-stone-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs tracking-wider text-stone-700 font-semibold">
          CART (0)
        </div>
      </div>
    </header>
  );
}
