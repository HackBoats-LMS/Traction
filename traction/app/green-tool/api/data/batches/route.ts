import { connectDB } from "@/lib/db";
import MemberReport from "@/models/memberReport";
import MonthlyReport from "@/models/monthlyReport";
import HistoricalReport from "@/models/historicalReport";
import ComparisonReport from "@/models/comparisonReport";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    let Model: any = MemberReport;
    if (type === 'monthly') Model = MonthlyReport;
    if (type === 'historical') Model = HistoricalReport;
    if (type === 'comparison') Model = ComparisonReport;

    const batches = await Model.aggregate([
      {
        $group: {
          _id: "$uploadBatchId",
          count: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
          reportType: { $first: { $ifNull: ["$reportType", type || "overall"] } },
          periodDate: { $first: "$periodDate" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    return NextResponse.json({ success: true, batches });
  } catch (error) {
    return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const batchId = url.searchParams.get("batchId");
    const type = url.searchParams.get("type");
    let Model: any = MemberReport;
    if (type === 'monthly') Model = MonthlyReport;
    if (type === 'historical') Model = HistoricalReport;
    if (type === 'comparison') Model = ComparisonReport;
    
    if (!batchId) {
       return NextResponse.json({ success: false, msg: "No batch ID provided" }, { status: 400 });
    }

    if (batchId === "legacy") {
       await Model.deleteMany({ uploadBatchId: { $exists: false } });
       await Model.deleteMany({ uploadBatchId: null });
    } else {
       await Model.deleteMany({ uploadBatchId: batchId });
    }

    revalidatePath("/", "page");

    return NextResponse.json({ success: true, msg: "Batch deleted successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
  }
}
