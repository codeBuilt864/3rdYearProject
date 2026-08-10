import JobInfo from "../models/JobDescription.js";

// GET /api/job-descriptions
export async function getJobDescriptions(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const jobInfos = await JobInfo.find({ clerkUserId }).sort({ updatedAt: -1 });
    res.json({ jobInfos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST /api/job-descriptions
export async function createJobDescription(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { name, title, experienceLevel, description } = req.body;

    if (!name || !experienceLevel || !description) {
      return res.status(400).json({ message: "name, experienceLevel, and description are required" });
    }

    const jobInfo = await JobInfo.create({
      clerkUserId,
      name,
      title: title || null,
      experienceLevel,
      description,
    });

    res.status(201).json({ jobInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/job-descriptions/:id
export async function getJobDescriptionById(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const jobInfo = await JobInfo.findOne({ _id: req.params.id, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });
    res.json({ jobInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// PUT /api/job-descriptions/:id
export async function updateJobDescription(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { name, title, experienceLevel, description } = req.body;

    const jobInfo = await JobInfo.findOneAndUpdate(
      { _id: req.params.id, clerkUserId },
      { name, title: title || null, experienceLevel, description },
      { new: true }
    );

    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });
    res.json({ jobInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
