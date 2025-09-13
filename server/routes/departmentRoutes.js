import express from "express";
import {
  viewAllComplaints,
  viewComplaintById,
  updateComplaintStatus,
  filterComplaintsByStatus,
  submitFinalClosing,
} from "../controllers/departmentController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get(
  "/complaints",
  verifyToken,
  authorizeRoles("department"),
  viewAllComplaints
);

router.get(
  "/complaints/:reportId",
  verifyToken,
  authorizeRoles("department"),
  viewComplaintById
);

router.patch(
  "/complaints/:reportId/status",
  verifyToken,
  authorizeRoles("department"),
  updateComplaintStatus
);

router.get(
  "/complaints/filter/status",
  verifyToken,
  authorizeRoles("department"),
  filterComplaintsByStatus
);

router.patch(
  "/complaints/:reportId/close",
  verifyToken,
  authorizeRoles("department"),
  submitFinalClosing
);

export default router;
