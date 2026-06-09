const XLSX = require('xlsx');
const fs = require('fs');

const parseExcel = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
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
        
        const rowData = {};
        for (let j = 0; j < headers.length; j++) {
            if (headers[j]) {
                rowData[headers[j]] = row[j];
            }
        }
        data.push(rowData);
    }
    return data;
};

const mainData = parseExcel('./public/Chapter_Summary_PALMS_Report_08-06-2026-8-28-PM.xls');
const visitorsData = parseExcel('./public/Region_Chapter_Visitor_Report_02-06-2026_10-11_AM.xls');
const sponsorsData = parseExcel('./public/Region_Sponsor_Report_02-06-2026_10-12_AM.xls');

const visitorCounts = {};
visitorsData.forEach(row => {
    const chapter = (row["Chapter"] || "").toString().trim().toUpperCase();
    if (chapter.includes("ATMOS") || chapter === "BNI ATMOS" || !row["Chapter"]) {
        const invitedBy = (row["Invited By"] || row["Invited"] || "").toString().trim();
        if (invitedBy) {
            const nameKey = invitedBy.toLowerCase().replace(/\s+/g, ' ');
            visitorCounts[nameKey] = (visitorCounts[nameKey] || 0) + 1;
        }
    }
});

const sponsorCounts = {};
sponsorsData.forEach(row => {
    const chapter = (row["Sponsor Chapter"] || row["Chapter"] || "").toString().trim().toUpperCase();
    if (chapter.includes("ATMOS") || chapter === "BNI ATMOS" || !row["Sponsor Chapter"]) {
        const name = (row["Sponsor First Name"] || row["Name"] || row["First Name"] || "").toString().trim();
        const lastName = (row["Sponsor Last Name"] || row["Last Name"] || "").toString().trim();
        const fullName = (name + " " + lastName).trim().toLowerCase().replace(/\s+/g, ' ');
        const fallbackName = name.toLowerCase().replace(/\s+/g, ' ');
        
        const sponsored = parseInt((row["Total Number Sponsored"] || row["Sponsored"] || row["Sponsor"] || "0").toString());
        
        if (fullName && !isNaN(sponsored)) {
            sponsorCounts[fullName] = Math.max(sponsorCounts[fullName] || 0, sponsored);
        }
        if (fallbackName && !isNaN(sponsored)) {
            sponsorCounts[fallbackName] = Math.max(sponsorCounts[fallbackName] || 0, sponsored);
        }
    }
});

console.log("Visitor Counts keys:", Object.keys(visitorCounts));
console.log("Sponsor Counts keys:", Object.keys(sponsorCounts));

let matches = 0;
mainData.forEach(row => {
    const firstName = row["First Name"]?.toString().trim().toLowerCase() || "";
    const lastName = row["Last Name"]?.toString().trim().toLowerCase() || "";
    const fullNameKey = (firstName + " " + lastName).trim().replace(/\s+/g, ' ');
    
    // Attempt fuzzy match
    let vCount = visitorCounts[fullNameKey] || visitorCounts[firstName] || 0;
    let sCount = sponsorCounts[fullNameKey] || sponsorCounts[firstName] || 0;

    if (vCount === 0) {
        // try finding a key that includes the first name
        const match = Object.keys(visitorCounts).find(k => k.includes(firstName));
        if (match) vCount = visitorCounts[match];
    }
    if (sCount === 0) {
        const match = Object.keys(sponsorCounts).find(k => k.includes(firstName));
        if (match) sCount = sponsorCounts[match];
    }

    if (vCount > 0 || sCount > 0) {
        matches++;
        console.log(`Matched: ${fullNameKey} -> V: ${vCount}, S: ${sCount}`);
    }
});

console.log(`Total Matches: ${matches}`);

