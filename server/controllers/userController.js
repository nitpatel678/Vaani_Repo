// controllers/reportController.js
import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { title, description, filePaths, location, department } = req.body;

    

    if (!filePaths || !filePaths.length) {
      return res.status(400).json({ message: "At least one file is required" });
    }

   
    const imageUrl = filePaths[0];
    const mediaUrls = filePaths.slice(1);

    const report = new Report({
      title,
      description,
      imageUrl,
      mediaUrl: mediaUrls.length ? mediaUrls : null,
      location,
      department,
      createdBy: req.user.id,
    });

    await report.save();

    res.status(201).json({
      message: "Report submitted successfully",
      reportId: report.reportId,
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error.message);
    res.status(500).json({ message: "Failed to create report", error: error.message });
  }
};



export const trackReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({ reportId }).populate("createdBy", "name email phone");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report details fetched successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch report", error: error.message });
  }
};



export const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "User complaints fetched successfully",
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user complaints", error: error.message });
  }
};