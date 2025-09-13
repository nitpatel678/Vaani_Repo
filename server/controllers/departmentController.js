import Report from "../models/Report.js";

export const viewAllComplaints = async (req, res) => {
  try {
    // departments should only see reports assigned to their department
    const reports = await Report.find({ department: req.user.department })
      .populate("createdBy", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All complaints fetched successfully",
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

export const viewComplaintById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({
      reportId,
      department: req.user.department, // restrict to department
    }).populate("createdBy", "name email phone");

    if (!report) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint fetched successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaint", error: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findById(reportId);

if (!report || report.department !== req.user.department) {
  return res.status(404).json({ message: "Report not found or unauthorized" });
}

report.status = status;
await report.save();

res.json(report);

  res.json(report);

    res.status(200).json({
      message: "Complaint status updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update complaint status", error: error.message });
  }
};

export const filterComplaintsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const reports = await Report.find({
      department: req.user.department,
      status,
    }).populate("createdBy", "name email phone");

    res.status(200).json({
      message: `Complaints with status '${status}' fetched successfully`,
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to filter complaints", error: error.message });
  }
};



export const submitFinalClosing = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { solvedImagePath, solvedMediaPaths } = req.body; 

    if (!solvedImagePath) {
      return res.status(400).json({ message: "Solved image path is required" });
    }

    // Save first file as imageUrl, rest as mediaUrls array
    const imageUrl = solvedImagePath;
    const mediaUrls = solvedMediaPaths && solvedMediaPaths.length ? solvedMediaPaths : [];

    const report = await Report.findById(reportId);

if (!report || report.department !== req.user.department) {
  return res.status(404).json({
    message: "Complaint not found or not in your department",
  });
}

report.imageUrl = imageUrl;
report.mediaUrl = mediaUrls.length ? mediaUrls : [];
report.status = "resolved";

await report.save();

res.json(report);

    res.status(200).json({
      message: "Complaint closed successfully with solved image and media",
      report,
    });
  } catch (error) {
    console.error("Error in submitFinalClosing:", error.message);
    res.status(500).json({
      message: "Failed to close complaint",
      error: error.message,
    });
  }
};
