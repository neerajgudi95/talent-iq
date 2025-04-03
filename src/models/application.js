const mongoose = require("mongoose");
const validator = require("validator");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["submitted", "shortlisted", "rejected", "hired"],
        message: `{VALUE} is not a valid application status`,
      },
      default: "submitted",
    },
    resume: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("This is not a valid url");
        }
      },
    },
    coverLetter: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("This is not a valid url");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = new mongoose.model("Application", applicationSchema);

module.exports = ApplicationModel;
