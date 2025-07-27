export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 border-t border-border">
      <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TrackBPM. All rights reserved.</p>
        <p>BPM data is crowdsourced and may not be accurate. Let us know of any issues at <a href="mailto:saytee.software@gmail.com" className="underline">saytee.software@gmail.com</a>.</p>
      </div>
    </footer>
  );
}
