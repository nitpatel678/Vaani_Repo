// file to generate signed upload URLs for Supabase storage

import express from "express";
import supabase from "../config/supabase.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/get-upload-urls", verifyToken, async (req, res) => {
  try {
    const { files } = req.body; // Array of { name, type }
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ message: "Files array required" });
    }

    const uploadUrls = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `uploads/${req.user.id}/${Date.now()}-${Math.random()}.${fileExt}`;

      // Create signed upload URL valid for 5 mins
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .createSignedUploadUrl(fileName, 300); // 5 min

      if (error) throw error;

      uploadUrls.push({
        fileName,        // will save in MongoDB
        signedUrl: data.signedUrl,
      });
    }

    res.json({ uploadUrls });
  } catch (err) {
    console.error("Error generating signed URLs:", err.message);
    res.status(500).json({ message: "Failed to generate signed URLs", error: err.message });
  }
});

export default router;
