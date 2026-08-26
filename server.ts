import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Request, Response } from "express";
import { connectDB } from "./src/schema/db";
import postRoute from "./src/router/postRoute";

dotenv.config();

const app = express();
app.use(express.json());

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Database connection middleware / helper
connectDB();

app.use("/api", postRoute);
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Markood Privacy Policy Backend API",
  });
});

// Local Development-এর জন্য app.listen() কেবল Vercel-এর বাইরে কাজ করবে
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
