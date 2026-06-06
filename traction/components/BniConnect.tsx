import Image from 'next/image';
import Link from 'next/link';

export default function BniConnect({ isGridMode = false }: { isGridMode?: boolean }) {
  return (
    <section className={`w-full flex items-center justify-center ${isGridMode ? 'h-full' : 'py-12 px-6'}`}>
      <div className={`relative w-full h-full ${isGridMode ? 'max-w-full max-h-full' : 'max-w-4xl min-h-[400px] mx-auto'}`}>
        <Link href={process.env.NEXT_PUBLIC_NEARBY_URL || "#"} target="_blank" rel="noopener noreferrer" className="w-full h-full block hover:opacity-90 transition-opacity relative">
          <Image
            src="/images/nearby.png"
            alt="Nearby Network"
            fill
            className="object-contain"
          />
        </Link>
      </div>
    </section>
  );
}
