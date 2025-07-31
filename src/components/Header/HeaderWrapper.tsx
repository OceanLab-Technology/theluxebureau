"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");
  return <>{!isAdminRoute && <Header />}</>;
};

export default HeaderWrapper;
