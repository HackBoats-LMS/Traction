"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingTop, setSavingTop] = useState(false);
  const [previewType, setPreviewType] = useState("overall");

  const [mainFileOverall, setMainFileOverall] = useState<File | null>(null);
  const [visitorsFileOverall, setVisitorsFileOverall] = useState<File | null>(null);
  const [sponsorsFileOverall, setSponsorsFileOverall] = useState<File | null>(null);

  const [mainFileMonthly, setMainFileMonthly] = useState<File | null>(null);
  const [visitorsFileMonthly, setVisitorsFileMonthly] = useState<File | null>(null);
  const [sponsorsFileMonthly, setSponsorsFileMonthly] = useState<File | null>(null);



  const [chapterSettings, setChapterSettings] = useState<any>({
    chapterName: "Infinity Chapter",
    monthYear: "Jan – May 2025",
    meetingsCount: "23"
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [monthlyMonthName, setMonthlyMonthName] = useState("");
  const [historicalMonthName, setHistoricalMonthName] = useState("");
  const [comparisonMonthName, setComparisonMonthName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Basic auth check
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/green-tool/pages/secure/auth/admin/login");
      return;
    }

    setIsAuthenticated(true);

    // Fetch existing data from DB
    fetch(`/green-tool/api/data?type=${previewType}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(console.error);



    // Fetch chapter settings
    fetch("/green-tool/api/chapter-settings")
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setChapterSettings(res.data);
          if (res.data.monthlyMonthYear) setMonthlyMonthName(res.data.monthlyMonthYear);
          if (res.data.historicalMonthYear) setHistoricalMonthName(res.data.historicalMonthYear);
          if (res.data.comparisonMonthYear) setComparisonMonthName(res.data.comparisonMonthYear);
        }
      })
      .catch(console.error);

    // Fetch batches
    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, previewType]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  async function loadBatches() {
    try {
      const [resOverall, resMonthly, resHistorical, resComparison] = await Promise.all([
        fetch("/green-tool/api/data/batches?type=overall"),
        fetch("/green-tool/api/data/batches?type=monthly"),
        fetch("/green-tool/api/data/batches?type=historical"),
        fetch("/green-tool/api/data/batches?type=comparison")
      ]);
      const [jsonOverall, jsonMonthly, jsonHistorical, jsonComparison] = await Promise.all([
        resOverall.json(), 
        resMonthly.json(),
        resHistorical.json(),
        resComparison.json()
      ]);
      
      let allBatches: any[] = [];
      if (jsonOverall.success) allBatches = [...allBatches, ...jsonOverall.batches];
      if (jsonMonthly.success) allBatches = [...allBatches, ...jsonMonthly.batches];
      if (jsonHistorical.success) allBatches = [...allBatches, ...jsonHistorical.batches];
      if (jsonComparison.success) allBatches = [...allBatches, ...jsonComparison.batches];
      
      allBatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBatches(allBatches);
    } catch (error) {
      console.error("Error loading batches", error);
    }
  };

  const handleMultiUpload = async (reportType: string = 'overall') => {
    let mainFile, visitorsFile, sponsorsFile;

    if (reportType === 'overall') {
      mainFile = mainFileOverall;
      visitorsFile = visitorsFileOverall;
      sponsorsFile = sponsorsFileOverall;
    } else if (reportType === 'monthly') {
      mainFile = mainFileMonthly;
      visitorsFile = visitorsFileMonthly;
      sponsorsFile = sponsorsFileMonthly;
    }

    if (!mainFile || !visitorsFile || !sponsorsFile) {
      alert("Please select all three files (Main, Visitors, Sponsors) before uploading.");
      return;
    }

    if (reportType === 'monthly' && !monthlyMonthName.trim()) {
      alert("Please enter a Month Name before uploading the file.");
      return;
    }

    if (reportType === 'historical' && !historicalMonthName.trim()) {
      alert("Please enter a Historical Period Name before uploading the file.");
      return;
    }

    if (reportType === 'comparison' && !comparisonMonthName.trim()) {
      alert("Please enter a Comparison Period Name before uploading the file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("mainFile", mainFile);
    formData.append("visitorsFile", visitorsFile);
    formData.append("sponsorsFile", sponsorsFile);
    formData.append("reportType", reportType);
    
    if (reportType === 'monthly' && monthlyMonthName) {
      formData.append("monthlyMonthName", monthlyMonthName);
    }
    if (reportType === 'historical' && historicalMonthName) {
      formData.append("historicalMonthName", historicalMonthName);
    }
    if (reportType === 'comparison' && comparisonMonthName) {
      formData.append("comparisonMonthName", comparisonMonthName);
    }

    try {
      let endpoint = "/green-tool/api/data/convert";
      if (reportType === 'monthly') endpoint = "/green-tool/api/data/convert-monthly";
      if (reportType === 'historical') endpoint = "/green-tool/api/data/convert-historical";
      if (reportType === 'comparison') endpoint = "/green-tool/api/data/convert-comparison";
      
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        alert("Data successfully uploaded and database updated!");
        window.location.reload();
      } else {
        alert("Upload failed: " + (result.msg || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    // Disabled since data is fetched from DB
  };



  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSettings({
      ...chapterSettings,
      [e.target.name]: e.target.value
    });
  };

  const saveBasicSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        chapterName: chapterSettings.chapterName,
        monthYear: chapterSettings.monthYear,
        meetingsCount: chapterSettings.meetingsCount
      };
      const res = await fetch("/green-tool/api/chapter-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert("Basic settings saved successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const saveOverallTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        attendanceTarget: chapterSettings.attendanceTarget,
        overall1to1sTarget: chapterSettings.overall1to1sTarget,
        overallReferralsTarget: chapterSettings.overallReferralsTarget,
        overallVisitorsTarget: chapterSettings.overallVisitorsTarget,
        overallTYFCBTarget: chapterSettings.overallTYFCBTarget,
        overallCEUTarget: chapterSettings.overallCEUTarget,
        overallSponsorsTarget: chapterSettings.overallSponsorsTarget,
      };
      const res = await fetch("/green-tool/api/chapter-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert("Overall targets saved successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert("Error saving overall targets");
    } finally {
      setSavingSettings(false);
    }
  };

  const saveMonthlyTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        monthly1to1sTarget: chapterSettings.monthly1to1sTarget,
        monthlyReferralsTarget: chapterSettings.monthlyReferralsTarget,
        monthlyVisitorsTarget: chapterSettings.monthlyVisitorsTarget,
        monthlyTYFCBTarget: chapterSettings.monthlyTYFCBTarget,
        monthlyCEUTarget: chapterSettings.monthlyCEUTarget,
        monthlySponsorsTarget: chapterSettings.monthlySponsorsTarget,
      };
      const res = await fetch("/green-tool/api/chapter-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert("Monthly targets saved successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert("Error saving monthly targets");
    } finally {
      setSavingSettings(false);
    }
  };

  const saveIndividualTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        individual1to1sTarget: chapterSettings.individual1to1sTarget,
        individualReferralsTarget: chapterSettings.individualReferralsTarget,
        individualVisitorsTarget: chapterSettings.individualVisitorsTarget,
        individualTYFCBTarget: chapterSettings.individualTYFCBTarget,
        individualCEUTarget: chapterSettings.individualCEUTarget,
      };
      const res = await fetch("/green-tool/api/chapter-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert("Individual targets saved successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert("Error saving individual targets");
    } finally {
      setSavingSettings(false);
    }
  };

  const saveSpecificPeriod = async (field: string, value: string) => {
    if (!value.trim()) return alert("Please enter a valid period name.");
    setSavingSettings(true);
    try {
      const res = await fetch("/green-tool/api/chapter-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      const data = await res.json();
      if (data.success) {
        alert("Period saved successfully!");
        window.location.reload();
      } else {
        alert("Failed to save period.");
      }
    } catch (err) {
      alert("Error saving period.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/green-tool/pages/secure/auth/admin/login");
  };

  const deleteBatch = async (batchId: string, type: string) => {
    if (confirm("Are you sure you want to delete this specific data batch?")) {
      try {
        const res = await fetch(`/green-tool/api/data/batches?batchId=${batchId || 'legacy'}&type=${type || 'overall'}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          window.location.reload();
        } else {
          alert("Failed to delete batch");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredData = data.filter((item) =>
    item.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium">Manage chapter data and recognition</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 font-bold text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Top Performers & Chapter Settings */}
          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-500">⚙️</span> Chapter Settings
              </h2>
              <form onSubmit={saveBasicSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Chapter Name</label>
                  <input type="text" name="chapterName" value={chapterSettings.chapterName || ""} onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none mb-2" placeholder="e.g. Infinity Chapter" required />



                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Number of Meetings</label>
                  <input type="text" name="meetingsCount" value={chapterSettings.meetingsCount || ""} onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none" placeholder="e.g. 23" required />
                </div>
                <button type="submit" disabled={savingSettings} className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2.5 rounded-lg mt-2 transition-colors disabled:opacity-50">
                  {savingSettings ? "Saving..." : "Save Basic Settings"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#10b981]">🎯</span> Overall Chapter Targets
              </h2>
              <form onSubmit={saveOverallTargets} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Attendance (%)</label>
                    <input type="number" name="attendanceTarget" value={chapterSettings.attendanceTarget || ''} placeholder="95" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">1-to-1s (Total)</label>
                    <input type="number" name="overall1to1sTarget" value={chapterSettings.overall1to1sTarget || ''} placeholder="1700" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Referrals (Total)</label>
                    <input type="number" name="overallReferralsTarget" value={chapterSettings.overallReferralsTarget || ''} placeholder="1700" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Visitors (Total)</label>
                    <input type="number" name="overallVisitorsTarget" value={chapterSettings.overallVisitorsTarget || ''} placeholder="400" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">CEU (Total Hours)</label>
                    <input type="number" name="overallCEUTarget" value={chapterSettings.overallCEUTarget || ''} placeholder="1700" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sponsors (Total)</label>
                    <input type="number" step="0.1" name="overallSponsorsTarget" value={chapterSettings.overallSponsorsTarget || ''} placeholder="68" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TYFCB (Total)</label>
                    <input type="number" name="overallTYFCBTarget" value={chapterSettings.overallTYFCBTarget || ''} placeholder="20000000" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                </div>
                <button type="submit" disabled={savingSettings} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 rounded-lg mt-2 transition-colors disabled:opacity-50">
                  {savingSettings ? "Saving..." : "Save Overall Targets"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#3b82f6]">📅</span> Monthly Chapter Targets
              </h2>
              <form onSubmit={saveMonthlyTargets} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">1-to-1s (Total)</label>
                    <input type="number" name="monthly1to1sTarget" value={chapterSettings.monthly1to1sTarget || ''} placeholder="272" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Referrals (Total)</label>
                    <input type="number" name="monthlyReferralsTarget" value={chapterSettings.monthlyReferralsTarget || ''} placeholder="272" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Visitors (Total)</label>
                    <input type="number" name="monthlyVisitorsTarget" value={chapterSettings.monthlyVisitorsTarget || ''} placeholder="68" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">CEU (Total Hours)</label>
                    <input type="number" name="monthlyCEUTarget" value={chapterSettings.monthlyCEUTarget || ''} placeholder="272" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sponsors (Total)</label>
                    <input type="number" step="0.1" name="monthlySponsorsTarget" value={chapterSettings.monthlySponsorsTarget || ''} placeholder="13.6" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TYFCB (Total)</label>
                    <input type="number" name="monthlyTYFCBTarget" value={chapterSettings.monthlyTYFCBTarget || ''} placeholder="3400000" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" />
                  </div>
                </div>
                <button type="submit" disabled={savingSettings} className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2.5 rounded-lg mt-2 transition-colors disabled:opacity-50">
                  {savingSettings ? "Saving..." : "Save Monthly Targets"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#8b5cf6]">👤</span> Individual Targets
              </h2>
              <form onSubmit={saveIndividualTargets} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">1-to-1s</label>
                    <input type="text" name="individual1to1sTarget" value={chapterSettings.individual1to1sTarget || ''} placeholder="1 per week" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#8b5cf6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Referrals</label>
                    <input type="text" name="individualReferralsTarget" value={chapterSettings.individualReferralsTarget || ''} placeholder="1 per week" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#8b5cf6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Visitors</label>
                    <input type="text" name="individualVisitorsTarget" value={chapterSettings.individualVisitorsTarget || ''} placeholder="1 per month" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#8b5cf6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">CEU</label>
                    <input type="text" name="individualCEUTarget" value={chapterSettings.individualCEUTarget || ''} placeholder="0.5 hour per week" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#8b5cf6]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TYFCB</label>
                    <input type="text" name="individualTYFCBTarget" value={chapterSettings.individualTYFCBTarget || ''} placeholder="10k+" onChange={handleSettingsChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#8b5cf6]" />
                  </div>
                </div>
                <button type="submit" disabled={savingSettings} className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-2.5 rounded-lg mt-2 transition-colors disabled:opacity-50">
                  {savingSettings ? "Saving..." : "Save Individual Targets"}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Excel Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#10b981]">📊</span> Upload Data Report
              </h2>
              <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Period / Month</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" name="monthYear" value={chapterSettings.monthYear || ""} onChange={handleSettingsChange} className="w-full sm:w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#10b981]" placeholder="e.g. Jan – May 2025" required />
                    <button type="button" onClick={saveBasicSettings} disabled={savingSettings} className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap shadow-sm">
                      {savingSettings ? "Saving..." : "Save Period"}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Set and save the period name before uploading the report.</p>
                </div>
                <div className="flex flex-col gap-4 pt-2 w-full">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">1. Main Data File</label>
                    <input type="file" accept=".xlsx,.xls" onChange={(e) => setMainFileOverall(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#10b981]/10 file:text-[#10b981] hover:file:bg-[#10b981]/20 transition-all cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">2. Visitors Data File</label>
                    <input type="file" accept=".xlsx,.xls" onChange={(e) => setVisitorsFileOverall(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#10b981]/10 file:text-[#10b981] hover:file:bg-[#10b981]/20 transition-all cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">3. Sponsors Data File</label>
                    <input type="file" accept=".xlsx,.xls" onChange={(e) => setSponsorsFileOverall(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#10b981]/10 file:text-[#10b981] hover:file:bg-[#10b981]/20 transition-all cursor-pointer" />
                  </div>
                  <button onClick={() => handleMultiUpload('overall')} disabled={uploading} className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 mt-2 w-full sm:w-auto self-start">
                    {uploading ? "Processing..." : "Upload All 3 Files"}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-3 mb-6">This will parse the Excel file, calculate scores, and update the database for the Overall Scoreboard.</p>

              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#3b82f6]">📊</span> Upload Monthly Data (For Dashboard & Modal)
              </h2>
              <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Select Month & Year</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="month" 
                      value={monthlyMonthName}
                      onChange={(e) => setMonthlyMonthName(e.target.value)}
                      className="w-full sm:w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#3b82f6]" 
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Select the exact month/year for this dataset before uploading.</p>
                </div>
                <div className="flex flex-col gap-4 pt-2 w-full">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">1. Main Data File</label>
                    <input type="file" accept=".xlsx,.xls" onChange={(e) => setMainFileMonthly(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#3b82f6]/10 file:text-[#3b82f6] hover:file:bg-[#3b82f6]/20 transition-all cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">2. Visitors Data File</label>
                    <input type="file" accept=".xlsx,.xls" onChange={(e) => setVisitorsFileMonthly(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#3b82f6]/10 file:text-[#3b82f6] hover:file:bg-[#3b82f6]/20 transition-all cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">3. Sponsors Data File</label>
                    <input type="file" accept=".xlsx,.xls" onChange={(e) => setSponsorsFileMonthly(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#3b82f6]/10 file:text-[#3b82f6] hover:file:bg-[#3b82f6]/20 transition-all cursor-pointer" />
                  </div>
                  <button onClick={() => handleMultiUpload('monthly')} disabled={uploading} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 mt-2 w-full sm:w-auto self-start">
                    {uploading ? "Processing..." : "Upload All 3 Files"}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-3 mb-6">This data updates the Monthly Scorecard and the Historical Comparison tables in the Member Modal.</p>

              <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete all historical old data? This will keep only the most recently uploaded batch.")) {
                      const res = await fetch("/green-tool/api/data/purge?type=old", { method: "DELETE" });
                      const json = await res.json();
                      alert(json.msg);
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-sm rounded-lg transition-colors border border-orange-100"
                >
                  Delete Old Data
                </button>
                <button
                  onClick={async () => {
                    if (confirm("WARNING: Are you sure you want to completely clear the entire database?")) {
                      const res = await fetch("/green-tool/api/data/purge?type=all", { method: "DELETE" });
                      const json = await res.json();
                      if (json.success) {
                        alert(json.msg);
                        window.location.reload();
                      } else {
                        alert(json.msg);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm rounded-lg transition-colors border border-red-100"
                >
                  Delete All Data
                </button>
              </div>
            </div>

            {/* Historical Batches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-500">🕰️</span> Manage Historical Batches
              </h2>
              {batches.length === 0 ? (
                <p className="text-sm text-gray-500">No batches found in the database.</p>
              ) : (
                <div className="space-y-3">
                  {batches.map((batch, idx) => (
                    <div key={batch._id || 'legacy'} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900 text-sm flex items-center flex-wrap gap-2">
                          {batch.periodDate ? (
                            <span>Period: <span className="text-[#3b82f6]">{batch.periodDate}</span></span>
                          ) : (
                            <span>Batch: {batch._id ? new Date(batch._id).toLocaleString() : 'Legacy Data'}</span>
                          )}
                          <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase tracking-wider ${batch.reportType === 'monthly' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'bg-gray-100 text-gray-500'}`}>{batch.reportType || 'overall'}</span>
                          {idx === 0 && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full uppercase tracking-wider">Latest</span>}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{batch.count} member records</p>
                      </div>
                      <button
                        onClick={() => deleteBatch(batch._id, batch.reportType)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete this batch"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Table Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-gray-900">
                  Data Preview <span className="text-xs font-normal text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded ml-2">{previewType}</span>
                </h3>
                {data.length > 0 && (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search members..."
                        className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition-all"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                    <button onClick={handleClear} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {data.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-medium text-sm">
                  Upload an Excel file to see the parsed data preview.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                    <thead className="bg-gray-50 sticky top-0 shadow-sm">
                      <tr className="text-gray-500 uppercase tracking-wider font-bold">
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Att. Pts</th>
                        <th className="p-3">Ref. Pts</th>
                        <th className="p-3">Vis. Pts</th>
                        <th className="p-3">TYFCB Pts</th>
                        <th className="p-3">121 Pts</th>
                        <th className="p-3">CEU Pts</th>
                        <th className="p-3">Total Score</th>
                        <th className="p-3">Band</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-900">{item.fullName}</td>
                          <td className="p-3 text-gray-900">{item.attendancePoints}</td>
                          <td className="p-3 text-gray-900">{item.referalPoints}</td>
                          <td className="p-3 text-gray-900">{item.visitorsPoints}</td>
                          <td className="p-3 text-gray-900">{item.TYFCBPoints}</td>
                          <td className="p-3 text-gray-900">{item.onetoonePoints}</td>
                          <td className="p-3 text-gray-900">{item.CEUPoints}</td>
                          <td className="p-3 font-bold text-gray-900">{item.totalScore}</td>
                          <td className="p-3 font-bold">
                            <span className={`px-2 py-0.5 rounded ${item.band === 'GREEN' ? 'bg-[#10b981]/10 text-[#10b981]' : item.band === 'AMBER' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : item.band === 'RED' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-gray-100 text-gray-500'}`}>{item.band}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
