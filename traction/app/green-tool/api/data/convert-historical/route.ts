import * as XLSX from "xlsx";
import { transformMemeber } from "../convert/functions";
import { connectDB } from "@/lib/db";
import HistoricalReport from "@/models/historicalReport";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get("file");
        const historicalMonthName = formData.get("historicalMonthName");

        if (!file || !(file instanceof File)) {
            return Response.json(
                { success: false, msg: "No valid file provided" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        let headerRowIndex = -1;
        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            if (row && (row.includes("First Name") || row.includes("First\nName"))) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
             return Response.json(
                { success: false, msg: "Could not find 'First Name' header in Excel file." },
                { status: 400 }
            );
        }

        const headers = rawData[headerRowIndex].map(h => typeof h === 'string' ? h.replace(/\n/g, ' ').trim() : h);
        
        const data = [];
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row || row.length === 0) continue;
            
            const rowData: any = {};
            for (let j = 0; j < headers.length; j++) {
                if (headers[j]) {
                    rowData[headers[j]] = row[j];
                }
            }
            data.push(rowData);
        }

        // Remove 'Total', 'BNI', and 'Visitors' rows
        const filteredData = data.filter((row: any) => {
            const firstName = row["First Name"]?.toString().trim().toLowerCase() || "";
            const lastName = row["Last Name"]?.toString().trim().toLowerCase() || "";
            if (!firstName && !lastName) return false;
            
            const isExcluded = ["total", "bni", "visitors"].some(term => firstName.includes(term) || lastName.includes(term));
            return !isExcluded;
        });

        const batchId = new Date().toISOString();
        const new_data = filteredData.map((row: any) => ({
            ...transformMemeber(row),
            uploadBatchId: batchId,
            reportType: "historical"
        }));
        
        await HistoricalReport.insertMany(new_data);

        if (historicalMonthName && typeof historicalMonthName === 'string') {
            const ChapterSettings = (await import("@/models/chapterSettings")).default;
            await ChapterSettings.findOneAndUpdate(
                {},
                { $set: { historicalMonthYear: historicalMonthName } },
                { upsert: true, sort: { createdAt: -1 } }
            );
        }

        revalidatePath("/", "page");
        // @ts-ignore
        revalidateTag("excel-data");
        // @ts-ignore
        revalidateTag("chapter-settings");

        return Response.json({ success: true, data: new_data });

    } catch (error) {
        console.log(error);
        return Response.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
}
