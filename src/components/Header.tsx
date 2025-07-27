import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-6 flex items-center justify-center">
        <Link href="/" className="text-5xl font-bold tracking-tighter flex items-center gap-2">
          TRACK<span className="text-blue-500">⚡</span>BPM
        </Link>
      </div>
    </header>
  );
}
