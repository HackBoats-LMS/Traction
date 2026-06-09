import React from 'react';
import DonutChart from './DonutChart';

export default function OverallReport({ data, chapterData }: { data: any[], chapterData?: any }) {
  const greens = data.filter(d => d.band?.toUpperCase() === 'GREEN');
  const ambers = data.filter(d => d.band?.toUpperCase() === 'AMBER');
  const reds = data.filter(d => d.band?.toUpperCase() === 'RED');
  const greys = data.filter(d => d.band?.toUpperCase() === 'GREY' || !d.band);

  const total = data.length || 1;
  const avgScore = Math.round(data.reduce((sum, d) => sum + (d.totalScore || 0), 0) / total);

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'BN';

  const MemberGroup = ({ title, percent, count, members, color, bg, text, isGrey = false, borderClass = "" }: any) => {
    const MAX_VISIBLE = 5;
    const visibleMembers = members.slice(0, MAX_VISIBLE);
    const hiddenCount = members.length - MAX_VISIBLE;

    return (
      <div className={`flex flex-col p-4 sm:p-6 ${borderClass}`}>
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${color} shrink-0`}></div>
          <span className="text-[11px] lg:text-[12px] font-bold text-gray-400 truncate">{title}</span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className={`text-[26px] lg:text-[32px] font-extrabold leading-none ${isGrey ? 'text-gray-300' : color.replace('bg-', 'text-')}`}>{percent}%</span>
          <span className="text-[11px] font-bold text-gray-400">({count})</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div className={`h-full rounded-full ${isGrey ? 'bg-gray-300' : color}`} style={{ width: `${percent}%` }}></div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visibleMembers.map((m: any, i: number) => (
            <div key={i} title={m.fullName} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold ${bg} ${text}`}>
              {getInitials(m.fullName)}
            </div>
          ))}
          {hiddenCount > 0 && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold bg-gray-100 text-gray-500">
              +{hiddenCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="bg-emerald-600 p-4 sm:p-5 text-white flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <h2 className="text-[15px] font-bold tracking-wide">OVERALL REPORT</h2>
            <p className="text-xs font-medium text-white/70 mt-0.5">Chapter performance snapshot &middot; {chapterData?.monthYear || "Jan – May 2025"}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Total Members</div>
          <div className="text-3xl font-extrabold leading-none">{data.length}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col 2xl:flex-row items-center justify-center gap-8 lg:gap-10 flex-1">
        {/* Donut Chart */}
        <DonutChart
          greens={greens.length}
          ambers={ambers.length}
          reds={reds.length}
          avgScore={avgScore}
        />

        {/* Breakdown */}
        <div className="flex-1 w-full grid grid-cols-2">
          <MemberGroup title="Green Members" percent={Math.round((greens.length / total) * 100)} count={greens.length} members={greens} color="bg-[#10b981]" bg="bg-[#10b981]" text="text-white" borderClass="border-b border-r border-gray-100/80" />
          <MemberGroup title="Amber Members" percent={Math.round((ambers.length / total) * 100)} count={ambers.length} members={ambers} color="bg-[#f59e0b]" bg="bg-[#f59e0b]" text="text-white" borderClass="border-b border-gray-100/80" />
          <MemberGroup title="Red Members" percent={Math.round((reds.length / total) * 100)} count={reds.length} members={reds} color="bg-[#ef4444]" bg="bg-[#ef4444]" text="text-white" borderClass="border-r border-gray-100/80" />
          <MemberGroup title="Grey Members" percent={Math.round((greys.length / total) * 100)} count={greys.length} members={greys} color="bg-[#9ca3af]" bg="bg-gray-100" text="text-gray-400" isGrey={true} borderClass="" />
        </div>
      </div>
    </div>
  );
}
