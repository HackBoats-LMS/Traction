import mongoose from "mongoose";

const topPerformerSchema = new mongoose.Schema({
  monthYear: { type: String, required: true, default: "Current Period" },
  mostReferrals: { type: String, default: "" },
  mostReferralsValue: { type: String, default: "" },
  bestAttendance: { type: String, default: "" },
  bestAttendanceValue: { type: String, default: "" },
  most1to1s: { type: String, default: "" },
  most1to1sValue: { type: String, default: "" },
  meetingsCount: { type: String, default: "23" },
}, { timestamps: true });

delete mongoose.models.TopPerformer;
export default mongoose.model("TopPerformer", topPerformerSchema);
