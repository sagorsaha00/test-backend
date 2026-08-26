import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/schema/db";
import postRoute from "./src/router/postRoute";

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    // "https://your-frontend.vercel.app",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use("/api", postRoute);

app.get("/", async (req: Request, res: Response) => {
  try {
    await connectDB();

    console.log("database connected");

    res.json({
      message: "Welcome to the Markood Privacy Policy Backend API",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

export default app;
