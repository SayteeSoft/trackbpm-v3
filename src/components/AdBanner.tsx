import Link from 'next/link';

export default function AdBanner() {
  return (
    <Link 
      href="https://www.paypal.com/ncp/payment/AKJNWAU8PSSNE" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex flex-col items-center justify-center h-[90px] w-full max-w-[728px] bg-[#cacaca] rounded-md mx-auto"
    >
      <div className="text-center text-black">
        <p className="text-lg font-bold">Advertise Here</p>
        <p className="text-sm">(728x90)</p>
      </div>
    </Link>
  );
}
