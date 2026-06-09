import memberReport from "@/models/memberReport";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import MonthlyReport from "@/models/monthlyReport";

export async function GET(req: Request) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'overall';
    
    const Model = type === 'monthly' ? MonthlyReport : memberReport;
    const query: any = type === 'overall' 
        ? { $or: [{ reportType: 'overall' }, { reportType: { $exists: false } }] }
        : { reportType: type };
        
    const latestDoc = await Model.findOne(query).sort({ createdAt: -1 });
    let data = [];
    
    if (latestDoc && latestDoc.uploadBatchId) {
        data = await Model.find({ uploadBatchId: latestDoc.uploadBatchId } as any);
    } else {
        // Fallback for legacy data before uploadBatchId was introduced
        data = await Model.find(query);
    }
    
    return NextResponse.json({ data });
}