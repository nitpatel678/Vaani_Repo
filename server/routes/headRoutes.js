import express from "express";
import {
  viewAllComplaints,
  createUser,
  viewComplaintById,
  flagComplaint,
  updateComplaintStatus,
} from "../controllers/headController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/complaints", verifyToken, authorizeRoles("head"), viewAllComplaints);

router.post("/users", verifyToken, authorizeRoles("head"), createUser);

router.get("/complaints/:reportId", verifyToken, authorizeRoles("head"), viewComplaintById);

router.patch(
  "/complaints/:reportId/flag",
  verifyToken,
  authorizeRoles("head"),
  flagComplaint
);


router.patch("/complaints/:reportId/status", verifyToken, authorizeRoles("head"), updateComplaintStatus);

export default router;
