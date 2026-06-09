export function transformMemeber(row: any) {
    const P = Number(row.P) || 0;
    const A = Number(row.A) || 0;
    const L = Number(row.L) || 0;
    const M = Number(row.M) || 0;
    const S = Number(row.S) || 0;
    const RGI = Number(row.RGI) || 0;
    const RGO = Number(row.RGO) || 0;

    // Robust extraction for V
    let rawV = row.V;
    if (rawV === undefined) rawV = row["V"];
    if (rawV === undefined) rawV = row["Visitors"];
    if (rawV === undefined) rawV = row["visitors"];
    const V = Number(rawV) || 0;

    const rowTYFCB = Number(row.TYFCB) || 0;
    const rowOnetoOne = Number(row["1-2-1"]) || 0;
    const rowCEU = Number(row.CEU) || 0;
    const Sponsor = Number(row.Sponsor) || 0;

    let total_mettings = P + A + L + M + S;
    // Prevent division by zero if all are 0
    if (total_mettings === 0) total_mettings = 1;

    //Attendance Percentage and Points calculation 
    const attendancePercentage = ((P + L + M + S) / total_mettings) * 100;
    let attendancePoints = 0;
    if (attendancePercentage < 88) {
        attendancePoints = 0;
    } else if (attendancePercentage >= 88 && attendancePercentage <= 94) {
        attendancePoints = 5;
    } else if (attendancePercentage >= 95) {
        attendancePoints = 10;
    }

    //Referals points calculation
    const referalsCalc = (RGI + RGO) / total_mettings;
    let referalPoints = 0;
    if (referalsCalc < 0.25) {
        referalPoints = 0;
    } else if (referalsCalc >= 0.25 && referalsCalc < 0.5) {
        referalPoints = 5;
    } else if (referalsCalc >= 0.5 && referalsCalc < 0.75) {
        referalPoints = 10;
    } else if (referalsCalc >= 0.75 && referalsCalc < 1) {
        referalPoints = 15;
    } else if (referalsCalc >= 1 && referalsCalc < 1.25) {
        referalPoints = 20;
    } else if (referalsCalc >= 1.25) {
        referalPoints = 25;
    }

    //visitiors calculation
    const visitorsCalc = V;
    let visitorsPoints = 0;
    if (visitorsCalc == 0) {
        visitorsPoints = 0;
    } else if (visitorsCalc == 1) {
        visitorsPoints = 5;
    } else if (visitorsCalc == 2) {
        visitorsPoints = 10;
    } else if (visitorsCalc == 3) {
        visitorsPoints = 15;
    } else if (visitorsCalc == 4) {
        visitorsPoints = 20;
    } else if (visitorsCalc >= 5) {
        visitorsPoints = 25;
    }

    //TYFCB Points calculation
    const TYFCBCalc = (rowTYFCB * 6) / 41599;
    let TYFCBPoints = 0;
    if (TYFCBCalc == 0) {
        TYFCBPoints = 0;
    } else if (TYFCBCalc > 0 && TYFCBCalc < 2) {
        TYFCBPoints = 1;
    } else if (TYFCBCalc >= 2 && TYFCBCalc < 5) {
        TYFCBPoints = 2;
    } else if (TYFCBCalc >= 5 && TYFCBCalc < 15) {
        TYFCBPoints = 3;
    } else if (TYFCBCalc >= 15 && TYFCBCalc < 30) {
        TYFCBPoints = 4;
    } else if (TYFCBCalc >= 30) {
        TYFCBPoints = 5;
    }

    //1-2-2 POINTS CALCULATION
    const onetooneCalc = rowOnetoOne / total_mettings;
    let onetoonePoints = 0;
    if (onetooneCalc < 0.25) {
        onetoonePoints = 0;
    } else if (onetooneCalc >= 0.25 && onetooneCalc < 0.5) {
        onetoonePoints = 5;
    } else if (onetooneCalc >= 0.5 && onetooneCalc < 0.75) {
        onetoonePoints = 10;
    } else if (onetooneCalc >= 0.75 && onetooneCalc < 1) {
        onetoonePoints = 15;
    } else if (onetooneCalc >= 1) {
        onetoonePoints = 20;
    }


    //CEU POINTS CALCULATION
    const CEUCalc = rowCEU / total_mettings;
    let CEUPoints = 0;
    if (CEUCalc == 0) {
        CEUPoints = 0;
    } else if (CEUCalc > 0 && CEUCalc <= 0.5) {
        CEUPoints = 5;
    } else if (CEUCalc > 0.5) {
        CEUPoints = 10;
    }

    //Sponcered members by you
    let sponsorPoints = 0;
    if (Sponsor == 0) {
        sponsorPoints = 0;
    } else if (Sponsor >= 1) {
        sponsorPoints = 5;
    }

    //total score band
    const totalScore = attendancePoints + referalPoints + visitorsPoints + TYFCBPoints + onetoonePoints + CEUPoints + sponsorPoints;

    let band = '';

    if (totalScore >= 70 && totalScore <= 100) {
        band = 'GREEN';
    } else if (totalScore >= 50 && totalScore <= 69) {
        band = 'AMBER';
    } else if (totalScore >= 30 && totalScore <= 49) {
        band = 'RED';
    } else if (totalScore <= 29) {
        band = 'GREY';
    } else {
        band = 'GREY';
    }

    return {
        fullName: `${row["First Name"] || ""} ${row["Last Name"] || ""}`.trim() || "Unknown Member",
        attendancePercentage: attendancePercentage || 0,
        attendancePoints: attendancePoints || 0,
        referals: (RGI + RGO) || 0, // RAW sum of referrals
        referalPoints: referalPoints || 0,
        visitors: V || 0, // RAW visitors
        visitorsPoints: visitorsPoints || 0,
        TYFCB: rowTYFCB || 0, // RAW TYFCB
        TYFCBPoints: TYFCBPoints || 0,
        onetoone: rowOnetoOne || 0, // RAW 1-to-1s
        onetoonePoints: onetoonePoints || 0,
        CEU: rowCEU || 0, // RAW CEUs
        CEUPoints: CEUPoints || 0,
        sponsors: Sponsor || 0, // RAW Sponsors
        sponsorPoints: sponsorPoints || 0,
        totalScore: totalScore || 0,
        band: band || "GREY",
    }
}