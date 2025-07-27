import Image from 'next/image';
import Link from 'next/link';

export default function AdBanner() {
  return (
    <Link href="https://www.paypal.com/ncp/payment/AKJNWAU8PSSNE" target="_blank" rel="noopener noreferrer" className="relative block">
      <Image
        src="https://placehold.co/728x90.png"
        alt="Advertisement banner"
        width={728}
        height={90}
        className="rounded-md"
        data-ai-hint="advertisement banner"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
        <p className="text-white text-lg font-bold text-shadow">Advertise Here</p>
        <p className="text-white text-sm text-shadow-sm">(728x90)</p>
      </div>
    </Link>
  );
}