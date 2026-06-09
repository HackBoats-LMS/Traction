import React from 'react';

export default function ScoringParameters() {
  const Card = ({ title, icon, children }: any) => (
    <div className="bg-white rounded-[16px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-[10px] bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </div>
        <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value, type }: any) => {
    const bgClass = type === 'green' ? 'bg-[#10b981]/15 text-[#047857]' : 
                    type === 'amber' ? 'bg-[#f59e0b]/15 text-[#b45309]' : 
                    type === 'red' ? 'bg-[#ef4444]/15 text-[#b91c1c]' : 
                    'bg-gray-50/80 text-gray-700';

    return (
      <div className={`flex justify-between items-center px-3 py-1.5 rounded-[8px] ${bgClass}`}>
        <span className="text-[11px] font-semibold">{label}</span>
        <span className="text-[11px] font-extrabold">{value}{['GREEN', 'AMBER', 'RED', 'GREY'].includes(value) ? '' : ' pts'}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-8 mt-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Scoring Parameters</h2>
        <p className="text-sm text-gray-500 font-medium mt-0.5">How points are calculated per metric &middot; reference guide</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <Card title="Attendance %" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
          </svg>
        }>
          <Row label="≥ 95%" value="10" type="green" />
          <Row label="88-94%" value="5" type="amber" />
          <Row label="< 88%" value="0" type="gray" />
        </Card>

        <Card title="CEU / Week" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }>
          <Row label="> 0.5" value="10" type="green" />
          <Row label="> 0-0.5" value="5" type="amber" />
          <Row label="0" value="0" type="gray" />
        </Card>

        <Card title="1-to-1s / Week" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }>
          <Row label="≥ 1.0" value="20" type="green" />
          <Row label="0.75-0.99" value="15" type="amber" />
          <Row label="0.5-0.74" value="10" type="amber" />
          <Row label="0.25-0.49" value="5" type="red" />
          <Row label="< 0.25" value="0" type="gray" />
        </Card>

        <Card title="Referrals / Week" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="7.5" cy="7" r="4" />
            <line x1="14" y1="11" x2="22" y2="11" />
            <polyline points="19 8 22 11 19 14" />
          </svg>
        }>
          <Row label="≥ 1.25" value="25" type="green" />
          <Row label="1.0-1.24" value="20" type="green" />
          <Row label="0.75-0.99" value="15" type="amber" />
          <Row label="0.5-0.74" value="10" type="amber" />
          <Row label="0.25-0.49" value="5" type="red" />
          <Row label="< 0.25" value="0" type="gray" />
        </Card>

        <Card title="TYFCB" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        }>
          <Row label="≥ 30" value="5" type="green" />
          <Row label="15-< 30" value="4" type="amber" />
          <Row label="5-< 15" value="3" type="amber" />
          <Row label="2-< 5" value="2" type="red" />
          <Row label="> 0-< 2" value="1" type="red" />
          <Row label="0" value="0" type="gray" />
        </Card>

        <Card title="Visitors (6 mo)" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }>
          <Row label="5+" value="25" type="green" />
          <Row label="4" value="20" type="green" />
          <Row label="3" value="15" type="amber" />
          <Row label="2" value="10" type="amber" />
          <Row label="1" value="5" type="red" />
          <Row label="0" value="0" type="gray" />
        </Card>

        <Card title="Sponsors (6 mo)" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }>
          <Row label="1+" value="5" type="green" />
          <Row label="0" value="0" type="gray" />
        </Card>

        <Card title="Score Band" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }>
          <Row label="70-100" value="GREEN" type="green" />
          <Row label="50-69" value="AMBER" type="amber" />
          <Row label="30-49" value="RED" type="red" />
          <Row label="0-29" value="GREY" type="gray" />
        </Card>
      </div>
    </div>
  );
}
