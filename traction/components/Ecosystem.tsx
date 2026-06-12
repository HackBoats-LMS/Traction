import { BarChart3, HeartHandshake, MapPin } from 'lucide-react';

export default function Ecosystem({ isGridMode = false }: { isGridMode?: boolean }) {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-green-600" />,
      label: "Green Tool",
      title: "Track Growth",
      desc: "Analytics & KPIs"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-green-600" />,
      label: "one-to-one",
      title: "Build Relationships",
      desc: "Structured Meetings"
    },
    {
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      label: "Atlas",
      title: "Discover Opportunities",
      desc: "Atlas Networking"
    }
  ];

  return (
    <section className={`w-full px-6 ${isGridMode ? 'bg-transparent py-2 border-none' : 'bg-transparent py-16 border-t border-black/5'}`}>
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center h-full">
        <div className={`text-center ${isGridMode ? 'mb-6' : 'mb-12'}`}>
          <h3 className="text-green-600 font-bold text-[10px] md:text-xs tracking-widest uppercase mb-2 md:mb-4">Our Ecosystem</h3>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-[#1D1D1F]">From Insight to Opportunity.</h2>
          <p className="text-[#86868B] max-w-xl mx-auto text-xs md:text-base">
            Understand performance, build stronger relationships, and discover new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-5xl mx-auto w-full">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-[#FBFBFB] rounded-xl p-2 sm:p-4 lg:p-6 border border-black/10 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-row items-center justify-center gap-1 md:gap-2 mb-3 md:mb-5">
                <div className="scale-75 md:scale-90 shrink-0 text-green-600">
                  {feature.icon}
                </div>
                <span className="font-bold text-green-600 text-[9px] sm:text-[10px] md:text-xs lg:text-sm whitespace-nowrap">{feature.label}</span>
              </div>
              <h4 className="font-bold text-[8px] sm:text-[9px] md:text-xs lg:text-sm mb-1 md:mb-2 text-[#1D1D1F] whitespace-nowrap">{feature.title}</h4>
              <p className="text-[#555555] text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs whitespace-nowrap">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
