import { connectDB } from "@/lib/db";
import TopPerformer from "@/models/topPerformer";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await connectDB();
    let data = await TopPerformer.findOne().sort({ createdAt: -1 });
    if (!data) {
      data = await TopPerformer.create({ monthYear: "Current Period" });
    }
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, msg: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    await TopPerformer.deleteMany({});
    const newRecord = await TopPerformer.create(body);

    revalidatePath("/", "page");

    return Response.json({ success: true, data: newRecord });
  } catch (error) {
    return Response.json({ success: false, msg: "Server Error" }, { status: 500 });
  }
}
