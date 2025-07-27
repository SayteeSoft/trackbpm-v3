import Image from 'next/image';
import Link from 'next/link';

export default function AdBannerSkyscraper() {
  return (
    <Link href="https://www.paypal.com/ncp/payment/AKJNWAU8PSSNE" target="_blank" rel="noopener noreferrer" className="sticky top-8">
      <Image
        src="https://placehold.co/160x600.png"
        alt="Skyscraper advertisement banner"
        width={160}
        height={600}
        className="rounded-md"
        data-ai-hint="advertisement banner"
      />
    </Link>
  );
}
