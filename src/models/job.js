const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: {
        values: ["full-time", "part-time", "contract"],
        message: `{VALUE} is not a valid job type`,
      },
    },
    visibility: {
      type: String,
      enum: {
        values: ["external", "internal"],
        message: `{VALUE} is not a valid job type`,
      },
      default: "internal",
    },
    salary: {
      type: Number,
    },
    skillsRequired: {
      type: [String],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

jobSchema.index({
  title: "text",
  description: "text",
  location: "text",
  skillsRequired: "text",
});

const JobModel = new mongoose.model("Job", jobSchema);
module.exports = JobModel;
