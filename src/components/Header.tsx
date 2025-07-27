import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-primary">
      <div className="container mx-auto px-4 py-8 pb-20 flex items-center justify-center">
        <div className="w-full max-w-[calc(42rem+90px)] text-center">
          <Link href="/" className="text-[100px] font-black text-primary-foreground flex items-center justify-center gap-2">
            TRACK ⚡ BPM
          </Link>
        </div>
      </div>
    </header>
  );
}
