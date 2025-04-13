const express = require("express");
const userAuth = require("../middlewares/userAuth");
const Job = require("../models/job");
const User = require("../models/user");

const jobRouter = express.Router();

jobRouter.get("/", userAuth, async (req, res) => {
  const { searchStr, location } = req.query;
  try {
    const query = {};
    if (searchStr.trim()) {
      query.$or = [
        { title: { $regex: searchStr, $options: "i" } },
        { description: { $regex: searchStr, $options: "i" } },
        { skillsRequired: { $regex: searchStr, $options: "i" } },
      ];
    }
    if (location.trim()) {
      query.location = { $regex: location, $options: "i" };
    }
    const jobsList = await Job.find(query);
    res.status(200).json({ jobs: jobsList });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

jobRouter.get("/:jobId", userAuth, async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId);
    res.status(200).json({ job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

jobRouter.post("/post", userAuth, async (req, res) => {
  try {
    const { _id: postedBy } = req.user;
    const { title, description, company, location, employmentType, salary, skillsRequired } = req.body;
    const postedByUser = await User.findById(postedBy);
    if (postedByUser.role !== "internal") {
      throw new Error("Only internal employees can post a job");
    }
    const newJob = new Job({
      title,
      description,
      company,
      location,
      employmentType,
      salary,
      skillsRequired,
      postedBy,
    });
    await newJob.save();
    res.status(200).json({ message: "Job posted Successfully" });
    // res.status(200).json({ jobs: jobsList });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
jobRouter.put("/:jobId", userAuth, async (req, res) => {
  try {
    const { _id: postedBy } = req.user;
    const { jobId } = req.params;
    const { title, description, company, location, employmentType, salary, skillsRequired } = req.body;
    const existingJob = await Job.findById(jobId);

    if (postedBy.toString() !== existingJob.postedBy.toString()) {
      throw new Error("Only the person who posted the job, can edit!!");
    }
    await Job.findByIdAndUpdate(
      { _id: jobId },
      {
        $set: {
          title: title,
          description: description,
          company: company,
          location: location,
          employmentType: employmentType,
          salary: salary,
          skillsRequired: skillsRequired,
        },
      }
    );
    res.status(200).json({ message: "Job updated successfully" });
    // res.status(200).json({ jobs: jobsList });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

jobRouter.delete("/:jobId", userAuth, async (req, res) => {
  const { _id: postedBy } = req.user;
  const { jobId } = req.params;
  const existingJob = await Job.findById(jobId);

  try {
      if (postedBy.toString() !== existingJob.postedBy.toString()) {
        throw new Error("Only the person who posted the job, can delete!!");
      }
    const job = await Job.findByIdAndDelete(jobId);
    console.log(job);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = jobRouter;
