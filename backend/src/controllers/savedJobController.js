import SavedJob from "../models/SavedJob.js";

// GET /api/saved-jobs
export async function getSavedJobs(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const savedJobs = await SavedJob.find({ clerkUserId }).sort({ createdAt: -1 });
    res.json({ savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST /api/saved-jobs
export async function saveJob(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const job = req.body;

    if (!job.jobId || !job.title || !job.company || !job.applyUrl || !job.source) {
      return res.status(400).json({ message: "Missing required job fields" });
    }

    const savedJob = await SavedJob.findOneAndUpdate(
      { clerkUserId, jobId: job.jobId },
      { clerkUserId, ...job },
      { upsert: true, new: true }
    );

    res.status(201).json({ savedJob });
  } catch (error) {
    console.error("Error saving job:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// DELETE /api/saved-jobs/:jobId
export async function unsaveJob(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobId } = req.params;

    await SavedJob.deleteOne({ clerkUserId, jobId });
    res.json({ message: "Job removed from saved" });
  } catch (error) {
    console.error("Error removing saved job:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
