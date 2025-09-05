'use client';

import React from 'react';
import Image from 'next/image';
import { CursorProvider, Cursor } from '@/components/ui/cursor';

interface CustomCursorProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomCursorProvider({ children, className }: CustomCursorProps) {
  return (
    <CursorProvider className={className}>
      {children}
      <Cursor className="w-5 h-5 z-[99999999]">
        <div className="relative w-full h-full pointer-events-none will-change-transform">
          <Image
            src="/cursorTLB.svg"
            alt="Custom cursor"
            width={32}
            height={32}
            className="w-full h-full object-contain drop-shadow-sm"
            priority
            quality={75}
          />
        </div>
      </Cursor>
    </CursorProvider>
  );
}

export { useCursor, CursorFollow } from '@/components/ui/cursor';
