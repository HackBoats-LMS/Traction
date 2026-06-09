import mongoose from "mongoose";

const chapterSettingsSchema = new mongoose.Schema({
  chapterName: { type: String, default: "Infinity Chapter" },
  monthYear: { type: String, default: "Jan – May 2025" },
  meetingsCount: { type: String, default: "23" },
  monthlyMonthYear: { type: String, default: "" },
  historicalMonthYear: { type: String, default: "" },
  comparisonMonthYear: { type: String, default: "" },
  
  // Overall targets
  attendanceTarget: { type: Number, default: 95 },
  overall1to1sTarget: { type: Number, default: 25 },
  overallReferralsTarget: { type: Number, default: 25 },
  overallVisitorsTarget: { type: Number, default: 6 },
  overallTYFCBTarget: { type: Number, default: 300000 },
  overallCEUTarget: { type: Number, default: 25 },
  overallSponsorsTarget: { type: Number, default: 1 },

  // Monthly targets
  monthly1to1sTarget: { type: Number, default: 4 },
  monthlyReferralsTarget: { type: Number, default: 4 },
  monthlyVisitorsTarget: { type: Number, default: 1 },
  monthlyTYFCBTarget: { type: Number, default: 50000 },
  monthlyCEUTarget: { type: Number, default: 4 },
  monthlySponsorsTarget: { type: Number, default: 0.2 },

  // Individual targets
  individual1to1sTarget: { type: String, default: "1 per week" },
  individualReferralsTarget: { type: String, default: "1 per week" },
  individualVisitorsTarget: { type: String, default: "1 per month" },
  individualTYFCBTarget: { type: String, default: "10k+" },
  individualCEUTarget: { type: String, default: "0.5 hour per week" },
}, { timestamps: true });

delete mongoose.models.ChapterSettings;
export default mongoose.model("ChapterSettings", chapterSettingsSchema);
