import Image from 'next/image';
import Link from 'next/link';

export default function AdBanner() {
  return (
    <Link href="https://www.paypal.com/ncp/payment/AKJNWAU8PSSNE" target="_blank" rel="noopener noreferrer">
      <Image
        src="https://placehold.co/728x90.png"
        alt="Advertisement banner"
        width={728}
        height={90}
        className="rounded-md"
        data-ai-hint="advertisement banner"
      />
    </Link>
  );
}
