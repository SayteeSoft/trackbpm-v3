import Link from 'next/link';

export default function AdBanner() {
  return (
    <Link 
      href="/pricing"
      className="flex flex-col items-center justify-center h-[90px] w-full max-w-[728px] bg-[#cacaca] rounded-md mx-auto"
    >
      <div className="text-center text-gray-700">
        <p className="text-xs font-semibold">Click</p>
        <p className="text-lg font-bold">Advertise Here</p>
        <p className="text-sm sm:hidden">(300x50)</p>
        <p className="text-sm hidden sm:block">(728x90)</p>
      </div>
    </Link>
  );
}
