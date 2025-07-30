"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  return <>{!isAdminRoute && <Header />}</>;
};

export default HeaderWrapper;
