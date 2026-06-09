import * as XLSX from "xlsx";
import { transformMemeber } from "./functions";
import { connectDB } from "@/lib/db";
import MemberReport from "@/models/memberReport";
import { revalidatePath, revalidateTag } from "next/cache";

const parseExcel = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(rawData.length, 50); i++) {
        const row = rawData[i];
        if (row && (row.includes("First Name") || row.includes("First\nName") || row.includes("Invited By") || row.includes("Name"))) {
            headerRowIndex = i;
            break;
        }
    }
    
    if (headerRowIndex === -1) headerRowIndex = 0;

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
    return data;
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const formData = await req.formData();
        
        const mainFile = formData.get("mainFile");
        const visitorsFile = formData.get("visitorsFile");
        const sponsorsFile = formData.get("sponsorsFile");
        const reportType = formData.get("reportType") || "overall";

        if (!mainFile || !(mainFile instanceof File) || 
            !visitorsFile || !(visitorsFile instanceof File) || 
            !sponsorsFile || !(sponsorsFile instanceof File)) {
            return Response.json(
                { success: false, msg: "Missing one or more required files (Main, Visitors, Sponsors)" },
                { status: 400 }
            );
        }

        const mainData = await parseExcel(mainFile);
        const visitorsData = await parseExcel(visitorsFile);
        const sponsorsData = await parseExcel(sponsorsFile);

        // Process Visitors
        const visitorCounts: Record<string, number> = {};
        visitorsData.forEach(row => {
            const chapter = (row["Chapter"] || "").toString().trim().toUpperCase();
            if (chapter.includes("ATMOS") || chapter.includes("ATOMS") || !row["Chapter"]) {
                const invitedBy = (row["Invited By"] || row["Invited"] || "").toString().trim();
                if (invitedBy) {
                    const nameKey = invitedBy.toLowerCase();
                    visitorCounts[nameKey] = (visitorCounts[nameKey] || 0) + 1;
                }
            }
        });

        // Process Sponsors
        const sponsorCounts: Record<string, number> = {};
        sponsorsData.forEach(row => {
            const chapter = (row["Sponsor Chapter"] || row["Chapter"] || "").toString().trim().toUpperCase();
            if (chapter.includes("ATMOS") || chapter.includes("ATOMS") || !row["Sponsor Chapter"]) {
                const name = (row["Sponsor First Name"] || row["Name"] || row["First Name"] || "").toString().trim();
                const lastName = (row["Sponsor Last Name"] || row["Last Name"] || "").toString().trim();
                const fullName = (name + " " + lastName).trim().toLowerCase();
                const fallbackName = name.toLowerCase();
                
                const sponsored = parseInt((row["Total Number Sponsored"] || row["Sponsored"] || row["Sponsor"] || "0").toString());
                
                if (fullName && !isNaN(sponsored)) {
                    sponsorCounts[fullName] = Math.max(sponsorCounts[fullName] || 0, sponsored);
                }
                if (fallbackName && !isNaN(sponsored)) {
                    sponsorCounts[fallbackName] = Math.max(sponsorCounts[fallbackName] || 0, sponsored);
                }
            }
        });

        // Process Main Data
        // Remove 'Total', 'BNI', and 'Visitors' rows
        const filteredData = mainData.filter((row: any) => {
            const firstName = row["First Name"]?.toString().trim().toLowerCase() || "";
            const lastName = row["Last Name"]?.toString().trim().toLowerCase() || "";
            if (!firstName && !lastName) return false;
            
            const isExcluded = ["total", "bni", "visitors"].some(term => firstName.includes(term) || lastName.includes(term));
            return !isExcluded;
        });

        const batchId = new Date().toISOString();
        const new_data = filteredData.map((row: any) => {
            const firstName = row["First Name"]?.toString().trim().toLowerCase() || "";
            const lastName = row["Last Name"]?.toString().trim().toLowerCase() || "";
            const fullNameKey = (firstName + " " + lastName).trim();
            
            let vCount = visitorCounts[fullNameKey] || visitorCounts[firstName] || 0;
            let sCount = sponsorCounts[fullNameKey] || sponsorCounts[firstName] || 0;

            row["V"] = vCount;
            row["Visitors"] = vCount;
            row["Sponsor"] = sCount;
            row["Sponsored"] = sCount;

            return {
                ...transformMemeber(row),
                uploadBatchId: batchId,
                reportType
            };
        });
        await MemberReport.insertMany(new_data);
        revalidatePath("/", "page");
        // @ts-ignore
        revalidateTag("excel-data");

        return Response.json({ success: true, data: new_data });

    } catch (error) {
        console.log(error);
        return Response.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
}