const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["submitted", "contacted", "hired", "rejected"],
        message: `{VALUE} is invalid status`,
      },
    },
  },
  { timestamps: true }
);

const ReferralModel = new mongoose.model("Referral", referralSchema);

module.exports = ReferralModel;
