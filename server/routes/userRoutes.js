import express from "express";
import { createReport, trackReport, getUserReports } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reports", verifyToken, createReport);

router.get("/reports/:reportId", verifyToken, trackReport);

router.get("/my-reports", verifyToken, getUserReports);

export default router;
