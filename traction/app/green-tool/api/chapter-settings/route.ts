import { connectDB } from "@/lib/db";
import ChapterSettings from "@/models/chapterSettings";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();
    let data = await ChapterSettings.findOne().sort({ createdAt: -1 });
    if (!data) {
      data = await ChapterSettings.create({});
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
    
    const newRecord = await ChapterSettings.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true, setDefaultsOnInsert: true, sort: { createdAt: -1 } }
    );

    revalidatePath("/", "page");
    // @ts-ignore
    revalidateTag("chapter-settings");

    return Response.json({ success: true, data: newRecord });
  } catch (error) {
    return Response.json({ success: false, msg: "Server Error" }, { status: 500 });
  }
}
