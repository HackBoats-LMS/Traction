import { connectDB } from "@/lib/db";
import MemberReport from "@/models/memberReport";
import MonthlyReport from "@/models/monthlyReport";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const modelParam = url.searchParams.get("model");
    const Model = modelParam === 'monthly' ? MonthlyReport : MemberReport;

    if (type === "all") {
      await Model.deleteMany({});
      revalidatePath("/", "page");
      return Response.json({ success: true, msg: "All database records deleted." });
    }

    if (type === "old") {
      const latestDoc = await Model.findOne().sort({ createdAt: -1 });
      if (latestDoc && latestDoc.uploadBatchId) {
        await Model.deleteMany({ uploadBatchId: { $ne: latestDoc.uploadBatchId } });
        return Response.json({ success: true, msg: "Old batches deleted from database." });
      } else {
        return Response.json({ success: false, msg: "No old batches found." });
      }
    }

    return Response.json({ success: false, msg: "Invalid purge type." }, { status: 400 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, msg: "Server error." }, { status: 500 });
  }
}
