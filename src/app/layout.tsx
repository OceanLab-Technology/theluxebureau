import type { Metadata } from "next";
import { Cormorant_Infant, Geist, Geist_Mono, PT_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalKeyboardHandler } from "@/components/PersonaliseComponents/GlobalKeyboardHandler";
import { CustomCursor } from "@/components/Tools/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  display: "swap",
  style: "normal",
  weight: ["400", "700"],
  fallback: ["serif"],
});

const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "theluxebureau",
    template: "theluxebureau"
  },
  description: "the luxe bureau",
  icons: {
    icon: "/Profile_Favicon.png",
    apple: "/Profile_Favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable} ${cormorantInfant.variable} antialiased`}
      > <GlobalKeyboardHandler />
        <main className="">{children}</main>
        <CustomCursor/>
        <Toaster toastOptions={{
          unstyled: true,
          style:{
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
            // fontWeight: "100",
            display: "flex",
            gap: "8px",
            fontFamily: "var(--font-pt-serif)",
            background:"#40362c",
            color:"#FBD060",
            border:"1px solid #40362c",
          },
          // descriptionClassName: "text-sm text-stone-400",
        }} duration={2000} />
      </body>
    </html>
  );
}
