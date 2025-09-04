"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     setIsLargeScreen(window.innerWidth >= 1024);
  //   };
  //   checkScreenSize();
  //   window.addEventListener("resize", checkScreenSize);

  //   return () => {
  //     window.removeEventListener("resize", checkScreenSize);
  //   };
  // }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isLargeScreen) {
      root.classList.add("has-custom-cursor");
    } else {
      root.classList.remove("has-custom-cursor");
    }

    const el = ref.current;
    if (!el || !isLargeScreen) return;

    const hotspotX = 10;
    const hotspotY = 10;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - hotspotX;
      const y = e.clientY - hotspotY;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      root.classList.remove("has-custom-cursor");
    };
  }, [isLargeScreen]);

  return isLargeScreen ? (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[999999999] pointer-events-none"
      style={{
        width: 24,
        height: 24,
        willChange: "transform",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 325.78 325.79"
        width="22"
        height="22"
      >
        <path
          fill="#fbd060"
          d="M197.59,197.58l-55.08,120.8c-4.64,6.31-10.09,8.51-17.92,6.92-8.92-1.82-11.05-11.06-14.02-18.23C71.34,212.2,38.5,114.43.2,19.19-1.44,7.29,7.24-1.41,19.2.19c95.34,38.11,192.89,71.4,287.88,110.37,4.12,1.69,10.56,3.6,13.72,6.53,7.72,7.14,6.13,19.75-2.41,25.41l-120.8,55.08Z"
        />
      </svg>
    </div>
  ) : null;
}
