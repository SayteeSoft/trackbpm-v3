import Link from "next/link";
import { Separator } from "./ui/separator";
import { Spotify } from "./icons";

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="bg-[#151515] py-8">
        <div className="container mx-auto px-4 text-center text-sm text-white space-y-4">
            <div>
              <p>TRACK⚡BPM helps you find the BPM and Key for any song.</p>
              <p>We hope you find our service helpful.</p>
            </div>
            <p>Got questions or feedback? <Link href="#" className="underline hover:text-primary">Let us know.</Link></p>
            <div className="flex items-center justify-center gap-2">
                <span>Song data provided by</span>
                <Spotify className="h-5 w-5"/>
                <span>Spotify</span>
            </div>
        </div>
      </div>
      <div className="w-full bg-[#111111]">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
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
      </div>
    </footer>
  );
}
