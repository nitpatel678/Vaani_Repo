import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// DB Connection
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import headRoutes from "./routes/headRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import fileRoutes from "./routes/fileRoutes.js"; // file upload signed URL route

// Middleware
import { verifyToken, authorizeRoles } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// ---------- Middleware ----------
app.use(express.json());

// Enable trust proxy for secure cookies behind proxy
app.set("trust proxy", 1);

// ---------- CORS Setup ----------
const allowedOrigins = [
  process.env.BASE_URL, // frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours
  })
);

// // Preflight handler for all routes
// app.options("/*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin || "");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );
//   res.header("Access-Control-Max-Age", "86400"); // Cache for 24 hours
//   res.sendStatus(204);
// });

// ---------- Connect DB ----------
connectDB();

// ---------- Routes ----------
// Public (Auth)
app.use("/api/auth", authRoutes);

// User routes (citizens)
app.use(
  "/api/user",
  verifyToken,
  authorizeRoles("user"),
  userRoutes
);

// Head routes
app.use(
  "/api/head",
  verifyToken,
  authorizeRoles("head"),
  headRoutes
);

// Department routes
app.use(
  "/api/department",
  verifyToken,
  authorizeRoles("department"),
  departmentRoutes
);

// File routes (for generating signed upload URLs) - protected
app.use("/api/files", verifyToken, fileRoutes);

// ---------- Base Route ----------
app.get("/", (req, res) => {
  res.send("🚀 Civic Issue Reporting API is running...");
});

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
