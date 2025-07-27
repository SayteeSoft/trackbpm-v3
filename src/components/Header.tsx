import { Bolt } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6 flex items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tighter flex items-center gap-2">
          TRACK <Bolt className="h-10 w-10" /> BPM
        </h1>
      </div>
    </header>
  );
}
