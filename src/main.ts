import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Request, Response } from "express";
import { connectDB } from "./schema/db";
import postRoute from "./router/postRoute";

dotenv.config();
const PORT = 5000;

const app = express();
app.use(express.json());
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use("/api", postRoute);
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Markood Privacy Policy Backend API",
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log("database connected");
  console.log("server is running", PORT);
});

export default app;
