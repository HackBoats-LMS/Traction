import { BarChart3, HeartHandshake, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';

const products = [
  {
    id: 'green-tool',
    title: 'Green Tool',
    subtitle: 'Track Growth Analytics & KPIs',
    description: 'A comprehensive dashboard to monitor your performance, track key metrics, and measure engagement across all your activities. Stay on top of your targets with real-time analytics.',
    icon: <BarChart3 className="w-8 h-8 text-green-600" />,
    image: '/images/green-tool.png',
    reverse: false,
    url: process.env.NEXT_PUBLIC_GREEN_TOOL_URL,
  },
  {
    id: 'one-to-one',
    title: '1-2-1 Conclave',
    subtitle: 'Structured Meetings & ROI',
    description: 'Wipe out unstructured networking. 1-2-1 Conclave orchestrates real-time, round-based matchmaking events so you can pitch to active leads and exchange digital referrals instantly.',
    icon: <HeartHandshake className="w-8 h-8 text-green-600" />,
    image: '/images/1-2-1.png',
    reverse: true,
    url: process.env.NEXT_PUBLIC_ONE_TO_ONE_URL,
  },
  {
    id: 'nearby',
    title: 'Nearby Network',
    subtitle: 'Discover Local Opportunities',
    description: 'Find and connect with business professionals in your immediate vicinity. Our global network brings local connections directly to your device, wherever your travels take you.',
    icon: <MapPin className="w-8 h-8 text-green-600" />,
    image: '/images/nearby.png',
    reverse: false,
    url: process.env.NEXT_PUBLIC_NEARBY_URL,
  }
];

export default function ProductDescriptions() {
  return (
    <section id="our-products" className="w-full bg-transparent py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-[#1D1D1F]">Our Products</h2>
          <p className="text-[#86868B] max-w-2xl mx-auto text-lg">
            Everything you need to accelerate your business growth and build meaningful professional relationships.
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`flex flex-col ${product.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-4">
                  {product.icon}
                </div>
                <h3 className="text-3xl font-bold text-[#1D1D1F]">{product.title}</h3>
                <h4 className="text-xl font-semibold text-[#86868B]">{product.subtitle}</h4>
                <p className="text-[#86868B] text-lg leading-relaxed max-w-lg">
                  {product.description}
                </p>
                <Link href={product.url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mt-4">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Image Content */}
              <div className="flex-1 w-full">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)] flex items-center justify-center p-6 border border-transparent">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
