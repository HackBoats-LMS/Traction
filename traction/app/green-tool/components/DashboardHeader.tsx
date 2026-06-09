import React from 'react';

export default function DashboardHeader({ data, chapterData }: { data: any[], chapterData?: any }) {
  const monthYear = chapterData?.monthYear || "Jan – May 2025";
  const chapterName = chapterData?.chapterName || "Atom Chapter";
  
  const count = data.length || 1;
  const avgScore = Math.round(data.reduce((sum, d) => sum + (d.totalScore || 0), 0) / count);
  const avgAttendance = Math.round(data.reduce((sum, item) => sum + (item.attendancePercentage || 0), 0) / count);
  
  // Try to use chapterData values if they exist, otherwise fallback to reasonable defaults
  const totalMembers = chapterData?.totalMembers || count + 10;
  const activeMembers = count;

  return (
    <div className="relative overflow-hidden mb-8 mt-4 rounded-[24px] bg-gradient-to-b from-[#e3faef] to-[#ccede1] p-8 sm:p-10 border border-white/60 shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3),inset_0_2px_4px_rgba(255,255,255,0.8)] backdrop-blur-sm">
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16,185,129,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16,185,129,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at top left, white, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top left, white, transparent 80%)'
        }}
      ></div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12">
        {/* Left Side */}
        <div className="flex-1 w-full lg:w-auto max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
            <span className="px-3.5 py-1.5 bg-gradient-to-b from-white to-gray-50 text-[#10b981] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,1)] border border-gray-100">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              CHAPTER OVERVIEW
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>{chapterName}</h1>
          <p className="text-[15px] text-gray-700 mb-8 max-w-[500px] leading-relaxed font-normal">
            A performance-first view of your chapter's journey — engagement, business, recognition, all in one place.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <span className="px-3.5 py-1.5 bg-gradient-to-b from-white to-gray-50 text-gray-600 text-[12px] font-medium rounded-full flex items-center gap-2 border border-gray-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)]">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {monthYear}
            </span>
            <span className="px-3.5 py-1.5 bg-gradient-to-b from-[#dcfce7] to-[#c6f6d5] text-[#166534] text-[12px] font-medium rounded-full flex items-center gap-2 border border-[#a7f3d0] shadow-[0_4px_12px_-4px_rgba(22,101,52,0.15),inset_0_1px_1px_rgba(255,255,255,0.7)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {activeMembers} active
            </span>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="flex w-full lg:w-auto shrink-0 justify-center lg:justify-start mt-4 lg:mt-0 relative group">
          {/* Subtle glow behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-white to-emerald-50 rounded-[26px] blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="relative flex items-center justify-center gap-6 sm:gap-8 bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-md rounded-[20px] p-6 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,1),inset_0_1px_2px_rgba(255,255,255,1)] border border-gray-100/50">
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Health Score</span>
              <div className="flex items-baseline gap-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <span className="text-4xl font-semibold text-gray-900 tracking-tight">{avgScore}</span>
                <span className="text-sm font-medium text-gray-400">/100</span>
              </div>
            </div>

            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent block shadow-[1px_0_0_rgba(255,255,255,1)]"></div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Active Rate</span>
              <div className="flex items-baseline gap-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <span className="text-4xl font-semibold text-gray-900 tracking-tight">{avgAttendance}%</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
