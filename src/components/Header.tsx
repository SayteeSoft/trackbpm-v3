import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-primary">
      <div className="container mx-auto px-4 py-8 pb-20 flex items-center justify-center">
        <Link href="/" className="text-6xl font-black tracking-tighter text-primary-foreground flex items-center gap-2">
          TRACK ⚡ BPM
        </Link>
      </div>
    </header>
  );
}
