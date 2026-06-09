import React from 'react'
import Image from 'next/image'

const Navbar = ({ chapterData }: { chapterData?: any }) => {
    return (
        <div className='w-full border-b border-emerald-100 bg-[#ffffff] px-4 py-3 sm:px-6 md:px-10 lg:px-20'>

            <div className='flex items-center justify-between gap-4'>

                {/* Logo Text */}
                <div className='flex items-center flex-shrink-0'>
                    <Image
                             src="/traction-logo.png"
                             alt="Traction Logo"
                             width={200}
                             height={60}
                             className="w-32 sm:w-40 md:w-48 h-auto object-contain invert hue-rotate-180"
                             priority
                           />
                </div>

                {/* Powered By */}
                <div className='flex flex-col items-center'>
                    <p className='text-[8px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1'>
                        powered by
                    </p>

                    <a
                        href="https://www.hackboats.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="/hb-logo.png"
                            alt="Hybrid Brain"
                            className='h-8 sm:h-10 md:h-10 lg:h-10 w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105'
                        />
                    </a>
                </div>

            </div>
        </div>
    )
}

export default Navbar