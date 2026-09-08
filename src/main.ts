import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./schema/db.js";
import postRoute from "./router/postRoute.js";

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://markood-center.vercel.app","https://markood-police-test.vercel.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

// Database connection before API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// API routes
app.use("/api", postRoute);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the Markood Privacy Policy Backend API",
  });
});

export default app;
