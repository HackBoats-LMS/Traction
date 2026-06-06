import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1D1D1F] text-white py-8 md:py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-12">
        {/* Brand Section */}
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4 md:mb-6">
            <img
              src="/traction-logo.png"
              alt="Traction Logo"
              className="w-28 sm:w-36 md:w-48 lg:w-56 h-auto object-contain"
            />
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-2 md:mb-6">
            Empowering professionals with performance analytics, structured meetings, and local opportunity discovery.
          </p>
        </div>

        {/* Links Columns */}
        <div className="col-span-1">
          <h4 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4">Products</h4>
          <ul className="space-y-2 md:space-y-3">
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Green Tool</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">1-2-1 Conclave</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Nearby Network</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4">Company</h4>
          <ul className="space-y-2 md:space-y-3">
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">About Us</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Careers</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Contact Support</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4">Legal</h4>
          <ul className="space-y-2 md:space-y-3 flex flex-col sm:flex-row sm:space-y-0 sm:gap-6 md:flex-col md:space-y-3 md:gap-0">
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Privacy Policy</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Terms of Service</Link></li>
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
            <img
              src="/hb-logo.png"
              alt="HB Logo"
              className="w-20 sm:w-28 md:w-32 h-auto object-contain brightness-110"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
