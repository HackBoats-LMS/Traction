import React from 'react';

export default function ChapterScorecard({ data, chapterData }: { data: any[], chapterData?: any }) {
  const count = data.length || 1;
  const avgAttendance = data.reduce((sum, item) => sum + (item.attendancePercentage || 0), 0) / count;
  const total1to1s = data.reduce((sum, item) => sum + (item.onetoone || 0), 0);
  const totalReferrals = data.reduce((sum, item) => sum + (item.referals || 0), 0);
  const totalVisitors = data.reduce((sum, item) => sum + (item.visitors || 0), 0);
  const totalTYFCB = data.reduce((sum, item) => sum + (item.TYFCB || 0), 0);
  const totalCEU = data.reduce((sum, item) => sum + (item.CEU || 0), 0) / 10;
  const totalSponsors = data.reduce((sum, item) => sum + (item.sponsorPoints ? item.sponsorPoints / 5 : 0), 0);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return (val / 10000000).toFixed(2) + 'Cr';
    if (val >= 100000) return (val / 100000).toFixed(2) + 'L';
    if (val >= 1000) return (val / 1000).toFixed(2) + 'k';
    return val.toFixed(0);
  };

  const t1to1s = chapterData?.overall1to1sTarget ? Number(chapterData.overall1to1sTarget) : 25 * count;
  const tReferrals = chapterData?.overallReferralsTarget ? Number(chapterData.overallReferralsTarget) : 25 * count;
  const tVisitors = chapterData?.overallVisitorsTarget ? Number(chapterData.overallVisitorsTarget) : 6 * count;
  const tTYFCB = chapterData?.overallTYFCBTarget ? Number(chapterData.overallTYFCBTarget) : 300000 * count;
  const tCEU = chapterData?.overallCEUTarget ? Number(chapterData.overallCEUTarget) : 25 * count;
  const tSponsors = chapterData?.overallSponsorsTarget ? Number(chapterData.overallSponsorsTarget) : 1 * count;

  const getMetricColor = (actual: number, target: number) => {
    const ratio = target > 0 ? actual / target : 1;
    if (ratio >= 1.0) return { bgClass: "bg-[#10b981]", textClass: "text-[#10b981]", lightBgClass: "bg-[#10b981]/10" };
    if (ratio >= 0.8) return { bgClass: "bg-[#f59e0b]", textClass: "text-[#f59e0b]", lightBgClass: "bg-[#f59e0b]/10" };
    return { bgClass: "bg-[#ef4444]", textClass: "text-[#ef4444]", lightBgClass: "bg-[#ef4444]/10" };
  };

  const tAttendance = Number(chapterData?.attendanceTarget) || 95;

  const groupedMetrics = {
    "Engagement": [
      {
        name: "ATTENDANCE", value: Math.round(avgAttendance) + "%", target: `${tAttendance}%`, progress: avgAttendance,
        ...getMetricColor(avgAttendance, tAttendance),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        name: "1-TO-1S", value: total1to1s.toString(), target: t1to1s, progress: Math.min((total1to1s / t1to1s) * 100, 100),
        ...getMetricColor(total1to1s, t1to1s),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      },
      {
        name: "VISITORS", value: totalVisitors.toString(), target: tVisitors, progress: Math.min((totalVisitors / tVisitors) * 100, 100),
        ...getMetricColor(totalVisitors, tVisitors),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        )
      }
    ],
    "Business": [
      {
        name: "REFERRALS", value: totalReferrals.toString(), target: tReferrals, progress: Math.min((totalReferrals / tReferrals) * 100, 100),
        ...getMetricColor(totalReferrals, tReferrals),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="7.5" cy="7" r="4" />
            <line x1="14" y1="11" x2="22" y2="11" />
            <polyline points="19 8 22 11 19 14" />
          </svg>
        )
      },
      {
        name: "TYFCB", value: formatCurrency(totalTYFCB), target: formatCurrency(tTYFCB), progress: Math.min((totalTYFCB / tTYFCB) * 100, 100),
        ...getMetricColor(totalTYFCB, tTYFCB),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )
      }
    ],
    "Contribution": [
      {
        name: "CEU (HOURS)", value: totalCEU.toFixed(2), target: tCEU, progress: Math.min((totalCEU / tCEU) * 100, 100),
        ...getMetricColor(totalCEU, tCEU),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      },
      {
        name: "SPONSORS", value: totalSponsors.toString(), target: tSponsors, progress: Math.min((totalSponsors / tSponsors) * 100, 100),
        ...getMetricColor(totalSponsors, tSponsors),
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      }
    ]
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 h-full mb-0">
      <div className="mb-6">
        <h2 className="text-[17px] font-extrabold text-gray-900 tracking-tight">Chapter Scorecard ({chapterData?.monthYear})</h2>
        <p className="text-[12px] text-gray-500 font-medium mt-0.5">Average per member performance &middot; 6-month targets shown</p>
      </div>

      <div className="flex flex-col gap-6">
        {Object.entries(groupedMetrics).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1 border-l-2 border-emerald-400">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((m, i) => (
                <div key={i} className="bg-gray-50/50 p-3 sm:p-3.5 rounded-[14px] border border-gray-100 flex flex-col hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`w-8 h-8 rounded-full ${m.lightBgClass} flex items-center justify-center ${m.textClass} shrink-0`}>
                      {m.icon}
                    </div>
                    <div className="flex items-start gap-1.5 pt-0.5">
                      <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">{m.value}</div>
                      <div className={`w-1.5 h-1.5 rounded-full ${m.bgClass} mt-1.5`}></div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-1.5 uppercase">{m.name}</div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1.5 w-full">
                      <span>Target: {m.target}</span>
                      <span className={`font-bold ${m.textClass}`}>{Math.round(m.progress)}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.bgClass}`} style={{ width: `${m.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
