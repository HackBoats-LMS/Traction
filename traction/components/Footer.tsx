import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1D1D1F] text-white py-8 md:py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-10">
        {/* Brand Section */}
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="mb-4 md:mb-6">
            <Image
              src="/traction-logo.png"
              alt="Traction Logo"
              width={224}
              height={60}
              className="w-28 sm:w-36 md:w-48 lg:w-56 h-auto object-contain"
            />
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-2 md:mb-6">
            Empowering professionals with performance analytics, structured meetings, and local opportunity discovery.
          </p>
        </div>

        {/* Links Columns */}
        <div className="sm:col-span-1 lg:col-span-1">
          <h4 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4">Products</h4>
          <ul className="space-y-2 md:space-y-3">
            <li><Link href={process.env.NEXT_PUBLIC_GREEN_TOOL_URL || "#"} className="text-gray-400 hover:text-white transition-colors text-sm">Green Tool</Link></li>
            <li><Link href={process.env.NEXT_PUBLIC_ONE_TO_ONE_URL || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">1-2-1 Conclave</Link></li>
            <li><Link href={process.env.NEXT_PUBLIC_NEARBY_URL || "#"} className="text-gray-400 hover:text-white transition-colors text-sm">Atlas</Link></li>
          </ul>
        </div>

        <div className="sm:col-span-1 lg:col-span-2">
          <h4 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4">Contact Info</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <Link href="mailto:official@hackboats.com" className="hover:text-white transition-colors hover:underline">official@hackboats.com</Link>
            </li>
            <li className="flex items-start gap-2">
              <span>📞</span>
              <span>+91 8886099957<br/>+91 8886099927</span>
            </li>
            <li className="pt-2 border-t border-white/10 mt-3 flex flex-col gap-1.5">
              <div className="flex gap-2 whitespace-nowrap">
                <span className="text-white">Mahan:</span>
                <Link href="mailto:mhrk.iot@gmail.com" className="hover:text-white transition-colors hover:underline">mhrk.iot@gmail.com</Link>
              </div>
              <div className="flex gap-2 whitespace-nowrap">
                <span className="text-white">Yaswanth:</span>
                <Link href="mailto:yaswanth45a7@gmail.com" className="hover:text-white transition-colors hover:underline">yaswanth45a7@gmail.com</Link>
              </div>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-1 lg:col-span-1">
          <h4 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4">Legal</h4>
          <ul className="space-y-2 md:space-y-3 flex flex-col">
            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
        <p className="text-gray-400 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Traction. All rights reserved.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Twitter</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">LinkedIn</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Instagram</Link>
          </div>
          <div className="flex items-center gap-3 pl-0 md:pl-6 border-l-0 md:border-l border-white/10 pt-4 md:pt-0 w-full md:w-auto justify-center md:justify-start border-t md:border-t-0">
            <span className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-bold">Powered by</span>
            <Link href="https://www.hackboats.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Image
                src="/hb-logo.png"
                alt="HB Logo"
                width={128}
                height={40}
                className="w-20 sm:w-28 md:w-32 h-auto object-contain brightness-110"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
