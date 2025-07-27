
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="w-full bg-primary">
      <div className={`container mx-auto px-4 py-8 flex items-center justify-center ${isHomePage ? 'pb-20' : 'pb-8'}`}>
        <div className="w-full max-w-[calc(42rem+90px)] text-center">
          <Link href="/" className="text-[100px] font-black text-primary-foreground flex items-center justify-center gap-2">
            TRACK ⚡ BPM
          </Link>
        </div>
      </div>
    </header>
  );
}
