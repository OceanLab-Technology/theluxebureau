"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {Footer} from "./Footer";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  return <>{!isAdminRoute && <Footer />}</>;
};

export default HeaderWrapper;
