import Link from "next/link";
import { Spotify } from "./icons";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>TrackBPM helps you find the BPM and Key for any song. We hope you find our service helpful.</p>
        <p>Got questions or feedback? <a href="mailto:saytee.software@gmail.com" className="underline hover:text-primary">Let us know</a>.</p>
        <div className="flex items-center justify-center gap-2 mt-4">
            Song data provided by <Spotify className="h-5 w-5" /> Spotify
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TRACK ⚡ BPM</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
                <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                <Link href="#" className="hover:text-primary">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}