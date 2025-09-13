import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Report from "../models/Report.js";

export const viewAllComplaints = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("createdBy", "name email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All complaints fetched successfully",
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user", 
      department: department || null,
    });

    await newUser.save();

    res.status(201).json({
      message: "User account created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

export const viewComplaintById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({ reportId }).populate("createdBy", "name email phone");
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

// controllers/headController.js
export const flagComplaint = async (req, res) => {
  try {
    const { reportId } = req.params;

    console.log("Flagging complaint with ID:", reportId);

    const report = await Report.findByIdAndUpdate(
      reportId,
      { $set: { flag: true } },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint flagged successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update flag",
      error: error.message,
    });
  }
};



export const updateComplaintStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    console.log("Updating status for complaint ID:", reportId, "to", status);
    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { $set: { status } },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update complaint status", error: error.message });
  }
};
