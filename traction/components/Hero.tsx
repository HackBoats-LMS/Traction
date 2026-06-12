"use client";

import Image from 'next/image';

export default function Hero() {
  const scrollToNext = () => {
    const element = document.getElementById('our-products');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  return (
    <section className="relative w-full h-[80vh] min-h-[700px] max-h-[1000px] flex items-center justify-center bg-transparent overflow-hidden">
      {/* Illustration Background */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-end justify-center">
          <Image
            src="/illustration.svg"
            alt="People communicating over cup phone"
            fill
            className="object-contain object-bottom scale-[1.0] lg:scale-[1.15] opacity-10 xl:opacity-100 transition-opacity"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-10 -mt-24 md:-mt-40 lg:-mt-16">
        <h1 className="text-3xl md:text-[36px] font-black tracking-tight mb-4 leading-[1.2] text-[#1D1D1F]">
          Track <span className="text-[#10B981]">Growth</span>. Build Relationships.<br />
          Discover <span className="text-[#EF4444]">Opportunities</span>.
        </h1>
        <p className="text-[#86868B] text-sm md:text-base font-medium max-w-[550px] mx-auto mb-6 leading-relaxed">
          Traction brings together performance analytics, one-to-one networking, and Atlas business discovery—helping members build stronger relationships and generate more opportunities.
        </p>
        <button 
          onClick={scrollToNext}
          className="bg-[#A3E6B5] hover:bg-[#8fd9a3] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm border border-[#A3E6B5] cursor-pointer"
        >
          View Products
        </button>
      </div>
    </section>
  );
}
