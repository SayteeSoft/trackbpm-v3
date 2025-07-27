import Image from 'next/image';
import Link from 'next/link';

export default function AdBannerSkyscraper() {
  return (
    <Link href="https://www.paypal.com/ncp/payment/AKJNWAU8PSSNE" target="_blank" rel="noopener noreferrer" className="sticky top-8 relative block">
      <Image
        src="https://placehold.co/160x600.png"
        alt="Skyscraper advertisement banner"
        width={160}
        height={600}
        className="rounded-md"
        data-ai-hint="advertisement banner"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
        <p className="text-white text-lg font-bold text-shadow">Advertise Here</p>
        <p className="text-white text-sm text-shadow-sm">(160x600)</p>
      </div>
    </Link>
  );
}