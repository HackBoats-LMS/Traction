import React, { useEffect, useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

export default function MemberModal({ member, allMonthlyData = [], comparisonData = [], onClose, chapterData }: { member: any, allMonthlyData?: any[], comparisonData?: any[], onClose: () => void, chapterData?: any }) {
  const [downloading, setDownloading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!member) return null;

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'BN';

  const t1to1s = chapterData?.individual1to1sTarget || '1 per week';
  const tReferrals = chapterData?.individualReferralsTarget || '1 per week';
  const tVisitors = chapterData?.individualVisitorsTarget || '1 per month';
  const tCEU = chapterData?.individualCEUTarget || '0.5 hour per week';
  const tTYFCB = chapterData?.individualTYFCBTarget || '10k+';
  
  // Extract up to 6 months of history for this member (only batches with a specific periodDate)
  const rawHistory = allMonthlyData?.filter((m: any) => m.fullName === member.fullName && m.periodDate) || [];
  // Sort descending by periodDate to get the latest 6 (newest first)
  const memberMonthlyHistory = rawHistory.sort((a: any, b: any) => (b.periodDate || '').localeCompare(a.periodDate || '')).slice(0, 6);
  
  // Use the most recent month for tooltip comparisons if available
  const comparisonMember = memberMonthlyHistory.length > 0 ? memberMonthlyHistory[0] : comparisonData?.find((h: any) => h.fullName === member.fullName);

  const getComparisonPoints = (key: string) => {
    if (!comparisonMember) return null;
    switch (key) {
      case 'attendance': return comparisonMember.attendancePoints;
      case 'sponsor': return comparisonMember.sponsorPoints;
      case 'onetoone': return comparisonMember.onetoonePoints;
      case 'referals': return comparisonMember.referalPoints;
      case 'visitors': return comparisonMember.visitorsPoints;
      case 'tyfcb': return comparisonMember.TYFCBPoints;
      case 'ceu': return comparisonMember.CEUPoints;
      default: return null;
    }
  };

  const metricsInfo = [
    { key: 'attendance', label: 'Attendance', value: member.attendancePercentage !== undefined ? Math.round(member.attendancePercentage) + '%' : '0%', target: '95%', points: member.attendancePoints, comparisonPoints: getComparisonPoints('attendance'), max: 10, action: { green: "Flawless attendance! Your consistency builds trust and visibility.", amber: "Your visibility is dropping. Plan ahead and use substitutes if you must be absent.", red: "Critical! Missing meetings hurts your credibility. Commit to showing up every week." } },
    { key: 'sponsor', label: 'Sponsor', value: member.sponsorPoints ? (member.sponsorPoints / 5).toFixed(2) : "0.00", target: '1 per 6 months', points: member.sponsorPoints, comparisonPoints: getComparisonPoints('sponsor'), max: 5, action: { green: "Outstanding leadership! You're actively expanding our chapter's network.", amber: "Think of your best clients or partners. Invite them to visit and experience the value.", red: "Start small: aim to bring just one visitor this month who could benefit from our group." } },
    { key: 'onetoone', label: '1-to-1s', value: member.onetoone !== undefined ? member.onetoone.toFixed(2) : "0.00", target: t1to1s, points: member.onetoonePoints, comparisonPoints: getComparisonPoints('onetoone'), max: 20, action: { green: "Superb networking! You are actively discovering how to help others.", amber: "Try to book at least one 1-to-1 per week with someone you haven't spoken to recently.", red: "You're missing out on referrals! Reach out to a member today and schedule a quick coffee chat." } },
    { key: 'referals', label: 'Referrals', value: member.referals !== undefined ? member.referals.toFixed(2) : "0.00", target: tReferrals, points: member.referalPoints, comparisonPoints: getComparisonPoints('referals'), max: 25, action: { green: "True 'Givers Gain' mentality! Your referrals directly drive our chapter's success.", amber: "Pay close attention to members' weekly asks. Actively look for opportunities in your daily conversations.", red: "Review the roster today. Ask yourself, 'Who do I know that needs their services?' and make an introduction." } },
    { key: 'visitors', label: 'Visitors', value: member.visitors !== undefined ? Number(member.visitors).toFixed(2) : "0.00", target: tVisitors, points: member.visitorsPoints, comparisonPoints: getComparisonPoints('visitors'), max: 25, action: { green: "Fantastic work! Visitors bring fresh energy and new business to everyone.", amber: "Make it a habit to invite one client, friend, or vendor to our next open meeting.", red: "Your network is valuable. Use the BNI Connect app to easily invite a contact to our next meeting." } },
    { key: 'tyfcb', label: 'TYFCB', value: (member.TYFCB || 0) >= 10000000 ? ((member.TYFCB || 0) / 10000000).toFixed(2) + 'Cr' : ((member.TYFCB || 0) >= 100000 ? ((member.TYFCB || 0) / 100000).toFixed(2) + 'L' : ((member.TYFCB || 0) >= 1000 ? ((member.TYFCB || 0) / 1000).toFixed(2) + 'k' : Number(member.TYFCB || 0).toFixed(2))), target: tTYFCB, points: member.TYFCBPoints, comparisonPoints: getComparisonPoints('tyfcb'), max: 5, action: { green: "Incredible ROI! You are successfully converting referrals into real revenue.", amber: "Don't leave money unacknowledged! Ensure you log all closed business from chapter referrals.", red: "Follow up on the referrals you've received. Close the loop and record your TYFCB to show appreciation." } },
    { key: 'ceu', label: 'CEU', value: member.CEU !== undefined ? member.CEU.toFixed(2) : "0.00", target: tCEU, points: member.CEUPoints, comparisonPoints: getComparisonPoints('ceu'), max: 10, action: { green: "Lifelong learner! Your dedication to BNI education sets a great example.", amber: "Invest in your growth. Listen to a BNI podcast episode or read an article this week.", red: "Log into BNI Business Builder for 15 minutes today. A quick course can boost your networking skills." } },
  ];

  const getMetricStatus = (points: number, max: number) => {
    const ratio = (points || 0) / max;
    if (ratio >= 0.7) return 'green';
    if (ratio >= 0.4) return 'amber';
    return 'red';
  };

  const getStatusColor = (status: string, type: 'bg' | 'text' | 'border' | 'light') => {
    if (status === 'green') {
      if (type === 'bg') return 'bg-[#10b981]';
      if (type === 'text') return 'text-[#10b981]';
      if (type === 'border') return 'border-[#10b981]';
      if (type === 'light') return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
    }
    if (status === 'amber') {
      if (type === 'bg') return 'bg-[#f59e0b]';
      if (type === 'text') return 'text-[#f59e0b]';
      if (type === 'border') return 'border-[#f59e0b]';
      if (type === 'light') return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
    }
    if (type === 'bg') return 'bg-[#ef4444]';
    if (type === 'text') return 'text-[#ef4444]';
    if (type === 'border') return 'border-[#ef4444]';
    return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20';
  };

  const metrics = metricsInfo.map(m => ({
    ...m,
    status: getMetricStatus(m.points, m.max)
  }));

  const greenCount = metrics.filter(m => m.status === 'green').length;
  const amberCount = metrics.filter(m => m.status === 'amber').length;
  const redCount = metrics.filter(m => m.status === 'red').length;

  const band = member.band?.toUpperCase() || 'GREY';
  const headerBgColor = band === 'GREEN' ? 'bg-[#10b981]' : band === 'AMBER' ? 'bg-[#f59e0b]' : band === 'RED' ? 'bg-[#ef4444]' : 'bg-[#9ca3af]';

  const handleDownload = async () => {
    if (!modalRef.current) return;
    setDownloading(true);

    // Yield to let the "Downloading..." state render
    await new Promise(resolve => setTimeout(resolve, 50));

    // Clone the modal into an off-screen wrapper to avoid visual layout shifts
    const cloneWrapper = document.createElement('div');
    cloneWrapper.style.position = 'absolute';
    cloneWrapper.style.top = '-10000px';
    cloneWrapper.style.left = '-10000px';
    cloneWrapper.style.width = '1000px';
    cloneWrapper.style.zIndex = '-1';
    
    const clonedModal = modalRef.current.cloneNode(true) as HTMLElement;
    clonedModal.style.width = '1000px';
    clonedModal.style.minWidth = '1000px';
    clonedModal.style.maxHeight = 'none';
    clonedModal.style.height = 'auto';
    clonedModal.classList.remove('max-h-[90vh]', 'overflow-hidden');
    
    // Un-constrain internal scrolling div if any
    const scrollAreas = clonedModal.querySelectorAll('.overflow-y-auto');
    scrollAreas.forEach(area => {
      (area as HTMLElement).classList.remove('overflow-y-auto');
      (area as HTMLElement).style.overflow = 'visible';
      (area as HTMLElement).style.maxHeight = 'none';
    });
    
    // Hide download/close buttons
    const hideElements = clonedModal.querySelectorAll('.hide-in-pdf');
    hideElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    cloneWrapper.appendChild(clonedModal);
    document.body.appendChild(cloneWrapper);

    // Yield to the browser so it can apply the new layout to the clone
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await htmlToImage.toJpeg(clonedModal, {
        backgroundColor: '#ffffff',
        pixelRatio: 5, 
        quality: 1.00,
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
        hbImgProps.src = hbDataUrl as string;
        await new Promise((resolve) => { hbImgProps.onload = resolve; });
      }

      const pdfLogicalWidth = 1000;
      const captureRatio = imgProps.width / pdfLogicalWidth;
      const pdfLogicalHeight = imgProps.height / captureRatio;

      const padding = 40;
      const topOffset = 220; 
      const bottomOffset = 180; 

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
        const res = await fetch('/atlaslogo.png');
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

      const chapterNameStr = chapterData?.chapterName || "Infinity Chapter";

      if (tractionImgProps && tractionLogoDataUrl) {
        const logoHeight = 65; // increased height to make it bigger
        const logoWidth = (tractionImgProps.width * logoHeight) / tractionImgProps.height;
        pdf.addImage(tractionLogoDataUrl as string, 'PNG', padding, 70, logoWidth, logoHeight);
      }

      // Add Chapter Scoreboard title
      pdf.setFontSize(28);
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.text(`${chapterNameStr} - Member Report`, padding, 170);

      // Draw the super high-res image into the logical bounds
      pdf.addImage(dataUrl, 'JPEG', padding, topOffset, pdfLogicalWidth, pdfLogicalHeight);

      // Add powered by hackboats at bottom right
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(107, 114, 128); // gray-500
      const poweredByText = "powered by";
      const pbWidth = pdf.getTextWidth(poweredByText);

      if (hbImgProps && hbDataUrl) {
        const hbHeight = 55; // Smaller logo
        const hbWidth = (hbImgProps.width * hbHeight) / hbImgProps.height;

        const blockLeft = pdfWidth - padding - Math.max(hbWidth, pbWidth);

        pdf.text(poweredByText, blockLeft, pdfHeight - 110);
        pdf.addImage(hbDataUrl as string, 'PNG', blockLeft, pdfHeight - 95, hbWidth, hbHeight);
      } else {
        pdf.text("powered by hackboats", pdfWidth - 300, pdfHeight - 100);
      }

      pdf.save(`bni-member-${member.fullName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div ref={modalRef} className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className={`${headerBgColor} p-6 sm:p-8 text-white relative flex justify-between items-start shrink-0`}>
          {/* Left: Profile Info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-lg sm:text-xl font-bold tracking-wider backdrop-blur-md shrink-0">
              {getInitials(member.fullName)}
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">{member.fullName}</h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">Chapter Member</p>
            </div>
          </div>

          {/* Right: Actions & Score */}
          <div className="flex flex-col items-end gap-3 sm:gap-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 hide-in-pdf">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-[11px] font-extrabold text-gray-900 tracking-widest uppercase shadow-sm disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Traffic Score */}
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Traffic Score</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-3xl sm:text-4xl font-extrabold leading-none">{member.totalScore || 0}</span>
                <span className="text-xs sm:text-sm font-bold text-white/70">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-[#fafafa]">

          {/* Progress Bar & Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="w-full sm:w-1/2">
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-[#10b981]" style={{ width: `${(greenCount / metrics.length) * 100}%` }}></div>
                <div className="h-full bg-[#f59e0b]" style={{ width: `${(amberCount / metrics.length) * 100}%` }}></div>
                <div className="h-full bg-[#ef4444]" style={{ width: `${(redCount / metrics.length) * 100}%` }}></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10b981]"></div> {greenCount} Green</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> {amberCount} Amber</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> {redCount} Red</div>
              <div className="text-xs text-gray-400">of {metrics.length} metrics</div>
            </div>
          </div>

          {/* Metric Breakdown */}
          <div className="mb-10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Metric Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {metrics.map((m, i) => {
                const diff = m.comparisonPoints !== null ? (m.points || 0) - m.comparisonPoints : null;
                return (
                <div key={i} className={`bg-white rounded-xl p-4 border flex flex-col justify-between ${getStatusColor(m.status, 'border')} shadow-sm hover:shadow-md transition-shadow`}>
                  <div>
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(m.status, 'light')}`}>
                        <span className={`w-1 h-1 rounded-full mr-1 ${getStatusColor(m.status, 'bg')}`}></span>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1">{m.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mb-1.5">
                      {m.points} <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">pts</span>
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white shadow-sm ${getStatusColor(m.status, 'bg')}`}>
                      {m.value}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[10px] font-semibold text-gray-400">Target: {m.target}</p>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Plan of Action */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Plan of Action</h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

              {/* Header */}
              <div className={`${getStatusColor(metrics.filter(m => m.status === 'green').length >= 4 ? 'green' : 'amber', 'bg')} p-5 sm:p-6 text-white flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hidden sm:block">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold">
                      {greenCount >= 4 ? `Well done, ${member.fullName.split(' ')[0]}!` : `Time to push, ${member.fullName.split(' ')[0]}!`}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">{greenCount} of {metrics.length} metrics green &middot; {metrics.length - greenCount} to push further</p>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold shrink-0">{member.totalScore || 0}<span className="text-xs sm:text-sm font-bold text-white/70">/100</span></div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">

                {/* Keep Doing This */}
                {greenCount > 0 && (
                  <div className="mb-8">
                    <h5 className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      Keep doing this
                      <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {metrics.filter(m => m.status === 'green').map((m, i) => {
                        const diff = m.comparisonPoints !== null ? (m.points || 0) - m.comparisonPoints : null;
                        return (
                        <div key={i} className="px-3 py-1.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {m.label}
                        </div>
                      )})}
                    </div>
                  </div>
                )}

                {/* Push to Perfect */}
                {metrics.filter(m => m.status !== 'green').length > 0 && (
                  <div>
                    <h5 className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      Push to perfect
                      <span className="text-lg sm:text-xl leading-none mb-0.5">🚀</span>
                    </h5>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100/80">
                      {metrics.filter(m => m.status !== 'green').map((m, i) => {
                        const diff = m.comparisonPoints !== null ? (m.points || 0) - m.comparisonPoints : null;
                        return (
                        <div key={i} className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-1/3">
                            <span className="text-gray-300">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </span>
                            <span className="font-bold text-gray-700 text-sm flex items-center gap-2">
                              {m.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 gap-4 pl-7 sm:pl-0">
                            <span className="text-xs font-medium text-gray-500 flex-1 sm:text-right">{(m.action as any)[m.status]}</span>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Tip */}
              <div className="bg-gray-50/80 border-t border-gray-100 px-5 sm:px-6 py-4 flex items-start gap-3">
                <span className="text-[#f59e0b] text-base sm:text-lg">⚡</span>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-relaxed">
                  <strong>Givers Gain!</strong> Maintain your current activity — consistency is what keeps your traffic light green. Keep networking, passing quality referrals, and building deep relationships!
                </p>
              </div>

            </div>
          </div>

          {/* Comparison Table */}
          {memberMonthlyHistory.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Historical Performance Comparison</h3>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-500">
                        <th className="py-3 px-4 font-bold text-left">Period</th>
                        <th className="py-3 px-4 font-bold text-center">Attendance %</th>
                        <th className="py-3 px-4 font-bold text-center">Referrals</th>
                        <th className="py-3 px-4 font-bold text-center">Visitors</th>
                        <th className="py-3 px-4 font-bold text-center">TYFCB</th>
                        <th className="py-3 px-4 font-bold text-center">1-2-1s</th>
                        <th className="py-3 px-4 font-bold text-center">Sponsor</th>
                        <th className="py-3 px-4 font-bold text-center">CEU's</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {memberMonthlyHistory.map((histRow: any, idx: number) => {
                        const isLatest = idx === 0;
                        // Format the periodDate from "YYYY-MM" to "MMM YYYY"
                        let periodLabel = histRow.periodDate || 'Previous';
                        if (histRow.periodDate) {
                          const [year, month] = histRow.periodDate.split('-');
                          const dateObj = new Date(parseInt(year), parseInt(month) - 1);
                          periodLabel = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
                        }

                        return (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className={`py-3 px-4 text-xs font-bold ${isLatest ? 'text-[#8b5cf6]' : 'text-gray-500'}`}>{periodLabel}</td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>{histRow.attendancePercentage !== undefined ? Math.round(histRow.attendancePercentage) + '%' : '0%'}</td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>{histRow.referals !== undefined ? histRow.referals : '0'}</td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>{histRow.visitors !== undefined ? histRow.visitors : '0'}</td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>
                              {histRow.TYFCB !== undefined ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(histRow.TYFCB) + '/-' : '0/-'}
                            </td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>{histRow.onetoone !== undefined ? histRow.onetoone : '0'}</td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>{histRow.sponsors !== undefined ? histRow.sponsors : (histRow.sponsorPoints ? 1 : 0)}</td>
                            <td className={`py-3 px-4 text-center text-xs ${isLatest ? 'font-bold' : 'font-medium'} text-gray-900`}>{histRow.CEU !== undefined ? histRow.CEU : '0'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
