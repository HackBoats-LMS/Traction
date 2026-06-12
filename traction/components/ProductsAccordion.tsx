"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import Link from 'next/link';

export default function ProductsAccordion() {
  const [activeTab, setActiveTab] = useState('Atlas');

  const tabs = [
    { id: 'Green Tool', label: 'Green Tool', image: '/images/green-tool.png', url: process.env.NEXT_PUBLIC_GREEN_TOOL_URL },
    { id: 'one-to-one', label: 'one-to-one', image: '/images/1-2-1.png', url: process.env.NEXT_PUBLIC_ONE_TO_ONE_URL },
    { id: 'Atlas', label: 'Atlas', image: '/atlaslogo.png', url: process.env.NEXT_PUBLIC_NEARBY_URL },
  ];

  return (
    <section className="w-full bg-transparent pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col border border-transparent bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex flex-col">
              <button
                onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                className={`w-full flex items-center justify-center py-4 px-6 text-center transition-colors ${index !== 0 ? 'border-t border-black/5' : ''} ${activeTab === tab.id
                    ? 'bg-green-600 text-white font-bold'
                    : 'bg-white text-[#86868B] font-medium hover:bg-[#F5F5F7]'
                  }`}
              >
                {tab.label}
              </button>
              <AnimatePresence>
                {activeTab === tab.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#F5F5F7]"
                  >
                    <div className="w-full flex justify-center border-t border-black/5">
                      <Link href={tab.url || "#"} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center">
                        <Image
                          src={tab.image}
                          alt={tab.label}
                          width={1200}
                          height={800}
                          className="w-full h-auto object-contain hover:opacity-90 transition-opacity"
                        />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
