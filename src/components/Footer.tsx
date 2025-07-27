import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-[#222222] text-white">
      <div className="container mx-auto px-4 py-4 text-center text-sm">
        <div className="flex justify-center items-center flex-wrap gap-x-2 gap-y-1">
            <span>
                Site By <a href="https://web-developer.one/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Saytee Software</a>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>&copy;2025 TRACK⚡BPM</span>
            <span className="hidden sm:inline">|</span>
            <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="#" className="underline hover:text-primary">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
