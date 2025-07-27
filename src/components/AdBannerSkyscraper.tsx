import Link from 'next/link';

export default function AdBannerSkyscraper() {
  return (
    <Link 
      href="https://www.paypal.com/ncp/payment/AKJNWAU8PSSNE" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="sticky top-8 flex flex-col items-center justify-center h-[600px] w-[160px] bg-[#cacaca] rounded-md"
    >
      <div className="text-center text-gray-700">
        <p className="text-xs font-semibold">Click</p>
        <p className="text-lg font-bold">Advertise Here</p>
        <p className="text-sm">(160x600)</p>
      </div>
    </Link>
  );
}
