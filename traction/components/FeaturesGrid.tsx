import Image from 'next/image';
import Link from 'next/link';
import Ecosystem from './Ecosystem';

export default function FeaturesGrid() {
  return (
    <div className="hidden xl:flex w-full py-10 px-6 xl:px-10 bg-transparent justify-center">
      <div className="grid grid-cols-2 w-full max-w-[1400px]">
        {/* Top Left: Green Tool Image */}
        <div className="border border-black/10 flex items-center justify-center group p-0">
          <Link href={process.env.NEXT_PUBLIC_GREEN_TOOL_URL || "#"} className="w-full h-full flex items-center">
            <img
              src="/images/green-tool.png"
              alt="Green Tool Dashboard"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </Link>
        </div>

        {/* Top Right: Ecosystem */}
        <div className="border border-black/10 flex items-center justify-center p-6">
          <div className="w-full flex items-center justify-center transform scale-[0.9] 2xl:scale-100 origin-center">
            <Ecosystem isGridMode={true} />
          </div>
        </div>

        {/* Bottom Left: 1-2-1 Image */}
        <div className="border border-black/10 flex items-center justify-center group p-0">
          <Link href={process.env.NEXT_PUBLIC_ONE_TO_ONE_URL || "#"} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center">
            <Image
              src="/images/onetoone.png"
              alt="1-2-1 Conclave Interface"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </Link>
        </div>

        {/* Bottom Right: Atlas Image */}
        <div className="border border-black/10 flex items-center justify-center group p-0">
          <Link href={process.env.NEXT_PUBLIC_NEARBY_URL || "#"} className="w-full h-full flex items-center">
            <Image
              src="/images/atlas1.png"
              alt="Atlas Network Interface"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
