import Navbar from "./components/Navbar";
import DashboardHeader from "./components/DashboardHeader";
import ChapterScorecard from "./components/ChapterScorecard";
import MonthlyScorecard from "./components/MonthlyScorecard";
import OverallReport from "./components/OverallReport";
import Table from "./components/Table";
import Recognition from "./components/Recognition";
import ScoringParameters from "./components/ScoringParameters";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import MemberReport from "@/models/memberReport";
import MonthlyReport from "@/models/monthlyReport";
import HistoricalReport from "@/models/historicalReport";
import ComparisonReport from "@/models/comparisonReport";
import ChapterSettings from "@/models/chapterSettings";

export const getCachedChapterSettings = unstable_cache(
  async () => {
    try {
      await connectDB();
      const settings = await ChapterSettings.findOne().sort({ createdAt: -1 }).lean();
      if (!settings) return null;
      return {
        ...settings,
        _id: settings._id?.toString(),
        createdAt: settings.createdAt?.toString(),
        updatedAt: settings.updatedAt?.toString()
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  ['chapter-settings-cache-key'],
  { tags: ['chapter-settings'], revalidate: 31536000 }
);

const getCachedData = async (type: string = 'overall') => {
  return unstable_cache(
    async () => {
      try {
        await connectDB();
        let Model: any = MemberReport;
        if (type === 'monthly' || type === 'all-monthly') Model = MonthlyReport;
        if (type === 'historical') Model = HistoricalReport;
        if (type === 'comparison') Model = ComparisonReport;

        const query = type === 'overall'
          ? { $or: [{ reportType: 'overall' }, { reportType: { $exists: false } }] }
          : { reportType: (type === 'all-monthly' ? 'monthly' : type) };

        let data = [];
        if (type === 'all-monthly') {
           data = await Model.find(query).sort({ periodDate: -1 }).lean();
        } else {
           const sortStrategy = type === 'monthly' ? { periodDate: -1, createdAt: -1 } : { createdAt: -1 };
           const latestDoc = await Model.findOne(query).sort(sortStrategy).lean();
           if (latestDoc && latestDoc.uploadBatchId) {
             data = await Model.find({ uploadBatchId: latestDoc.uploadBatchId }).lean();
           } else {
             data = await Model.find(query).lean();
           }
        }
        // Serialize to avoid Next.js warning when passing to client components
        return data.map((d: any) => ({
          ...d,
          _id: d._id?.toString(),
          createdAt: d.createdAt?.toString(),
          updatedAt: d.updatedAt?.toString()
        }));
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    [`excel-data-cache-key-v2-${type}`],
    { tags: ['excel-data'] }
  )();
};

export const dynamic = 'force-static';

export default async function Home() {
  const data = await getCachedData('overall');
  const monthlyData = await getCachedData('monthly');
  const allMonthlyData = await getCachedData('all-monthly');
  const historicalData = await getCachedData('historical');
  const comparisonData = await getCachedData('comparison');
  const chapterData = await getCachedChapterSettings();

  return (
    <main className="min-h-screen bg-[#EEF4F6] overflow-x-hidden">
      <Navbar chapterData={chapterData} />
      <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 font-sans pb-0">
        <DashboardHeader data={data} chapterData={chapterData} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
          <ChapterScorecard data={data} chapterData={chapterData} />
          {monthlyData && monthlyData.length > 0 && (() => {
            const uploadDate = new Date(monthlyData[0].createdAt);
            const formattedMonth = chapterData?.monthlyMonthYear || uploadDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            return (
              <MonthlyScorecard data={monthlyData} chapterData={chapterData} title={`Monthly Scorecard (${formattedMonth})`} />
            );
          })()}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 items-stretch">
          <OverallReport data={data} chapterData={chapterData} />
          <Recognition data={data} monthlyData={monthlyData || []} chapterData={chapterData} />
        </div>
      </div>
      <Table initialData={data} allMonthlyData={allMonthlyData} comparisonData={comparisonData} chapterData={chapterData} />
      <ScoringParameters />
    </main>
  );
}
