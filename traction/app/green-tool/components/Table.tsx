"use client";

import React, { useState, useRef } from 'react';
import MemberModal from './MemberModal';
import * as htmlToImage from 'html-to-image';

export default function Table({ initialData = [], allMonthlyData = [], comparisonData = [], chapterData }: { initialData: any[], allMonthlyData?: any[], comparisonData?: any[], chapterData?: any }) {
  const chapterName = chapterData?.chapterName || "Infinity Chapter";
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  let data = [...initialData];

  // Search
  if (search) {
    data = data.filter(d => d.fullName?.toLowerCase().includes(search.toLowerCase()));
  }

  // Sort
  if (sortBy === 'score') {
    data.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  } else {
    data.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  }

  // Helpers
  const getInitials = (name: string) => {
    if (!name) return 'BN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getBandColor = (band: string) => {
    switch (band?.toUpperCase()) {
      case 'GREEN': return 'bg-[#10b981]';
      case 'AMBER': return 'bg-[#f59e0b]';
      case 'RED': return 'bg-[#ef4444]';
      default: return 'bg-[#9ca3af]';
    }
  };

  const getBandTextColor = (band: string) => {
    switch (band?.toUpperCase()) {
      case 'GREEN': return 'text-[#10b981]';
      case 'AMBER': return 'text-[#f59e0b]';
      case 'RED': return 'text-[#ef4444]';
      default: return 'text-[#9ca3af]';
    }
  };

  const getBandBgLight = (band: string) => {
    switch (band?.toUpperCase()) {
      case 'GREEN': return 'bg-[#10b981]/10';
      case 'AMBER': return 'bg-[#f59e0b]/10';
      case 'RED': return 'bg-[#ef4444]/10';
      default: return 'bg-[#9ca3af]/10';
    }
  };

  const getBandBorderColor = (band: string) => {
    switch (band?.toUpperCase()) {
      case 'GREEN': return 'border-b-[#10b981]/30';
      case 'AMBER': return 'border-b-[#f59e0b]/30';
      case 'RED': return 'border-b-[#ef4444]/30';
      default: return 'border-b-gray-100';
    }
  };

  const getDotColor = (points: number, maxPoints: number) => {
    if (points === undefined) return 'bg-[#9ca3af]';
    const ratio = points / maxPoints;
    if (ratio >= 0.7) return 'bg-[#10b981]';
    if (ratio >= 0.4) return 'bg-[#f59e0b]';
    return 'bg-[#ef4444]';
  };

  const getMetricTextColor = (points: number, maxPoints: number) => {
    if (points === undefined) return 'text-[#9ca3af]';
    const ratio = points / maxPoints;
    if (ratio >= 0.7) return 'text-[#10b981]';
    if (ratio >= 0.4) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  const handleDownload = async () => {
    if (!tableRef.current) return;
    setDownloading(true);

    // Yield to let the "Downloading..." state render
    await new Promise(resolve => setTimeout(resolve, 50));

    // Clone the table into an off-screen wrapper to avoid visual layout shifts
    const cloneWrapper = document.createElement('div');
    cloneWrapper.style.position = 'absolute';
    cloneWrapper.style.top = '-10000px';
    cloneWrapper.style.left = '-10000px';
    cloneWrapper.style.width = '1400px';
    cloneWrapper.style.zIndex = '-1';
    
    const clonedTable = tableRef.current.cloneNode(true) as HTMLElement;
    clonedTable.style.width = '1400px';
    clonedTable.style.minWidth = '1400px';
    
    // Ensure hidden columns are visible in the PDF clone
    const hiddenCells = clonedTable.querySelectorAll('.md\\:table-cell');
    hiddenCells.forEach(cell => {
      cell.classList.remove('hidden', 'md:table-cell');
    });
    
    cloneWrapper.appendChild(clonedTable);
    document.body.appendChild(cloneWrapper);

    // Yield to the browser so it can apply the new layout to the clone
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await htmlToImage.toJpeg(clonedTable, {
        backgroundColor: '#ffffff',
        pixelRatio: 10, // 3x resolution to make the table look as sharp as the vector text
        quality: 1.00, // Stronger JPEG compression to keep the 3x resolution file size under control
        filter: (node) => {
          const el = node as HTMLElement;
          return !(el.classList && el.classList.contains('hide-in-pdf'));
        }
      });

      const { jsPDF } = await import('jspdf');

      const imgProps = new Image();
      imgProps.src = dataUrl;
      await new Promise((resolve) => { imgProps.onload = resolve; });

      // Fetch HB.png and convert to base64
      let hbDataUrl = null;
      try {
        const res = await fetch('/hb-logo.png');
        const blob = await res.blob();
        hbDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Failed to load HB logo", err);
      }

      let hbImgProps:any = null;
      if (hbDataUrl) {
        hbImgProps = new Image();
        hbImgProps.src = hbDataUrl;
        await new Promise((resolve) => { hbImgProps.onload = resolve; });
      }

      const pdfLogicalWidth = 1400;
      const captureRatio = imgProps.width / pdfLogicalWidth;
      const pdfLogicalHeight = imgProps.height / captureRatio;

      const padding = 40;
      const topOffset = 220; // Reduced top offset since fonts are smaller
      const bottomOffset = 180; // Reduced bottom offset

      // Create a custom page size based on logical units to prevent PDF spec maximum-height clipping
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfLogicalWidth + (padding * 2), pdfLogicalHeight + topOffset + bottomOffset]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      let tractionLogoDataUrl = null;
      try {
        const res = await fetch('/traction-logo.png');
        const blob = await res.blob();
        const base64Url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        const tempImg = new Image();
        tempImg.src = base64Url as string;
        await new Promise((resolve) => { tempImg.onload = resolve; });
        
        const canvas = document.createElement('canvas');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = 'invert(1) hue-rotate(180deg)';
          ctx.drawImage(tempImg, 0, 0);
          tractionLogoDataUrl = canvas.toDataURL('image/png');
        } else {
          tractionLogoDataUrl = base64Url;
        }
      } catch (err) {
        console.error("Failed to load Traction logo", err);
      }

      let tractionImgProps:any = null;
      if (tractionLogoDataUrl) {
        tractionImgProps = new Image();
        tractionImgProps.src = tractionLogoDataUrl as string;
        await new Promise((resolve) => { tractionImgProps.onload = resolve; });
      }

      if (tractionImgProps && tractionLogoDataUrl) {
        const logoHeight = 65; // increased height to make it bigger
        const logoWidth = (tractionImgProps.width * logoHeight) / tractionImgProps.height;
        pdf.addImage(tractionLogoDataUrl as string, 'PNG', padding, 70, logoWidth, logoHeight);
      }

      // Add Chapter Scoreboard title
      pdf.setFontSize(36);
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.text(`${chapterName} Scoreboard`, padding, 175);

      // Draw the super high-res image into the logical bounds
      pdf.addImage(dataUrl, 'JPEG', padding, topOffset, pdfLogicalWidth, pdfLogicalHeight);

      // Add powered by hackboats at bottom right
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(107, 114, 128); // gray-500
      const poweredByText = "powered by";
      const pbWidth = pdf.getTextWidth(poweredByText);

      if (hbImgProps && hbDataUrl) {
        const hbHeight = 65; // Smaller logo
        const hbWidth = (hbImgProps.width * hbHeight) / hbImgProps.height;

        const blockLeft = pdfWidth - padding - Math.max(hbWidth, pbWidth);

        pdf.text(poweredByText, blockLeft, pdfHeight - 120);
        pdf.addImage(hbDataUrl as string, 'PNG', blockLeft, pdfHeight - 105, hbWidth, hbHeight);
      } else {
        pdf.text("powered by hackboats", pdfWidth - 300, pdfHeight - 100);
      }

      pdf.save(`bni-chapter-scorecard-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF.');
    } finally {
      // Clean up the off-screen clone
      if (document.body.contains(cloneWrapper)) {
        document.body.removeChild(cloneWrapper);
      }
      setDownloading(false);
    }
  };


  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 font-sans pb-12">
      <div className="bg-white rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100">

          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{chapterName} Scoreboard</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {data.length} members &middot; Tap a row to expand &middot; Traffic light per metric
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:max-w-md flex items-center">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or role..."
                className="w-full pl-10 pr-10 py-2 bg-gray-50/80 border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-2 sm:gap-4">
              <div className="flex bg-gray-100/80 rounded-full p-1">
                <button
                  onClick={() => setSortBy('score')}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full shadow-sm transition-colors ${sortBy === 'score' ? 'bg-[#cc0000] text-white' : 'text-gray-600 hover:bg-gray-200/50'}`}
                >
                  By Score
                </button>
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full shadow-sm transition-colors ${sortBy === 'name' ? 'bg-[#cc0000] text-white' : 'text-gray-600 hover:bg-gray-200/50'}`}
                >
                  By Name
                </button>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 hidden lg:inline-block">{data.length} of {initialData.length} members</span>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-wait"
              >
                {downloading ? (
                  <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
                ) : (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse min-w-full md:min-w-[900px] bg-white">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Member</th>
                <th className="py-4 px-4 font-medium text-center">Score</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">Attendance</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">Sponsor</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">1-To-1s</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">Referrals Given</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">Visitors</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">TYFCB</th>
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">CEU</th>
                <th className="py-4 px-6 text-right hide-in-pdf"></th>
              </tr>
            </thead>
            <tbody className="">
              {data.map((item: any, index: number) => (
                <tr key={index} onClick={() => setSelectedMember(item)} className={`hover:bg-gray-50/50 transition-colors group cursor-pointer border-b-[3px] ${getBandBorderColor(item.band)}`}>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <span className="text-gray-300 text-xs font-medium w-3 sm:w-4 text-right shrink-0 mt-2 sm:mt-0">{index + 1}</span>
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs tracking-wide shrink-0 mt-0.5 sm:mt-0 ${getBandBgLight(item.band)} ${getBandTextColor(item.band)}`}>
                        {getInitials(item.fullName)}
                      </div>
                      <div className="flex-1 min-w-0 max-w-[180px] sm:max-w-none">
                        <p className="text-sm font-bold text-gray-900 break-words leading-snug">{item.fullName}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Chapter Member</p>
                      </div>
                    </div>
                  </td>

                  {/* Score column */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getBandColor(item.band)}`}
                          style={{ width: `${item.totalScore || 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 uppercase flex items-center gap-1">
                        {item.totalScore || 0}/100
                        {(item.totalScore || 0) >= 70 && (
                          <svg className="w-3 h-3 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Metrics */}
                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.attendancePoints, 10)}`}>
                        {item.attendancePoints}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.attendancePoints, 10)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.sponsorPoints, 5)}`}>
                        {item.sponsorPoints}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.sponsorPoints, 5)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.onetoonePoints, 20)}`}>
                        {item.onetoonePoints || 0}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.onetoonePoints, 20)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.referalPoints, 25)}`}>
                        {item.referalPoints || 0}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.referalPoints, 25)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.visitorsPoints, 25)}`}>
                        {item.visitorsPoints || 0}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.visitorsPoints, 25)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.TYFCBPoints, 5)}`}>
                        {item.TYFCBPoints || 0}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.TYFCBPoints, 5)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[13px] font-bold ${getMetricTextColor(item.CEUPoints, 10)}`}>
                        {item.CEUPoints || 0}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.CEUPoints, 10)}`}></div>
                    </div>
                  </td>

                  <td className="py-3 px-6 text-right hide-in-pdf">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 font-medium">No members found</p>
                      <p className="text-sm text-gray-400 mt-1">Upload an Excel report to see the scoreboard.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <MemberModal 
          member={selectedMember} 
          allMonthlyData={allMonthlyData}
          comparisonData={comparisonData} 
          onClose={() => setSelectedMember(null)}
          chapterData={chapterData}
        />
      )}
    </div>
  );
}