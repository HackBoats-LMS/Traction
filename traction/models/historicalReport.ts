import mongoose from "mongoose";

const historicalReportSchema =
  new mongoose.Schema({

    fullName: {
      type: String,
      required: true,
    },

    attendancePercentage: {
      type: Number,
      default: 0,
    },

    attendancePoints: {
      type: Number,
      default: 0,
    },

    referals: {
      type: Number,
      default: 0,
    },

    referalPoints: {
      type: Number,
      default: 0,
    },

    visitors: {
      type: Number,
      default: 0,
    },

    visitorsPoints: {
      type: Number,
      default: 0,
    },

    TYFCB: {
      type: Number,
      default: 0,
    },

    TYFCBPoints: {
      type: Number,
      default: 0,
    },

    onetoone: {
      type: Number,
      default: 0,
    },

    onetoonePoints: {
      type: Number,
      default: 0,
    },

    CEU: {
      type: Number,
      default: 0,
    },

    CEUPoints: {
      type: Number,
      default: 0,
    },

    sponsorPoints: {
      type: Number,
      default: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    band: {
      type: String,
      enum: [
        "GREEN",
        "AMBER",
        "RED",
        "GREY",
      ],
      default: "GREY",
    },

    uploadBatchId: {
      type: String,
    },

    reportType: {
      type: String,
      default: "historical",
    },

  }, {
    timestamps: true,
  });

delete mongoose.models.HistoricalReport;

export default mongoose.model(
  "HistoricalReport",
  historicalReportSchema
);
