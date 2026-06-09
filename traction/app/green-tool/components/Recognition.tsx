import React from 'react';

export default function Recognition({ data, monthlyData, chapterData }: { data: any[], monthlyData: any[], chapterData: any }) {
  if (!data || data.length === 0) return null;

  const getHighest = (dataset: any[], key1: string, key2?: string) => {
    if (!dataset || dataset.length === 0) return { name: "N/A", value: "-" };
    const sorted = [...dataset].sort((a, b) => {
      const valA = (a[key1] || (key2 ? a[key2] : 0) || 0);
      const valB = (b[key1] || (key2 ? b[key2] : 0) || 0);
      return valB - valA;
    });
    const top = sorted[0];
    if (!top) return { name: "N/A", value: "-" };
    const val = top[key1] || (key2 ? top[key2] : 0) || 0;
    return { name: top.fullName, value: val };
  };

  const formatCurrency = (val: any) => {
    const num = Number(val) || 0;
    if (num >= 10000000) return (num / 10000000).toFixed(2) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
    return num.toFixed(0);
  };

  const overallVis = getHighest(data, 'visitors');
  const monthlyVis = getHighest(monthlyData, 'visitors');

  const overallRef = getHighest(data, 'referals', 'referralsGiven');
  const monthlyRef = getHighest(monthlyData, 'referals', 'referralsGiven');

  const overallTYFCB = getHighest(data, 'TYFCB');
  const monthlyTYFCB = getHighest(monthlyData, 'TYFCB');

  const Card = ({ title, overallName, overallVal, monthlyName, monthlyVal, icon, colorClass, borderClass, bgClass, textClass }: any) => (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-md hover:border-emerald-100 transition-all duration-300 relative overflow-hidden group`}>
      {/* Decorative subtle background flair */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full ${bgClass} opacity-30 blur-3xl group-hover:opacity-50 transition-opacity pointer-events-none`}></div>

      {/* Main Category Icon */}
      <div className="flex items-center gap-4 sm:w-1/4 shrink-0 sm:flex-col sm:items-start sm:justify-center">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${bgClass} flex items-center justify-center ${textClass} shrink-0 border ${borderClass} shadow-sm group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest leading-tight">{title}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        {/* Overall Champion (Gold Ribbon) */}
        <div className="flex-1 min-w-0 bg-gradient-to-br from-amber-50/80 to-white border border-amber-100/80 rounded-xl p-3 relative group/award hover:border-amber-200 transition-colors shadow-sm hover:shadow">
          <p className="text-[9px] font-extrabold text-amber-600/80 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Overall Champion
          </p>
          <div className="flex items-start gap-2.5">
            <svg className="w-7 h-7 text-amber-500 shrink-0 drop-shadow-sm group-hover/award:scale-110 group-hover/award:rotate-3 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="#fde68a"></polyline>
              <circle cx="12" cy="8" r="7" fill="#fef3c7"></circle>
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-gray-900 break-words leading-tight" title={overallName}>{overallName}</p>
              <div className="mt-1.5">
                <span className="text-[11px] text-amber-700 font-bold bg-amber-100/60 px-2.5 py-0.5 rounded-md border border-amber-200/50 shadow-sm inline-block">
                  {overallVal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Champion (Gold Ribbon) */}
        <div className="flex-1 min-w-0 bg-gradient-to-br from-amber-50/80 to-white border border-amber-100/80 rounded-xl p-3 relative group/award hover:border-amber-200 transition-colors shadow-sm hover:shadow">
          <p className="text-[9px] font-extrabold text-amber-600/80 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Monthly Champion
          </p>
          <div className="flex items-start gap-2.5">
            <svg className="w-7 h-7 text-amber-500 shrink-0 drop-shadow-sm group-hover/award:scale-110 group-hover/award:rotate-3 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="#fde68a"></polyline>
              <circle cx="12" cy="8" r="7" fill="#fef3c7"></circle>
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-gray-900 break-words leading-tight" title={monthlyName}>{monthlyName}</p>
              <div className="mt-1.5">
                <span className="text-[11px] text-amber-700 font-bold bg-amber-100/60 px-2.5 py-0.5 rounded-md border border-amber-200/50 shadow-sm inline-block">
                  {monthlyVal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col h-full bg-white rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
      <div className="bg-emerald-600 p-4 sm:p-5 text-white flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div>
            <h2 className="text-[15px] font-bold tracking-wide">RECOGNITION BOARDS</h2>
            <p className="text-xs font-medium text-white/70 mt-0.5">Top performers overall vs monthly</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-4 bg-[#f8fafc]/50">
        <Card
          title="Highest Visitors"
          overallName={overallVis.name} overallVal={overallVis.value}
          monthlyName={monthlyVis.name} monthlyVal={monthlyVis.value}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
          bgClass="bg-blue-50" textClass="text-[#3b82f6]" borderClass="border-blue-100"
        />

        <Card
          title="Highest Referrals"
          overallName={overallRef.name} overallVal={overallRef.value}
          monthlyName={monthlyRef.name} monthlyVal={monthlyRef.value}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="7.5" cy="7" r="4" /><line x1="14" y1="11" x2="22" y2="11" /><polyline points="19 8 22 11 19 14" /></svg>}
          bgClass="bg-green-50" textClass="text-[#10b981]" borderClass="border-green-100"
        />

        <Card
          title="Highest TYFCB"
          overallName={overallTYFCB.name} overallVal={formatCurrency(overallTYFCB.value as number)}
          monthlyName={monthlyTYFCB.name} monthlyVal={formatCurrency(monthlyTYFCB.value as number)}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
          bgClass="bg-purple-50" textClass="text-[#8b5cf6]" borderClass="border-purple-100"
        />
      </div>
    </div>
  );
}
